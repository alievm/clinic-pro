const express = require("express");
const router = express.Router();
const { getAllStockUsage, getStockUsageByProduct } = require("../controllers/stockUsageController");
const { protect, authorize } = require("../middleware/authMiddleware");

router.use(protect, authorize("admin", "reception"));

router.get("/", getAllStockUsage); // все списания
router.get("/:id", getStockUsageByProduct); // по товару

module.exports = router;
