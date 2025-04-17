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
  treatmentPlan: [
    {
      step: Number,
      title: String,
      services: [
        { service: mongoose.Schema.Types.ObjectId, quantity: Number }
      ],
      status: { type: String, enum: ["planned", "in-progress", "done"], default: "planned" },
      note: String
    }
  ],
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
  
  attachments: [{type: String, },], 
  photosBefore: [{ type: String }],
  photosAfter: [{ type: String }],
  
  note: {
    type: String,
    default: "",
  },

  // Зубная формула 

  toothChart: {
    type: Map,
    of: new mongoose.Schema({
      status: { type: String },        // healthy, caries, treated, etc.
      diagnosis: { type: String },     // текст диагноза
      notes: { type: String },         // комментарии
      service: {                       // привязка к услуге (если была выполнена)
        type: mongoose.Schema.Types.ObjectId,
        ref: "Service"
      },
      quantity: { type: Number, default: 1 }, // сколько раз применили услугу (обычно 1)
      updatedAt: { type: Date }
    }),
    default: {}
  },
  
}, { timestamps: true });

module.exports = mongoose.model("Visit", visitSchema);
