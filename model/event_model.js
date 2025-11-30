// model/event_model.js
const mongoose = require("mongoose");

const VenueSchema = new mongoose.Schema(
  {
    image: { type: String, required: true },
    name: { type: String, required: true, trim: true },
    address: { type: String, required: true },
    cost: { type: Number, required: true },
    type: { type: String, enum: ["lounge", "theatre"], required: true },
  },
  { _id: false }
);

const EventSchema = new mongoose.Schema(
  {
    //! the User
    organizerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    //! Event Name
    eventName: {
      type: String,
      required: true,
      trim: true,
    },

    eventDescription: { type: String, default: "" },

    occasionType: {
      type: String,
      enum: ["public", "private"],
      required: true,
    },

    //! DATE & TIME
    eventDate: { type: String, required: true },
    eventTime: { type: String, required: true },

    //! PRICE
    price: { type: Number, required: true },

    //! INVITATION LINK
    invitationLink: { type: String, default: "" },

    //! Max Attendance
    maxAttendance: { type: Number, required: true },

    //! Event Type
    eventType: {
      type: String,
      enum: [
        "wedding",
        "engagement",
        "graduation",
        "familyEvent",
        "photoSession",
        "musicalParty",
        "festival",
        "conference",
        "play",
        "custom",
      ],
      required: true,
    },

    //! LOCATION TYPE
    locationType: {
      type: String,
      enum: ["home", "lounge", "theatre"],
      required: true,
    },

    //! Used ONLY when locationType === "home"
    homeAddress: { type: String },

    //! Embedded venue data when NOT home
    venue: VenueSchema, // EMBEDDED — NO collection anymore

    //! SERVICES
    services: {
      hospitality: {
        enabled: { type: Boolean, default: false },
        cost: { type: Number, default: 0 },
        drinks: { type: Boolean, default: false },
        food: { type: Boolean, default: false },
        cake: { type: Boolean, default: false },
        icecream: { type: Boolean, default: false },
      },
      camera: {
        enabled: { type: Boolean, default: false },
        cost: { type: Number, default: 0 },
      },
      decoration: {
        enabled: { type: Boolean, default: false },
        cost: { type: Number, default: 0 },
      },
      limousine: {
        enabled: { type: Boolean, default: false },
        cost: { type: Number, default: 0 },
      },
      musicalBand: {
        enabled: { type: Boolean, default: false },
        cost: { type: Number, default: 0 },
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Event", EventSchema);
