const mongoose = require("mongoose");

const visitSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Patient",
    required: true,
  },
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ["new", "completed", "canceled"],
    default: "new",
  },
  reason: {
    type: String,
  },
  note: {
    type: String,
  },
}, { timestamps: true });

module.exports = mongoose.model("Visit", visitSchema);
