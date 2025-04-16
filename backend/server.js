const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const patientRoutes = require("./routes/patientRoutes");
const visitRoutes = require("./routes/visitRoutes");
const serviceRoutes = require("./routes/serviceRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const path = require("path");
dotenv.config();
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get("/", (req, res) => {
  res.send("Clinic CRM API is running");
});

app.use("/uploads", express.static(path.join(__dirname, "/uploads")));
app.use("/api/auth", authRoutes);
app.use("/api/patients", patientRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/visits", visitRoutes);

// Error handler placeholder
app.use((err, req, res, next) => {
    console.error("SERVER ERROR:", err); // вывод в консоль
    res.status(500).json({ message: err.message || "Internal server error" });
  });

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
