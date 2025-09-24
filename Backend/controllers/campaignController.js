import Campaign from "../models/campaignModel.js";
import cloudinary from "../config/cloudinary.js";

// Helper: Upload single file to Cloudinary
const uploadToCloudinary = (fileBuffer, folder, resource_type = "image") => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type },
      (error, result) => {
        if (error) reject(error);
        else resolve(result.secure_url);
      }
    );
    stream.end(fileBuffer);
  });
};

// Create a campaign
export const createCampaign = async (req, res) => {
  try {
    const { title, description, goalAmount, category, deadline, creator, location, rewards } = req.body;

    // 1️⃣ Upload images
    const images = [];
    if (req.files && req.files.images) {
      for (const file of req.files.images) {
        const imageUrl = await uploadToCloudinary(file.buffer, "campaigns/images", "image");
        images.push(imageUrl);
      }
    }

    // 2️⃣ Upload video (if provided)
    let video = null;
    if (req.files && req.files.video && req.files.video[0]) {
      video = await uploadToCloudinary(req.files.video[0].buffer, "campaigns/videos", "video");
    }

    // 3️⃣ Parse rewards safely
    let rewardsArray = [];
    if (rewards) {
      try {
        rewardsArray = JSON.parse(rewards);
      } catch (err) {
        return res.status(400).json({
          success: false,
          error: "Rewards must be valid JSON. Example: [{\"amount\":1000,\"title\":\"Thank You\"}]",
        });
      }
    }

    // 4️⃣ Create campaign document
    const campaign = new Campaign({
      title,
      description,
      goalAmount,
      category,
      deadline,
      creator,
      location,
      media: { images, video },
      rewards: rewardsArray,
    });

    await campaign.save();
    res.status(201).json({ success: true, campaign });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
};

// Get all campaigns
export const getCampaigns = async (req, res) => {
  try {
    const campaigns = await Campaign.find().sort({ createdAt: -1 });
    res.json({ success: true, campaigns });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
