// src/routes/productRoutes.js
import express from "express";
import { protect, admin } from "../middleware/authMiddleware.js";
import {
  createProduct,
  getAllProducts,
  getProductById,
  deleteProduct,
} from "../controllers/productController.js";

const router = express.Router();

// Create a product → Admin only
router.post("/", protect, admin, createProduct);

// Delete product → Admin only
router.delete("/:id", protect, admin, deleteProduct);

// Public routes (anyone can view)
router.get("/", getAllProducts);
router.get("/:id", getProductById);

export default router;