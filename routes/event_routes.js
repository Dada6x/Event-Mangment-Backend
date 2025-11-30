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
//$ ====== cancel Request ======
eventRoute.delete("/:requestId", protect, cancelEventRequestById);
//! ====== Edit Request ======
eventRoute.patch("/", protect, EditEventRequestById);
//$ ====== Get all My Requests ======
eventRoute.get("/", protect, getMyEventRequests);
//$ ====== Get Request DetailsBy ID ======
eventRoute.get("/:id", protect, getEventRequestDetails);

module.exports = eventRoute;
