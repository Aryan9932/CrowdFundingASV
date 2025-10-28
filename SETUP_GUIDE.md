# 🚀 CrowdFunding Platform - Complete Setup Guide

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Backend Setup](#backend-setup)
3. [Frontend Setup](#frontend-setup)
4. [Database Setup](#database-setup)
5. [Environment Variables](#environment-variables)
6. [Running the Application](#running-the-application)
7. [Testing the Connection](#testing-the-connection)

---

## Prerequisites

Make sure you have the following installed:
- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **PostgreSQL** (v13 or higher) - [Download](https://www.postgresql.org/download/)
- **Git** (optional) - [Download](https://git-scm.com/)
- **Razorpay Account** - [Sign up](https://dashboard.razorpay.com/signup)
- **Cloudinary Account** - [Sign up](https://cloudinary.com/users/register/free)

---

## Backend Setup

### 1. Navigate to Backend Directory
```bash
cd CrowdFundingASV/Backend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Install Razorpay SDK (if not already installed)
```bash
npm install razorpay
```

### 4. Create .env File
Create a file named `.env` in the `Backend` directory with the following content:

```env
# Database Configuration (NeonDB PostgreSQL)
DATABASE_URL=your_neon_database_url_here

# JWT Secret (generate a strong random string)
JWT_SECRET=your_jwt_secret_key_here

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Razorpay Configuration
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

# Server Port
PORT=5000
```

### 5. Run Database Migrations
Run the SQL migration file to create payment tables:

```bash
# Connect to your PostgreSQL database and run:
psql -U your_username -d your_database -f migrations/create_payment_tables.sql
```

Or using a PostgreSQL GUI client (pgAdmin, DBeaver, etc.), execute the contents of `migrations/create_payment_tables.sql`.

---

## Frontend Setup

### 1. Navigate to Frontend Directory
```bash
cd CrowdFundingASV/Frontend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Create .env File
Create a file named `.env` in the `Frontend` directory:

```env
# Backend API URL
VITE_API_URL=http://localhost:5000/api

# Razorpay Key ID (public key - safe to expose in frontend)
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
```

**Important:** Only use the Razorpay **Key ID** (not the secret) in the frontend.

---

## Database Setup

### Option 1: NeonDB (Recommended - Serverless PostgreSQL)

1. Go to [https://neon.tech/](https://neon.tech/)
2. Sign up for a free account
3. Create a new project
4. Copy the connection string (it looks like: `postgresql://username:password@host/database`)
5. Paste it in your Backend `.env` file as `DATABASE_URL`

### Option 2: Local PostgreSQL

1. Install PostgreSQL locally
2. Create a new database:
```sql
CREATE DATABASE crowdfunding_db;
```
3. Update `DATABASE_URL` in `.env`:
```env
DATABASE_URL=postgresql://postgres:your_password@localhost:5432/crowdfunding_db
```

### Run Database Migrations

Execute the migration scripts to create all necessary tables:

```bash
# From Backend directory
cd CrowdFundingASV/Backend

# Run main schema (if you have it)
psql $DATABASE_URL -f migrations/schema.sql

# Run payment tables migration
psql $DATABASE_URL -f migrations/create_payment_tables.sql
```

---

## Environment Variables

### Backend Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@host/db` |
| `JWT_SECRET` | Secret key for JWT tokens | `my_super_secret_key_12345` |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name | `my-cloud-name` |
| `CLOUDINARY_API_KEY` | Cloudinary API key | `123456789012345` |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | `abcdefghijklmnop` |
| `RAZORPAY_KEY_ID` | Razorpay Key ID | `rzp_test_abcd1234` |
| `RAZORPAY_KEY_SECRET` | Razorpay Key Secret | `abcdefghijklmnop1234` |
| `PORT` | Backend server port | `5000` |

### Frontend Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | `http://localhost:5000/api` |
| `VITE_RAZORPAY_KEY_ID` | Razorpay Key ID (public) | `rzp_test_abcd1234` |

---

## Running the Application

### 1. Start Backend Server

From the `Backend` directory:

```bash
# Development mode with auto-reload
npm run dev

# OR Production mode
npm start
```

You should see:
```
✅ PostgreSQL connected at: [timestamp]
🚀 Server running on port 5000
```

### 2. Start Frontend Development Server

Open a **new terminal** and from the `Frontend` directory:

```bash
npm run dev
```

You should see:
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

### 3. Open Application

Open your browser and navigate to:
```
http://localhost:5173
```

---

## Testing the Connection

### 1. Test Backend API

Open your browser or use `curl`:

```bash
# Test server is running
curl http://localhost:5000/api/campaigns

# Expected response: { "campaigns": [...], ... }
```

### 2. Test Frontend-Backend Connection

1. Open the application in browser: `http://localhost:5173`
2. Open Browser DevTools (F12) → Console
3. Click on "Explore Campaigns" or navigate to campaigns page
4. Check the Console for API calls - you should see requests to `http://localhost:5000/api/campaigns`
5. Check the Network tab to see successful API responses (Status 200)

### 3. Test User Registration

1. Click "Sign Up" in the navbar
2. Fill in the registration form
3. Submit the form
4. Check Console for successful registration
5. You should be redirected to the home page

### 4. Test Campaign Creation

1. Login to your account
2. Click "Start Campaign"
3. Fill in the campaign details
4. Upload images
5. Submit the campaign
6. Check if the campaign appears in the campaigns list

### 5. Test Payment Integration (Razorpay)

1. Navigate to any campaign detail page
2. Click "Back this project"
3. Enter an amount
4. Click the payment button
5. Razorpay checkout modal should appear
6. Use Razorpay test cards for testing:
   - **Card Number:** 4111 1111 1111 1111
   - **CVV:** Any 3 digits
   - **Expiry:** Any future date

---

## Common Issues & Troubleshooting

### Issue 1: CORS Error
**Error:** `Access to fetch at 'http://localhost:5000/api/...' from origin 'http://localhost:5173' has been blocked by CORS policy`

**Solution:** Make sure CORS is properly configured in `Backend/server.js`:
```javascript
const corsOptions = {
  origin: ['http://localhost:5173', 'http://localhost:5174'],
  credentials: true,
};
app.use(cors(corsOptions));
```

### Issue 2: Database Connection Failed
**Error:** `PostgreSQL connection failed`

**Solution:**
1. Check if PostgreSQL is running
2. Verify `DATABASE_URL` in `.env`
3. Make sure the database exists
4. Check username/password are correct

### Issue 3: Port Already in Use
**Error:** `Port 5000 is already in use`

**Solution:**
```bash
# Kill the process using port 5000
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:5000 | xargs kill -9

# OR change the port in Backend/.env
PORT=5001
```

### Issue 4: Module Not Found
**Error:** `Cannot find module 'razorpay'`

**Solution:**
```bash
cd CrowdFundingASV/Backend
npm install razorpay
```

### Issue 5: Razorpay Checkout Not Loading
**Error:** Payment modal doesn't open

**Solution:**
1. Check if `VITE_RAZORPAY_KEY_ID` is set in Frontend `.env`
2. Check browser console for script loading errors
3. Make sure you're using the correct Razorpay key (test mode for development)

---

## API Endpoints Reference

### Auth Endpoints
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Campaign Endpoints
- `GET /api/campaigns` - Get all campaigns
- `GET /api/campaigns/:id` - Get campaign by ID
- `POST /api/campaigns` - Create campaign (requires auth)
- `PUT /api/campaigns/:id` - Update campaign (requires auth)
- `DELETE /api/campaigns/:id` - Delete campaign (requires auth)
- `GET /api/campaigns/trending` - Get trending campaigns
- `GET /api/campaigns/category/:category` - Get campaigns by category
- `GET /api/campaigns/type/:type` - Get campaigns by type

### Payment Endpoints
- `POST /api/payments/create-order` - Create Razorpay order (requires auth)
- `POST /api/payments/verify` - Verify payment (requires auth)
- `GET /api/payments/history/:userId` - Get payment history (requires auth)
- `GET /api/payments/campaign/:campaignId` - Get campaign transactions (requires auth)

---

## Next Steps

1. ✅ Backend and Frontend are connected
2. ✅ Database is set up
3. ✅ Payment integration is ready
4. 📝 Create some test campaigns
5. 💳 Test the payment flow
6. 🎨 Customize the design
7. 🚀 Deploy to production

---

## Support

If you encounter any issues:
1. Check the console logs (both frontend and backend)
2. Verify all environment variables are set correctly
3. Make sure all dependencies are installed
4. Check the database connection
5. Review the troubleshooting section above

---

## Production Deployment

### Backend Deployment (e.g., Render, Railway, Heroku)
1. Push code to GitHub
2. Connect your repository to the hosting platform
3. Set environment variables in the platform dashboard
4. Deploy!

### Frontend Deployment (e.g., Vercel, Netlify)
1. Push code to GitHub
2. Connect repository to Vercel/Netlify
3. Set build command: `npm run build`
4. Set output directory: `dist`
5. Add environment variables
6. Deploy!

---

**Happy Coding! 🚀**

