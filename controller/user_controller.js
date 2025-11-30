// controller/user_controller.js
const User = require("../model/user_model");

//! /api/me
exports.me = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json({ message: "Authenticated", user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//! /api/admin
exports.admin = async (req, res) => {
  try {
    res.json({ message: "Welcome admin", user: req.user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//! /api/user
exports.user = async (req, res) => {
  try {
    res.json({ message: "Hello user", user: req.user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//! /api/users  (ADMIN ONLY) -> see all users from DB
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json({ count: users.length, users });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
