import Razorpay from "razorpay";
import crypto from "crypto";
import pool from "../config/db.js";

// Initialize Razorpay with error handling
let razorpay = null;

try {
  if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
    razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
    console.log("✅ Razorpay initialized successfully");
  } else {
    console.warn("⚠️  Razorpay credentials not found. Payment features will be disabled.");
    console.warn("   Add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to .env file");
  }
} catch (error) {
  console.error("❌ Failed to initialize Razorpay:", error.message);
}

/**
 * Create Razorpay Order
 */
export const createOrder = async (req, res) => {
  try {
    const { amount, currency = "INR", campaignId, fundingType } = req.body;
    const userId = req.user.id;

    // Validate inputs
    if (!amount || !campaignId || !fundingType) {
      return res.status(400).json({
        success: false,
        message: "Amount, campaignId, and fundingType are required",
      });
    }

    // Create Razorpay order
    const options = {
      amount: Math.round(amount), // Amount in smallest currency unit (paise)
      currency: currency,
      receipt: `receipt_${campaignId}_${Date.now()}`,
      notes: {
        campaign_id: campaignId,
        user_id: userId,
        funding_type: fundingType,
      },
    };

    const order = await razorpay.orders.create(options);

    // Store order in database
    const query = `
      INSERT INTO payment_orders (
        order_id, user_id, campaign_id, amount, currency, funding_type, status, created_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
      RETURNING *
    `;

    const values = [
      order.id,
      userId,
      campaignId,
      amount,
      currency,
      fundingType,
      "created",
    ];

    await pool.query(query, values);

    res.status(200).json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (error) {
    console.error("Create order error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create order",
      error: error.message,
    });
  }
};

/**
 * Verify Razorpay Payment
 */
export const verifyPayment = async (req, res) => {
  try {
    const {
      orderId,
      paymentId,
      signature,
      campaignId,
      fundingType,
      amount,
    } = req.body;
    const userId = req.user.id;

    // Validate inputs
    if (!orderId || !paymentId || !signature) {
      return res.status(400).json({
        success: false,
        message: "Order ID, payment ID, and signature are required",
      });
    }

    // Verify signature
    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${orderId}|${paymentId}`)
      .digest("hex");

    if (generatedSignature !== signature) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment signature",
      });
    }

    // Update order status in database
    const updateOrderQuery = `
      UPDATE payment_orders 
      SET payment_id = $1, status = $2, verified_at = NOW(), updated_at = NOW()
      WHERE order_id = $3 AND user_id = $4
      RETURNING *
    `;

    await pool.query(updateOrderQuery, [paymentId, "paid", orderId, userId]);

    // Create transaction record
    const transactionQuery = `
      INSERT INTO transactions (
        user_id, campaign_id, amount, payment_id, order_id, funding_type, status, created_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
      RETURNING *
    `;

    const transactionValues = [
      userId,
      campaignId,
      amount / 100, // Convert paise to rupees
      paymentId,
      orderId,
      fundingType,
      "completed",
    ];

    const transactionResult = await pool.query(transactionQuery, transactionValues);

    // Update campaign raised_amount
    const updateCampaignQuery = `
      UPDATE campaigns 
      SET raised_amount = raised_amount + $1, backers_count = backers_count + 1, updated_at = NOW()
      WHERE id = $2
      RETURNING *
    `;

    await pool.query(updateCampaignQuery, [amount / 100, campaignId]);

    res.status(200).json({
      success: true,
      message: "Payment verified successfully",
      transaction: transactionResult.rows[0],
    });
  } catch (error) {
    console.error("Verify payment error:", error);
    res.status(500).json({
      success: false,
      message: "Payment verification failed",
      error: error.message,
    });
  }
};

/**
 * Get Payment History for User
 */
export const getPaymentHistory = async (req, res) => {
  try {
    const { userId } = req.params;
    const requestingUserId = req.user.id;

    // Check if user is requesting their own history
    if (parseInt(userId) !== requestingUserId) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized access",
      });
    }

    const query = `
      SELECT 
        t.*,
        c.title as campaign_title,
        c.category as campaign_category,
        c.type_of_campaign as campaign_type
      FROM transactions t
      LEFT JOIN campaigns c ON t.campaign_id = c.id
      WHERE t.user_id = $1 AND t.status = 'completed'
      ORDER BY t.created_at DESC
    `;

    const result = await pool.query(query, [userId]);

    res.status(200).json({
      success: true,
      transactions: result.rows,
      total: result.rows.length,
    });
  } catch (error) {
    console.error("Get payment history error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch payment history",
      error: error.message,
    });
  }
};

/**
 * Get Campaign Transactions
 */
export const getCampaignTransactions = async (req, res) => {
  try {
    const { campaignId } = req.params;

    const query = `
      SELECT 
        t.id,
        t.amount,
        t.funding_type,
        t.status,
        t.created_at,
        u.first_name,
        u.last_name,
        u.email
      FROM transactions t
      LEFT JOIN users u ON t.user_id = u.id
      WHERE t.campaign_id = $1 AND t.status = 'completed'
      ORDER BY t.created_at DESC
    `;

    const result = await pool.query(query, [campaignId]);

    // Calculate total raised
    const totalQuery = `
      SELECT SUM(amount) as total_raised, COUNT(*) as total_backers
      FROM transactions
      WHERE campaign_id = $1 AND status = 'completed'
    `;

    const totalResult = await pool.query(totalQuery, [campaignId]);

    res.status(200).json({
      success: true,
      transactions: result.rows,
      summary: {
        totalRaised: parseFloat(totalResult.rows[0].total_raised || 0),
        totalBackers: parseInt(totalResult.rows[0].total_backers || 0),
      },
    });
  } catch (error) {
    console.error("Get campaign transactions error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch campaign transactions",
      error: error.message,
    });
  }
};

