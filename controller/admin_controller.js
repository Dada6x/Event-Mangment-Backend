const User = require("../model/user_model");
const Event = require("../model/event_model");
const RequestEvent = require("../model/request_model");

//$ ====== get ALl users (Admin) ======
exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select("-password"); // don't expose passwords
    return res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (err) {
    next(err);
  }
};
//$ ====== Get All Events (Admin) ======
exports.getAllEvents = async (req, res, next) => {
  try {
    const events = await Event.find().populate("organizerId", "name email");

    return res.status(200).json({
      success: true,
      count: events.length,
      data: events,
    });
  } catch (err) {
    next(err);
  }
};
//$ ====== Get All  Requests ======
exports.getAllEventRequests = async (req, res, next) => {
  try {
    const requests = await RequestEvent.find()
      .populate("requestedBy", "name email")
      .populate("eventId")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: requests.length,
      data: requests,
    });
  } catch (err) {
    next(err);
  }
};
//$ ====== Approve Event By ID ======
exports.approveEventRequest = async (req, res, next) => {
  try {
    const { id } = req.params; // RequestEvent _id
    const request = await RequestEvent.findById(id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Request not found",
      });
    }

    if (request.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: `Request already ${request.status}`,
      });
    }

    let resultEvent = null;

    // ---------- CREATE ----------
    if (request.requestType === "create") {
      // convert snapshot to plain new event
      let eventData = request.event.toObject
        ? request.event.toObject()
        : request.event;

      delete eventData._id;
      delete eventData.createdAt;
      delete eventData.updatedAt;

      // 1) Create event
      resultEvent = await Event.create(eventData);

      // 2) Set invitationLink = event _id (for QR / invites)
      resultEvent.invitationLink = resultEvent._id.toString();
      await resultEvent.save();

      // 3) delete request after success
      await RequestEvent.findByIdAndDelete(id);
    }

    // ---------- EDIT ----------
    else if (request.requestType === "edit") {
      if (!request.eventId) {
        return res.status(400).json({
          success: false,
          message: "Edit request missing eventId",
        });
      }

      // Get existing event to preserve its invitationLink
      const existingEvent = await Event.findById(request.eventId);
      if (!existingEvent) {
        return res.status(404).json({
          success: false,
          message: "Original event not found",
        });
      }

      let updates = request.event.toObject
        ? request.event.toObject()
        : request.event;

      delete updates._id;
      delete updates.createdAt;
      delete updates.updatedAt;

      // Keep the same invitationLink (don’t change the QR code)
      updates.invitationLink = existingEvent.invitationLink;

      resultEvent = await Event.findByIdAndUpdate(request.eventId, updates, {
        new: true,
        runValidators: true,
      });

      // delete request after success
      await RequestEvent.findByIdAndDelete(id);
    }

    // ---------- CANCEL ----------
    else if (request.requestType === "cancel") {
      if (!request.eventId) {
        return res.status(400).json({
          success: false,
          message: "Cancel request missing eventId",
        });
      }

      await Event.findByIdAndDelete(request.eventId);

      // delete request after success
      await RequestEvent.findByIdAndDelete(id);
    }

    // ---------- UNKNOWN ----------
    else {
      return res.status(400).json({
        success: false,
        message: `Unknown requestType: ${request.requestType}`,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Request approved and removed from queue",
      data: {
        event: resultEvent,
      },
    });
  } catch (err) {
    next(err);
  }
};
//$ ====== Reject Event By ID ======
exports.rejectEventRequest = async (req, res, next) => {
  try {
    const { id } = req.params;

    const request = await RequestEvent.findById(id);
    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Request not found",
      });
    }

    if (request.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: `Request already ${request.status}`,
      });
    }

    request.status = "rejected";
    await RequestEvent.findByIdAndDelete(id);
    await request.save();

    return res.status(200).json({
      success: true,
      message: "Request rejected successfully",
      data: request,
    });
  } catch (err) {
    next(err);
  }
};
