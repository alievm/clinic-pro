const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ["admin", "doctor", "reception", "accountant"],
    default: "reception",
  },
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
