const mongoose = require("mongoose");
const Event = require("./event_model");

const RequestEventSchema = new mongoose.Schema(
  {
    requestType: {
      type: String,
      enum: ["create", "edit", "cancel"],
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    requestedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
    },
    event: {
      type: Event.schema,
      required: true,
    },
  },
  { timestamps: true, collection: "request_Events" }
);

module.exports = mongoose.model("RequestEvent", RequestEventSchema);
