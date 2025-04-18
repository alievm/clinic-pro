const express = require("express");
const router = express.Router();
const {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory
} = require("../controllers/productCategoryController");
const { protect, authorize } = require("../middleware/authMiddleware");

router.use(protect, authorize("admin"));

router.get("/", getAllCategories);
router.post("/", createCategory);
router.put("/:id", updateCategory);
router.delete("/:id", deleteCategory);

module.exports = router;
