const express = require("express");
const router = express.Router();
const { createStockEntry, getAllStockEntries } = require("../controllers/stockEntryController");
const { protect, authorize } = require("../middleware/authMiddleware");

router.use(protect, authorize("admin"));

router.post("/", createStockEntry);        // ➕ приход
router.get("/", getAllStockEntries);       // 📄 история

module.exports = router;
