const express = require("express");
const { registerUser, loginUser, getUsers, deleteUser } = require("../controllers/authController");
const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

// Only admin can register users
router.post("/register", protect, authorize("admin"), registerUser);

router.get("/users", protect, authorize("admin"), getUsers);
router.delete("/users/:id", protect, authorize("admin"), deleteUser);

// Login route
router.post("/login", loginUser);

module.exports = router;
