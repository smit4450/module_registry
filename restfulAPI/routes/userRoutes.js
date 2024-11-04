// Import dependencies using ES module syntax
import express from "express";
import jwt from "jsonwebtoken";
import { createUser, getUserByUsername, validatePassword } from "../models/userModel.js";  // Note the .js extension for ES modules

// Initialize an Express router instance
const router = express.Router();

// Function to generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });  // Sign token with user ID and expiration
};

// Register a new user
router.post("/register", async (req, res) => {
  const { username, password } = req.body;

  try {
    // Check if the username already exists
    const existingUser = await getUserByUsername(username);
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    // Create a new user and generate a token for them
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
    // Retrieve the user by username
    const user = await getUserByUsername(username);

    // Validate the provided password and generate a token if valid
    if (user && (await validatePassword(user, password))) {
      res.json({ id: user.id, username: user.username, token: generateToken(user.id) });
    } else {
      res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error logging in", error });
  }
});

// Export the router as the default export
export default router;
