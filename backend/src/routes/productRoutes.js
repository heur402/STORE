// src/routes/productRoutes.js
import express from "express";
import { protect, admin } from "../middleware/authMiddleware.js";
import Product from "../models/Product.js";
import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  likeProduct,
} from "../controllers/productController.js";

import {
  getDashboardStats,
  getSalesData,
  getStockStatus,
  getRecentProducts
} from "../controllers/dashboardController.js";

const router = express.Router();

// Dashboard Stats APIs
router.get("/dashboard/stats", protect, admin, getDashboardStats);
router.get("/dashboard/sales", protect, admin, getSalesData);
router.get("/dashboard/stock-status", protect, admin, getStockStatus);
router.get("/dashboard/recent-products", protect, admin, getRecentProducts);

// Create a product → Admin only
router.post("/", protect, admin, createProduct);

// Update product → Admin only
router.put("/:id", protect, admin, updateProduct);

// Delete product → Admin only
router.delete("/:id", protect, admin, deleteProduct);

// Like/Unlike product → Logged in users only
router.put("/:id/like", protect, likeProduct);

// Public routes (anyone can view)
router.get("/", getAllProducts);
router.get("/:id", getProductById);

export default router;