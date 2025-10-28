import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { campaignAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
// import PaymentModal from '../components/PaymentModal'; // Disabled for now
import {
  HeartIcon,
  MapPinIcon,
  CalendarIcon,
  UserGroupIcon,
  ShareIcon,
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';

const CampaignDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  // const [showPaymentModal, setShowPaymentModal] = useState(false); // Disabled for now

  useEffect(() => {
    fetchCampaignDetail();
  }, [id]);

  const fetchCampaignDetail = async () => {
    try {
      const response = await campaignAPI.getCampaignById(id);
      setCampaign(response.campaign);
    } catch (error) {
      console.error('Error fetching campaign:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = (result) => {
    alert(`Payment successful! Transaction ID: ${result.paymentId}`);
    fetchCampaignDetail(); // Refresh campaign data
  };

  const handleLike = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    try {
      await campaignAPI.toggleLike(id, user.id);
      fetchCampaignDetail();
    } catch (error) {
      console.error('Error liking campaign:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Campaign not found</h2>
          <button
            onClick={() => navigate('/campaigns')}
            className="text-primary-600 hover:text-primary-700"
          >
            Back to campaigns
          </button>
        </div>
      </div>
    );
  }

  const percentageRaised = campaign.goal_amount > 0
    ? Math.min((campaign.raised_amount / campaign.goal_amount) * 100, 100)
    : 0;

  const daysLeft = campaign.deadline
    ? Math.max(0, Math.ceil((new Date(campaign.deadline) - new Date()) / (1000 * 60 * 60 * 24)))
    : 0;

  // Currency helpers (fallback to INR)
  const currencySymbol = campaign.currency_symbol || '₹';
  const formatCurrency = (n) => `${currencySymbol}${(n || 0).toLocaleString()}`;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Image/Video */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
              {campaign.media?.video ? (
                <video controls className="w-full h-96 object-cover">
                  <source src={campaign.media.video} type="video/mp4" />
                </video>
              ) : (
                <img
                  src={campaign.media?.images?.[0] || 'https://via.placeholder.com/800x400'}
                  alt={campaign.title}
                  className="w-full h-96 object-cover"
                />
              )}
            </div>

            {/* Gallery */}
            {campaign.media?.images?.length > 1 && (
              <div className="grid grid-cols-4 gap-2 mb-6">
                {campaign.media.images.slice(1).map((img, index) => (
                  <img
                    key={index}
                    src={img}
                    alt={`Gallery ${index + 1}`}
                    className="w-full h-24 object-cover rounded-lg cursor-pointer hover:opacity-75 transition"
                  />
                ))}
              </div>
            )}

            {/* Campaign Info */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <span className="inline-block px-3 py-1 bg-primary-100 text-primary-800 text-sm font-semibold rounded-full mb-2">
                    {campaign.category}
                  </span>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {campaign.title}
                  </h1>
                </div>
                <button
                  onClick={handleLike}
                  className="flex items-center space-x-1 text-gray-600 hover:text-red-500 transition"
                >
                  <HeartIcon className="h-6 w-6" />
                  <span>{campaign.likes || 0}</span>
                </button>
              </div>

              <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-6">
                {campaign.location && (
                  <div className="flex items-center">
                    <MapPinIcon className="h-5 w-5 mr-1" />
                    {campaign.location}
                  </div>
                )}
                <div className="flex items-center">
                  <UserGroupIcon className="h-5 w-5 mr-1" />
                  {campaign.backers?.length || 0} backers
                </div>
                <div className="flex items-center">
                  <CalendarIcon className="h-5 w-5 mr-1" />
                  {daysLeft} days left
                </div>
              </div>

              <h2 className="text-xl font-semibold mb-3">About this campaign</h2>
              <p className="text-gray-700 whitespace-pre-line leading-relaxed">
                {campaign.description}
              </p>
            </div>

            {/* Rewards */}
            {campaign.rewards && campaign.rewards.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4">Rewards</h2>
                <div className="space-y-4">
                  {campaign.rewards.map((reward, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-lg">
                          {formatCurrency(reward.amount)}
                        </h3>
                      </div>
                      <p className="text-gray-600">{reward.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar (Indiegogo-like pledge box) */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24">
              {/* Amount & Goal */}
              <div className="mb-5">
                <div className="text-2xl font-extrabold text-gray-900">
                  {formatCurrency(campaign.raised_amount)}
                </div>
                <div className="text-xs uppercase tracking-wide text-gray-500 mt-1">
                  Goal: {formatCurrency(campaign.goal_amount)}
                </div>

                {/* Progress */}
                <div className="mt-3">
                  <div className="w-full h-2 rounded-full bg-gray-200 overflow-hidden">
                    <div
                      className="h-2 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 transition-all"
                      style={{ width: `${percentageRaised}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-600 mt-1">
                    <span>{percentageRaised.toFixed(0)}% funded</span>
                    <span>{daysLeft} days left</span>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 mb-6 text-center">
                <div>
                  <div className="text-xl font-bold text-gray-900">
                    {campaign.backers?.length || 0}
                  </div>
                  <div className="text-xs text-gray-600">backers</div>
                </div>
                <div>
                  <div className="text-xl font-bold text-gray-900">
                    {daysLeft}
                  </div>
                  <div className="text-xs text-gray-600">days left</div>
                </div>
              </div>

              {/* Primary CTA */}
              <button
                onClick={() => {
                  if (!isAuthenticated) {
                    navigate('/login');
                  } else {
                    // Payment feature coming soon
                    alert('Payment feature coming soon! Set up Razorpay to enable payments.');
                  }
                }}
                className="w-full py-3 rounded-md font-semibold text-white bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 transition shadow-md mb-3"
              >
                {campaign.type_of_campaign === 'donation' && 'BACK THIS PROJECT'}
                {campaign.type_of_campaign === 'reward' && 'BACK THIS PROJECT'}
                {campaign.type_of_campaign === 'equity' && 'INVEST NOW'}
                {campaign.type_of_campaign === 'debt' && 'LEND TO THIS PROJECT'}
              </button>

              {/* Follow */}
              <button
                className="w-full py-3 rounded-md font-semibold bg-violet-50 text-violet-700 hover:bg-violet-100 transition mb-3"
              >
                FOLLOW
              </button>

              {/* Share */}
              <button
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: campaign.title,
                      text: campaign.description,
                      url: window.location.href,
                    });
                  } else {
                    navigator.clipboard.writeText(window.location.href);
                    alert('Link copied to clipboard!');
                  }
                }}
                className="w-full border border-gray-300 text-gray-700 py-3 rounded-md font-semibold hover:bg-gray-50 transition flex items-center justify-center"
              >
                <ShareIcon className="h-5 w-5 mr-2" />
                Share
              </button>

              {/* Meta */}
              <div className="mt-6 pt-6 border-t">
                <div className="text-xs text-gray-600">
                  <strong>Type:</strong> <span className="capitalize">{campaign.type_of_campaign}</span>
                </div>
                <div className="text-xs text-gray-600 mt-2">
                  <strong>Status:</strong> <span className="capitalize text-green-600">{campaign.status}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Modal - Disabled for now */}
      {/* <PaymentModal
        campaign={campaign}
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        onSuccess={handlePaymentSuccess}
      /> */}
    </div>
  );
};

export default CampaignDetail;

