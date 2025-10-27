import * as Campaign from "../models/campaignModel.js";
import { uploadToCloudinary } from "../middleware/upload.js";

// Create a new campaign with file uploads
export const createCampaign = async (req, res) => {
  try {
    const {
      title,
      description,
      creatorId,
      creatorType = "individual",
      typeOfCampaign,
      category,
      goalAmount,
      location,
      rewards,
    } = req.body;

    // Validate required fields
    if (
      !title ||
      !description ||
      !creatorId ||
      !typeOfCampaign ||
      !category ||
      !goalAmount
    ) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    // Handle file uploads to Cloudinary
    const mediaUrls = { images: [], video: null };

    if (req.files) {
      // Upload images
      if (req.files.images) {
        for (const file of req.files.images) {
          const result = await uploadToCloudinary(file.buffer, {
            folder: "campaigns/images",
            resource_type: "image",
          });
          mediaUrls.images.push(result.secure_url);
        }
      }

      // Upload video
      if (req.files.video && req.files.video[0]) {
        const result = await uploadToCloudinary(req.files.video[0].buffer, {
          folder: "campaigns/videos",
          resource_type: "video",
        });
        mediaUrls.video = result.secure_url;
      }
    }

    // Parse rewards if provided
    let parsedRewards = [];
    if (rewards) {
      try {
        parsedRewards =
          typeof rewards === "string" ? JSON.parse(rewards) : rewards;
      } catch (err) {
        return res.status(400).json({
          success: false,
          message: "Invalid rewards format",
        });
      }
    }

    const campaignData = {
      title,
      description,
      creatorId: parseInt(creatorId),
      creatorType,
      typeOfCampaign,
      category,
      goalAmount: parseFloat(goalAmount),
      location,
      media: mediaUrls,
      rewards: parsedRewards,
    };

    const campaign = await Campaign.createCampaign(campaignData);
    res.status(201).json({
      success: true,
      message: "Campaign created successfully",
      campaign,
    });
  } catch (err) {
    console.error("Error creating campaign:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};

// Get all campaigns with filtering, pagination, and sorting
export const getCampaigns = async (req, res) => {
  try {
    const {
      category,
      status,
      search,
      page = 1,
      limit = 12,
      sortBy = "created_at",
      sortOrder = "DESC",
    } = req.query;

    const filters = {
      category,
      status,
      search,
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit),
      sortBy,
      sortOrder,
    };

    const campaigns = await Campaign.fetchAllCampaigns(filters);

    res.json({
      success: true,
      campaigns,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: campaigns.length,
      },
    });
  } catch (err) {
    console.error("Error fetching campaigns:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};

// Get a single campaign by ID with full details
export const getCampaignById = async (req, res) => {
  try {
    const { id } = req.params;

    const campaign = await Campaign.fetchCampaignById(parseInt(id));

    if (!campaign) {
      return res.status(404).json({
        success: false,
        message: "Campaign not found",
      });
    }

    res.json({ success: true, campaign });
  } catch (err) {
    console.error("Error fetching campaign:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};

// Get campaigns by category (specific endpoint for category filtering)
export const getCampaignsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const { page = 1, limit = 12 } = req.query;

    const campaigns = await Campaign.fetchAllCampaigns({
      category,
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit),
      sortBy: "created_at",
      sortOrder: "DESC",
    });

    res.json({
      success: true,
      category,
      campaigns,
      count: campaigns.length,
    });
  } catch (err) {
    console.error("Error fetching campaigns by category:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};

// Get campaigns by type (donation/investment)
export const getCampaignsByType = async (req, res) => {
  try {
    const { type } = req.params;
    const { page = 1, limit = 12 } = req.query;

    if (!["donation", "investment"].includes(type)) {
      return res.status(400).json({
        success: false,
        message: "Invalid campaign type. Must be 'donation' or 'investment'",
      });
    }

    const campaigns = await Campaign.fetchAllCampaigns({
      typeOfCampaign: type,
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit),
      sortBy: "created_at",
      sortOrder: "DESC",
    });

    res.json({
      success: true,
      type,
      campaigns,
      count: campaigns.length,
    });
  } catch (err) {
    console.error("Error fetching campaigns by type:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};

// Get trending/featured campaigns
export const getTrendingCampaigns = async (req, res) => {
  try {
    const { limit = 6 } = req.query;

    // Fetch campaigns sorted by likes/engagement
    const campaigns = await Campaign.fetchAllCampaigns({
      status: "active",
      limit: parseInt(limit),
      offset: 0,
      sortBy: "total_likes",
      sortOrder: "DESC",
    });

    res.json({
      success: true,
      campaigns,
    });
  } catch (err) {
    console.error("Error fetching trending campaigns:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};

// Update campaign
export const updateCampaign = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const updatedCampaign = await Campaign.updateCampaign(
      parseInt(id),
      updates
    );

    if (!updatedCampaign) {
      return res.status(404).json({
        success: false,
        message: "Campaign not found",
      });
    }

    res.json({
      success: true,
      message: "Campaign updated successfully",
      campaign: updatedCampaign,
    });
  } catch (err) {
    console.error("Error updating campaign:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};

// Delete campaign
export const deleteCampaign = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Campaign.deleteCampaign(parseInt(id));

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Campaign not found",
      });
    }

    res.json({
      success: true,
      message: "Campaign deleted successfully",
    });
  } catch (err) {
    console.error("Error deleting campaign:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};

// Toggle campaign like
export const toggleLike = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    const result = await Campaign.toggleCampaignLike(
      parseInt(id),
      parseInt(userId)
    );

    res.json({
      success: true,
      action: result.action,
      message:
        result.action === "liked" ? "Campaign liked" : "Campaign unliked",
      totalLikes: result.totalLikes,
    });
  } catch (err) {
    console.error("Error toggling like:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};

// Add comment/discussion to campaign
export const addComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId, comment } = req.body;

    if (!userId || !comment) {
      return res.status(400).json({
        success: false,
        message: "User ID and comment are required",
      });
    }

    const newComment = await Campaign.addCampaignComment(
      parseInt(id),
      parseInt(userId),
      comment
    );

    res.status(201).json({
      success: true,
      message: "Comment added successfully",
      comment: newComment,
    });
  } catch (err) {
    console.error("Error adding comment:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};

// Get comments for a campaign
export const getComments = async (req, res) => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const comments = await Campaign.fetchCampaignComments(parseInt(id), {
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit),
    });

    res.json({
      success: true,
      comments,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
      },
    });
  } catch (err) {
    console.error("Error fetching comments:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};

// Add investment to campaign
export const addInvestment = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId, amount } = req.body;

    if (!userId || !amount) {
      return res.status(400).json({
        success: false,
        message: "User ID and amount are required",
      });
    }

    const investment = await Campaign.addInvestment(
      parseInt(id),
      parseInt(userId),
      parseFloat(amount)
    );

    res.status(201).json({
      success: true,
      message: "Investment added successfully",
      investment,
    });
  } catch (err) {
    console.error("Error adding investment:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};
