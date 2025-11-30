// controller/event_controller.js
const Event = require("../model/event_model");
const RequestEvent = require("../model/request_model");

//! ====== ADD New Request   ======
exports.addEventRequest = async (req, res, next) => {
  try {
    const userId = req.user._id || req.user.id;

    let {
      eventName,
      eventDescription,
      occasionType,
      eventDate,
      eventTime,
      price,
      invitationLink,
      maxAttendance,
      eventType,
      locationType,
      homeAddress,
      venue,
      services,
    } = req.body;

    // basic validation for location
    if (locationType === "home") {
      if (!homeAddress) {
        return res.status(400).json({
          success: false,
          message: "homeAddress is required when locationType is 'home'",
        });
      }
      // no venue needed
      venue = undefined;
    } else {
      // lounge/theatre
      if (!venue) {
        return res.status(400).json({
          success: false,
          message:
            "venue object is required when locationType is 'lounge' or 'theatre'",
        });
      }
    }

    // base event data
    const eventData = {
      organizerId: userId,
      eventName,
      eventDescription,
      occasionType,
      eventDate,
      eventTime,
      price,
      invitationLink,
      maxAttendance,
      eventType,
      locationType,
      homeAddress,
      venue, // embedded venue (or undefined if home)
      services,
    };

    // Create a request document instead of actual Event
    const request = await RequestEvent.create({
      requestType: "create",
      requestedBy: userId,
      eventId: null,
      event: eventData,
    });

    return res.status(201).json({
      success: true,
      message: "Event creation request submitted",
      data: request,
    });
  } catch (err) {
    next(err);
  }
};
//! ====== Edit My Request By ID  ======
exports.EditEventRequestById = async (req, res, next) => {
  try {
    const userId = req.user._id || req.user.id;
    const { eventId, event } = req.body;

    if (!eventId) {
      return res.status(400).json({
        success: false,
        message: "eventId is required for edit request",
      });
    }

    const existingEvent = await Event.findById(eventId);
    if (!existingEvent) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    if (!event) {
      return res.status(400).json({
        success: false,
        message: "Updated event data (event) is required",
      });
    }

    // Ensure organizerId stays the same owner (or use userId if you want)
    if (!event.organizerId) {
      event.organizerId = existingEvent.organizerId;
    }

    // Optional: basic location validation for edits
    if (event.locationType === "home") {
      if (!event.homeAddress) {
        return res.status(400).json({
          success: false,
          message:
            "homeAddress is required when locationType is 'home' for edit request",
        });
      }
      event.venue = undefined;
    } else if (
      event.locationType === "lounge" ||
      event.locationType === "theatre"
    ) {
      if (!event.venue) {
        return res.status(400).json({
          success: false,
          message:
            "venue object is required when locationType is 'lounge' or 'theatre' for edit request",
        });
      }
    }

    const request = await RequestEvent.create({
      requestType: "edit",
      requestedBy: userId,
      eventId,
      event,
    });

    return res.status(201).json({
      success: true,
      message: "Event edit request submitted",
      data: request,
    });
  } catch (err) {
    next(err);
  }
};
//! ====== cancel My Request By ID  ======
exports.cancelEventRequestById = async (req, res, next) => {
  try {
    const userId = req.user._id || req.user.id;
    const { eventId } = req.body;

    if (!eventId) {
      return res.status(400).json({
        success: false,
        message: "eventId is required for cancel request",
      });
    }

    const existingEvent = await Event.findById(eventId);
    if (!existingEvent) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    const request = await RequestEvent.create({
      requestType: "cancel",
      requestedBy: userId,
      eventId,
      event: existingEvent.toObject(), // includes embedded venue if present
    });

    return res.status(201).json({
      success: true,
      message: "Event cancel request submitted",
      data: request,
    });
  } catch (err) {
    next(err);
  }
};
//! ====== Get My request Details By ID  ======
exports.getEventRequestDetails = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user._id || req.user.id;

    // Only allow user to see THEIR OWN requests
    const request = await RequestEvent.findOne({
      _id: id,
      requestedBy: userId,
    })
      .populate("requestedBy", "name email")
      .populate("eventId"); // for edit/cancel types

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Event request not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: request,
    });
  } catch (err) {
    next(err);
  }
};
//! ====== Get All My Events Requests (Requests Not Events )  ======
exports.getMyEventRequests = async (req, res, next) => {
  try {
    const userId = req.user._id || req.user.id;

    const requests = await RequestEvent.find({ requestedBy: userId }).sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      count: requests.length,
      data: requests,
    });
  } catch (err) {
    next(err);
  }
};
