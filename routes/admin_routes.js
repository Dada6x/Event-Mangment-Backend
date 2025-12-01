// routes/admin_routes.js
const express = require("express");
const {
  getAllUsers,
  getAllEvents,
  getAllEventRequests,
  approveEventRequest,
  rejectEventRequest,
} = require("../controller/admin_controller");
const { protect, authorize } = require("../middlewares/middlewares"); // you add isAdmin

const adminRoute = express.Router();
//? ====== Only Admin is able to use this  ======
adminRoute.use(protect, authorize("admin"));
//$ ====== Get all Users ======
adminRoute.get("/users", getAllUsers);
//$ ====== Get ALl Accepted Events ======
adminRoute.get("/events", getAllEvents);
//$ ====== Get All Requests  ======
adminRoute.get("/requests", getAllEventRequests);
//$ ====== Approve an Request ======
adminRoute.patch("/requests/:id/approve", approveEventRequest);
//$ ====== Reject an Request ======
adminRoute.patch("/requests/:id/reject", rejectEventRequest);

module.exports = adminRoute;
