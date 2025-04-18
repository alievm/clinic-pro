const express = require("express");
const router = express.Router();
const {
  getSuppliers,
  createSupplier,
  updateSupplier,
  deleteSupplier
} = require("../controllers/supplierController");
const { protect, authorize } = require("../middleware/authMiddleware");

router.use(protect, authorize("admin", "reception"));

router.get("/", getSuppliers);
router.post("/", createSupplier);
router.put("/:id", updateSupplier);
router.delete("/:id", deleteSupplier);

module.exports = router;
