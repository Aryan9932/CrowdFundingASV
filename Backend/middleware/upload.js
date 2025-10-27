import multer from "multer";
import cloudinary from "../config/cloudinary.js";
import { Readable } from "stream";

// Store files in memory temporarily
const storage = multer.memoryStorage();

// File filter to accept only images and videos
const fileFilter = (req, file, cb) => {
  // Accept images (jpeg, jpg, png, gif, webp)
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  }
  // Accept videos (mp4, avi, mov, wmv, flv, mkv)
  else if (file.mimetype.startsWith("video/")) {
    cb(null, true);
  } else {
    cb(
      new Error("Invalid file type. Only images and videos are allowed!"),
      false
    );
  }
};

// Configure multer with memory storage and file filter
export const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB max file size
  },
});

// Helper function to upload buffer to Cloudinary
export const uploadToCloudinary = (buffer, options = {}) => {
  return new Promise((resolve, reject) => {
    const uploadOptions = {
      resource_type: options.resource_type || "auto",
      folder: options.folder || "crowdfunding",
      transformation:
        options.resource_type === "image"
          ? [{ quality: "auto", fetch_format: "auto" }]
          : undefined,
      ...options,
    };

    const uploadStream = cloudinary.uploader.upload_stream(
      uploadOptions,
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    );

    // Convert buffer to stream and pipe to Cloudinary
    const readableStream = new Readable();
    readableStream.push(buffer);
    readableStream.push(null);
    readableStream.pipe(uploadStream);
  });
};

// Middleware to upload single file to Cloudinary
export const uploadSingleToCloudinary = async (req, res, next) => {
  try {
    if (!req.file) {
      return next();
    }

    const resourceType = req.file.mimetype.startsWith("image/")
      ? "image"
      : "video";
    const folder =
      resourceType === "image" ? "crowdfunding/images" : "crowdfunding/videos";

    const result = await uploadToCloudinary(req.file.buffer, {
      resource_type: resourceType,
      folder: folder,
    });

    // Attach Cloudinary result to request
    req.cloudinaryResult = {
      url: result.secure_url,
      publicId: result.public_id,
      resourceType: result.resource_type,
      format: result.format,
      width: result.width,
      height: result.height,
      size: result.bytes,
    };

    next();
  } catch (error) {
    next(error);
  }
};

// Middleware to upload multiple files to Cloudinary
export const uploadMultipleToCloudinary = async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      return next();
    }

    const uploadPromises = req.files.map(async (file) => {
      const resourceType = file.mimetype.startsWith("image/")
        ? "image"
        : "video";
      const folder =
        resourceType === "image"
          ? "crowdfunding/images"
          : "crowdfunding/videos";

      const result = await uploadToCloudinary(file.buffer, {
        resource_type: resourceType,
        folder: folder,
      });

      return {
        url: result.secure_url,
        publicId: result.public_id,
        resourceType: result.resource_type,
        format: result.format,
        width: result.width,
        height: result.height,
        size: result.bytes,
      };
    });

    req.cloudinaryResults = await Promise.all(uploadPromises);
    next();
  } catch (error) {
    next(error);
  }
};
