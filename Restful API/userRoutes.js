// routes/userRoutes.js
const express = require("express");
const jwt = require("jsonwebtoken");
const { createUser, getUserByUsername, validatePassword } = require("../models/userModel");

const router = express.Router();

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

// Register a new user
router.post("/register", async (req, res) => {
  const { username, password } = req.body;

  try {
    const existingUser = await getUserByUsername(username);
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    const user = await createUser(username, password);
    res.status(201).json({ id: user.id, username: user.username, token: generateToken(user.id) });
  } catch (error) {
    res.status(500).json({ message: "Error registering user", error });
  }
});

// Login user
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await getUserByUsername(username);
    if (user && (await validatePassword(user, password))) {
      res.json({ id: user.id, username: user.username, token: generateToken(user.id) });
    } else {
      res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error logging in", error });
  }
});

module.exports = router;
