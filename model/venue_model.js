// model/venue_model.js
const mongoose = require("mongoose");

const venueSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    type: { type: String, enum: ["lounge", "theatre"], required: true },
    address: { type: String, required: true },
    image: { type: String, default: "" },
    baseCost: { type: Number, required: true },
    maxCapacity: { type: Number },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Venue", venueSchema);
