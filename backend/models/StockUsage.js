const mongoose = require("mongoose");

const stockUsageSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true
  },
  quantity: {
    type: Number,
    required: true
  },
  type: {
    type: String,
    enum: ["used", "manual"],
    default: "used" // used = авто, manual = вручную
  },
  usedIn: {
    type: String,
    enum: ["visit", "other"],
    default: "visit"
  },
  referenceId: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: "usedIn" // динамическая ссылка (обычно visit._id)
  },
  usedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  date: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model("StockUsage", stockUsageSchema);
