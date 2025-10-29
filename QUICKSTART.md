# 🚀 CrowdFunding Platform - Quick Start Guide

Complete crowdfunding platform with React frontend and Node.js backend.

## 📋 Prerequisites

- Node.js 16+ and npm
- PostgreSQL database (or NeonDB account)
- Cloudinary account (for image/video uploads)

---

## 🔧 Backend Setup

### 1. Navigate to Backend directory
```bash
cd Backend
```

### 2. Install dependencies
```bash
npm install
```

### 3. Create `.env` file

Create `Backend/.env` with the following:

```env
# PostgreSQL Database (get from neon.tech or local PostgreSQL)
DATABASE_URL=postgresql://username:password@host:port/database

# JWT Secret (any random string)
JWT_SECRET=your_super_secret_jwt_key_change_this

# Cloudinary Configuration (get from cloudinary.com dashboard)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Server Port (optional, defaults to 5000)
PORT=5000
```

### 4. Set up Database

**Option A: NeonDB (Cloud - Free)**
1. Go to https://neon.tech
2. Create free account
3. Create a new project
4. Copy connection string
5. Paste as `DATABASE_URL` in `.env`

**Option B: Local PostgreSQL**
1. Install PostgreSQL
2. Create database: `createdb crowdfunding`
3. Use connection string: `postgresql://username:password@localhost:5432/crowdfunding`

### 5. Set up Cloudinary

1. Go to https://cloudinary.com
2. Sign up for free account
3. Go to Dashboard
4. Copy:
   - Cloud Name
   - API Key
   - API Secret
5. Add to `.env` file

### 6. Start Backend Server

```bash
npm run dev
```

Backend should now be running on `http://localhost:5000`

✅ **Backend is ready!**

---

## 🎨 Frontend Setup

### 1. Open new terminal and navigate to Frontend
```bash
cd Frontend
```

### 2. Install dependencies
```bash
npm install
```

### 3. Create `.env` file

Create `Frontend/.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

### 4. Start Frontend Development Server

```bash
npm run dev
```

Frontend should open at `http://localhost:3000`

✅ **Frontend is ready!**

---

## 🎯 Testing the Application

### 1. Register a New User

1. Go to http://localhost:3000
2. Click "Sign Up"
3. Choose account type:
   - **Individual**: First Name, Last Name
   - **Organization**: Organization Name
4. Enter email, password, location
5. Click "Create account"

### 2. Create a Campaign

1. After login, click "Start Campaign"
2. Fill in details:
   - Title: "Help Students Get Laptops"
   - Description: Explain your cause
   - Category: Education
   - Type: Donation
   - Goal: $5000
   - Location: Your city
3. Upload images (1-5 required)
4. Upload video (optional)
5. Add rewards (optional)
6. Click "Launch Campaign"

### 3. Browse Campaigns

1. Click "Campaigns" in navbar
2. Use filters:
   - Search by keyword
   - Filter by category
   - Filter by type (donation/investment)
3. Click on a campaign card to view details

### 4. Support a Campaign

1. Open any campaign detail page
2. Click "Back this project"
3. Enter amount (e.g., $50)
4. Click "Confirm"
5. Campaign's raised amount updates!

### 5. Like a Campaign

1. On campaign detail page
2. Click the heart icon ❤️
3. Like count increases

---

## 📁 Project Structure

```
CrowdFundingASV/
├── Backend/
│   ├── config/          # DB & Cloudinary config
│   ├── controllers/     # Request handlers
│   ├── middleware/      # Auth & file upload
│   ├── models/          # Database models
│   ├── Routes/          # API routes
│   ├── utils/           # JWT helpers
│   ├── server.js        # Entry point
│   └── .env             # Environment variables
│
└── Frontend/
    ├── src/
    │   ├── components/  # Reusable UI components
    │   ├── pages/       # Page components
    │   ├── context/     # Auth context
    │   ├── services/    # API calls
    │   ├── App.jsx      # Main app with routing
    │   └── main.jsx     # Entry point
    ├── index.html
    └── .env             # Environment variables
```

---

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user

### Campaigns
- `GET /api/campaigns` - List campaigns (with filters)
- `GET /api/campaigns/:id` - Get campaign details
- `POST /api/campaigns` - Create campaign (auth required)
- `GET /api/campaigns/trending` - Get trending campaigns
- `GET /api/campaigns/category/:category` - Filter by category
- `POST /api/campaigns/:id/like` - Like campaign (auth required)
- `POST /api/campaigns/:id/invest` - Invest in campaign (auth required)
- `POST /api/campaigns/:id/comments` - Add comment (auth required)

Full API documentation: `Backend/API_ROUTES_DOCUMENTATION.md`

---

## 🔐 Authentication Flow

1. User registers or logs in
2. Backend returns JWT token
3. Frontend stores token in:
   - localStorage (for persistence)
   - Cookie (for backend requests)
4. All protected requests include token in:
   - Authorization header: `Bearer <token>`
   - Cookie: `token=<token>`

---

## 📸 File Upload Flow

1. User selects images/video in Create Campaign form
2. Frontend creates FormData with files
3. Multer middleware receives files in memory
4. Backend uploads to Cloudinary
5. Cloudinary returns secure URLs
6. URLs stored in PostgreSQL database
7. Frontend displays images from Cloudinary URLs

---

## 🐛 Common Issues & Solutions

### Backend won't start

**Error:** "Cannot find module 'cookie-parser'"
- **Solution:** Run `npm install` in Backend directory

**Error:** "PostgreSQL connection failed"
- **Solution:** Check `DATABASE_URL` in `.env` is correct

**Error:** "Cloudinary upload failed"
- **Solution:** Verify Cloudinary credentials in `.env`

### Frontend won't start

**Error:** Module not found
- **Solution:** Run `npm install` in Frontend directory

**Error:** Network Error when calling API
- **Solution:** 
  - Ensure backend is running on port 5000
  - Check `VITE_API_URL` in Frontend `.env`

### Cannot create campaign

**Error:** "User is not authenticated"
- **Solution:** Login first, then create campaign

**Error:** "Missing required fields"
- **Solution:** Fill in title, description, goal, and upload at least 1 image

### Cannot upload files

**Error:** File size too large
- **Solution:** 
  - Images: Max 10MB each
  - Video: Max 100MB

---

## 🎨 Tech Stack

### Backend
- Node.js + Express
- PostgreSQL (NeonDB)
- JWT Authentication
- Cloudinary (file storage)
- Multer (file uploads)
- bcrypt (password hashing)

### Frontend
- React 18
- Vite (build tool)
- React Router (routing)
- Axios (HTTP client)
- Tailwind CSS (styling)
- Heroicons (icons)

---

## 📚 Features

✅ User registration & login (Individual/Organization)
✅ Create campaigns with images & video
✅ Browse & filter campaigns
✅ Campaign categories (Education, Medical, etc.)
✅ Campaign types (Donation, Investment)
✅ Invest/donate to campaigns
✅ Like campaigns
✅ Real-time progress tracking
✅ Rewards system
✅ Responsive design (mobile, tablet, desktop)
✅ File uploads to cloud (Cloudinary)

---

## 🚀 Next Steps

1. **Add Payment Integration** - Stripe, PayPal
2. **Email Notifications** - SendGrid, Mailgun
3. **Campaign Comments** - Discussion section
4. **User Profiles** - View user's campaigns
5. **Admin Dashboard** - Manage campaigns
6. **Social Sharing** - Facebook, Twitter integration
7. **Analytics** - Campaign performance metrics

---

## 📞 Support

If you encounter issues:
1. Check this guide
2. Review `Backend/API_ROUTES_DOCUMENTATION.md`
3. Check browser console for errors
4. Check backend terminal for errors

---

## 🎉 You're All Set!

Your crowdfunding platform is now running! Create campaigns, invite users, and start fundraising! 🚀




