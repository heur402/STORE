import express from "express";
import {
  registerUser,
  loginUser,
  getUsers,
  getMe,
  updateUserProfile,
  updateUserInfo,
  suspendUser,
} from "../controllers/userController.js";


import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me", protect, getMe);
router.put("/profile", protect, updateUserProfile);

// Protected admin routes
router.get("/", protect, admin, getUsers);
router.put("/:id", protect, admin, updateUserInfo);
router.patch("/:id/suspend", protect, admin, suspendUser);

export default router;