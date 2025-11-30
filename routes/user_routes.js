// routes/user_routes.js
const express = require("express");
const {
  me,
  getMyEvents,
} = require("../controller/user_controller");
const { protect, } = require("../middlewares/middlewares");

const userRoute = express.Router();
//$ ====== Get my details (Profile) ======
userRoute.get("/me", protect, me);
//$ ====== Get All My Events (accepted ones) ======
userRoute.get("/my-events", protect, getMyEvents);


module.exports = userRoute;
