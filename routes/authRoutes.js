const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user.js");
const { requireAuth } = require("../middleware/auth");

// 🔐 Helper: Check if user is admin
const requireAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied" });
  }
  next();
};

// ✅ REGISTER
router.post("/register", async (req, res) => {
  try {
    const { name, username, password, role } = req.body;

    const existingUser = await User.findOne({ username });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      username,
      password: hashedPassword,
      role: role || "user",
    });

    res
      .status(201)
      .json({ message: "User created successfully", user: newUser.username });
  } catch (err) {
    console.error("Register Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ LOGIN
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      {
        userId: user._id,
        username: user.username,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        name: user.name,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ GET all users (admin only)
router.get("/users", requireAuth, requireAdmin, async (req, res) => {
  try {
    const users = await User.find({}, "-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch users" });
  }
});

// ✅ PUT update user by ID (admin only)
router.put("/users/:id", requireAuth, requireAdmin, async (req, res) => {
  try {
    const { name, role } = req.body;
    await User.findByIdAndUpdate(req.params.id, { name, role });
    res.json({ message: "User updated" });
  } catch (err) {
    res.status(500).json({ message: "Failed to update user" });
  }
});

// DELETE /api/auth/users/:id (Admin only)
router.delete("/users/:id", requireAuth, async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    // Prevent self-deletion
    if (req.user.userId === req.params.id) {
      return res
        .status(400)
        .json({ message: "You cannot delete your own account." });
    }

    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete user" });
  }
});

module.exports = router;
