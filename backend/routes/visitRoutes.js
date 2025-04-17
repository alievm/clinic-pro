const express = require("express");
const {
  createVisit,
  getVisits,
  getVisitById,
  updateVisit,
  deleteVisit,
  getVisitWithPayments,
  addServiceToVisit,
  getMyVisits,
  completeVisit,
  updateVisitDoctorFields
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
router.put("/:id/add-service", addServiceToVisit);
router.get("/my", protect, authorize("doctor"), getMyVisits);
router.put("/:id/complete", protect, authorize("doctor"), completeVisit);
router.put("/:id/update-doctor", protect, authorize("doctor"), updateVisitDoctorFields);

module.exports = router;
