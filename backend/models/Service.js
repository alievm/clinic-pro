const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  type: {
    type: String,
    enum: ["main", "extra"],
    default: "main",
  },
}, { timestamps: true });

module.exports = mongoose.model("Service", serviceSchema);
