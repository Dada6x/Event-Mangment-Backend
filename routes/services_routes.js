// routes/meta_routes.js
const express = require("express");
const Venue = require("../model/venue_model");
const servicesConfig = require("../config/services_config");
const { protect } = require("../middlewares/middlewares");

const servicesRoute = express.Router();

//$ ====== Get all active venues  ======
servicesRoute.get("/venues", protect, async (req, res, next) => {
  try {
    const { type } = req.query; // ?type=lounge or ?type=theatre
    const query = { isActive: true };
    if (type) query.type = type;
    const venues = await Venue.find(query).sort({ name: 1 });

    res.status(200).json({
      success: true,
      data: venues,
    });
  } catch (err) {
    next(err);
  }
});
//$ ====== Get all Services ======
servicesRoute.get("/", protect, (req, res) => {
  res.status(200).json({
    success: true,
    data: servicesConfig,
  });
});

module.exports = servicesRoute;
