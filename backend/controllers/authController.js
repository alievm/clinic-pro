const User = require("../models/User");
const bcrypt = require("bcryptjs");
const generateToken = require("../utils/generateToken");

// ✅ Register user (admin only)
const registerUser = async (req, res) => {
  const { name, username, password, role } = req.body;

  const existing = await User.findOne({ username });
  if (existing) return res.status(400).json({ message: "Username already exists" });

  const hashed = await bcrypt.hash(password, 10);

  const user = await User.create({ name, username, password: hashed, role });

  res.status(201).json({ message: "User created successfully", user });
};

// ✅ Login user
const loginUser = async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });
  if (!user) return res.status(401).json({ message: "Invalid credentials" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

  const token = generateToken(user);

  res.json({ token, user: { id: user._id, name: user.name, role: user.role } });
};

// ✅ Get all users (admin only)
const getUsers = async (req, res) => {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.json(users);
  };
  
  // ✅ Delete user (admin only)
  const deleteUser = async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
  
    await user.remove();
    res.json({ message: "User deleted successfully" });
  };

module.exports = { registerUser, loginUser, getUsers, deleteUser };
