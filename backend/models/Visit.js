const mongoose = require("mongoose");

const visitSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Patient",
    required: true,
  },
  services: [
    {
      service: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Service",
      },
      quantity: { type: Number, default: 1 }
    }
  ],
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
  symptoms: {
    type: String,
    default: "",
  }, // Жалоба / симптомы
  
  diagnosis: {
    type: String,
    default: "",
  }, // Диагноз
  
  recommendations: {
    type: String,
    default: "",
  }, // Назначения
  
  attachments: [
    {
      type: String, // путь к файлу
    },
  ], 
  
  note: {
    type: String,
    default: "",
  },
}, { timestamps: true });

module.exports = mongoose.model("Visit", visitSchema);
