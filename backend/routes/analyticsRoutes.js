const express = require("express");
const router = express.Router();
const { getInventoryAnalytics, getVisitAnalytics, getPaymentAnalytics, getProfitabilityAnalytics } = require("../controllers/analyticsController");
const { protect, authorize } = require("../middleware/authMiddleware");

router.use(protect, authorize("admin"));
router.get("/inventory", getInventoryAnalytics);
router.get("/visits", protect, authorize("admin"), getVisitAnalytics);
router.get("/payments", protect, authorize("admin"), getPaymentAnalytics);
router.get("/profitability", protect, authorize("admin"), getProfitabilityAnalytics);
module.exports = router;
