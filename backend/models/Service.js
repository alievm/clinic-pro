const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  materials: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true
      },
      quantity: {
        type: Number,
        required: true,
        default: 1
      }
    }
  ],
  type: {
    type: String,
    enum: ["main", "extra"],
    default: "main",
  },
}, { timestamps: true });

module.exports = mongoose.model("Service", serviceSchema);
