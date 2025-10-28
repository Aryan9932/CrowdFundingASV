import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Razorpay Configuration
const RAZORPAY_KEY = import.meta.env.VITE_RAZORPAY_KEY_ID || 'YOUR_RAZORPAY_KEY_ID';

/**
 * Load Razorpay script dynamically
 */
export const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

/**
 * Create Razorpay order
 */
export const createRazorpayOrder = async (amount, currency = 'INR', campaignId, fundingType) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/payments/create-order`, {
      amount, // in smallest currency unit (paise for INR)
      currency,
      campaignId,
      fundingType,
    }, {
      withCredentials: true,
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Verify Razorpay payment
 */
export const verifyPayment = async (paymentData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/payments/verify`, paymentData, {
      withCredentials: true,
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Initialize Razorpay payment
 * @param {Object} options - Payment options
 * @param {number} options.amount - Amount in INR
 * @param {string} options.campaignId - Campaign ID
 * @param {string} options.campaignTitle - Campaign title
 * @param {string} options.fundingType - donation/reward/equity/debt
 * @param {Object} options.user - User details
 * @param {Function} options.onSuccess - Success callback
 * @param {Function} options.onFailure - Failure callback
 */
export const initiateRazorpayPayment = async ({
  amount,
  campaignId,
  campaignTitle,
  fundingType,
  user,
  onSuccess,
  onFailure,
}) => {
  try {
    // Load Razorpay script
    const scriptLoaded = await loadRazorpayScript();
    if (!scriptLoaded) {
      throw new Error('Failed to load Razorpay SDK. Please check your internet connection.');
    }

    // Create order
    const orderData = await createRazorpayOrder(
      Math.round(amount * 100), // Convert to paise
      'INR',
      campaignId,
      fundingType
    );

    // Razorpay options
    const options = {
      key: RAZORPAY_KEY,
      amount: orderData.amount,
      currency: orderData.currency,
      name: 'CrowdFund',
      description: getPaymentDescription(fundingType, campaignTitle),
      image: '/logo.png', // Your logo URL
      order_id: orderData.orderId,
      handler: async function (response) {
        try {
          // Verify payment on backend
          const verificationResult = await verifyPayment({
            orderId: response.razorpay_order_id,
            paymentId: response.razorpay_payment_id,
            signature: response.razorpay_signature,
            campaignId,
            fundingType,
            amount: amount,
          });

          if (verificationResult.success) {
            onSuccess && onSuccess(verificationResult);
          } else {
            onFailure && onFailure(new Error('Payment verification failed'));
          }
        } catch (error) {
          console.error('Payment verification error:', error);
          onFailure && onFailure(error);
        }
      },
      prefill: {
        name: user?.firstName ? `${user.firstName} ${user.lastName || ''}` : user?.email,
        email: user?.email || '',
        contact: user?.phone || '',
      },
      notes: {
        campaign_id: campaignId,
        funding_type: fundingType,
      },
      theme: {
        color: '#0ea5e9', // Your primary color
      },
      modal: {
        ondismiss: function() {
          onFailure && onFailure(new Error('Payment cancelled by user'));
        },
      },
    };

    const razorpay = new window.Razorpay(options);
    razorpay.open();

  } catch (error) {
    console.error('Payment initiation error:', error);
    onFailure && onFailure(error);
  }
};

/**
 * Get payment description based on funding type
 */
const getPaymentDescription = (fundingType, campaignTitle) => {
  const descriptions = {
    donation: `Donation for ${campaignTitle}`,
    reward: `Reward-based backing for ${campaignTitle}`,
    equity: `Equity investment in ${campaignTitle}`,
    debt: `Loan contribution to ${campaignTitle}`,
  };
  return descriptions[fundingType] || `Payment for ${campaignTitle}`;
};

/**
 * Get payment history
 */
export const getPaymentHistory = async (userId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/payments/history/${userId}`, {
      withCredentials: true,
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

/**
 * Get campaign transactions
 */
export const getCampaignTransactions = async (campaignId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/payments/campaign/${campaignId}`, {
      withCredentials: true,
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export default {
  loadRazorpayScript,
  createRazorpayOrder,
  verifyPayment,
  initiateRazorpayPayment,
  getPaymentDescription,
  getPaymentHistory,
  getCampaignTransactions,
};


