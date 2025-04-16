const express = require("express");
const {
  createPatient,
  getPatients,
  getPatientById,
  updatePatient,
  deletePatient,
  getPatientHistory,
} = require("../controllers/patientController");

const upload = require("../middleware/upload"); // 📌 ВАЖНО: этот импорт должен быть выше, ДО router.post
const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

// 📌 upload — ДО общего use
router.post(
  "/upload",
  protect,
  authorize("admin", "reception"),
  upload.single("image"),
  (req, res) => {
    res.status(200).json({ image: `/uploads/${req.file.filename}` });
  }
);

// 🔐 Защищённые маршруты
router.use(protect, authorize("admin", "reception"));

router.post("/", createPatient);
router.get("/", getPatients);
router.get("/:id", getPatientById);
router.put("/:id", updatePatient);
router.get("/:id/history", getPatientHistory);
router.delete("/:id", deletePatient);

module.exports = router;
