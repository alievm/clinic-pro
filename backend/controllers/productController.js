// ✅ controllers/productController.js
const Product = require("../models/Product");
const StockEntry = require("../models/StockEntry");
const StockUsage = require("../models/StockUsage");

// 🔹 Get all products
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ name: 1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getLowStockProducts = async (req, res) => {
    try {
      const products = await Product.find({
        track: true,
        $expr: { $lt: ["$stock", "$minStock"] }
      }).sort({ stock: 1 });
  
      res.json(products);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };

// 🔹 Create product
const createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// 🔹 Update product
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// 🔹 Delete product
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🔹 Get stock report
const getStockReport = async (req, res) => {
    try {
      const products = await Product.find();
  
      const report = await Promise.all(
        products.map(async (product) => {
          const totalIncoming = await StockEntry.aggregate([
            { $match: { product: product._id } },
            { $group: { _id: null, total: { $sum: "$quantity" } } }
          ]);
  
          const totalUsed = await StockUsage.aggregate([
            { $match: { product: product._id } },
            { $group: { _id: null, total: { $sum: "$quantity" } } }
          ]);
  
          return {
            name: product.name,
            stock: product.stock,
            incoming: totalIncoming[0]?.total || 0,
            used: totalUsed[0]?.total || 0,
            unit: product.unit
          };
        })
      );
  
      res.json(report);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };

module.exports = {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getLowStockProducts,
  getStockReport
};
