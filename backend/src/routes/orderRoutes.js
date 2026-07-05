// routes/orderRoutes.js
import express from "express";
import {
  createOrder,
  adminCreateOrder,
  getOrderById,
  getMyOrders,
  getAllOrders,
  updateOrderToPaid,
  updateOrderToDelivered,
  updateOrderStatus,
  cancelOrder,
  deleteOrder,
  getOrderStats,
  trackOrder,
} from "../controllers/orderController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

// ── Fixed-path routes MUST come before /:id to prevent Express swallowing them

// Stats
router.get("/dashboard/stats", protect, admin, getOrderStats);

// All orders list (admin)
router.get("/all", protect, admin, getAllOrders);

// Logged-in user's own orders
router.get("/myorders", protect, getMyOrders);

// Public order tracking by orderNumber (e.g. ORD-202507-042)
router.get("/track/:orderNumber", trackOrder);

// Admin manually logs a WhatsApp order
router.post("/admin", protect, admin, adminCreateOrder);

// Public: create order from storefront
router.post("/", createOrder);

// Single order by ID
router.get("/:id", protect, getOrderById);

// Status update (admin) — stock decrement/restore logic inside
router.put("/:id/status", protect, admin, updateOrderStatus);

// Pay
router.put("/:id/pay", protect, updateOrderToPaid);

// Deliver
router.put("/:id/deliver", protect, updateOrderToDelivered);

// Cancel
router.put("/:id/cancel", protect, cancelOrder);

// Hard delete (admin)
router.delete("/:id", protect, admin, deleteOrder);

export default router;
