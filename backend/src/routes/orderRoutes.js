// routes/orderRoutes.js
import express from "express";
import {
  createOrder,
  getOrderById,
  getMyOrders,
  getAllOrders,
  updateOrderToPaid,
  updateOrderToDelivered,
  updateOrderStatus,
  cancelOrder,
  deleteOrder,
  getOrderStats,
} from "../controllers/orderController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

// Create a new order — public, no auth required
router.post("/", createOrder);

// Get logged in user's orders
router.get("/myorders", protect, getMyOrders);

// Get order by ID
router.get("/:id", protect, getOrderById);

// Get all orders (Admin only)
router.get("/", protect, admin, getAllOrders);

// Get order stats (Admin only)
router.get("/dashboard/stats", protect, admin, getOrderStats);

// Update order to paid
router.put("/:id/pay", protect, updateOrderToPaid);

// Update order to delivered
router.put("/:id/deliver", protect, updateOrderToDelivered);

// Update order status (Admin only)
router.put("/:id/status", protect, admin, updateOrderStatus);

// Cancel order
router.put("/:id/cancel", protect, cancelOrder);

// Delete order (Admin only)
router.delete("/:id", protect, admin, deleteOrder);

export default router;
