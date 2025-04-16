const Visit = require("../models/Visit");
const Payment = require("../models/Payment");

const getVisitWithPayments = async (req, res) => {
    const { id } = req.params;
  
    const visit = await Visit.findById(id)
      .populate("patient", "fullName phoneNumber")
      .populate("doctor", "name");
  
    if (!visit) return res.status(404).json({ message: "Visit not found" });
  
    const payments = await Payment.find({ visit: id })
      .populate("services.service", "name price type");
  
    res.json({ visit, payments });
  };

// ✅ Создание визита
const createVisit = async (req, res) => {
  const visit = await Visit.create(req.body);
  res.status(201).json(visit);
};

// ✅ Получить все визиты
const getVisits = async (req, res) => {
  const visits = await Visit.find()
    .populate("patient", "fullName phoneNumber")
    .populate("doctor", "name role");
  res.json(visits);
};

// ✅ Получить визит по ID
const getVisitById = async (req, res) => {
  const visit = await Visit.findById(req.params.id)
    .populate("patient", "fullName phoneNumber")
    .populate("doctor", "name role");
  if (!visit) return res.status(404).json({ message: "Visit not found" });
  res.json(visit);
};

// ✅ Обновление визита
const updateVisit = async (req, res) => {
  const visit = await Visit.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!visit) return res.status(404).json({ message: "Visit not found" });
  res.json(visit);
};

// ✅ Удаление визита
const deleteVisit = async (req, res) => {
  const visit = await Visit.findByIdAndDelete(req.params.id);
  if (!visit) return res.status(404).json({ message: "Visit not found" });
  res.json({ message: "Visit deleted" });
};

module.exports = {
  createVisit,
  getVisits,
  getVisitById,
  updateVisit,
  deleteVisit,
  getVisitWithPayments
};
