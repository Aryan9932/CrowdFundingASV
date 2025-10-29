import express from "express";
import {
  createOrder,
  verifyPayment,
  getPaymentHistory,
  getCampaignTransactions,
} from "../controllers/paymentController.js";
import { verifyToken } from "../middleware/authentication.js";

const router = express.Router();

// ============================================
// Protected Routes (Authentication Required)
// ============================================

// Create Razorpay order
router.post("/create-order", verifyToken(), createOrder);

// Verify Razorpay payment
router.post("/verify", verifyToken(), verifyPayment);

// Get user's payment history
router.get("/history/:userId", verifyToken(), getPaymentHistory);

// Get campaign transactions
router.get("/campaign/:campaignId", verifyToken(), getCampaignTransactions);

export default router;



