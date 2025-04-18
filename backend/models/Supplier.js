// ✅ models/Supplier.js
const mongoose = require("mongoose");

const supplierSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  contact: String,
  phone: String,
  email: String,
  address: String,
  note: String
}, {
  timestamps: true
});

module.exports = mongoose.model("Supplier", supplierSchema);
