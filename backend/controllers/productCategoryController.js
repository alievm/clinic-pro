// ✅ controllers/productCategoryController.js
const ProductCategory = require("../models/ProductCategory");

// 🔹 Получить все категории
const getAllCategories = async (req, res) => {
  try {
    const categories = await ProductCategory.find().sort({ name: 1 });
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ➕ Создать категорию
const createCategory = async (req, res) => {
  try {
    const category = await ProductCategory.create(req.body);
    res.status(201).json(category);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// ✏️ Обновить категорию
const updateCategory = async (req, res) => {
  try {
    const category = await ProductCategory.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!category) return res.status(404).json({ message: "Category not found" });
    res.json(category);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// ❌ Удалить категорию
const deleteCategory = async (req, res) => {
  try {
    const category = await ProductCategory.findByIdAndDelete(req.params.id);
    if (!category) return res.status(404).json({ message: "Category not found" });
    res.json({ message: "Category deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory
};
