// routes/event_routes.js
const express = require("express");
const {
  addEventRequest,
  EditEventRequestById,
  cancelEventRequestById,
  getEventRequestDetails,
  getMyEventRequests,
} = require("../controller/event_controller");
const { protect } = require("../middlewares/middlewares");

const eventRoute = express.Router();
//$ ====== Add new Request  ======
eventRoute.post("/", protect, addEventRequest);
//! ====== cancel Request ====== 
eventRoute.delete("/:id", protect, cancelEventRequestById);
//! ====== Edit Request ======
eventRoute.patch("/:id", protect, EditEventRequestById);
//$ ====== Get Request DetailsBy ID ======
eventRoute.get("/:id", protect, getEventRequestDetails);
//$ ====== Get all My Requests ======
eventRoute.get("/", protect, getMyEventRequests);

module.exports = eventRoute;

// reduce the number of IDs 
