const StockEntry = require("../models/StockEntry");
const Product = require("../models/Product");

// ➕ Добавление прихода
const createStockEntry = async (req, res) => {
    try {
      const { product, quantity, supplier } = req.body;
  
      const foundProduct = await Product.findById(product);
      if (!foundProduct) {
        return res.status(404).json({ message: "Product not found" });
      }
  
      foundProduct.stock += quantity;
      await foundProduct.save();
  
      const entry = await StockEntry.create({
        product,
        quantity,
        supplier,
        addedBy: req.user.id
      });
  
      res.status(201).json({ message: "Stock updated", entry });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };

// 📄 История приходов
const getAllStockEntries = async (req, res) => {
  try {
    const entries = await StockEntry.find()
      .populate("product", "name")
      .populate("supplier", "name")
      .populate("addedBy", "name")
      .sort({ createdAt: -1 });

    res.json(entries);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  createStockEntry,
  getAllStockEntries
};
