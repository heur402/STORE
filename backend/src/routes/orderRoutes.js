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
} from "../controllers/orderController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

// ── Stats (must be before /:id to avoid route conflict)
router.get("/dashboard/stats", protect, admin, getOrderStats);

// ── Admin manually logs a WhatsApp order
router.post("/admin", protect, admin, adminCreateOrder);

// ── Public: create order from storefront
router.post("/", createOrder);

// ── User: own orders
router.get("/myorders", protect, getMyOrders);

// ── Admin: all orders
router.get("/", protect, admin, getAllOrders);

// ── Single order
router.get("/:id", protect, getOrderById);

// ── Status update (admin) — includes stock decrement/restore logic
router.put("/:id/status", protect, admin, updateOrderStatus);

// ── Pay
router.put("/:id/pay", protect, updateOrderToPaid);

// ── Deliver
router.put("/:id/deliver", protect, updateOrderToDelivered);

// ── Cancel
router.put("/:id/cancel", protect, cancelOrder);

// ── Delete (admin)
router.delete("/:id", protect, admin, deleteOrder);

export default router;
