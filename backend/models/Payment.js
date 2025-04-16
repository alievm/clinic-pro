const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Patient",
    required: true,
  },
  visit: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Visit",
  },
  services: [
    {
      service: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Service",
      },
      quantity: {
        type: Number,
        default: 1,
      },
    },
  ],
  totalAmount: {
    type: Number,
    required: true,
  },
  paidAmount: {
    type: Number,
    default: 0,
  },
  status: {
    type: String,
    enum: ["pending", "paid", "partial"],
    default: "pending",
  },
  paidAt: {
    type: Date,
  },
  discount: {
    type: Number, // сумма скидки
    default: 0,
  },
  discountReason: {
    type: String, // например: "Акция", "По решению врача", "VIP клиент"
  },
}, { timestamps: true });

module.exports = mongoose.model("Payment", paymentSchema);
