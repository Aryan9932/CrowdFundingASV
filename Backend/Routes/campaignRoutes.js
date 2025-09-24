import express from "express";
import { createCampaign, getCampaigns } from "../Controllers/campaignController.js";
import { upload } from "../middleware/upload.js";

const router = express.Router();

router.post(
  "/",
  upload.fields([
    { name: "images", maxCount: 5 },
    { name: "video", maxCount: 1 }
  ]),
  (req, res, next) => {
    if (req.files && req.files.video) req.videoFile = req.files.video[0];
    next();
  },
  createCampaign
);

router.get("/", getCampaigns);

export default router;
