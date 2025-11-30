// controller/user_controller.js
const User = require("../model/user_model");
const Event = require("../model/event_model");

//$ ====== Me  ======
exports.me = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json({ message: "Authenticated", user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//$ ====== Get all my Accepted Events  ======
exports.getMyEvents = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;

    const events = await Event.find({ organizerId: userId }).sort({
      eventDate: 1,
      eventTime: 1,
    });

    res.status(200).json({
      success: true,
      count: events.length,
      data: events,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
