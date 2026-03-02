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
} from "../controllers/productController.js";

const router = express.Router();

// In your backend, add these endpoints:

// 1. Dashboard Stats
router.get("/dashboard/stats", protect, admin, async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments({ isDeleted: false });
    const activeProducts = await Product.countDocuments({
      isDeleted: false,
      stock: { $gt: 0 },
    });
    const outOfStock = await Product.countDocuments({
      stock: 0,
      isDeleted: false,
    });
    const lowStock = await Product.countDocuments({
      stock: { $gt: 0, $lte: 10 },
      isDeleted: false,
    });

    res.json([
      { id: 1, title: "Total Products", value: totalProducts.toString() },
      { id: 2, title: "Active Products", value: activeProducts.toString() },
      { id: 3, title: "Out of Stock", value: outOfStock.toString() },
      { id: 4, title: "Low Stock", value: lowStock.toString() },
    ]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 2. Sales Data (you'll need to create an Order model for this)
router.get("/dashboard/sales", protect, admin, async (req, res) => {
  try {
    // This is sample data - you need Order model to get real sales
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
    const salesData = months.map((month) => ({
      month,
      sales: Math.floor(Math.random() * 5000) + 2000, // Random for now
    }));
    res.json(salesData);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 3. Stock Status
router.get("/dashboard/stock-status", protect, admin, async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments({ isDeleted: false });
    const inStock = await Product.countDocuments({
      stock: { $gt: 10 },
      isDeleted: false,
    });
    const lowStock = await Product.countDocuments({
      stock: { $gt: 0, $lte: 10 },
      isDeleted: false,
    });
    const outOfStock = await Product.countDocuments({
      stock: 0,
      isDeleted: false,
    });

    res.json([
      { name: "In Stock", value: inStock },
      { name: "Low Stock", value: lowStock },
      { name: "Out of Stock", value: outOfStock },
    ]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 4. Recent Products (last 5)
router.get("/dashboard/recent-products", protect, admin, async (req, res) => {
  try {
    const products = await Product.find({ isDeleted: false })
      .sort({ createdAt: -1 })
      .limit(5);
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 5. Update product endpoint
router.put("/:id", protect, admin, updateProduct);

// Create a product → Admin only
router.post("/", protect, admin, createProduct);

// Delete product → Admin only
router.delete("/:id", protect, admin, deleteProduct);

// Public routes (anyone can view)
router.get("/", getAllProducts);
router.get("/:id", getProductById);

export default router;