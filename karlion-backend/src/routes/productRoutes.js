const express = require("express")
const router = express.Router();
const {
  createProduct,
  getAllProducts,
  getProductByCategory,
  getProductById,
  deleteProduct,
  updateProductbyId,
} = require("../controllers/productController");

const { isAuthenticated, isAdmin } = require("../middleware/auth");

// 🌍 Public routes (anyone can view products)
router.get("/", getAllProducts); // GET all products
router.get("/category/:category", getProductByCategory); // GET products by category
router.get("/page/:page", getProductbyPage); // GET products by page (Men/Women/Kid)
router.get("/:id", getProductById); // GET single product by ID

// 🔒 Admin routes (create, update, delete products)
router.post("/", isAuthenticated, isAdmin, createProduct); // Create new product
router.put("/:id", isAuthenticated, isAdmin, updateProductbyId); // Update product by ID
router.delete("/:id", isAuthenticated, isAdmin, deleteProduct); // Delete product by ID

export default router;