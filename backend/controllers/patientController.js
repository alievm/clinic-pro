const Patient = require("../models/Patient");

// ✅ Create new patient
const createPatient = async (req, res) => {
  const patient = await Patient.create(req.body);
  res.status(201).json(patient);
};

// ✅ Get all patients
const getPatients = async (req, res) => {
    const { page = 1, limit = 10, search } = req.query;
    const skip = (page - 1) * limit;
  
    const query = {};
  
    if (search) {
      query.$or = [
        { fullName: new RegExp(search, "i") },
        { phoneNumber: new RegExp(search, "i") },
      ];
    }
  
    const total = await Patient.countDocuments(query);
    const patients = await Patient.find(query)
      .skip(skip)
      .limit(Number(limit))
      .sort({ createdAt: -1 });
  
    res.json({
      data: patients,
      meta: {
        total,
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(total / limit),
      },
    });
  };

// ✅ Get single patient
const getPatientById = async (req, res) => {
  const patient = await Patient.findById(req.params.id);
  if (!patient) return res.status(404).json({ message: "Patient not found" });
  res.json(patient);
};

// ✅ Update patient
const updatePatient = async (req, res) => {
  const patient = await Patient.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!patient) return res.status(404).json({ message: "Patient not found" });
  res.json(patient);
};

// ✅ Delete patient
const deletePatient = async (req, res) => {
  const patient = await Patient.findByIdAndDelete(req.params.id);
  if (!patient) return res.status(404).json({ message: "Patient not found" });
  res.json({ message: "Patient deleted" });
};

module.exports = {
  createPatient,
  getPatients,
  getPatientById,
  updatePatient,
  deletePatient,
};
