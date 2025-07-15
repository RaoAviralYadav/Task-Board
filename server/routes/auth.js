const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// REGISTER
router.post("/register", async (req, res) => {
  try {
    const { username, password, name, avatar } = req.body;

    // check if user exists
    const existing = await User.findOne({ username });
    if (existing) return res.status(400).json({ message: "Username already exists" });

    // hash password
    const hashed = await bcrypt.hash(password, 10);

    // create user
    const user = new User({ username, password: hashed, name, avatar });
    await user.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    // find user
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    // compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    // generate token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "3d" });

    res.json({
      token,
      user: { id: user._id, username: user.username }
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
