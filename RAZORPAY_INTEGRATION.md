# 💳 Razorpay Payment Integration Guide

Complete guide for integrating Razorpay payment gateway in the CrowdFunding platform.

---

## 🎯 Overview

Your platform supports **4 funding models** with Razorpay integration:
- 💝 **Donation-based** - One-time donations
- 🎁 **Reward-based** - Pledge with rewards
- 📈 **Equity-based** - Investment payments
- 💰 **Debt-based** - Loan contributions

---

## 🚀 Setup Instructions

### 1. Create Razorpay Account

1. Go to https://razorpay.com/
2. Sign up for account (Test mode is free)
3. Complete KYC verification (for production)
4. Get your API keys from Dashboard → Settings → API Keys

### 2. Get API Keys

```
Test Mode:
- Key ID: rzp_test_xxxxxxxxxxxxxxxx
- Key Secret: xxxxxxxxxxxxxxxxxxxxxxxxxx

Live Mode:
- Key ID: rzp_live_xxxxxxxxxxxxxxxx  
- Key Secret: xxxxxxxxxxxxxxxxxxxxxxxxxx
```

⚠️ **Never commit secrets to Git!**

### 3. Frontend Configuration

Create `Frontend/.env`:

```env
VITE_API_URL=http://localhost:5000/api
VITE_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxxxxx
```

### 4. Backend Configuration

Create `Backend/.env`:

```env
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=your_secret_key_here
```

---

## 💻 Frontend Implementation

### Payment Service (`src/services/payment.js`)

```javascript
import { initiateRazorpayPayment } from '../services/payment';

// Initiate payment
await initiateRazorpayPayment({
  amount: 5000, // in INR
  campaignId: 'campaign_123',
  campaignTitle: 'Save the Turtles',
  fundingType: 'donation', // or 'reward', 'equity', 'debt'
  user: currentUser,
  onSuccess: (result) => {
    console.log('Payment successful!', result);
  },
  onFailure: (error) => {
    console.error('Payment failed:', error);
  },
});
```

### Payment Modal Component

Automatically handles:
- ✅ Amount selection (preset + custom)
- ✅ Reward tier selection (reward-based)
- ✅ Investment details (equity/debt)
- ✅ Razorpay checkout integration
- ✅ Payment verification
- ✅ Success/failure handling

```jsx
import PaymentModal from '../components/PaymentModal';

<PaymentModal
  campaign={campaignData}
  isOpen={showModal}
  onClose={() => setShowModal(false)}
  onSuccess={(result) => {
    alert('Payment successful!');
    refreshCampaign();
  }}
/>
```

---

## 🔧 Backend Implementation

### Required Backend Endpoints

#### 1. Create Razorpay Order

```javascript
POST /api/payments/create-order

Request Body:
{
  "amount": 500000,  // in paise (₹5000)
  "currency": "INR",
  "campaignId": "campaign_123",
  "fundingType": "donation"
}

Response:
{
  "orderId": "order_xxxxxxxxxxxxx",
  "amount": 500000,
  "currency": "INR"
}
```

**Backend Code:**

```javascript
import Razorpay from 'razorpay';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export const createOrder = async (req, res) => {
  try {
    const { amount, currency, campaignId, fundingType } = req.body;

    const options = {
      amount: amount, // in paise
      currency: currency,
      receipt: `receipt_${campaignId}_${Date.now()}`,
      notes: {
        campaign_id: campaignId,
        funding_type: fundingType,
        user_id: req.user.id,
      },
    };

    const order = await razorpay.orders.create(options);

    res.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
```

#### 2. Verify Payment

```javascript
POST /api/payments/verify

Request Body:
{
  "orderId": "order_xxxxxxxxxxxxx",
  "paymentId": "pay_xxxxxxxxxxxxx",
  "signature": "signature_string",
  "campaignId": "campaign_123",
  "fundingType": "donation",
  "amount": 5000
}

Response:
{
  "success": true,
  "paymentId": "pay_xxxxxxxxxxxxx",
  "message": "Payment verified successfully"
}
```

**Backend Code:**

```javascript
import crypto from 'crypto';

export const verifyPayment = async (req, res) => {
  try {
    const { orderId, paymentId, signature, campaignId, fundingType, amount } = req.body;

    // Verify signature
    const generatedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(`${orderId}|${paymentId}`)
      .digest('hex');

    if (generatedSignature !== signature) {
      return res.status(400).json({ success: false, message: 'Invalid signature' });
    }

    // Save transaction to database
    await saveTransaction({
      paymentId,
      orderId,
      campaignId,
      userId: req.user.id,
      amount: amount,
      fundingType,
      status: 'success',
    });

    // Update campaign raised_amount
    await updateCampaignFunds(campaignId, amount);

    res.json({
      success: true,
      paymentId,
      message: 'Payment verified successfully',
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
```

#### 3. Get Payment History

```javascript
GET /api/payments/history/:userId

Response:
{
  "payments": [
    {
      "id": 1,
      "paymentId": "pay_xxxxxxxxxxxxx",
      "campaignTitle": "Save the Turtles",
      "amount": 5000,
      "fundingType": "donation",
      "status": "success",
      "createdAt": "2025-01-15T10:30:00Z"
    }
  ]
}
```

---

## 💾 Database Schema

### Payments/Transactions Table

```sql
CREATE TABLE transactions (
  id SERIAL PRIMARY KEY,
  payment_id VARCHAR(255) UNIQUE NOT NULL,
  order_id VARCHAR(255) NOT NULL,
  campaign_id INTEGER REFERENCES campaigns(id),
  user_id INTEGER REFERENCES users(id),
  amount DECIMAL(12,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'INR',
  funding_type VARCHAR(50) NOT NULL, -- donation, reward, equity, debt
  status VARCHAR(50) DEFAULT 'pending', -- pending, success, failed
  payment_method VARCHAR(100), -- card, upi, netbanking, wallet
  razorpay_signature TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_transactions_user ON transactions(user_id);
CREATE INDEX idx_transactions_campaign ON transactions(campaign_id);
CREATE INDEX idx_transactions_payment ON transactions(payment_id);
```

---

## 🔄 Payment Flow

### Detailed Flow Diagram

```
User Action
    ↓
1. User clicks "Donate/Invest/Back/Lend" button
    ↓
2. Frontend opens Payment Modal
    ↓
3. User selects amount/reward tier
    ↓
4. User clicks "Pay ₹X" button
    ↓
5. Frontend calls createRazorpayOrder()
    ↓
6. Backend creates Razorpay order
    ↓
7. Backend returns orderId
    ↓
8. Frontend loads Razorpay Checkout
    ↓
9. User completes payment on Razorpay
    ↓
10. Razorpay returns payment details
    ↓
11. Frontend calls verifyPayment()
    ↓
12. Backend verifies signature
    ↓
13. Backend saves transaction
    ↓
14. Backend updates campaign funds
    ↓
15. Frontend shows success message
    ↓
Done! ✅
```

---

## 🎨 UI/UX Features

### Payment Modal Features

✅ **Dynamic Amount Selection**
- Preset amounts based on funding type
- Custom amount input
- Minimum amount validation

✅ **Funding Type Specific**
- **Donation**: Simple amount selection
- **Reward**: Shows reward tiers with descriptions
- **Equity**: Shows equity % calculation
- **Debt**: Shows interest returns calculation

✅ **Security Indicators**
- SSL badge
- Razorpay logo
- Secure payment icons

✅ **Payment Methods**
- Credit/Debit Cards 💳
- Net Banking 🏦
- UPI 📱
- Wallets 👛

---

## 🧪 Testing

### Test Mode

Use Razorpay test cards:

```
Success:
Card: 4111 1111 1111 1111
CVV: Any 3 digits
Expiry: Any future date

Failure:
Card: 4000 0000 0000 0002
```

### Test UPI

```
Success: success@razorpay
Failure: failure@razorpay
```

### Testing Checklist

- [ ] Create order successfully
- [ ] Payment modal opens
- [ ] Amount selection works
- [ ] Razorpay checkout opens
- [ ] Test card payment works
- [ ] Payment verification works
- [ ] Database updated correctly
- [ ] Campaign funds increased
- [ ] Success message shown
- [ ] Failed payment handled

---

## 🔒 Security Best Practices

### 1. **Never Expose Key Secret**
```javascript
// ❌ BAD - Never do this
const keySecret = 'your_secret_key_here';

// ✅ GOOD - Use environment variables
const keySecret = process.env.RAZORPAY_KEY_SECRET;
```

### 2. **Always Verify Signature**
```javascript
// Don't trust frontend data alone
// Always verify payment signature on backend
```

### 3. **Validate Amounts**
```javascript
// Check minimum amounts
// Verify campaign still active
// Check user is authenticated
```

### 4. **Use HTTPS in Production**
```javascript
// Razorpay requires HTTPS for live mode
```

---

## 📊 Payment Analytics

Track key metrics:

```javascript
// Total raised per funding type
SELECT funding_type, SUM(amount) as total
FROM transactions
WHERE status = 'success'
GROUP BY funding_type;

// Top campaigns
SELECT campaign_id, COUNT(*) as backers, SUM(amount) as raised
FROM transactions
WHERE status = 'success'
GROUP BY campaign_id
ORDER BY raised DESC;

// Success rate
SELECT 
  status,
  COUNT(*) as count,
  (COUNT(*) * 100.0 / SUM(COUNT(*)) OVER()) as percentage
FROM transactions
GROUP BY status;
```

---

## 🚨 Error Handling

### Common Errors

**1. Payment Failed**
```javascript
{
  "error": {
    "code": "BAD_REQUEST_ERROR",
    "description": "Payment failed"
  }
}
```

**2. Invalid Signature**
```javascript
{
  "error": "Payment verification failed"
}
```

**3. Network Error**
```javascript
{
  "error": "Unable to connect to payment gateway"
}
```

### Error Messages for Users

```javascript
const userFriendlyErrors = {
  'BAD_REQUEST_ERROR': 'Payment failed. Please try again.',
  'GATEWAY_ERROR': 'Payment gateway error. Please try after some time.',
  'NETWORK_ERROR': 'Network issue. Please check your connection.',
  'SERVER_ERROR': 'Something went wrong. Please contact support.',
};
```

---

## 🌍 Production Checklist

Before going live:

- [ ] KYC completed on Razorpay
- [ ] Live API keys configured
- [ ] HTTPS enabled
- [ ] Webhook configured (optional)
- [ ] Error logging setup
- [ ] Payment receipts configured
- [ ] Refund policy defined
- [ ] Terms & conditions updated
- [ ] Test all payment methods
- [ ] Load testing completed

---

## 📱 Webhooks (Optional)

For real-time payment updates:

```javascript
POST /api/webhooks/razorpay

// Razorpay sends webhook on payment events
// Verify webhook signature
// Update payment status
```

---

## 💰 Pricing

Razorpay Fees:
- **Domestic Cards**: 2% + GST
- **International Cards**: 3% + GST
- **UPI**: 2% + GST (capped at ₹3000)
- **Net Banking**: 2% + GST

---

## 📚 References

- Razorpay Docs: https://razorpay.com/docs/
- Payment Gateway API: https://razorpay.com/docs/api/
- Checkout Integration: https://razorpay.com/docs/payment-gateway/web-integration/standard/
- Test Cards: https://razorpay.com/docs/payments/payments/test-card-details/

---

## 🎉 You're All Set!

Your crowdfunding platform now has a complete Razorpay integration supporting all 4 funding models! 🚀


