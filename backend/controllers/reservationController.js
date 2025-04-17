const Reservation = require("../models/Reservation");
const Visit = require("../models/Visit");

// ✅ Создание новой записи (бронирование)
const createReservation = async (req, res) => {
  try {
    const { patient, doctor, date, duration, note } = req.body;

    const existing = await Reservation.findOne({
      doctor,
      date: new Date(date),
      status: "pending"
    });

    if (existing) {
      return res.status(400).json({ message: "Doctor already has a reservation at this time" });
    }

    const reservation = await Reservation.create({
      patient,
      doctor,
      date,
      duration,
      note,
      createdBy: req.user.id
    });

    res.status(201).json(reservation);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// ✅ Обновить бронь
const updateReservation = async (req, res) => {
    try {
      const { id } = req.params;
      const { patient, doctor, date, duration, note, status } = req.body;
  
      const reservation = await Reservation.findById(id);
      if (!reservation) {
        return res.status(404).json({ message: "Reservation not found" });
      }
  
      if (patient) reservation.patient = patient;
      if (doctor) reservation.doctor = doctor;
      if (date) reservation.date = date;
      if (duration) reservation.duration = duration;
      if (note) reservation.note = note;
      if (status) reservation.status = status;
  
      await reservation.save();
      res.json({ message: "Reservation updated", reservation });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };

const getAllReservations = async (req, res) => {
    try {
      const reservations = await Reservation.find()
       .populate("doctor", "name color")
        .populate("patient", "fullName phoneNumber")
        .sort({ date: 1 }); // по дате
  
      res.json(reservations);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };

// ✅ Получение всех бронирований по дате
const getReservationsByDate = async (req, res) => {
  try {
    const { from, to } = req.query;

    const reservations = await Reservation.find({
      date: { $gte: new Date(from), $lte: new Date(to) },
      status: "pending"
    })
      .populate("doctor", "name color")
      .populate("patient", "fullName phoneNumber");

    res.json(reservations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Удаление вручную
const deleteReservation = async (req, res) => {
  try {
    const reservation = await Reservation.findByIdAndDelete(req.params.id);
    if (!reservation) return res.status(404).json({ message: "Reservation not found" });

    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Авто-удаление при создании визита
const removeReservationIfMatched = async ({ patient, doctor, date }) => {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
  
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);
  
    await Reservation.findOneAndUpdate(
      {
        patient,
        doctor,
        date: {
          $gte: startOfDay,
          $lte: endOfDay
        },
        status: "pending"
      },
      { status: "converted" }
    );
  };
  

module.exports = {
  createReservation,
  getReservationsByDate,
  deleteReservation,
  removeReservationIfMatched,
  getAllReservations,
  updateReservation
};
