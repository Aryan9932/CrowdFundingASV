import React from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { 
  XCircleIcon, 
  ArrowLeftIcon,
  ExclamationTriangleIcon,
  QuestionMarkCircleIcon,
  ChatBubbleLeftRightIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';

const PaymentFailure = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const error = searchParams.get('error') || 'Payment was not completed';
  const campaignId = searchParams.get('campaign_id');
  const amount = searchParams.get('amount');

  const commonIssues = [
    {
      icon: '💳',
      title: 'Insufficient Funds',
      description: 'Check if your account has sufficient balance'
    },
    {
      icon: '🔒',
      title: 'Card Declined',
      description: 'Your card may have been declined by the bank'
    },
    {
      icon: '⏱️',
      title: 'Session Timeout',
      description: 'The payment session may have expired'
    },
    {
      icon: '📱',
      title: 'OTP/3D Secure',
      description: 'Authentication may have failed or timed out'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 py-16 px-4">
      <div className="container-custom max-w-3xl mx-auto">
        {/* Failure Card */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-red-500 to-orange-600 text-white p-12 text-center relative">
            <div className="absolute inset-0 bg-black/10 opacity-20"></div>
            <div className="relative z-10">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-white rounded-full mb-6 shadow-2xl">
                <XCircleIcon className="h-16 w-16 text-red-500" />
              </div>
              <h1 className="text-4xl font-bold mb-3">Payment Failed</h1>
              <p className="text-xl text-red-100">
                We couldn't process your payment
              </p>
            </div>
          </div>

          {/* Error Details */}
          <div className="p-10">
            <div className="bg-red-50 border border-red-200 rounded-2xl p-6 mb-8">
              <div className="flex items-start">
                <ExclamationTriangleIcon className="h-6 w-6 text-red-600 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-red-900 mb-2">
                    Transaction Failed
                  </h3>
                  <p className="text-sm text-red-700 leading-relaxed">
                    {error}
                  </p>
                  {amount && (
                    <div className="mt-3 pt-3 border-t border-red-200">
                      <span className="text-red-600">Attempted amount: </span>
                      <span className="font-bold text-red-900">₹{amount}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Reassurance Message */}
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 mb-8">
              <div className="flex items-start">
                <QuestionMarkCircleIcon className="h-6 w-6 text-blue-600 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-blue-900 mb-2">
                    Don't worry!
                  </h3>
                  <p className="text-sm text-blue-700 leading-relaxed">
                    No money has been deducted from your account. If you see any deduction, 
                    it will be automatically refunded within 5-7 business days.
                  </p>
                </div>
              </div>
            </div>

            {/* Common Issues */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Common Reasons for Payment Failure
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {commonIssues.map((issue, index) => (
                  <div key={index} className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                    <div className="text-3xl mb-2">{issue.icon}</div>
                    <h4 className="font-semibold text-gray-900 mb-1">{issue.title}</h4>
                    <p className="text-sm text-gray-600">{issue.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              {campaignId && (
                <button
                  onClick={() => navigate(`/campaigns/${campaignId}`)}
                  className="w-full flex items-center justify-center px-8 py-4 bg-primary-600 text-white rounded-xl font-semibold text-lg hover:bg-primary-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  <ArrowPathIcon className="h-5 w-5 mr-2" />
                  Try Again
                </button>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Link
                  to="/campaigns"
                  className="flex items-center justify-center px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all"
                >
                  <ArrowLeftIcon className="h-5 w-5 mr-2" />
                  Back to Campaigns
                </Link>
                <Link
                  to="/support"
                  className="flex items-center justify-center px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all"
                >
                  <ChatBubbleLeftRightIcon className="h-5 w-5 mr-2" />
                  Contact Support
                </Link>
              </div>
            </div>

            {/* Help Section */}
            <div className="mt-8 pt-8 border-t">
              <h3 className="font-semibold text-gray-900 mb-3">Need Assistance?</h3>
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-6">
                <p className="text-gray-700 mb-4">
                  If you continue to face issues with payment, please try:
                </p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start">
                    <span className="text-primary-600 mr-2">•</span>
                    <span>Using a different payment method (UPI, Net Banking, Cards)</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary-600 mr-2">•</span>
                    <span>Checking your internet connection</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary-600 mr-2">•</span>
                    <span>Contacting your bank to enable online transactions</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary-600 mr-2">•</span>
                    <span>Trying again after some time</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Contact */}
        <div className="text-center mt-8 bg-white rounded-2xl p-6 shadow-md">
          <p className="text-gray-700 font-medium mb-2">Still having trouble?</p>
          <p className="text-gray-500 text-sm mb-4">Our support team is here to help</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="mailto:support@crowdfund.com" className="text-primary-600 hover:text-primary-700 font-semibold">
              📧 support@crowdfund.com
            </a>
            <a href="tel:+911234567890" className="text-primary-600 hover:text-primary-700 font-semibold">
              📞 +91 123 456 7890
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailure;



