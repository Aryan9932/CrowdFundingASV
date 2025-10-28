# ⚠️ Payment Features Temporarily Disabled

## What Was Changed

All payment-related features have been commented out to allow the backend and frontend to run without Razorpay configuration.

### Backend Changes:
✅ `server.js` - Payment routes disabled
✅ `controllers/paymentController.js` - Added error handling for missing Razorpay credentials

### Frontend Changes:
✅ `App.jsx` - Payment success/failure routes disabled
✅ `pages/CampaignDetail.jsx` - Payment modal disabled
✅ Payment button now shows alert: "Payment feature coming soon!"

---

## ✅ You Can Now Run The App Without:
- Razorpay credentials
- Payment database tables
- Payment .env variables

---

## 🚀 How to Run Now

### 1. Start Backend
```bash
cd CrowdFundingASV/Backend
npm run dev
```

Expected output:
```
✅ PostgreSQL connected at: [timestamp]
⚠️  Razorpay credentials not found. Payment features will be disabled.
🚀 Server running on port 5000
```

### 2. Start Frontend
```bash
cd CrowdFundingASV/Frontend
npm run dev
```

---

## 🔓 To Re-Enable Payments Later

### Step 1: Get Razorpay Credentials
1. Sign up at https://dashboard.razorpay.com/signup
2. Get your test keys (starts with `rzp_test_`)

### Step 2: Add to Backend .env
```env
RAZORPAY_KEY_ID=rzp_test_your_key_here
RAZORPAY_KEY_SECRET=your_secret_here
```

### Step 3: Add to Frontend .env
```env
VITE_RAZORPAY_KEY_ID=rzp_test_your_key_here
```

### Step 4: Uncomment Payment Code

**Backend - `server.js`:**
```javascript
// Uncomment these lines:
import paymentRoutes from "./Routes/paymentRoutes.js";
app.use("/api/payments", paymentRoutes);
```

**Frontend - `App.jsx`:**
```javascript
// Uncomment these lines:
import PaymentSuccess from './pages/PaymentSuccess';
import PaymentFailure from './pages/PaymentFailure';
<Route path="/payment/success" element={<PaymentSuccess />} />
<Route path="/payment/failure" element={<PaymentFailure />} />
```

**Frontend - `pages/CampaignDetail.jsx`:**
```javascript
// Uncomment these lines:
import PaymentModal from '../components/PaymentModal';
const [showPaymentModal, setShowPaymentModal] = useState(false);
// Restore the payment button onClick handler
// Restore the PaymentModal component at the bottom
```

### Step 5: Run Database Migration
```sql
-- Run this SQL in your PostgreSQL database
-- File: Backend/migrations/create_payment_tables.sql
```

### Step 6: Restart Servers
Both backend and frontend need to be restarted after changes.

---

## 📝 Notes

- The payment infrastructure is still in place
- Only the initialization and routes are disabled
- No code was deleted, just commented out
- Easy to re-enable when ready

---

**Current Status:** ✅ App runs without payment setup  
**Payment Features:** ❌ Temporarily disabled  
**Campaign Features:** ✅ Fully functional  
**Auth Features:** ✅ Fully functional

