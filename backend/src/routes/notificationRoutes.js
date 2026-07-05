// src/routes/notificationRoutes.js
import express from "express";
import { protect, admin } from "../middleware/authMiddleware.js";
import {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
} from "../controllers/notificationController.js";

const router = express.Router();

// All notification routes are admin-only
router.get("/", protect, admin, getNotifications);
router.get("/unread-count", protect, admin, getUnreadCount);
router.put("/mark-all-read", protect, admin, markAllAsRead);
router.put("/:id/read", protect, admin, markAsRead);
router.delete("/:id", protect, admin, deleteNotification);

export default router;
