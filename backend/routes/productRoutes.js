const express = require("express");
const router = express.Router();
const {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getLowStockProducts,
  getStockReport
} = require("../controllers/productController");
const { protect, authorize } = require("../middleware/authMiddleware");

router.use(protect, authorize("admin"));

router.get("/", getAllProducts);
router.post("/", createProduct);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);
router.get("/low-stock", authorize("admin", "reception"), getLowStockProducts);
router.get("/stock-report", authorize("admin"), getStockReport);

module.exports = router;
