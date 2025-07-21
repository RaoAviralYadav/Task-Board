

const express = require("express");
const router = express.Router();
const Group = require("../models/Group");
const Task = require("../models/Task");
const auth = require("../middleware/auth");


router.get("/", async (req, res) => {
  try {
    const groups = await Group.find().sort({ createdAt: -1 });
    res.json(groups);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch groups" });
  }
});


router.post("/", auth, async (req, res) => {
  try {
    const group = new Group({
      name: req.body.name,
      createdBy: req.user.id,
    });
    await group.save();
    res.status(201).json(group);
  } catch (err) {
    res.status(400).json({ message: "Group creation failed" });
  }
});


router.delete("/:id", async (req, res) => {
  try {
    const groupId = req.params.id;

    
    await Task.deleteMany({ groupId });

    
    const deletedGroup = await Group.findByIdAndDelete(groupId);

    if (!deletedGroup) {
      return res.status(404).json({ message: "Group not found" });
    }

    res.status(200).json({ message: "Group and its tasks deleted" });
  } catch (err) {
    console.error("Error deleting group:", err);
    res.status(500).json({ message: "Failed to delete group" });
  }
});


router.get("/:id", async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);
    if (!group) return res.status(404).json({ message: "Group not found" });
    res.json(group);
  } catch (err) {
    res.status(500).json({ message: "Error fetching group" });
  }
});


module.exports = router;
