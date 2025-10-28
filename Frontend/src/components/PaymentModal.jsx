
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { initiateRazorpayPayment } from '../services/payment';
import {
  XMarkIcon,
  CreditCardIcon,
  BanknotesIcon,
  ShieldCheckIcon,
  InformationCircleIcon,
} from '@heroicons/react/24/outline';

/*
  PaymentModal
  - Unified checkout modal supporting four funding models: donation, reward, equity, debt
  - Derives sensible presets and validation rules from the selected model
  - Delegates secure payment creation/verification to backend via initiateRazorpayPayment
  - Never trusts client-only state for final accounting (backend re-verifies)
*/
const PaymentModal = ({ campaign, isOpen, onClose, onSuccess }) => {
  const { user, isAuthenticated } = useAuth();
  const [amount, setAmount] = useState('');
  const [customAmount, setCustomAmount] = useState('');
  const [selectedReward, setSelectedReward] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const fundingType = campaign?.type_of_campaign || 'donation';

  // Choose user-friendly preset amounts per funding model
  const getPresetAmounts = () => {
    switch (fundingType) {
      // Micro to mid donations typical for charitable giving
      case 'donation':
        return [100, 500, 1000, 5000, 10000];
      // For rewards, mirror the actual tier amounts if present
      case 'reward':
        return campaign?.rewards?.map(r => r.amount) || [500, 1000, 2500];
      // Equity investments tend to be higher tickets
      case 'equity':
        return [50000, 100000, 250000, 500000];
      // Debt contributions commonly sit between 25k–250k
      case 'debt':
        return [25000, 50000, 100000, 250000];
      default:
        return [100, 500, 1000, 5000];
    }
  };

  const presetAmounts = getPresetAmounts();

  // Enforce model-specific minimums (backend should enforce the same)
  const getMinimumAmount = () => {
    switch (fundingType) {
      case 'donation': return 10;
      case 'reward': return Math.min(...(campaign?.rewards?.map(r => r.amount) || [100]));
      case 'equity': return campaign?.minimum_investment || 10000;
      case 'debt': return 5000;
      default: return 10;
    }
  };

  const minimumAmount = getMinimumAmount();

  // Titles/CTAs tailored to funding type for better UX clarity
  const getPaymentLabels = () => {
    const labels = {
      donation: { action: 'Donate', title: 'Make a Donation', subtitle: 'Support this cause' },
      reward: { action: 'Back Project', title: 'Back This Project', subtitle: 'Choose your reward' },
      equity: { action: 'Invest', title: 'Invest in Company', subtitle: 'Become a shareholder' },
      debt: { action: 'Lend', title: 'Provide Loan', subtitle: 'Earn fixed returns' },
    };
    return labels[fundingType] || labels.donation;
  };

  const labels = getPaymentLabels();

  const handleAmountSelect = (value) => {
    setAmount(value);
    setCustomAmount('');
    setError('');
    
    // Reward campaigns: auto-pick the tier whose amount matches the preset
    if (fundingType === 'reward' && campaign?.rewards) {
      const reward = campaign.rewards.find(r => r.amount === value);
      setSelectedReward(reward);
    }
  };

  const handleCustomAmount = (value) => {
    setCustomAmount(value);
    setAmount('');
    setSelectedReward(null);
    setError('');
  };

  const getFinalAmount = () => {
    return parseFloat(customAmount || amount || 0);
  };

  // Launch Razorpay flow after client-side validation; backend still re-verifies signature
  const handlePayment = async () => {
    const finalAmount = getFinalAmount();

    // Basic client-side guards (mirrored on backend)
    if (!finalAmount || finalAmount < minimumAmount) {
      setError(`Minimum amount is ₹${minimumAmount}`);
      return;
    }

    // Avoid ambiguous pledge on reward model
    if (fundingType === 'reward' && !selectedReward && !customAmount) {
      setError('Please select a reward tier');
      return;
    }

    if (!isAuthenticated) {
      setError('Please login to continue');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await initiateRazorpayPayment({
        amount: finalAmount,            // INR amount (frontend shows rupees, service converts to paise)
        campaignId: campaign.id,        // used for receipt and attribution
        campaignTitle: campaign.title,  // used in Razorpay description
        fundingType: fundingType,       // donation / reward / equity / debt
        user: user,                     // prefill details
        onSuccess: (result) => {
          setLoading(false);
          onSuccess && onSuccess(result); // bubble up to page for refresh/toast
          onClose();
        },
        onFailure: (err) => {
          setLoading(false);
          setError(err.message || 'Payment failed. Please try again.');
        },
      });
    } catch (err) {
      setLoading(false);
      setError(err.message || 'Failed to initiate payment');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-primary-600 to-primary-700 text-white p-6 rounded-t-3xl">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-3xl font-bold mb-2">{labels.title}</h2>
              <p className="text-primary-100">{labels.subtitle}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-full transition"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          {/* Campaign Info */}
          <div className="mt-4 pt-4 border-t border-white/20">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-2xl mr-3">
                {campaign?.title?.charAt(0)}
              </div>
              <div>
                <div className="font-semibold text-lg">{campaign?.title}</div>
                <div className="text-sm text-primary-100">
                  {fundingType.charAt(0).toUpperCase() + fundingType.slice(1)}-based Campaign
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          {/* Funding Type Specific Info */}
          {fundingType === 'equity' && campaign?.equity_offered && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
              <div className="flex items-start">
                <InformationCircleIcon className="h-6 w-6 text-blue-600 mr-3 mt-0.5" />
                <div>
                  <div className="font-semibold text-blue-900 mb-1">Investment Details</div>
                  <div className="text-sm text-blue-700">
                    Company Valuation: ₹{(campaign.valuation / 10000000).toFixed(2)}Cr • 
                    Equity Offered: {campaign.equity_offered}% • 
                    Min Investment: ₹{(campaign.minimum_investment / 1000).toFixed(0)}K
                  </div>
                </div>
              </div>
            </div>
          )}

          {fundingType === 'debt' && campaign?.interest_rate && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
              <div className="flex items-start">
                <InformationCircleIcon className="h-6 w-6 text-green-600 mr-3 mt-0.5" />
                <div>
                  <div className="font-semibold text-green-900 mb-1">Loan Terms</div>
                  <div className="text-sm text-green-700">
                    Interest Rate: {campaign.interest_rate}% p.a. • 
                    Tenure: {campaign.loan_term} months • 
                    Repayment: {campaign.repayment_schedule || 'Monthly'}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Preset Amounts */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Select Amount (₹)
            </label>
            <div className="grid grid-cols-3 gap-3">
              {presetAmounts.map((value) => (
                <button
                  key={value}
                  onClick={() => handleAmountSelect(value)}
                  className={`p-4 rounded-xl border-2 font-semibold transition-all ${
                    amount === value
                      ? 'border-primary-600 bg-primary-50 text-primary-700'
                      : 'border-gray-200 hover:border-primary-300 text-gray-700'
                  }`}
                >
                  ₹{value >= 1000 ? `${(value / 1000).toFixed(0)}K` : value}
                </button>
              ))}
            </div>
          </div>

          {/* Rewards (for reward-based) */}
          {fundingType === 'reward' && campaign?.rewards?.length > 0 && (
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Or Choose a Reward
              </label>
              <div className="space-y-3">
                {campaign.rewards.map((reward, index) => (
                  <div
                    key={index}
                    onClick={() => {
                      setAmount(reward.amount);
                      setSelectedReward(reward);
                      setCustomAmount('');
                    }}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      selectedReward?.amount === reward.amount
                        ? 'border-purple-600 bg-purple-50'
                        : 'border-gray-200 hover:border-purple-300'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="font-bold text-lg text-gray-900">
                        ₹{reward.amount.toLocaleString()}
                      </div>
                      {reward.delivery_date && (
                        <div className="text-xs text-gray-500">
                          Est. {new Date(reward.delivery_date).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                    <div className="text-sm text-gray-600">{reward.description}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Custom Amount */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Or Enter Custom Amount
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-semibold">
                ₹
              </span>
              <input
                type="number"
                value={customAmount}
                onChange={(e) => handleCustomAmount(e.target.value)}
                placeholder={`Minimum ₹${minimumAmount}`}
                className="w-full pl-8 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:border-primary-500 focus:outline-none text-lg font-semibold"
              />
            </div>
            <div className="text-xs text-gray-500 mt-2">
              Minimum amount: ₹{minimumAmount.toLocaleString()}
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
              {error}
            </div>
          )}

          {/* Amount Summary */}
          {getFinalAmount() > 0 && (
            <div className="bg-gray-50 rounded-xl p-6 mb-6">
              <div className="flex justify-between items-center mb-4">
                <span className="text-gray-600">Amount</span>
                <span className="text-2xl font-bold text-gray-900">
                  ₹{getFinalAmount().toLocaleString()}
                </span>
              </div>
              {fundingType === 'equity' && campaign?.equity_offered && (
                <div className="text-sm text-gray-600 pt-4 border-t">
                  You will receive approximately{' '}
                  <span className="font-semibold text-gray-900">
                    {((getFinalAmount() / campaign.valuation) * 100).toFixed(4)}%
                  </span>{' '}
                  equity
                </div>
              )}
              {fundingType === 'debt' && campaign?.interest_rate && (
                <div className="text-sm text-gray-600 pt-4 border-t">
                  Expected returns: ₹
                  {((getFinalAmount() * campaign.interest_rate * (campaign.loan_term / 12)) / 100).toLocaleString()}{' '}
                  over {campaign.loan_term} months
                </div>
              )}
            </div>
          )}

          {/* Payment Button */}
          <button
            onClick={handlePayment}
            disabled={loading || !getFinalAmount()}
            className="w-full py-5 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                Processing...
              </>
            ) : (
              <>
                <CreditCardIcon className="h-6 w-6 mr-2" />
                {labels.action} ₹{getFinalAmount().toLocaleString()}
              </>
            )}
          </button>

          {/* Security Badge */}
          <div className="mt-6 flex items-center justify-center text-sm text-gray-500">
            <ShieldCheckIcon className="h-5 w-5 text-green-600 mr-2" />
            <span>Secured by Razorpay • SSL Encrypted</span>
          </div>

          {/* Payment Methods */}
          <div className="mt-6 pt-6 border-t text-center">
            <div className="text-xs text-gray-500 mb-3">We accept</div>
            <div className="flex items-center justify-center space-x-4 text-2xl">
              <span title="Credit/Debit Cards">💳</span>
              <span title="Net Banking">🏦</span>
              <span title="UPI">📱</span>
              <span title="Wallets">👛</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;

