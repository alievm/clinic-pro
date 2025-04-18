const Payment = require("../models/Payment");
const Service = require("../models/Service");

// ✅ Создание оплаты (предоплата или финальная)
const createPayment = async (req, res) => {
  const { patient, visit, services } = req.body;

  // Рассчитываем сумму
  let total = 0;

  for (const item of services) {
    const service = await Service.findById(item.service);
    if (!service) return res.status(404).json({ message: "Service not found" });

    const quantity = item.quantity || 1;
    total += service.price * quantity;
  }

  const payment = await Payment.create({
    patient,
    visit: visit || null,
    services,
    totalAmount: total,
    status: "pending",
  });

  res.status(201).json(payment);
};

// ✅ Получение всех оплат
const getPayments = async (req, res) => {
  const payments = await Payment.find()
    .populate("patient", "fullName phoneNumber")
    .populate("visit", "date status")
    .populate("services.service", "name price type");
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
  
    const { services, paidAmount } = req.body;
  
    if (services) {
      let total = 0;
  
      for (const item of services) {
        const service = await Service.findById(item.service);
        if (!service) return res.status(404).json({ message: "Service not found" });
  
        const quantity = item.quantity || 1;
        total += service.price * quantity;
      }
  
      payment.services = services;
      payment.totalAmount = total;
    }
  
    if (typeof paidAmount === "number") {
      payment.paidAmount = paidAmount;
  
      if (paidAmount >= payment.totalAmount) {
        payment.status = "paid";
        payment.paidAt = new Date();
      } else if (paidAmount > 0) {
        payment.status = "partial";
      } else {
        payment.status = "pending";
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
