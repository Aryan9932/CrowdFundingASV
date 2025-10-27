import express from "express";
import {
  createCampaign,
  getCampaigns,
  getCampaignById,
  getCampaignsByCategory,
  getCampaignsByType,
  getTrendingCampaigns,
  updateCampaign,
  deleteCampaign,
  toggleLike,
  addComment,
  getComments,
  addInvestment,
} from "../Controllers/campaignController.js";
import { upload } from "../middleware/upload.js";
import { verifyToken } from "../middleware/authentication.js";

const router = express.Router();

// ============================================
// Public Routes (No Authentication Required)
// ============================================

// Get all campaigns with filtering, pagination, sorting
// Query params: ?category=tech&status=active&search=keyword&page=1&limit=12&sortBy=created_at&sortOrder=DESC
router.get("/", getCampaigns);

// Get trending/featured campaigns
// Query params: ?limit=6
router.get("/trending", getTrendingCampaigns);

// Get campaigns by category
// URL: /campaigns/category/technology
router.get("/category/:category", getCampaignsByCategory);

// Get campaigns by type (donation/investment)
// URL: /campaigns/type/donation or /campaigns/type/investment
router.get("/type/:type", getCampaignsByType);

// Get single campaign by ID with full details
// URL: /campaigns/123
router.get("/:id", getCampaignById);

// Get comments for a campaign
// Query params: ?page=1&limit=10
router.get("/:id/comments", getComments);

// ============================================
// Protected Routes (Authentication Required)
// ============================================

// Create a new campaign with file uploads
// Requires: images (up to 5), video (up to 1)
router.post(
  "/",
  verifyToken(),
  upload.fields([
    { name: "images", maxCount: 5 },
    { name: "video", maxCount: 1 },
  ]),
  createCampaign
);

// Update campaign
router.put("/:id", verifyToken(), updateCampaign);

// Delete campaign
router.delete("/:id", verifyToken(), deleteCampaign);

// Toggle like on a campaign
router.post("/:id/like", verifyToken(), toggleLike);

// Add comment/discussion to a campaign
router.post("/:id/comments", verifyToken(), addComment);

// Add investment to a campaign
router.post("/:id/invest", verifyToken(), addInvestment);

export default router;
