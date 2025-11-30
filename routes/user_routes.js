// routes/user_routes.js
const express = require("express");
const {
  me,
  admin,
  user,
  getAllUsers,
  getUsersForMessaging,
} = require("../controller/user_controller");
const { protect, authorize } = require("../middlewares/middlewares");

const userRoute = express.Router();

userRoute.get("/me", protect, me);
userRoute.get("/admin", protect, authorize("admin"), admin);
userRoute.get("/user", protect, user);
// ! get all users
userRoute.get("/users", protect, getAllUsers);

module.exports = userRoute;
