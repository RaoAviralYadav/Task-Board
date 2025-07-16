const express = require("express");
const router = express.Router();
const Task = require("../models/Task");
const User = require("../models/User");
const auth = require("../middleware/auth");

// Get all tasks
router.get("/", auth, async (req, res) => {
  const tasks = await Task.find().populate("assignedTo", "name");
  res.json(tasks);
});

// Create new task
// router.post("/", auth, async (req, res) => {
//   try {
//     const task = new Task(req.body);
//     await task.save();
//     res.status(201).json(task);
//   } catch (err) {
//     res.status(400).json({ message: err.message });
//   }
// });
router.post("/", auth, async (req, res) => {
  try {
    const { title, groupId } = req.body;

    // 1. Validate title presence
    if (!title || !groupId) {
      return res.status(400).json({ message: "Task title and groupId are required." });
    }

    const forbiddenTitles = ["todo", "inprogress", "done"];

    // 2. Check if title matches column names
    if (forbiddenTitles.includes(title.trim().toLowerCase())) {
      return res.status(400).json({ message: "Task title cannot match a column name." });
    }

    // 3. Check for duplicates in this group
    const existing = await Task.findOne({
      title: title.trim(),
      groupId: groupId
    });

    if (existing) {
      return res.status(409).json({ message: "A task with this title already exists in this group." });
    }

    // 4. Create task if valid
    const task = new Task(req.body);
    await task.save();
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ message: "Server error while creating task." });
  }
});


// Update task with activity logging
router.put("/:id", auth, async (req, res) => {
  try {
    const { title, description, status } = req.body;

    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ error: "Task not found" });

    const updates = [];

    if (title && title !== task.title) {
      updates.push({ user: req.user.name, action: "Updated title", timestamp: Date.now() });
      task.title = title;
    }
    if (description && description !== task.description) {
      updates.push({ user: req.user.name, action: "Updated description", timestamp: Date.now() });
      task.description = description;
    }
    if (status && status !== task.status) {
      updates.push({ user: req.user.name, action: `Moved to ${status}`, timestamp: Date.now() });
      task.status = status;
    }

    task.activity.push(...updates);

    await task.save();
    res.json(task);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Update failed" });
  }
});

// Get tasks for a group
router.get("/group/:groupId", auth, async (req, res) => {
  const tasks = await Task.find({ groupId: req.params.groupId }).populate("assignedTo", "name");
  res.json(tasks);
});

// 🚀 SMART ASSIGN: Assign task to least-loaded user
router.post("/:id/assign-smart", auth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    const users = await User.find();
    const allTasks = await Task.find();

    // Count assigned tasks
    const userLoad = {};
    for (const user of users) userLoad[user._id] = 0;
    for (const t of allTasks) {
      if (t.assignedTo) {
        const id = t.assignedTo.toString();
        userLoad[id] = (userLoad[id] || 0) + 1;
      }
    }

    // Find least-loaded user
    let bestUser = null;
    let minLoad = Infinity;

    for (const user of users) {
      const load = userLoad[user._id] || 0;
      if (load < minLoad) {
        bestUser = user;
        minLoad = load;
      }
    }

    if (!bestUser) return res.status(404).json({ message: "No users to assign" });

    task.assignedTo = bestUser._id;
    task.activity.push({
      user: req.user.name,
      action: `Smart-assigned to ${bestUser.name}`,
      timestamp: Date.now()
    });

    await task.save();

    // ✅ Populate assignedTo before returning
    const populatedTask = await Task.findById(task._id).populate("assignedTo", "name");
    res.json(populatedTask);
  } catch (err) {
    console.error("Smart Assign Error:", err);
    res.status(500).json({ message: "Smart assign failed" });
  }
});

module.exports = router;
