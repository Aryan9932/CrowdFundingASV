import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { 
  CheckCircleIcon, 
  ArrowRightIcon,
  DocumentTextIcon,
  ShareIcon,
  HeartIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [confetti, setConfetti] = useState(true);

  const paymentId = searchParams.get('payment_id');
  const orderId = searchParams.get('order_id');
  const campaignId = searchParams.get('campaign_id');
  const amount = searchParams.get('amount');

  useEffect(() => {
    // Hide confetti after 5 seconds
    const timer = setTimeout(() => setConfetti(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-primary-50 py-16 px-4 relative overflow-hidden">
      {/* Animated Background */}
      {confetti && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="confetti-container">
            {[...Array(50)].map((_, i) => (
              <div
                key={i}
                className="confetti"
                style={{
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 3}s`,
                  backgroundColor: ['#10b981', '#3b82f6', '#ec4899', '#f59e0b'][Math.floor(Math.random() * 4)]
                }}
              />
            ))}
          </div>
        </div>
      )}

      <div className="container-custom max-w-3xl mx-auto">
        {/* Success Card */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Header with Gradient */}
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-12 text-center relative">
            <div className="absolute inset-0 bg-black/10 opacity-20"></div>
            <div className="relative z-10">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-white rounded-full mb-6 shadow-2xl">
                <CheckCircleIcon className="h-16 w-16 text-green-500" />
              </div>
              <h1 className="text-4xl font-bold mb-3">Payment Successful!</h1>
              <p className="text-xl text-green-100">
                Thank you for your contribution 🎉
              </p>
            </div>
            
            {/* Decorative Elements */}
            <div className="absolute top-4 left-4 text-6xl opacity-20">🎊</div>
            <div className="absolute bottom-4 right-4 text-6xl opacity-20">🎉</div>
          </div>

          {/* Payment Details */}
          <div className="p-10">
            <div className="bg-gray-50 rounded-2xl p-6 mb-8">
              <h2 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
                <DocumentTextIcon className="h-5 w-5 mr-2 text-gray-500" />
                Payment Details
              </h2>
              
              <div className="space-y-3">
                {amount && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Amount Paid</span>
                    <span className="text-2xl font-bold text-green-600">₹{amount}</span>
                  </div>
                )}
                {paymentId && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Payment ID</span>
                    <span className="text-sm font-mono text-gray-900 bg-white px-3 py-1 rounded-lg">
                      {paymentId}
                    </span>
                  </div>
                )}
                {orderId && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Order ID</span>
                    <span className="text-sm font-mono text-gray-900 bg-white px-3 py-1 rounded-lg">
                      {orderId}
                    </span>
                  </div>
                )}
                <div className="flex justify-between items-center pt-3 border-t">
                  <span className="text-gray-600">Transaction Date</span>
                  <span className="text-gray-900 font-medium">
                    {new Date().toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
              </div>
            </div>

            {/* Success Message */}
            <div className="bg-green-50 border border-green-200 rounded-2xl p-6 mb-8">
              <div className="flex items-start">
                <SparklesIcon className="h-6 w-6 text-green-600 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-green-900 mb-2">
                    Your contribution is making a difference!
                  </h3>
                  <p className="text-sm text-green-700 leading-relaxed">
                    A confirmation email with your receipt and payment details has been sent to your registered email address. 
                    You can view your contribution history in your profile dashboard.
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="space-y-4">
              {campaignId && (
                <Link
                  to={`/campaigns/${campaignId}`}
                  className="w-full flex items-center justify-center px-8 py-4 bg-primary-600 text-white rounded-xl font-semibold text-lg hover:bg-primary-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  View Campaign
                  <ArrowRightIcon className="h-5 w-5 ml-2" />
                </Link>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Link
                  to="/profile"
                  className="flex items-center justify-center px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all"
                >
                  <DocumentTextIcon className="h-5 w-5 mr-2" />
                  My Contributions
                </Link>
                <Link
                  to="/campaigns"
                  className="flex items-center justify-center px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all"
                >
                  <HeartIcon className="h-5 w-5 mr-2" />
                  Explore More
                </Link>
              </div>
            </div>

            {/* Share Section */}
            <div className="mt-8 pt-8 border-t text-center">
              <p className="text-gray-600 mb-4">Help spread the word!</p>
              <button className="inline-flex items-center px-6 py-3 bg-blue-50 text-blue-600 rounded-xl font-semibold hover:bg-blue-100 transition-all">
                <ShareIcon className="h-5 w-5 mr-2" />
                Share This Campaign
              </button>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="text-center mt-8 text-gray-500 text-sm">
          <p>Need help? Contact our support team at support@crowdfund.com</p>
        </div>
      </div>

      {/* Confetti CSS */}
      <style>{`
        @keyframes confetti-fall {
          0% {
            transform: translateY(-100vh) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }
        
        .confetti {
          position: absolute;
          width: 10px;
          height: 10px;
          top: -10px;
          animation: confetti-fall 4s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default PaymentSuccess;

