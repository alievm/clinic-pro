const Visit = require("../models/Visit");
const Payment = require("../models/Payment");
const Service = require("../models/Service");

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
  const { patient, doctor, date, reason, services } = req.body;

  // Проверим все сервисы
  let total = 0;
  for (const item of services) {
    const service = await Service.findById(item.service);
    if (!service) return res.status(404).json({ message: "Service not found" });
    const quantity = item.quantity || 1;
    total += service.price * quantity;
  }

  // Создаём визит
  const visit = await Visit.create({
    patient,
    doctor,
    date,
    reason,
    services,
    status: "new"
  });

  // Создаём платеж
  await Payment.create({
    patient,
    visit: visit._id,
    services,
    totalAmount: total,
    paidAmount: 0,
    status: "pending"
  });

  res.status(201).json({ message: "Visit and Payment created", visitId: visit._id });
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


const addServiceToVisit = async (req, res) => {
  const { id } = req.params; // visitId
  const { services } = req.body; // [{ serviceId, quantity }]

  try {
    const visit = await Visit.findById(id);
    if (!visit) return res.status(404).json({ message: "Visit not found" });
    if (visit.status === "completed") return res.status(400).json({ message: "Visit already completed" });

    const payment = await Payment.findOne({ visit: id });
    if (!payment) return res.status(404).json({ message: "No payment linked to this visit" });

    for (const { serviceId, quantity = 1 } of services) {
      const service = await Service.findById(serviceId);
      if (!service) return res.status(404).json({ message: `Service not found: ${serviceId}` });

      // 1. Добавить в визит
      visit.services.push({ service: serviceId, quantity });

      // 2. Добавить в платеж (если уже есть — увеличить количество)
      const existing = payment.services.find(item => item.service.toString() === serviceId);
      if (existing) {
        existing.quantity += quantity;
      } else {
        payment.services.push({ service: serviceId, quantity });
      }
    }

    await visit.save();

    // 3. Перерасчёт суммы
    let total = 0;
    for (const item of payment.services) {
      const s = await Service.findById(item.service);
      total += s.price * (item.quantity || 1);
    }
    payment.totalAmount = total;

    // 4. Обновление статуса
    if (payment.paidAmount >= total) {
      payment.status = "paid";
      payment.paidAt = new Date();
    } else if (payment.paidAmount > 0) {
      payment.status = "partial";
    } else {
      payment.status = "pending";
    }

    await payment.save();

    res.json({
      message: "Services added to visit and payment updated",
      visit,
      payment: {
        totalAmount: payment.totalAmount,
        paidAmount: payment.paidAmount,
        remainingAmount: payment.totalAmount - payment.paidAmount,
        status: payment.status
      }
    });
  } catch (err) {
    console.error("AddServicesToVisit Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};



module.exports = {
  createVisit,
  getVisits,
  getVisitById,
  updateVisit,
  deleteVisit,
  getVisitWithPayments,
  addServiceToVisit
};
