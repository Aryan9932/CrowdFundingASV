import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { campaignAPI } from '../services/api';
import CampaignCard from '../components/CampaignCard';
import {
  PlusCircleIcon,
  RocketLaunchIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  EyeIcon,
  PencilIcon
} from '@heroicons/react/24/outline';

const MyCampaigns = () => {
  const { user, isAuthenticated } = useAuth();
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, active, completed, draft

  useEffect(() => {
    if (isAuthenticated) {
      fetchMyCampaigns();
    }
  }, [isAuthenticated]);

  const fetchMyCampaigns = async () => {
    try {
      setLoading(true);
      // This endpoint needs to be created in your backend
      const response = await campaignAPI.getMyCampaigns();
      setCampaigns(response.campaigns || []);
    } catch (error) {
      console.error('Error fetching my campaigns:', error);
      setCampaigns([]);
    } finally {
      setLoading(false);
    }
  };

  const filterCampaigns = () => {
    if (filter === 'all') return campaigns;
    
    return campaigns.filter(campaign => {
      const now = new Date();
      const endDate = new Date(campaign.endDate);
      
      switch (filter) {
        case 'active':
          return endDate > now && campaign.status === 'active';
        case 'completed':
          return endDate <= now || campaign.status === 'completed';
        case 'draft':
          return campaign.status === 'draft';
        default:
          return true;
      }
    });
  };

  const filteredCampaigns = filterCampaigns();

  const stats = {
    total: campaigns.length,
    active: campaigns.filter(c => {
      const endDate = new Date(c.endDate);
      return endDate > new Date() && c.status === 'active';
    }).length,
    completed: campaigns.filter(c => {
      const endDate = new Date(c.endDate);
      return endDate <= new Date() || c.status === 'completed';
    }).length,
    draft: campaigns.filter(c => c.status === 'draft').length
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Please log in</h2>
          <p className="text-gray-600 mb-8">You need to be logged in to view your campaigns</p>
          <Link
            to="/login"
            className="inline-block px-8 py-3 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 transition"
          >
            Log In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container-custom">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">My Campaigns</h1>
              <p className="text-gray-600">Manage and track all your crowdfunding projects</p>
            </div>
            <Link
              to="/campaigns/create"
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all"
            >
              <PlusCircleIcon className="h-5 w-5" />
              Create New Campaign
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-md border-2 border-transparent hover:border-primary-500 transition-all cursor-pointer" onClick={() => setFilter('all')}>
            <RocketLaunchIcon className="h-8 w-8 text-blue-600 mb-2" />
            <div className="text-3xl font-bold text-gray-900">{stats.total}</div>
            <div className="text-sm text-gray-600">Total Campaigns</div>
          </div>
          
          <div className="bg-white rounded-2xl p-6 shadow-md border-2 border-transparent hover:border-green-500 transition-all cursor-pointer" onClick={() => setFilter('active')}>
            <ClockIcon className="h-8 w-8 text-green-600 mb-2" />
            <div className="text-3xl font-bold text-gray-900">{stats.active}</div>
            <div className="text-sm text-gray-600">Active</div>
          </div>
          
          <div className="bg-white rounded-2xl p-6 shadow-md border-2 border-transparent hover:border-purple-500 transition-all cursor-pointer" onClick={() => setFilter('completed')}>
            <CheckCircleIcon className="h-8 w-8 text-purple-600 mb-2" />
            <div className="text-3xl font-bold text-gray-900">{stats.completed}</div>
            <div className="text-sm text-gray-600">Completed</div>
          </div>
          
          <div className="bg-white rounded-2xl p-6 shadow-md border-2 border-transparent hover:border-orange-500 transition-all cursor-pointer" onClick={() => setFilter('draft')}>
            <PencilIcon className="h-8 w-8 text-orange-600 mb-2" />
            <div className="text-3xl font-bold text-gray-900">{stats.draft}</div>
            <div className="text-sm text-gray-600">Drafts</div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white rounded-2xl shadow-md p-2 mb-8 inline-flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-6 py-2 rounded-xl font-semibold transition-all ${
              filter === 'all'
                ? 'bg-primary-600 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            All ({stats.total})
          </button>
          <button
            onClick={() => setFilter('active')}
            className={`px-6 py-2 rounded-xl font-semibold transition-all ${
              filter === 'active'
                ? 'bg-green-600 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Active ({stats.active})
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`px-6 py-2 rounded-xl font-semibold transition-all ${
              filter === 'completed'
                ? 'bg-purple-600 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Completed ({stats.completed})
          </button>
          <button
            onClick={() => setFilter('draft')}
            className={`px-6 py-2 rounded-xl font-semibold transition-all ${
              filter === 'draft'
                ? 'bg-orange-600 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Drafts ({stats.draft})
          </button>
        </div>

        {/* Campaigns Grid */}
        {loading ? (
          <div className="text-center py-16">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-primary-600"></div>
            <p className="mt-4 text-gray-600 font-medium">Loading your campaigns...</p>
          </div>
        ) : filteredCampaigns.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCampaigns.map((campaign) => (
              <div key={campaign.id} className="relative">
                <CampaignCard campaign={campaign} />
                <div className="mt-3 flex gap-2">
                  <Link
                    to={`/campaigns/${campaign.id}`}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 transition text-sm"
                  >
                    <EyeIcon className="h-4 w-4" />
                    View
                  </Link>
                  <Link
                    to={`/campaigns/${campaign.id}/edit`}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-xl font-semibold hover:bg-gray-700 transition text-sm"
                  >
                    <PencilIcon className="h-4 w-4" />
                    Edit
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-3xl shadow-md">
            <RocketLaunchIcon className="h-20 w-20 text-gray-300 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              {filter === 'all' ? 'No campaigns yet' : `No ${filter} campaigns`}
            </h3>
            <p className="text-gray-600 mb-8">
              {filter === 'all' 
                ? "Ready to bring your ideas to life? Create your first campaign!"
                : `You don't have any ${filter} campaigns at the moment.`
              }
            </p>
            {filter === 'all' && (
              <Link
                to="/campaigns/create"
                className="inline-flex items-center gap-2 px-8 py-3 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 transition"
              >
                <PlusCircleIcon className="h-5 w-5" />
                Create Your First Campaign
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyCampaigns;


