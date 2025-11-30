// controller/auth_controller.js
const User = require("../model/user_model");
const bcrypt = require("bcryptjs");
const { createToken } = require("../utils/jwt_helper");

//! ====== Login  ======
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    //! 1) Find user in DB
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    //! 2) Compare password
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: "Invalid credentials" });

    //! 3) Create token
    const token = createToken(user);

    res.json({
      message: "Logged in",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      },
      token,
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
//! ====== Signup  ======
exports.signup = async (req, res) => {
  try {
    const { name, email, password, role, avatar } = req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "name, email, password are required" });
    }

    //@ 1) Check if email exists in DB
    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: "Email already exists" });
    }

    //@ 2) Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    //@ 3) Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || "user",
      avatar: avatar || null,
    });

    //@ 4) Create token
    const token = createToken(user);

    res.status(201).json({
      message: "User created",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      },
      token,
    });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
