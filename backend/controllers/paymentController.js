const Payment = require("../models/Payment");
const Service = require("../models/Service");
const Visit = require("../models/Visit");

// ✅ Создание оплаты (предоплата или финальная)
const createPayment = async (req, res) => {
  const { patient, visit, services, paidAmount = 0 } = req.body;

  // Проверка: если передан визит — он должен быть валиден
  if (visit) {
    const relatedVisit = await Visit.findById(visit);
    if (!relatedVisit) {
      return res.status(404).json({ message: "Указанный визит не найден" });
    }
    if (String(relatedVisit.patient) !== String(patient)) {
      return res.status(400).json({ message: "Визит не принадлежит этому пациенту" });
    }
  }

  let total = 0;

  for (const item of services) {
    const service = await Service.findById(item.service);
    if (!service) return res.status(404).json({ message: "Service not found" });

    const quantity = item.quantity || 1;
    total += service.price * quantity;
  }

  if (paidAmount > total) {
    return res.status(400).json({ message: "Оплата превышает сумму" });
  }

  let status = "pending";
  if (paidAmount >= total) status = "paid";
  else if (paidAmount > 0) status = "partial";

  const payment = await Payment.create({
    patient,
    visit: visit || null,
    services,
    totalAmount: total,
    paidAmount,
    status,
    paidAt: status === "paid" ? new Date() : null,
  });

  res.status(201).json(payment);
};
// ✅ Получение всех оплат
const getPayments = async (req, res) => {
  const rawPayments = await Payment.find()
  .populate("patient", "fullName phoneNumber")
  .populate("visit", "date status")
  .populate("services.service", "name price type");

const payments = rawPayments.map(p => ({
  ...p.toObject(),
  remainingAmount: p.totalAmount - p.paidAmount
}));

res.json(payments);
};

// ✅ Получение одной оплаты
const getPaymentById = async (req, res) => {
  const payment = await Payment.findById(req.params.id)
    .populate("patient", "fullName phoneNumber")
    .populate("visit", "date status")
    .populate("services.service", "name price type");

  if (!payment) return res.status(404).json({ message: "Payment not found" });

  res.json(payment);
};

// ✅ Обновление оплаты (добавление услуг, завершение)
const updatePayment = async (req, res) => {
  const payment = await Payment.findById(req.params.id);
  if (!payment) return res.status(404).json({ message: "Payment not found" });

  const { paidAmount } = req.body;

  if (typeof paidAmount === "number") {
    const newPaidAmount = payment.paidAmount + paidAmount;

    if (newPaidAmount > payment.totalAmount) {
      return res.status(400).json({ message: "Оплата превышает итоговую сумму." });
    }

    payment.paidAmount = newPaidAmount;

    if (newPaidAmount === 0) {
      payment.status = "pending";
    } else if (newPaidAmount < payment.totalAmount) {
      payment.status = "partial";
    } else {
      payment.status = "paid";
      payment.paidAt = new Date();
    }
  }

  const updated = await payment.save();
  res.json(updated);
};



// ✅ Удаление оплаты
const deletePayment = async (req, res) => {
  const payment = await Payment.findByIdAndDelete(req.params.id);
  if (!payment) return res.status(404).json({ message: "Payment not found" });

  res.json({ message: "Payment deleted" });
};

module.exports = {
  createPayment,
  getPayments,
  getPaymentById,
  updatePayment,
  deletePayment,
};
