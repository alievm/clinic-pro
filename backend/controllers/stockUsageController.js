const StockUsage = require("../models/StockUsage");

// 🔎 Получить все списания
const getAllStockUsage = async (req, res) => {
  try {
    const usage = await StockUsage.find()
      .populate("product", "name")
      .populate("usedBy", "name")
      .sort({ createdAt: -1 });

    res.json(usage);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 📦 Получить все списания по конкретному продукту
const getStockUsageByProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const usage = await StockUsage.find({ product: id })
      .populate("usedBy", "name")
      .sort({ createdAt: -1 });

    res.json(usage);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getAllStockUsage,
  getStockUsageByProduct
};
