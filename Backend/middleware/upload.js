import multer from "multer";
import cloudinary from "../config/cloudinary.js";

// Store files in memory temporarily
const storage = multer.memoryStorage();
export const upload = multer({ storage });
