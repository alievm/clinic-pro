const Visit = require("../models/Visit");
const Payment = require("../models/Payment");
const Service = require("../models/Service");
const { removeReservationIfMatched } = require("./reservationController");

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

  const existing = await Visit.findOne({
    patient,
    status: { $in: ["new", "pending"] }
  });

  if (existing) {
    return res.status(400).json({
      message: "У пациента уже есть незавершённый визит"
    });
  }

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
  await removeReservationIfMatched({ patient, doctor, date });
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

const getMyVisits = async (req, res) => {
  const doctorId = req.user._id;

  const visits = await Visit.find({ doctor: doctorId })
    .populate("patient", "fullName phoneNumber")
    .populate("services.service", "name price type")
    .sort({ date: -1 });

  res.json(visits);
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

const completeVisit = async (req, res) => {
  const { id } = req.params;
  const { note } = req.body;

  const visit = await Visit.findById(id);
  if (!visit) return res.status(404).json({ message: "Visit not found" });

  if (visit.status === "completed") {
    return res.status(400).json({ message: "Visit already completed" });
  }

  visit.status = "completed";
  if (note) visit.note = note;
  await visit.save();

  res.json({ message: "Visit marked as completed", visit });
};


const updateVisitDoctorFields = async (req, res) => {
  const { id } = req.params;
  const { symptoms, diagnosis, recommendations, note, attachments } = req.body;

  const visit = await Visit.findById(id);
  if (!visit) return res.status(404).json({ message: "Visit not found" });

  if (visit.status === "completed") {
    return res.status(400).json({ message: "Cannot update a completed visit." });
  }

  if (symptoms !== undefined) visit.symptoms = symptoms;
  if (diagnosis !== undefined) visit.diagnosis = diagnosis;
  if (recommendations !== undefined) visit.recommendations = recommendations;
  if (note !== undefined) visit.note = note;
  if (attachments && Array.isArray(attachments)) {
    visit.attachments = [...visit.attachments, ...attachments];
  }

  await visit.save();

  res.json({ message: "Visit updated", visit });
};


const addMultipleTreatmentSteps = async (req, res) => {
  const { id } = req.params;
  const { steps } = req.body;

  const visit = await Visit.findById(id);
  if (!visit) return res.status(404).json({ message: "Visit not found" });

  const payment = await Payment.findOne({ visit: id });
  if (!payment) return res.status(404).json({ message: "Payment not found" });

  let nextStep = (visit.treatmentPlan?.length || 0) + 1;

  // Добавляем шаги лечения в визит
  for (const step of steps) {
    const { title, services, note } = step;

    visit.treatmentPlan.push({
      step: nextStep++,
      title,
      services,
      note,
      status: "planned"
    });
  }

  // 🔄 Нормализуем все новые услуги из steps
  const serviceMap = new Map();

  for (const step of steps) {
    for (const { service, quantity } of step.services) {
      const key = service.toString();
      if (serviceMap.has(key)) {
        serviceMap.set(key, serviceMap.get(key) + quantity);
      } else {
        serviceMap.set(key, quantity);
      }
    }
  }

  // Объединяем с уже существующими в payment.services
  for (const [serviceId, quantityToAdd] of serviceMap.entries()) {
    const existing = payment.services.find(s => s.service.toString() === serviceId);
    if (existing) {
      existing.quantity += quantityToAdd;
    } else {
      payment.services.push({
        service: serviceId,
        quantity: quantityToAdd
      });
    }
  }

  // 🔢 Пересчёт totalAmount
  let total = 0;
  for (const item of payment.services) {
    const s = await Service.findById(item.service);
    total += s.price * (item.quantity || 1);
  }

  payment.totalAmount = total;

  if (payment.paidAmount >= total) {
    payment.status = "paid";
    payment.paidAt = new Date();
  } else if (payment.paidAmount > 0) {
    payment.status = "partial";
  } else {
    payment.status = "pending";
  }

  await visit.save();
  await payment.save();

  res.json({ message: "Treatment steps added", visit, payment });
};


const uploadVisitPhoto = async (req, res) => {
  const { id } = req.params;
  const { type } = req.body;

  if (!["before", "after"].includes(type)) {
    return res.status(400).json({ message: "Invalid type. Use 'before' or 'after'" });
  }

  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  const visit = await Visit.findById(id);
  if (!visit) return res.status(404).json({ message: "Visit not found" });

  const imagePath = `/uploads/${req.file.filename}`;

  if (type === "before") {
    visit.photosBefore.push(imagePath);
  } else {
    visit.photosAfter.push(imagePath);
  }

  await visit.save();

  res.status(200).json({
    message: `Photo uploaded (${type})`,
    path: imagePath,
    visitId: visit._id
  });
};


// Teeth Formulae 

const updateToothChart = async (req, res) => {
  const { id } = req.params;
  const { updates } = req.body; // объект: { "36": { status, diagnosis, service, notes } }

  const visit = await Visit.findById(id);
  if (!visit) return res.status(404).json({ message: "Visit not found" });

  const payment = await Payment.findOne({ visit: id });
  if (!payment) return res.status(404).json({ message: "Payment not found" });

  for (const [toothCode, data] of Object.entries(updates)) {
    // Обновляем toothChart
    visit.toothChart.set(toothCode, {
      ...(visit.toothChart.get(toothCode) || {}),
      ...data,
      updatedAt: new Date()
    });

    // Если есть услуга — добавляем в visit.services и payment.services
    if (data.service) {
      const serviceId = data.service.toString();
      const quantity = data.quantity || 1;

      // 🔁 В visit.services
      const existingVisit = visit.services.find(s => s.service.toString() === serviceId);
      if (existingVisit) {
        existingVisit.quantity += quantity;
      } else {
        visit.services.push({ service: serviceId, quantity });
      }

      // 🔁 В payment.services
      const existingPayment = payment.services.find(s => s.service.toString() === serviceId);
      if (existingPayment) {
        existingPayment.quantity += quantity;
      } else {
        payment.services.push({ service: serviceId, quantity });
      }
    }
  }

  // Пересчёт суммы оплаты
  let total = 0;
  for (const item of payment.services) {
    const s = await Service.findById(item.service);
    total += s.price * (item.quantity || 1);
  }

  payment.totalAmount = total;
  if (payment.paidAmount >= total) {
    payment.status = "paid";
    payment.paidAt = new Date();
  } else if (payment.paidAmount > 0) {
    payment.status = "partial";
  } else {
    payment.status = "pending";
  }

  await visit.save();
  await payment.save();

  res.json({ message: "Tooth chart updated", visit, payment });
};





module.exports = {
  createVisit,
  getVisits,
  getVisitById,
  updateVisit,
  deleteVisit,
  getVisitWithPayments,
  addServiceToVisit,
  getMyVisits,
  completeVisit,
  updateVisitDoctorFields,
  addMultipleTreatmentSteps,
  uploadVisitPhoto,
  updateToothChart
};
