import express from "express";
import {
  upload,
  uploadSingleToCloudinary,
  uploadMultipleToCloudinary,
} from "../middleware/upload.js";

const router = express.Router();


// Test single file upload
router.post(
  "/test/single",
  upload.single("file"),
  uploadSingleToCloudinary,
  (req, res) => {
    try {
      if (!req.cloudinaryResult) {
        return res.status(400).json({
          success: false,
          error: "No file uploaded",
        });
      }

      res.status(200).json({
        success: true,
        message: "✅ Test upload successful!",
        note: "For campaign uploads, use POST /api/campaigns",
        data: req.cloudinaryResult,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }
);


router.post(
  "/test/multiple",
  upload.array("files", 10), // Max 10 files
  uploadMultipleToCloudinary,
  (req, res) => {
    try {
      if (!req.cloudinaryResults || req.cloudinaryResults.length === 0) {
        return res.status(400).json({
          success: false,
          error: "No files uploaded",
        });
      }

      res.status(200).json({
        success: true,
        message: `✅ Test upload successful! ${req.cloudinaryResults.length} file(s) uploaded.`,
        note: "For campaign uploads, use POST /api/campaigns",
        data: req.cloudinaryResults,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }
);

export default router;
