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

eventRoute.post("/", protect, addEventRequest);
eventRoute.delete("/", protect, cancelEventRequestById);
eventRoute.patch("/", protect, EditEventRequestById);
eventRoute.get("/:id", protect, getEventRequestDetails);
eventRoute.get("/", protect, getMyEventRequests);

module.exports = eventRoute;
