# 📸 Campaign Creation with File Uploads

## Overview

When creating a campaign, users can upload images and videos **in the same request**. The upload happens automatically during campaign creation - no separate upload step needed!

---

## 🎯 Main Endpoint

### Create Campaign with Media

```http
POST /api/campaigns
Content-Type: multipart/form-data
```

**All fields in one request:**

- Campaign details (title, description, goal, etc.)
- Images (up to 5)
- Video (optional, max 1)

---

## 📋 Complete Example

### Using Postman/Thunder Client

1. **Method:** `POST`
2. **URL:** `http://localhost:5000/api/campaigns`
3. **Body:** Select `form-data`
4. **Add these fields:**

| Key           | Type | Value                                    | Required |
| ------------- | ---- | ---------------------------------------- | -------- |
| `title`       | Text | "Save the Ocean"                         | ✅ Yes   |
| `description` | Text | "Help us clean our oceans..."            | ✅ Yes   |
| `goalAmount`  | Text | "50000"                                  | ✅ Yes   |
| `category`    | Text | "Environment"                            | No       |
| `deadline`    | Text | "2025-12-31"                             | No       |
| `creator`     | Text | "user123"                                | No       |
| `location`    | Text | "California"                             | No       |
| `rewards`     | Text | `[{"amount":1000,"title":"Early Bird"}]` | No       |
| `images`      | File | _Select image1.jpg_                      | No       |
| `images`      | File | _Select image2.jpg_                      | No       |
| `images`      | File | _Select image3.jpg_                      | No       |
| `video`       | File | _Select video.mp4_                       | No       |

5. Click **Send**

---

## ✅ Success Response

```json
{
  "success": true,
  "message": "Campaign created successfully",
  "campaign": {
    "_id": "67890abc123",
    "title": "Save the Ocean",
    "description": "Help us clean our oceans...",
    "goalAmount": 50000,
    "category": "Environment",
    "deadline": "2025-12-31T00:00:00.000Z",
    "creator": "user123",
    "location": "California",
    "media": {
      "images": [
        "https://res.cloudinary.com/da30huwky/image/upload/v1234/campaigns/images/xyz1.jpg",
        "https://res.cloudinary.com/da30huwky/image/upload/v1234/campaigns/images/xyz2.jpg",
        "https://res.cloudinary.com/da30huwky/image/upload/v1234/campaigns/images/xyz3.jpg"
      ],
      "video": "https://res.cloudinary.com/da30huwky/video/upload/v1234/campaigns/videos/abc1.mp4"
    },
    "rewards": [
      {
        "amount": 1000,
        "title": "Early Bird"
      }
    ],
    "createdAt": "2025-10-15T10:30:00.000Z"
  },
  "uploadedMedia": {
    "images": 3,
    "video": 1
  }
}
```

---

## 🔧 PowerShell/cURL Testing

### Create Campaign with Images and Video

```powershell
curl -X POST http://localhost:5000/api/campaigns `
  -F "title=Save the Ocean" `
  -F "description=Help us clean our oceans and protect marine life" `
  -F "goalAmount=50000" `
  -F "category=Environment" `
  -F "deadline=2025-12-31" `
  -F "creator=user123" `
  -F "location=California" `
  -F 'rewards=[{"amount":1000,"title":"Early Bird"},{"amount":5000,"title":"Supporter"}]' `
  -F "images=@C:\path\to\image1.jpg" `
  -F "images=@C:\path\to\image2.jpg" `
  -F "video=@C:\path\to\video.mp4"
```

### Create Campaign (Text Only, No Media)

```powershell
curl -X POST http://localhost:5000/api/campaigns `
  -F "title=Community Project" `
  -F "description=Building a community center" `
  -F "goalAmount=25000"
```

---

## 🎨 Frontend Integration

### React Example - Complete Campaign Form

```jsx
import React, { useState } from "react";
import axios from "axios";

function CreateCampaignForm() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    goalAmount: "",
    category: "",
    deadline: "",
    location: "",
  });

  const [images, setImages] = useState([]);
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImagesChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 5) {
      alert("Maximum 5 images allowed");
      return;
    }
    setImages(files);
  };

  const handleVideoChange = (e) => {
    setVideo(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Create FormData object
    const data = new FormData();

    // Add text fields
    Object.keys(formData).forEach((key) => {
      if (formData[key]) {
        data.append(key, formData[key]);
      }
    });

    // Add rewards (example)
    data.append(
      "rewards",
      JSON.stringify([
        { amount: 1000, title: "Early Bird" },
        { amount: 5000, title: "Supporter" },
      ])
    );

    // Add images
    images.forEach((image) => {
      data.append("images", image);
    });

    // Add video
    if (video) {
      data.append("video", video);
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/campaigns",
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Campaign created:", response.data);
      setSuccess(true);
      alert("✅ Campaign created successfully!");

      // Reset form
      setFormData({
        title: "",
        description: "",
        goalAmount: "",
        category: "",
        deadline: "",
        location: "",
      });
      setImages([]);
      setVideo(null);
    } catch (error) {
      console.error("Error:", error);
      alert("❌ Failed: " + (error.response?.data?.error || error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="campaign-form">
      <h2>Create New Campaign</h2>

      <form onSubmit={handleSubmit}>
        {/* Title */}
        <div>
          <label>Title *</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            placeholder="Enter campaign title"
          />
        </div>

        {/* Description */}
        <div>
          <label>Description *</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows={5}
            placeholder="Describe your campaign"
          />
        </div>

        {/* Goal Amount */}
        <div>
          <label>Goal Amount (₹) *</label>
          <input
            type="number"
            name="goalAmount"
            value={formData.goalAmount}
            onChange={handleChange}
            required
            placeholder="50000"
          />
        </div>

        {/* Category */}
        <div>
          <label>Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
          >
            <option value="">Select category</option>
            <option value="Technology">Technology</option>
            <option value="Environment">Environment</option>
            <option value="Education">Education</option>
            <option value="Healthcare">Healthcare</option>
            <option value="Arts">Arts & Culture</option>
          </select>
        </div>

        {/* Deadline */}
        <div>
          <label>Deadline</label>
          <input
            type="date"
            name="deadline"
            value={formData.deadline}
            onChange={handleChange}
          />
        </div>

        {/* Location */}
        <div>
          <label>Location</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="City, State"
          />
        </div>

        {/* Images */}
        <div>
          <label>Campaign Images (Max 5)</label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImagesChange}
          />
          {images.length > 0 && <p>✅ {images.length} image(s) selected</p>}
        </div>

        {/* Video */}
        <div>
          <label>Campaign Video (Optional)</label>
          <input type="file" accept="video/*" onChange={handleVideoChange} />
          {video && <p>✅ Video selected: {video.name}</p>}
        </div>

        {/* Submit Button */}
        <button type="submit" disabled={loading}>
          {loading ? "Creating Campaign..." : "Create Campaign"}
        </button>
      </form>

      {success && (
        <div className="success-message">
          ✅ Campaign created successfully! Check your Cloudinary dashboard.
        </div>
      )}
    </div>
  );
}

export default CreateCampaignForm;
```

---

## 📊 File Upload Limits

| Type   | Max Count | Max Size (each) | Allowed Formats              |
| ------ | --------- | --------------- | ---------------------------- |
| Images | 5         | 100MB           | JPEG, PNG, GIF, WebP         |
| Video  | 1         | 100MB           | MP4, AVI, MOV, WMV, FLV, MKV |

---

## ❌ Error Responses

### Missing Required Fields

```json
{
  "success": false,
  "error": "Title, description, and goal amount are required"
}
```

### Invalid File Type

```json
{
  "success": false,
  "error": "Invalid file type. Only images and videos are allowed!"
}
```

### Upload Failed

```json
{
  "success": false,
  "error": "Failed to upload image: Network error"
}
```

---

## 🧪 Testing Routes

For testing uploads independently (without creating campaigns):

```http
POST /api/upload/test/single
POST /api/upload/test/multiple
```

These are utility routes for testing. **In production, always use `/api/campaigns`**.

---

## 🔄 Workflow Summary

1. **User fills campaign form** (title, description, goal, etc.)
2. **User selects images** (up to 5)
3. **User selects video** (optional)
4. **User clicks "Create Campaign"**
5. **Frontend sends ONE request** with all data
6. **Backend automatically:**
   - Validates files
   - Uploads to Cloudinary
   - Saves campaign to database
   - Returns campaign with media URLs

**No separate upload steps needed!** 🎉

---

## 📁 Cloudinary Organization

Uploaded files are automatically organized:

- **Images:** `campaigns/images/`
- **Videos:** `campaigns/videos/`

View at: https://cloudinary.com/console/media_library

---

## 🛡️ Security Notes

✅ File type validation  
✅ File size limits  
✅ `.env` credentials hidden  
⚠️ **TODO:** Add authentication before campaign creation  
⚠️ **TODO:** Add rate limiting

---

## 🚀 Quick Start

1. **Start server:**

   ```powershell
   cd Backend
   npm run dev
   ```

2. **Test with Postman:**

   - URL: `POST http://localhost:5000/api/campaigns`
   - Body: form-data
   - Add text fields + file fields
   - Send!

3. **Check response** for Cloudinary URLs

4. **Verify in Cloudinary** dashboard

---

## 📚 Need More Help?

- Check `UPLOAD_USAGE.md` for detailed middleware documentation
- Check `README_UPLOAD.md` for full configuration guide
- Test Cloudinary: `node test-cloudinary.js`

**Everything uploads in one go with campaign creation!** ✨
