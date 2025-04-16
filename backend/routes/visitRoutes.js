const express = require("express");
const {
  createVisit,
  getVisits,
  getVisitById,
  updateVisit,
  deleteVisit,
  getVisitWithPayments
} = require("../controllers/visitController");

const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect);

// Доступ только для admin, doctor, reception
router.use(authorize("admin", "doctor", "reception"));

router.post("/", createVisit);
router.get("/", getVisits);
router.get("/:id", getVisitById);
router.put("/:id", updateVisit);
router.delete("/:id", deleteVisit);
router.get("/:id/payments", getVisitWithPayments);

module.exports = router;
