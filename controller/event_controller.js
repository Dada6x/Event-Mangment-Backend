// controller/event_controller.js
const Event = require("../model/event_model");
const RequestEvent = require("../model/request_model");
const Venue = require("../model/venue_model");
const servicesConfig = require("../config/services_config");

//$ ====== ADD New Request   ======

exports.addEventRequest = async (req, res, next) => {
  try {
    const userId = req.user._id || req.user.id;
    let {
      eventName,
      eventDescription,
      occasionType,
      eventDate,
      eventTime,
      maxAttendance,
      eventType,
      locationType,
      homeAddress,
      venueId,   // <-- now we expect this
      services,
    } = req.body;

    let venueSnapshot = undefined;
    let totalPrice = 0;

    // ---- LOCATION VALIDATION + VENUE LOOKUP ----
    if (locationType === "home") {
      if (!homeAddress) {
        return res.status(400).json({
          success: false,
          message: "homeAddress is required when locationType is 'home'",
        });
      }
      // maybe home has some base cost? up to you
    } else {
      if (!venueId) {
        return res.status(400).json({
          success: false,
          message: "venueId is required when locationType is 'lounge' or 'theatre'",
        });
      }

      const venue = await Venue.findOne({ _id: venueId, isActive: true });
      if (!venue) {
        return res.status(404).json({
          success: false,
          message: "Venue not found or inactive",
        });
      }

      // snapshot of venue into the Event
      venueSnapshot = {
        name: venue.name,
        type: venue.type,
        address: venue.address,
        cost: venue.baseCost,
        image: venue.image,
      };

      totalPrice += venue.baseCost;
    }

    // ---- SERVICES PRICING ----
    const selectedServices = services || {};
    const servicesSnapshot = {
      hospitality: {
        enabled: false,
        cost: 0,
        drinks: false,
        food: false,
        cake: false,
        icecream: false,
      },
      camera: { enabled: false, cost: 0 },
      decoration: { enabled: false, cost: 0 },
      limousine: { enabled: false, cost: 0 },
      musicalBand: { enabled: false, cost: 0 },
    };

    // hospitality
    if (selectedServices.hospitality?.enabled) {
      const config = servicesConfig.hospitality;
      let cost = config.baseCost;

      if (selectedServices.hospitality.drinks) {
        cost += config.options.drinks.extraCost;
      }
      if (selectedServices.hospitality.food) {
        cost += config.options.food.extraCost;
      }
      if (selectedServices.hospitality.cake) {
        cost += config.options.cake.extraCost;
      }
      if (selectedServices.hospitality.icecream) {
        cost += config.options.icecream.extraCost;
      }

      servicesSnapshot.hospitality = {
        enabled: true,
        cost,
        drinks: !!selectedServices.hospitality.drinks,
        food: !!selectedServices.hospitality.food,
        cake: !!selectedServices.hospitality.cake,
        icecream: !!selectedServices.hospitality.icecream,
      };

      totalPrice += cost;
    }

    // camera
    if (selectedServices.camera?.enabled) {
      const config = servicesConfig.camera;
      servicesSnapshot.camera = {
        enabled: true,
        cost: config.baseCost,
      };
      totalPrice += config.baseCost;
    }

    // same pattern for decoration, limousine, musicalBand...

    // ---- base event data (now price is calculated here) ----
    const eventData = {
      organizerId: userId,
      eventName,
      eventDescription,
      occasionType,
      eventDate,
      eventTime,
      price: totalPrice,        // <--- now server-side
      invitationLink: "",       // or generate later
      maxAttendance,
      eventType,
      locationType,
      homeAddress,
      venue: venueSnapshot,
      services: servicesSnapshot,
    };

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
//$====== cancel My Request By ID  ======
exports.cancelEventRequestById = async (req, res, next) => {
  try {
    const userId = req.user._id || req.user.id;

    // requestId now comes from URL params
    const { requestId } = req.params;

    if (!requestId) {
      return res.status(400).json({
        success: false,
        message: "requestId is required to cancel a request",
      });
    }

    // Find the request that belongs to this user
    const request = await RequestEvent.findOne({
      _id: requestId,
      requestedBy: userId,
    });

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Request not found",
      });
    }

    if (request.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: `Only pending requests can be cancelled (current status: ${request.status})`,
      });
    }

    await RequestEvent.findByIdAndDelete(requestId);

    return res.status(200).json({
      success: true,
      message: "Request cancelled successfully",
    });
  } catch (err) {
    next(err);
  }
};
//$ ====== Get My request Details By ID  ======
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
//$ ====== Get All My Requests (Requests Not Events )  ======
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
