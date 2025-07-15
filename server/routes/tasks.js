const express = require("express");
const router = express.Router();
const Task = require("../models/Task");
const auth = require("../middleware/auth");

// Get all tasks
router.get("/", auth, async (req, res) => {
  const tasks = await Task.find().populate("assignedTo", "username");
  res.json(tasks);
});

// Create new task
router.post("/", auth, async (req, res) => {
  try {
    const task = new Task(req.body);
    await task.save();
    res.status(201).json(task);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update task status/assignment
router.put("/:id", auth, async (req, res) => {
  // try {
  //   const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
  //     new: true,
  //   });
  //   res.json(task);
  // } catch (err) {
  //   res.status(400).json({ message: "Update failed" });
  // }
  try {
    const { title, description, status } = req.body;

    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ error: "Task not found" });

    const updates = [];
    if (title && title !== task.title) {
      updates.push({ user: "Aviral Yadav", action: "Updated title", timestamp: Date.now() });
      task.title = title;
    }
    if (description && description !== task.description) {
      updates.push({ user: "Aviral Yadav", action: "Updated description", timestamp: Date.now() });
      task.description = description;
    }
    if (status && status !== task.status) {
      updates.push({ user: "Aviral Yadav", action: `Moved to ${status}`, timestamp: Date.now() });
      task.status = status;
    }

    // Add to activity
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
  const tasks = await Task.find({ groupId: req.params.groupId });
  res.json(tasks);
});


module.exports = router;
