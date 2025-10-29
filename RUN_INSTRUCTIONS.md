# 🚀 How to Run Backend and Frontend

## Prerequisites
- Node.js installed
- PostgreSQL database (NeonDB recommended)
- Environment variables configured

---

## Method 1: Using Two Separate Terminals (Recommended)

### Terminal 1 - Backend Server

```bash
# Navigate to backend directory
cd CrowdFundingASV/Backend

# Install dependencies (first time only)
npm install

# Start the backend server
npm run dev
```

**Expected Output:**
```
✅ PostgreSQL connected at: [timestamp]
🚀 Server running on port 5000
```

### Terminal 2 - Frontend Development Server

```bash
# Navigate to frontend directory
cd CrowdFundingASV/Frontend

# Install dependencies (first time only)
npm install

# Start the frontend server
npm run dev
```

**Expected Output:**
```
VITE v5.x.x ready in xxx ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

### Open Your Browser
Navigate to: **http://localhost:5173/**

---

## Method 2: Using PowerShell Scripts

### For Windows (PowerShell)

**Start Backend:**
```powershell
cd C:\Users\Admin\OneDrive\Desktop\CrowdFunding\CrowdFundingASV\Backend
npm run dev
```

**Start Frontend (in new terminal):**
```powershell
cd C:\Users\Admin\OneDrive\Desktop\CrowdFunding\CrowdFundingASV\Frontend
npm run dev
```

---

## Quick Commands Reference

| Action | Command | Directory |
|--------|---------|-----------|
| Install Backend Dependencies | `npm install` | `Backend/` |
| Install Frontend Dependencies | `npm install` | `Frontend/` |
| Start Backend (Dev) | `npm run dev` | `Backend/` |
| Start Backend (Prod) | `npm start` | `Backend/` |
| Start Frontend | `npm run dev` | `Frontend/` |
| Build Frontend | `npm run build` | `Frontend/` |

---

## Troubleshooting

### Backend won't start
- ✅ Check if `.env` file exists in Backend directory
- ✅ Verify DATABASE_URL is correct
- ✅ Make sure PostgreSQL is running
- ✅ Check if port 5000 is available

### Frontend won't start
- ✅ Check if `.env` file exists in Frontend directory
- ✅ Make sure backend is running first
- ✅ Check if port 5173 is available

### Can't connect to backend
- ✅ Verify backend is running on port 5000
- ✅ Check VITE_API_URL in Frontend/.env is `http://localhost:5000/api`
- ✅ Open browser console (F12) to check for CORS errors

---

## Production Build

### Build Frontend for Production
```bash
cd CrowdFundingASV/Frontend
npm run build
```

This creates a `dist/` folder with optimized production files.

---

## Stop Servers

- Press **Ctrl + C** in each terminal to stop the servers

---

## First Time Setup Checklist

- [ ] Create Backend `.env` file with all required variables
- [ ] Create Frontend `.env` file with API URL and Razorpay key
- [ ] Run `npm install` in Backend directory
- [ ] Run `npm install` in Frontend directory
- [ ] Run database migration SQL script
- [ ] Start Backend server
- [ ] Start Frontend server
- [ ] Open http://localhost:5173 in browser
- [ ] Test registration and login

---

**Need help?** Check the full `SETUP_GUIDE.md` for detailed instructions!



