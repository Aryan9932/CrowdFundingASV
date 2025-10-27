# 🚀 Multer + Cloudinary Setup - Complete!

Your backend now has **full file upload capabilities** with Multer and Cloudinary integration.

## ✅ What's Configured

### 1. **Cloudinary Configuration** (`config/cloudinary.js`)

- ✅ Connected to your Cloudinary account
- ✅ Using credentials from `.env` file
- ✅ Tested and working!

### 2. **Upload Middleware** (`middleware/upload.js`)

- ✅ Multer configured with memory storage
- ✅ File type validation (images + videos only)
- ✅ 100MB file size limit
- ✅ Single file upload helper
- ✅ Multiple files upload helper
- ✅ Automatic Cloudinary upload

### 3. **Upload Routes** (`Routes/uploadRoutes.js`)

- ✅ `/api/upload/single` - Single file upload
- ✅ `/api/upload/multiple` - Multiple files upload
- ✅ `/api/upload/mixed` - Mixed fields (thumbnail + video)

### 4. **Campaign Routes** (`Routes/campaignRoutes.js`)

- ✅ Already integrated with file uploads
- ✅ Supports images (max 5) and video (max 1)

---

## 📡 Available API Endpoints

### 1. **Upload Single File**

```
POST /api/upload/single
Content-Type: multipart/form-data

Body (form-data):
- file: [your image or video file]
```

**Response:**

```json
{
  "success": true,
  "message": "File uploaded successfully to Cloudinary",
  "data": {
    "url": "https://res.cloudinary.com/.../file.jpg",
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

### 2. **Upload Multiple Files**

```
POST /api/upload/multiple
Content-Type: multipart/form-data

Body (form-data):
- files: [file1]
- files: [file2]
- files: [file3]
... (up to 10 files)
```

**Response:**

```json
{
  "success": true,
  "message": "3 file(s) uploaded successfully to Cloudinary",
  "data": [
    {
      "url": "https://res.cloudinary.com/.../file1.jpg",
      "publicId": "crowdfunding/images/abc123",
      "resourceType": "image",
      "format": "jpg",
      "width": 1920,
      "height": 1080,
      "size": 245632
    }
    // ... more files
  ]
}
```

---

### 3. **Create Campaign with Media**

```
POST /api/campaigns
Content-Type: multipart/form-data

Body (form-data):
- title: "My Campaign Title"
- description: "Campaign description"
- goalAmount: 50000
- category: "Technology"
- deadline: "2025-12-31"
- creator: "user_id_here"
- location: "New York"
- rewards: '[{"amount":1000,"title":"Thank You"}]'
- images: [image1.jpg]
- images: [image2.jpg]
- video: [video.mp4]
```

**Response:**

```json
{
  "success": true,
  "campaign": {
    "_id": "...",
    "title": "My Campaign Title",
    "description": "Campaign description",
    "goalAmount": 50000,
    "media": {
      "images": [
        "https://res.cloudinary.com/.../image1.jpg",
        "https://res.cloudinary.com/.../image2.jpg"
      ],
      "video": "https://res.cloudinary.com/.../video.mp4"
    },
    "rewards": [{ "amount": 1000, "title": "Thank You" }],
    "createdAt": "2025-10-15T..."
  }
}
```

---

## 🧪 Testing

### Option 1: Using Postman/Thunder Client

1. Open Postman
2. Create new request: `POST http://localhost:5000/api/upload/single`
3. Go to **Body** tab
4. Select **form-data**
5. Add key: `file` (change type to **File**)
6. Select your image/video file
7. Click **Send**

### Option 2: Using PowerShell + cURL

```powershell
# Single file
curl -X POST http://localhost:5000/api/upload/single `
  -F "file=@C:\path\to\image.jpg"

# Multiple files
curl -X POST http://localhost:5000/api/upload/multiple `
  -F "files=@C:\path\to\image1.jpg" `
  -F "files=@C:\path\to\video.mp4"

# Create campaign with media
curl -X POST http://localhost:5000/api/campaigns `
  -F "title=Test Campaign" `
  -F "description=Testing upload" `
  -F "goalAmount=10000" `
  -F "category=Tech" `
  -F "deadline=2025-12-31" `
  -F "creator=user123" `
  -F "location=Delhi" `
  -F 'rewards=[{"amount":500,"title":"Early Bird"}]' `
  -F "images=@C:\path\to\image1.jpg" `
  -F "video=@C:\path\to\video.mp4"
```

### Option 3: Test Cloudinary Connection

```powershell
cd Backend
node test-cloudinary.js
```

Expected output:

```
🔍 Testing Cloudinary Configuration...

✅ Cloud Name: da30huwky
✅ API Key: ***7385
✅ API Secret: ***configured

✅ Cloudinary connection successful!
Status: ok
```

---

## 🎨 Frontend Integration

### React Example - File Upload Component

```jsx
import React, { useState } from "react";
import axios from "axios";

function FileUpload() {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadedUrls, setUploadedUrls] = useState([]);

  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files));
  };

  const handleUpload = async () => {
    if (files.length === 0) return;

    setUploading(true);
    const formData = new FormData();

    files.forEach((file) => {
      formData.append("files", file);
    });

    try {
      const response = await axios.post(
        "http://localhost:5000/api/upload/multiple",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      setUploadedUrls(response.data.data.map((f) => f.url));
      alert("Files uploaded successfully!");
    } catch (error) {
      console.error("Upload error:", error);
      alert("Upload failed: " + error.response?.data?.error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <h2>Upload Files</h2>
      <input
        type="file"
        multiple
        accept="image/*,video/*"
        onChange={handleFileChange}
      />
      <button onClick={handleUpload} disabled={uploading}>
        {uploading ? "Uploading..." : "Upload"}
      </button>

      {uploadedUrls.length > 0 && (
        <div>
          <h3>Uploaded Files:</h3>
          {uploadedUrls.map((url, index) => (
            <div key={index}>
              {url.includes("video") ? (
                <video src={url} controls width="300" />
              ) : (
                <img src={url} alt="uploaded" width="300" />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default FileUpload;
```

### Create Campaign Form Example

```jsx
import React, { useState } from "react";
import axios from "axios";

function CreateCampaign() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    goalAmount: "",
    category: "",
    deadline: "",
    creator: "",
    location: "",
  });
  const [images, setImages] = useState([]);
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      data.append(key, formData[key]);
    });

    // Add rewards
    data.append(
      "rewards",
      JSON.stringify([{ amount: 1000, title: "Early Bird" }])
    );

    // Add images
    images.forEach((img) => data.append("images", img));

    // Add video
    if (video) data.append("video", video);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/campaigns",
        data,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      alert("Campaign created successfully!");
      console.log(response.data);
    } catch (error) {
      console.error("Error:", error);
      alert("Failed: " + error.response?.data?.error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Title"
        value={formData.title}
        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        required
      />
      <textarea
        placeholder="Description"
        value={formData.description}
        onChange={(e) =>
          setFormData({ ...formData, description: e.target.value })
        }
        required
      />
      <input
        type="number"
        placeholder="Goal Amount"
        value={formData.goalAmount}
        onChange={(e) =>
          setFormData({ ...formData, goalAmount: e.target.value })
        }
        required
      />

      <label>Upload Images (max 5):</label>
      <input
        type="file"
        multiple
        accept="image/*"
        onChange={(e) => setImages(Array.from(e.target.files))}
      />

      <label>Upload Video (optional):</label>
      <input
        type="file"
        accept="video/*"
        onChange={(e) => setVideo(e.target.files[0])}
      />

      <button type="submit" disabled={loading}>
        {loading ? "Creating..." : "Create Campaign"}
      </button>
    </form>
  );
}

export default CreateCampaign;
```

---

## 📁 File Structure

```
Backend/
├── config/
│   ├── cloudinary.js          ✅ Cloudinary configuration
│   └── db.js
├── middleware/
│   ├── upload.js               ✅ Multer + Cloudinary upload middleware
│   └── authentication.js
├── Routes/
│   ├── uploadRoutes.js         ✅ Dedicated upload endpoints
│   ├── campaignRoutes.js       ✅ Campaign with media upload
│   └── authRoutes.js
├── Controllers/
│   └── campaignController.js   ✅ Handles campaign creation with media
├── models/
│   └── campaignModel.js
├── server.js                   ✅ Upload routes registered
├── test-cloudinary.js          ✅ Test script for Cloudinary
├── UPLOAD_USAGE.md             ✅ Detailed usage guide
└── .env                        ✅ Cloudinary credentials (hidden from git)
```

---

## 🔧 Configuration

### Change File Size Limit

Edit `middleware/upload.js`:

```javascript
limits: {
  fileSize: 200 * 1024 * 1024, // Change to 200MB
}
```

### Change Allowed File Types

Edit `fileFilter` in `middleware/upload.js`:

```javascript
const fileFilter = (req, file, cb) => {
  // Only allow specific types
  const allowed = ["image/jpeg", "image/png", "video/mp4"];

  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only JPEG, PNG, and MP4 allowed!"), false);
  }
};
```

### Change Cloudinary Folders

Edit folder paths in `middleware/upload.js`:

```javascript
const folder = resourceType === "image" ? "my-app/photos" : "my-app/videos";
```

---

## 🛡️ Security Best Practices

1. ✅ `.env` is in `.gitignore` (already done)
2. ✅ File type validation enabled
3. ✅ File size limits set (100MB)
4. ⚠️ **TODO:** Add authentication middleware to upload routes
5. ⚠️ **TODO:** Add rate limiting to prevent abuse
6. ⚠️ **TODO:** Consider virus scanning for production

### Add Authentication (Recommended)

```javascript
import { authenticateUser } from "../middleware/authentication.js";

router.post(
  "/single",
  authenticateUser, // Add this line
  upload.single("file"),
  uploadSingleToCloudinary,
  (req, res) => {
    // ... handler
  }
);
```

---

## 🌐 Cloudinary Dashboard

View your uploaded files at:
**https://cloudinary.com/console/media_library**

Your files are organized in:

- `crowdfunding/images/` - Campaign images
- `crowdfunding/videos/` - Campaign videos
- `crowdfunding/thumbnails/` - Thumbnails (if using mixed upload)

---

## 📚 Documentation Links

- **Multer:** https://github.com/expressjs/multer
- **Cloudinary Node.js:** https://cloudinary.com/documentation/node_integration
- **Cloudinary Upload API:** https://cloudinary.com/documentation/image_upload_api_reference

---

## 🐛 Troubleshooting

### Error: "No file uploaded"

- Make sure the form field name matches: `file` for single, `files` for multiple
- Check that `Content-Type: multipart/form-data` is set

### Error: "Invalid file type"

- Only images and videos are allowed
- Check the file mimetype

### Error: Cloudinary upload failed

- Run `node test-cloudinary.js` to verify credentials
- Check Cloudinary dashboard for quota limits

### File size too large

- Current limit is 100MB
- Adjust in `middleware/upload.js` if needed

---

## ✅ Quick Start Checklist

- [x] Cloudinary credentials in `.env`
- [x] Multer middleware configured
- [x] Upload routes created
- [x] Campaign routes support media
- [x] Test script created
- [x] Documentation complete

**You're ready to upload files!** 🎉

---

## 🚀 Next Steps

1. Start your server:

   ```powershell
   cd Backend
   npm run dev
   ```

2. Test upload endpoint:

   ```powershell
   curl -X POST http://localhost:5000/api/upload/single `
     -F "file=@C:\path\to\your\image.jpg"
   ```

3. Check `UPLOAD_USAGE.md` for detailed examples

4. View uploaded files in Cloudinary dashboard

---

**Need help?** Check `UPLOAD_USAGE.md` for more examples and frontend integration code!
