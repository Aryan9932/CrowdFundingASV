import express from "express";
import { registerUser, loginUser, updateProfile, getProfile } from "../Controllers/authController.js";
import { verifyToken } from "../middleware/authentication.js";

const router = express.Router();

// Public routes - no authentication required
router.post("/register", registerUser);
router.post("/login", loginUser);

// Protected routes - authentication required
router.get("/profile", verifyToken(), getProfile);
router.put("/profile", verifyToken(), updateProfile);

export default router;
