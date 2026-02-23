import express from "express";
import {
  registerUser,
  loginUser,
  getUsers,
  getMe,
} from "../controllers/userController.js";


import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me", protect, getMe);

// Protected admin route
router.get("/", protect, admin, getUsers);

export default router;