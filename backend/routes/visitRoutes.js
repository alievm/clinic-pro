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
  updateVisitDoctorFields,
  addMultipleTreatmentSteps,
  uploadVisitPhoto,
  updateToothChart
} = require("../controllers/visitController");

const { protect, authorize } = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");

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
router.put("/:id/complete", protect, authorize("admin"), completeVisit);
router.put("/:id/update-doctor", protect, authorize("doctor"), updateVisitDoctorFields);
router.put("/:id/add-treatment-step", protect, authorize("admin"), addMultipleTreatmentSteps);
router.post(
  "/:id/upload-photo",
  protect,
  authorize("admin"),
  upload.single("image"),
  uploadVisitPhoto
);

router.put("/:id/update-tooth-chart", protect, authorize("admin"), updateToothChart);

module.exports = router;
