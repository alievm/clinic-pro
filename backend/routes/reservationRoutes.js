const express = require("express");
const router = express.Router();
const {
  createReservation,
  getReservationsByDate,
  deleteReservation,
  getAllReservations,
  updateReservation
} = require("../controllers/reservationController");

const { protect, authorize } = require("../middleware/authMiddleware");

router.use(protect);

// 👤 Рецепция / админ могут бронировать
router.post("/", authorize("admin", "reception"), createReservation);

// 📆 Получить все брони по диапазону дат
router.get("/calendar", authorize("admin", "reception", "doctor"), getReservationsByDate);

// ❌ Удалить бронь
router.delete("/:id", authorize("admin", "reception"), deleteReservation);

router.get("/", authorize("admin", "reception"), getAllReservations);

router.put("/:id", authorize("admin", "reception"), updateReservation);

module.exports = router;
