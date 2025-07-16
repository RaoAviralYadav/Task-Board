const express = require("express");
const router = express.Router();
const Group = require("../models/Group");
const auth = require("../middleware/auth");

// Get all groups for logged-in user
// router.get("/", auth, async (req, res) => {
//   const groups = await Group.find({ createdBy: req.user.id });
//   res.json(groups);
// });
router.get("/", async (req, res) => {
  try {
    const groups = await Group.find().sort({ createdAt: -1 });
    res.json(groups);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch groups" });
  }
});


// Create new group
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

module.exports = router;
