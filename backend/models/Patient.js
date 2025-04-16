const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  region: { type: String, required: true },
  district: { type: String, required: true },
  referrer: { type: String }, 
  phoneNumber: { type: String, required: true },
  profession: { type: String },
  birthDate: { type: Date },
  homeAddress: { type: String },
  workAddress: { type: String },
  note: { type: String },
  gender: { type: String, enum: ["man", "woman"], required: true },
  image: { type: String }, 
}, { timestamps: true });

module.exports = mongoose.model("Patient", patientSchema);
