# File Upload with Multer + Cloudinary - Usage Guide

## Overview

Your backend now has a complete file upload system using **Multer** (for handling multipart/form-data) and **Cloudinary** (for cloud storage).

## Features

✅ Upload photos (JPEG, PNG, GIF, WebP, etc.)  
✅ Upload videos (MP4, AVI, MOV, WMV, FLV, MKV, etc.)  
✅ Automatic file type validation  
✅ Direct upload to Cloudinary cloud storage  
✅ Support for single and multiple file uploads  
✅ 100MB file size limit (configurable)  
✅ Organized in Cloudinary folders (`crowdfunding/images`, `crowdfunding/videos`)

---

## Usage in Routes

### 1. **Single File Upload**

Upload a single image or video:

```javascript
import express from "express";
import { upload, uploadSingleToCloudinary } from "../middleware/upload.js";

const router = express.Router();

// Single file upload route
router.post(
  "/upload-single",
  upload.single("file"), // "file" is the form field name
  uploadSingleToCloudinary,
  (req, res) => {
    try {
      if (!req.cloudinaryResult) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      res.status(200).json({
        message: "File uploaded successfully",
        file: req.cloudinaryResult,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

export default router;
```

**Response Example:**

```json
{
  "message": "File uploaded successfully",
  "file": {
    "url": "https://res.cloudinary.com/your-cloud/image/upload/v1234567890/crowdfunding/images/abc123.jpg",
    "publicId": "crowdfunding/images/abc123",
    "resourceType": "image",
    "format": "jpg",
    "width": 1920,
    "height": 1080,
    "size": 245632
  }
}
```

---

### 2. **Multiple Files Upload**

Upload multiple images/videos at once:

```javascript
import express from "express";
import { upload, uploadMultipleToCloudinary } from "../middleware/upload.js";

const router = express.Router();

// Multiple files upload route
router.post(
  "/upload-multiple",
  upload.array("files", 10), // Max 10 files, "files" is the form field name
  uploadMultipleToCloudinary,
  (req, res) => {
    try {
      if (!req.cloudinaryResults || req.cloudinaryResults.length === 0) {
        return res.status(400).json({ error: "No files uploaded" });
      }

      res.status(200).json({
        message: "Files uploaded successfully",
        files: req.cloudinaryResults,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

export default router;
```

---

### 3. **Campaign with Image/Video Upload**

Example of creating a campaign with media files:

```javascript
import express from "express";
import { upload, uploadMultipleToCloudinary } from "../middleware/upload.js";
import Campaign from "../models/campaignModel.js";

const router = express.Router();

router.post(
  "/campaigns",
  upload.array("media", 5), // Accept up to 5 media files
  uploadMultipleToCloudinary,
  async (req, res) => {
    try {
      const { title, description, goalAmount } = req.body;

      // Get uploaded media URLs from Cloudinary
      const mediaUrls = req.cloudinaryResults
        ? req.cloudinaryResults.map((result) => ({
            url: result.url,
            publicId: result.publicId,
            type: result.resourceType,
          }))
        : [];

      const campaign = new Campaign({
        title,
        description,
        goalAmount,
        media: mediaUrls,
        creator: req.user._id, // from authentication middleware
      });

      await campaign.save();

      res.status(201).json({
        message: "Campaign created successfully",
        campaign,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

export default router;
```

---

## Testing with Postman/Thunder Client

### Single File Upload

1. **Method:** `POST`
2. **URL:** `http://localhost:5000/api/upload-single`
3. **Body:** Select `form-data`
4. **Add field:**
   - Key: `file` (change type to `File`)
   - Value: Select your image or video file

### Multiple Files Upload

1. **Method:** `POST`
2. **URL:** `http://localhost:5000/api/upload-multiple`
3. **Body:** Select `form-data`
4. **Add multiple fields with same key:**
   - Key: `files` (change type to `File`)
   - Value: Select first file
   - Click `+ Add` and repeat for more files

---

## Testing with cURL (PowerShell)

### Single file:

```powershell
curl -X POST http://localhost:5000/api/upload-single `
  -F "file=@C:\path\to\your\image.jpg"
```

### Multiple files:

```powershell
curl -X POST http://localhost:5000/api/upload-multiple `
  -F "files=@C:\path\to\image1.jpg" `
  -F "files=@C:\path\to\video1.mp4" `
  -F "files=@C:\path\to\image2.png"
```

---

## Frontend Integration (React Example)

### Single File Upload

```javascript
const handleSingleUpload = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await fetch("http://localhost:5000/api/upload-single", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    console.log("Uploaded:", data.file.url);
  } catch (error) {
    console.error("Upload failed:", error);
  }
};
```

### Multiple Files Upload

```javascript
const handleMultipleUpload = async (files) => {
  const formData = new FormData();

  // Append all files
  for (let file of files) {
    formData.append("files", file);
  }

  try {
    const response = await fetch("http://localhost:5000/api/upload-multiple", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    console.log("Uploaded files:", data.files);
  } catch (error) {
    console.error("Upload failed:", error);
  }
};
```

### React Component Example

```jsx
import React, { useState } from "react";

function FileUploader() {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e) => {
    setSelectedFiles(Array.from(e.target.files));
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) return;

    setUploading(true);
    const formData = new FormData();

    selectedFiles.forEach((file) => {
      formData.append("files", file);
    });

    try {
      const response = await fetch(
        "http://localhost:5000/api/upload-multiple",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();
      console.log("Success:", data);
      alert("Files uploaded successfully!");
    } catch (error) {
      console.error("Error:", error);
      alert("Upload failed!");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <input
        type="file"
        multiple
        accept="image/*,video/*"
        onChange={handleFileChange}
      />
      <button onClick={handleUpload} disabled={uploading}>
        {uploading ? "Uploading..." : "Upload Files"}
      </button>
    </div>
  );
}

export default FileUploader;
```

---

## Configuration Options

### Change File Size Limit

Edit `middleware/upload.js`:

```javascript
export const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 200 * 1024 * 1024, // Change to 200MB
  },
});
```

### Change Allowed File Types

Edit the `fileFilter` function in `middleware/upload.js`:

```javascript
const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "video/mp4"];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only JPEG, PNG images and MP4 videos allowed!"), false);
  }
};
```

### Change Cloudinary Folders

Edit `uploadToCloudinary` function in `middleware/upload.js`:

```javascript
const folder =
  resourceType === "image"
    ? "my-app/photos" // Change folder name
    : "my-app/clips"; // Change folder name
```

---

## Error Handling

The middleware automatically handles these errors:

- ✅ Invalid file type (not image/video)
- ✅ File size exceeds limit
- ✅ Cloudinary upload failures
- ✅ Missing files in request

Example error response:

```json
{
  "error": "Invalid file type. Only images and videos are allowed!"
}
```

---

## Cloudinary Dashboard

View your uploaded files at:
https://cloudinary.com/console/media_library

Your files will be organized in:

- `crowdfunding/images/` - All images
- `crowdfunding/videos/` - All videos

---

## Security Notes

⚠️ **Important:**

1. Never commit `.env` file (already in `.gitignore` ✅)
2. Keep Cloudinary credentials secure
3. Consider adding authentication middleware before upload routes
4. Validate file content on backend (current implementation validates MIME types)
5. Consider adding rate limiting for upload endpoints

---

## Need Help?

- **Multer Docs:** https://github.com/expressjs/multer
- **Cloudinary Docs:** https://cloudinary.com/documentation
- **Issues?** Check console logs and Cloudinary dashboard for errors
