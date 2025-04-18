const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ProductCategory"
  },
  unit: {
    type: String, // "шт", "мл", "г" и т.д.
    default: "шт"
  },
  stock: {
    type: Number,
    default: 0
  },
  minStock: {
    type: Number,
    default: 0 // когда показывать алерт
  },
  price: {
    type: Number,
    default: 0 // закупочная цена (если нужно)
  },
  track: {
    type: Boolean,
    default: true // использовать ли в складе
  }
}, {
  timestamps: true
});

module.exports = mongoose.model("Product", productSchema);
