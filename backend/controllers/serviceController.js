const Service = require("../models/Service");

// ✅ Создать услугу
const createService = async (req, res) => {
  const service = await Service.create(req.body);
  res.status(201).json(service);
};

// ✅ Получить все услуги
const getServices = async (req, res) => {
  const services = await Service.find().sort({ createdAt: -1 });
  res.json(services);
};

// ✅ Получить одну услугу
const getServiceById = async (req, res) => {
  const service = await Service.findById(req.params.id);
  if (!service) return res.status(404).json({ message: "Service not found" });
  res.json(service);
};

// ✅ Обновить услугу
const updateService = async (req, res) => {
  if (req.body.materials) {
    console.log("Обновляем материалы:", req.body.materials);
  }
  
  const service = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!service) return res.status(404).json({ message: "Service not found" });
  res.json(service);
};

// ✅ Удалить услугу
const deleteService = async (req, res) => {
  const service = await Service.findByIdAndDelete(req.params.id);
  if (!service) return res.status(404).json({ message: "Service not found" });
  res.json({ message: "Service deleted" });
};

module.exports = {
  createService,
  getServices,
  getServiceById,
  updateService,
  deleteService,
};
