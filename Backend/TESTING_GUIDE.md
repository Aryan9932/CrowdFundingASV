# 🧪 API Testing Guide - CrowdFunding Backend

## ✅ Pre-Flight Checklist

Before starting the server, ensure you have:

1. ✅ PostgreSQL database (NeonDB) set up with all tables
2. ✅ `.env` file with all required variables:
   - `DATABASE_URL` (PostgreSQL connection string)
   - `JWT_SECRET`
   - `CLOUDINARY_CLOUD_NAME`
   - `CLOUDINARY_API_KEY`
   - `CLOUDINARY_API_SECRET`
   - `PORT` (optional, defaults to 5000)
3. ✅ All npm packages installed: `npm install`

---

## 🚀 Starting the Server

```bash
# Development mode (with auto-restart)
npm run dev

# Production mode
npm start
```

**Expected Console Output:**

```
✅ PostgreSQL connected (NeonDB)
✅ PostgreSQL connected at: 2025-10-27T...
🚀 Server running on port 5000
```

---

## 📋 API Endpoints Testing Order

### **Phase 1: Authentication** 🔐

#### 1.1 Register a User

```bash
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "Test123!",
  "role": "individual",
  "firstName": "John",
  "lastName": "Doe"
}
```

**Expected Response (201):**

```json
{
  "id": 1,
  "email": "test@example.com",
  "role": "individual",
  "firstName": "John",
  "lastName": "Doe",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "message": "User registered successfully. Please verify your email."
}
```

**Save the `token` for protected routes!**

---

#### 1.2 Login

```bash
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "Test123!"
}
```

**Expected Response (200):**

```json
{
  "id": 1,
  "email": "test@example.com",
  "role": "individual",
  "firstName": "John",
  "lastName": "Doe",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "message": "Login successful"
}
```

---

### **Phase 2: Campaign Creation** 📝

#### 2.1 Create Campaign (with files)

```bash
POST http://localhost:5000/api/campaigns
Cookie: token=<your_jwt_token>
Content-Type: multipart/form-data

Form Data:
- title: "Save the Oceans"
- description: "A campaign to clean ocean plastic"
- creatorId: 1
- typeOfCampaign: "donation"
- category: "environment"
- goalAmount: 50000
- location: "California, USA"
- rewards: [{"amount": 25, "description": "Thank you email"}]
- images: [file1.jpg, file2.jpg]
- video: video.mp4
```

**Expected Response (201):**

```json
{
  "success": true,
  "message": "Campaign created successfully",
  "campaign": {
    "id": 1,
    "title": "Save the Oceans",
    "description": "...",
    "media": {
      "images": ["https://res.cloudinary.com/..."],
      "video": "https://res.cloudinary.com/..."
    },
    "rewards": [...]
  }
}
```

---

### **Phase 3: Public Routes (No Auth)** 🌐

#### 3.1 Get All Campaigns

```bash
GET http://localhost:5000/api/campaigns
```

**Query Parameters (optional):**

- `?category=environment`
- `?status=active`
- `?search=ocean`
- `?page=1&limit=12`
- `?sortBy=created_at&sortOrder=DESC`

**Expected Response (200):**

```json
{
  "success": true,
  "campaigns": [...],
  "pagination": {
    "page": 1,
    "limit": 12,
    "total": 1
  }
}
```

---

#### 3.2 Get Trending Campaigns

```bash
GET http://localhost:5000/api/campaigns/trending?limit=6
```

**Expected Response (200):**

```json
{
  "success": true,
  "campaigns": [...]
}
```

---

#### 3.3 Get Campaigns by Category

```bash
GET http://localhost:5000/api/campaigns/category/environment?page=1&limit=12
```

**Expected Response (200):**

```json
{
  "success": true,
  "category": "environment",
  "campaigns": [...],
  "count": 1
}
```

---

#### 3.4 Get Campaigns by Type

```bash
GET http://localhost:5000/api/campaigns/type/donation?page=1&limit=12
```

**Expected Response (200):**

```json
{
  "success": true,
  "type": "donation",
  "campaigns": [...],
  "count": 1
}
```

---

#### 3.5 Get Single Campaign

```bash
GET http://localhost:5000/api/campaigns/1
```

**Expected Response (200):**

```json
{
  "success": true,
  "campaign": {
    "id": 1,
    "title": "Save the Oceans",
    "media": {
      "images": [...],
      "video": "..."
    },
    "rewards": [...],
    "likes": 0,
    "backers": []
  }
}
```

---

#### 3.6 Get Campaign Comments

```bash
GET http://localhost:5000/api/campaigns/1/comments?page=1&limit=10
```

**Expected Response (200):**

```json
{
  "success": true,
  "comments": [],
  "pagination": {
    "page": 1,
    "limit": 10
  }
}
```

---

### **Phase 4: Protected Routes (Auth Required)** 🔒

**Remember to include the token in Cookie or Authorization header!**

#### 4.1 Update Campaign

```bash
PUT http://localhost:5000/api/campaigns/1
Cookie: token=<your_jwt_token>
Content-Type: application/json

{
  "title": "Save the Oceans - Updated",
  "status": "active"
}
```

**Expected Response (200):**

```json
{
  "success": true,
  "message": "Campaign updated successfully",
  "campaign": {...}
}
```

---

#### 4.2 Toggle Like

```bash
POST http://localhost:5000/api/campaigns/1/like
Cookie: token=<your_jwt_token>
Content-Type: application/json

{
  "userId": 1
}
```

**Expected Response (200):**

```json
{
  "success": true,
  "action": "liked",
  "message": "Campaign liked",
  "totalLikes": 1
}
```

---

#### 4.3 Add Comment

```bash
POST http://localhost:5000/api/campaigns/1/comments
Cookie: token=<your_jwt_token>
Content-Type: application/json

{
  "userId": 1,
  "comment": "This is an amazing project!"
}
```

**Expected Response (201):**

```json
{
  "success": true,
  "message": "Comment added successfully",
  "comment": {
    "id": 1,
    "user_id": 1,
    "campaign_id": 1,
    "comment": "This is an amazing project!",
    "created_at": "2025-10-27T..."
  }
}
```

---

#### 4.4 Add Investment/Donation

```bash
POST http://localhost:5000/api/campaigns/1/invest
Cookie: token=<your_jwt_token>
Content-Type: application/json

{
  "userId": 1,
  "amount": 100.00
}
```

**Expected Response (201):**

```json
{
  "success": true,
  "message": "Investment added successfully",
  "investment": {
    "id": 1,
    "campaign_id": 1,
    "user_id": 1,
    "amount": 100.0,
    "created_at": "2025-10-27T..."
  }
}
```

---

#### 4.5 Delete Campaign

```bash
DELETE http://localhost:5000/api/campaigns/1
Cookie: token=<your_jwt_token>
```

**Expected Response (200):**

```json
{
  "success": true,
  "message": "Campaign deleted successfully"
}
```

---

## 🛠️ Testing Tools

### Option 1: Postman

1. Import the collection
2. Set `{{baseURL}}` = `http://localhost:5000/api`
3. Set `{{token}}` after login
4. Test each endpoint

### Option 2: Thunder Client (VS Code)

1. Install Thunder Client extension
2. Create new request
3. Add token to Auth tab (Bearer Token)

### Option 3: cURL

```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123!","firstName":"John","lastName":"Doe"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123!"}'

# Get campaigns
curl http://localhost:5000/api/campaigns
```

### Option 4: REST Client (VS Code Extension)

Create a file `test.http`:

```http
### Register User
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "Test123!",
  "firstName": "John",
  "lastName": "Doe"
}

### Login
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "Test123!"
}

### Get All Campaigns
GET http://localhost:5000/api/campaigns
```

---

## 🐛 Common Issues & Solutions

### Issue 1: PostgreSQL Connection Failed

**Error:** `❌ PostgreSQL connection failed`

**Solution:**

- Check `DATABASE_URL` in `.env`
- Ensure NeonDB is accessible
- Verify SSL settings

---

### Issue 2: Token Invalid/Missing

**Error:** `401 Unauthorized - User is not authenticated`

**Solution:**

- Include token in Cookie: `token=<jwt_token>`
- Or in header: `Authorization: Bearer <jwt_token>`
- Get fresh token by logging in again

---

### Issue 3: File Upload Fails

**Error:** `500 Internal Server Error` during campaign creation

**Solution:**

- Check Cloudinary credentials in `.env`
- Ensure files are under 100MB
- Verify file types (images/videos only)

---

### Issue 4: Campaign Not Found

**Error:** `404 Campaign not found`

**Solution:**

- Campaign ID must exist in database
- Check if campaign was deleted
- Use correct campaign ID from creation response

---

## 📊 Expected Database State After Testing

**users table:**

```
id | email              | role       | first_name | last_name
1  | test@example.com   | individual | John       | Doe
```

**campaigns table:**

```
id | title            | creator_id | type_of_campaign | status
1  | Save the Oceans  | 1          | donation         | active
```

**campaign_media table:**

```
id | campaign_id | media_type | media_url
1  | 1           | image      | https://cloudinary.com/...
2  | 1           | image      | https://cloudinary.com/...
3  | 1           | video      | https://cloudinary.com/...
```

**campaign_likes table:**

```
id | campaign_id | user_id
1  | 1           | 1
```

**campaign_discussions table:**

```
id | campaign_id | user_id | comment
1  | 1           | 1       | This is an amazing project!
```

**investments table:**

```
id | campaign_id | user_id | amount
1  | 1           | 1       | 100.00
```

---

## ✅ Success Criteria

All endpoints should:

- ✅ Return correct status codes (200, 201, 400, 401, 404, 500)
- ✅ Return proper JSON responses with `success` field
- ✅ Handle authentication correctly (public vs protected)
- ✅ Validate required fields
- ✅ Upload files to Cloudinary successfully
- ✅ Store data in PostgreSQL correctly
- ✅ Handle errors gracefully with meaningful messages

---

## 🎯 Quick Test Sequence

```bash
# 1. Start server
npm run dev

# 2. Register user
POST /api/auth/register

# 3. Login (save token)
POST /api/auth/login

# 4. Create campaign (with token + files)
POST /api/campaigns

# 5. Get all campaigns (no auth)
GET /api/campaigns

# 6. Get single campaign
GET /api/campaigns/1

# 7. Like campaign (with token)
POST /api/campaigns/1/like

# 8. Add comment (with token)
POST /api/campaigns/1/comments

# 9. Add investment (with token)
POST /api/campaigns/1/invest

# 10. Verify data in database
```

---

**Ready to test! 🚀**

Start the server with `npm run dev` and begin testing from Phase 1!
