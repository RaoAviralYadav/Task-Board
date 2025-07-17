const express = require("express");
const router = express.Router();
const Task = require("../models/Task");
const User = require("../models/User");
const auth = require("../middleware/auth");

// 🔹 Get all tasks
router.get("/", auth, async (req, res) => {
  const tasks = await Task.find().populate("assignedTo", "name");
  res.json(tasks);
});

// 🔹 Create a new task
router.post("/", auth, async (req, res) => {
  try {
    const { title, groupId } = req.body;

    if (!title || !groupId) {
      return res.status(400).json({ message: "Task title and groupId are required." });
    }

    const forbiddenTitles = ["todo", "inprogress", "done"];
    if (forbiddenTitles.includes(title.trim().toLowerCase())) {
      return res.status(400).json({ message: "Task title cannot match a column name." });
    }

    const existing = await Task.findOne({ title: title.trim(), groupId });
    if (existing) {
      return res.status(409).json({ message: "A task with this title already exists in this group." });
    }

    const task = new Task(req.body);
    await task.save();

    const io = req.io;
    if (io) io.emit("taskCreated", task);

    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ message: "Server error while creating task." });
  }
});

// 🔹 Update a task with conflict detection and activity logging
router.put("/:id", auth, async (req, res) => {
  try {
    const { title, description, status, updatedAt } = req.body;

    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ error: "Task not found" });

    // 🚨 Conflict Detection
    const clientTime = new Date(updatedAt);
    const serverTime = new Date(task.updatedAt);

    if (serverTime > clientTime) {
      return res.status(409).json({
        message: "Conflict detected",
        serverVersion: task,
      });
    }

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

    const io = req.io;
    const populatedTask = await Task.findById(task._id).populate("assignedTo", "name");
    if (io) io.emit("taskUpdated", populatedTask);

    res.json(populatedTask);
  } catch (err) {
    console.error("Update failed:", err);
    res.status(500).json({ error: "Update failed" });
  }
});

// 🔹 Get tasks for a group
router.get("/group/:groupId", auth, async (req, res) => {
  const tasks = await Task.find({ groupId: req.params.groupId }).populate("assignedTo", "name");
  res.json(tasks);
});

router.delete("/:id", auth, async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    const io = req.io;
    if (io) io.emit("taskDeleted", { taskId: req.params.id });

    res.json({ message: "Task deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete task" });
  }
});

// 🔹 Delete all tasks in a specific column of a group
router.delete("/group/:groupId/status/:status", auth, async (req, res) => {
  try {
    const { groupId, status } = req.params;
    const result = await Task.deleteMany({ groupId, status });
    res.json({ message: `${result.deletedCount} tasks deleted` });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete tasks in column" });
  }
});


// 🔹 Smart Assign Task
router.post("/:id/assign-smart", auth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    const users = await User.find();
    const allTasks = await Task.find();

    const userLoad = {};
    for (const user of users) userLoad[user._id] = 0;
    for (const t of allTasks) {
      if (t.assignedTo) {
        const id = t.assignedTo.toString();
        userLoad[id] = (userLoad[id] || 0) + 1;
      }
    }

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

    const io = req.io;
    const populatedTask = await Task.findById(task._id).populate("assignedTo", "name");
    if (io) io.emit("taskUpdated", populatedTask);

    res.json(populatedTask);
  } catch (err) {
    console.error("Smart Assign Error:", err);
    res.status(500).json({ message: "Smart assign failed" });
  }
});

module.exports = router;


// const express = require("express");
// const router = express.Router();
// const Task = require("../models/Task");
// const User = require("../models/User");
// const auth = require("../middleware/auth");

// // 🔹 Get all tasks
// router.get("/", auth, async (req, res) => {
//   const tasks = await Task.find().populate("assignedTo", "name");
//   res.json(tasks);
// });

// // 🔹 Create a new task
// router.post("/", auth, async (req, res) => {
//   try {
//     const { title, groupId } = req.body;

//     if (!title || !groupId) {
//       return res.status(400).json({ message: "Task title and groupId are required." });
//     }

//     const forbiddenTitles = ["todo", "inprogress", "done"];
//     if (forbiddenTitles.includes(title.trim().toLowerCase())) {
//       return res.status(400).json({ message: "Task title cannot match a column name." });
//     }

//     const existing = await Task.findOne({ title: title.trim(), groupId });
//     if (existing) {
//       return res.status(409).json({ message: "A task with this title already exists in this group." });
//     }

//     const task = new Task(req.body);
//     await task.save();

//     // Emit to all clients in real time
//     const io = req.io;
//     if (io) io.emit("taskCreated", task);

//     res.status(201).json(task);
//   } catch (err) {
//     res.status(500).json({ message: "Server error while creating task." });
//   }
// });

// // 🔹 Update a task with activity logging
// router.put("/:id", auth, async (req, res) => {
//   try {
//     const { title, description, status } = req.body;

//     const task = await Task.findById(req.params.id);
//     if (!task) return res.status(404).json({ error: "Task not found" });

//     const updates = [];

//     if (title && title !== task.title) {
//       updates.push({ user: req.user.name, action: "Updated title", timestamp: Date.now() });
//       task.title = title;
//     }
//     if (description && description !== task.description) {
//       updates.push({ user: req.user.name, action: "Updated description", timestamp: Date.now() });
//       task.description = description;
//     }
//     if (status && status !== task.status) {
//       updates.push({ user: req.user.name, action: `Moved to ${status}`, timestamp: Date.now() });
//       task.status = status;
//     }

//     task.activity.push(...updates);
//     await task.save();

//     const io = req.io;
//     const populatedTask = await Task.findById(task._id).populate("assignedTo", "name");
//     if (io) io.emit("taskUpdated", populatedTask);

//     res.json(populatedTask);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Update failed" });
//   }
// });

// // 🔹 Get tasks for a group
// router.get("/group/:groupId", auth, async (req, res) => {
//   const tasks = await Task.find({ groupId: req.params.groupId }).populate("assignedTo", "name");
//   res.json(tasks);
// });

// // 🔹 Smart Assign Task
// router.post("/:id/assign-smart", auth, async (req, res) => {
//   try {
//     const task = await Task.findById(req.params.id);
//     if (!task) return res.status(404).json({ message: "Task not found" });

//     const users = await User.find();
//     const allTasks = await Task.find();

//     const userLoad = {};
//     for (const user of users) userLoad[user._id] = 0;
//     for (const t of allTasks) {
//       if (t.assignedTo) {
//         const id = t.assignedTo.toString();
//         userLoad[id] = (userLoad[id] || 0) + 1;
//       }
//     }

//     let bestUser = null;
//     let minLoad = Infinity;

//     for (const user of users) {
//       const load = userLoad[user._id] || 0;
//       if (load < minLoad) {
//         bestUser = user;
//         minLoad = load;
//       }
//     }

//     if (!bestUser) return res.status(404).json({ message: "No users to assign" });

//     task.assignedTo = bestUser._id;
//     task.activity.push({
//       user: req.user.name,
//       action: `Smart-assigned to ${bestUser.name}`,
//       timestamp: Date.now()
//     });

//     await task.save();

//     const io = req.io;
//     const populatedTask = await Task.findById(task._id).populate("assignedTo", "name");
//     if (io) io.emit("taskUpdated", populatedTask);

//     res.json(populatedTask);
//   } catch (err) {
//     console.error("Smart Assign Error:", err);
//     res.status(500).json({ message: "Smart assign failed" });
//   }
// });

// module.exports = router;
