# Campaign API Routes Documentation

## Overview

This document describes all available API endpoints for the campaign system. Routes are organized by functionality with specific endpoints for different data needs.

## Benefits of This Architecture ✅

- **Performance**: Send only required data
- **Security**: Control data exposure per endpoint
- **Scalability**: Easier caching and optimization
- **Maintainability**: Clear, purpose-driven endpoints
- **Frontend Flexibility**: Components fetch exactly what they need

---

## 📍 Public Routes (No Authentication)

### 1. Get All Campaigns (with filters)

```
GET /api/campaigns
```

**Query Parameters:**

- `category` (optional): Filter by category (e.g., "technology", "health", "education")
- `status` (optional): Filter by status ("active", "completed", "cancelled")
- `search` (optional): Search in title or description
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 12)
- `sortBy` (optional): Sort field ("created_at", "goal_amount", "total_likes")
- `sortOrder` (optional): Sort direction ("ASC" or "DESC", default: "DESC")

**Example:**

```
GET /api/campaigns?category=technology&status=active&page=1&limit=12&sortBy=created_at
```

**Response:**

```json
{
  "success": true,
  "campaigns": [...],
  "pagination": {
    "page": 1,
    "limit": 12,
    "total": 50
  }
}
```

**Use Case**: Main campaigns listing page with filters

---

### 2. Get Trending Campaigns

```
GET /api/campaigns/trending
```

**Query Parameters:**

- `limit` (optional): Number of campaigns (default: 6)

**Example:**

```
GET /api/campaigns/trending?limit=6
```

**Response:**

```json
{
  "success": true,
  "campaigns": [...]
}
```

**Use Case**: Homepage hero section, trending campaigns widget

---

### 3. Get Campaigns by Category

```
GET /api/campaigns/category/:category
```

**Path Parameters:**

- `category`: Category name (e.g., "technology", "health", "education")

**Query Parameters:**

- `page` (optional): Page number
- `limit` (optional): Items per page

**Example:**

```
GET /api/campaigns/category/technology?page=1&limit=12
```

**Response:**

```json
{
  "success": true,
  "category": "technology",
  "campaigns": [...],
  "count": 25
}
```

**Use Case**: Category-specific pages (e.g., "/campaigns/technology")

---

### 4. Get Campaigns by Type

```
GET /api/campaigns/type/:type
```

**Path Parameters:**

- `type`: Campaign type ("donation" or "investment")

**Query Parameters:**

- `page` (optional): Page number
- `limit` (optional): Items per page

**Example:**

```
GET /api/campaigns/type/donation?page=1&limit=12
```

**Response:**

```json
{
  "success": true,
  "type": "donation",
  "campaigns": [...],
  "count": 30
}
```

**Use Case**: Type-specific pages ("/donations" vs "/investments")

---

### 5. Get Campaign by ID

```
GET /api/campaigns/:id
```

**Path Parameters:**

- `id`: Campaign ID

**Example:**

```
GET /api/campaigns/123
```

**Response:**

```json
{
  "success": true,
  "campaign": {
    "id": 123,
    "title": "Campaign Title",
    "description": "...",
    "media": {
      "images": ["url1", "url2"],
      "video": "video_url"
    },
    "rewards": [...],
    "likes": 45,
    "backers": [...]
  }
}
```

**Use Case**: Campaign detail page with full information

---

### 6. Get Campaign Comments

```
GET /api/campaigns/:id/comments
```

**Path Parameters:**

- `id`: Campaign ID

**Query Parameters:**

- `page` (optional): Page number (default: 1)
- `limit` (optional): Comments per page (default: 10)

**Example:**

```
GET /api/campaigns/123/comments?page=1&limit=10
```

**Response:**

```json
{
  "success": true,
  "comments": [
    {
      "id": 1,
      "user_id": 5,
      "comment": "Great project!",
      "created_at": "2025-10-27T10:30:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10
  }
}
```

**Use Case**: Comments section on campaign detail page

---

## 🔒 Protected Routes (Authentication Required)

These routes require a valid JWT token in the cookie or Authorization header.

### 7. Create Campaign

```
POST /api/campaigns
```

**Headers:**

- `Cookie: token=<jwt_token>`

**Body (multipart/form-data):**

- `title` (required): Campaign title
- `description` (required): Campaign description
- `creatorId` (required): Creator user ID
- `creatorType` (optional): "individual" or "organization" (default: "individual")
- `typeOfCampaign` (required): "donation" or "investment"
- `category` (required): Campaign category
- `goalAmount` (required): Goal amount in dollars
- `location` (optional): Campaign location
- `rewards` (optional): JSON array of rewards
- `images` (optional): Up to 5 image files
- `video` (optional): 1 video file

**Example (using FormData):**

```javascript
const formData = new FormData();
formData.append("title", "My Campaign");
formData.append("description", "Campaign description");
formData.append("creatorId", "1");
formData.append("typeOfCampaign", "donation");
formData.append("category", "technology");
formData.append("goalAmount", "10000");
formData.append(
  "rewards",
  JSON.stringify([
    { amount: 25, description: "Thank you email" },
    { amount: 100, description: "T-shirt + email" },
  ])
);
formData.append("images", file1);
formData.append("images", file2);
formData.append("video", videoFile);
```

**Response:**

```json
{
  "success": true,
  "message": "Campaign created successfully",
  "campaign": {...}
}
```

**Use Case**: Create campaign page

---

### 8. Update Campaign

```
PUT /api/campaigns/:id
```

**Headers:**

- `Cookie: token=<jwt_token>`

**Body (JSON):**

```json
{
  "title": "Updated Title",
  "description": "Updated description",
  "status": "active"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Campaign updated successfully",
  "campaign": {...}
}
```

**Use Case**: Edit campaign page (creator only)

---

### 9. Delete Campaign

```
DELETE /api/campaigns/:id
```

**Headers:**

- `Cookie: token=<jwt_token>`

**Response:**

```json
{
  "success": true,
  "message": "Campaign deleted successfully"
}
```

**Use Case**: Campaign management, creator dashboard

---

### 10. Toggle Like

```
POST /api/campaigns/:id/like
```

**Headers:**

- `Cookie: token=<jwt_token>`

**Body (JSON):**

```json
{
  "userId": 5
}
```

**Response:**

```json
{
  "success": true,
  "action": "liked", // or "unliked"
  "message": "Campaign liked",
  "totalLikes": 46
}
```

**Use Case**: Like button on campaign cards/detail page

---

### 11. Add Comment

```
POST /api/campaigns/:id/comments
```

**Headers:**

- `Cookie: token=<jwt_token>`

**Body (JSON):**

```json
{
  "userId": 5,
  "comment": "This is a great project!"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Comment added successfully",
  "comment": {
    "id": 10,
    "user_id": 5,
    "campaign_id": 123,
    "comment": "This is a great project!",
    "created_at": "2025-10-27T11:00:00Z"
  }
}
```

**Use Case**: Comment form on campaign detail page

---

### 12. Add Investment/Donation

```
POST /api/campaigns/:id/invest
```

**Headers:**

- `Cookie: token=<jwt_token>`

**Body (JSON):**

```json
{
  "userId": 5,
  "amount": 100.0
}
```

**Response:**

```json
{
  "success": true,
  "message": "Investment added successfully",
  "investment": {
    "id": 15,
    "campaign_id": 123,
    "user_id": 5,
    "amount": 100.0,
    "created_at": "2025-10-27T11:05:00Z"
  }
}
```

**Use Case**: Donation/investment form on campaign detail page

---

## 🎯 Frontend Usage Examples

### Homepage

```javascript
// Trending campaigns widget
GET /api/campaigns/trending?limit=6

// Recent campaigns
GET /api/campaigns?page=1&limit=8&sortBy=created_at&sortOrder=DESC
```

### Category Page

```javascript
// Technology campaigns
GET /api/campaigns/category/technology?page=1&limit=12
```

### Campaign Type Page

```javascript
// All donation campaigns
GET /api/campaigns/type/donation?page=1&limit=12

// All investment campaigns
GET /api/campaigns/type/investment?page=1&limit=12
```

### Search/Filter Page

```javascript
// Search with filters
GET /api/campaigns?search=education&category=education&status=active&page=1&limit=12
```

### Campaign Detail Page

```javascript
// Get campaign details
GET /api/campaigns/123

// Get comments (load more on scroll)
GET /api/campaigns/123/comments?page=1&limit=10
```

### User Actions

```javascript
// Like campaign
POST /api/campaigns/123/like
Body: { userId: currentUser.id }

// Add comment
POST /api/campaigns/123/comments
Body: { userId: currentUser.id, comment: "Great!" }

// Donate/Invest
POST /api/campaigns/123/invest
Body: { userId: currentUser.id, amount: 50.00 }
```

---

## 🔐 Authentication Flow

1. User logs in: `POST /api/auth/login`
2. Receive JWT token in response
3. Store token in cookies or localStorage
4. Include token in subsequent requests

**Cookie-based (recommended):**

```javascript
// Token automatically sent with requests
fetch("/api/campaigns", {
  credentials: "include",
});
```

**Header-based:**

```javascript
fetch("/api/campaigns", {
  headers: {
    Authorization: `Bearer ${token}`,
  },
});
```

---

## 📊 Response Format

All responses follow this structure:

**Success:**

```json
{
  "success": true,
  "data": {...},
  "message": "Optional success message"
}
```

**Error:**

```json
{
  "success": false,
  "error": "Error message",
  "message": "User-friendly error message"
}
```

---

## 🚀 Performance Tips

1. **Use Pagination**: Always use `page` and `limit` parameters
2. **Specific Endpoints**: Use category/type routes instead of filtering all campaigns
3. **Caching**: Cache trending campaigns on frontend for 5-10 minutes
4. **Lazy Loading**: Load comments/backers on demand
5. **Debounce Search**: Wait for user to stop typing before searching

---

## 🎨 Route Design Principles Applied

✅ **Separation of Concerns**: Each route serves a specific purpose
✅ **RESTful Design**: Standard HTTP methods (GET, POST, PUT, DELETE)
✅ **Nested Resources**: Comments and investments under campaigns
✅ **Query Parameters**: Flexible filtering without route explosion
✅ **Clear Naming**: Self-documenting endpoint names
✅ **Versioning Ready**: Can add `/v1/` prefix later

---

**Last Updated**: October 27, 2025
**API Version**: 1.0
**Base URL**: `http://localhost:5000/api`
