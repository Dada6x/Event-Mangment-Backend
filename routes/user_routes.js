// routes/user_routes.js
const express = require("express");
const {
  me,
  getMyEvents,
} = require("../controller/user_controller");
const { protect, } = require("../middlewares/middlewares");

const userRoute = express.Router();

userRoute.get("/me", protect, me);
userRoute.get("/my_events", protect, getMyEvents);


module.exports = userRoute;
