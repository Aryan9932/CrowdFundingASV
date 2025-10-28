import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { campaignAPI } from '../services/api';
import CampaignCard from '../components/CampaignCard';
import { MagnifyingGlassIcon, FunnelIcon } from '@heroicons/react/24/outline';

const CampaignsList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    typeOfCampaign: searchParams.get('typeOfCampaign') || '',
    search: searchParams.get('search') || '',
    status: 'active',
  });

  const categories = [
    'All',
    'Education',
    'Medical',
    'Charity',
    'Technology',
    'Arts',
    'Environment',
    'Community',
    'Other',
  ];

  useEffect(() => {
    fetchCampaigns();
  }, [filters]);

  const fetchCampaigns = async () => {
    setLoading(true);
    try {
      const params = {
        ...(filters.category && filters.category !== 'All' && { category: filters.category }),
        ...(filters.typeOfCampaign && { typeOfCampaign: filters.typeOfCampaign }),
        ...(filters.search && { search: filters.search }),
        status: filters.status,
        page: 1,
        limit: 12,
      };

      const response = await campaignAPI.getCampaigns(params);
      setCampaigns(response.campaigns || []);
    } catch (error) {
      console.error('Error fetching campaigns:', error);
      setCampaigns([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);

    // Update URL params
    const params = new URLSearchParams();
    Object.entries(newFilters).forEach(([k, v]) => {
      if (v && v !== 'All') params.set(k, v);
    });
    setSearchParams(params);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchCampaigns();
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container-custom">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Explore Campaigns
          </h1>
          <p className="text-gray-600">
            Discover and support amazing projects from creators around the world
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="mb-6">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search campaigns..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </form>

          {/* Category Filter */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FunnelIcon className="inline h-4 w-4 mr-1" />
              Category
            </label>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => handleFilterChange('category', cat === 'All' ? '' : cat)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                    (cat === 'All' && !filters.category) || filters.category === cat
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Type Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Campaign Type
            </label>
            <div className="flex space-x-2">
              <button
                onClick={() => handleFilterChange('typeOfCampaign', '')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  !filters.typeOfCampaign
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All Types
              </button>
              <button
                onClick={() => handleFilterChange('typeOfCampaign', 'donation')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  filters.typeOfCampaign === 'donation'
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Donation
              </button>
              <button
                onClick={() => handleFilterChange('typeOfCampaign', 'investment')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  filters.typeOfCampaign === 'investment'
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Investment
              </button>
            </div>
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading campaigns...</p>
          </div>
        ) : campaigns.length > 0 ? (
          <>
            <div className="mb-4 text-gray-600">
              Found {campaigns.length} campaign{campaigns.length !== 1 ? 's' : ''}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {campaigns.map((campaign) => (
                <CampaignCard key={campaign.id} campaign={campaign} />
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg shadow-md">
            <p className="text-gray-500 text-lg mb-4">No campaigns found</p>
            <p className="text-gray-400">Try adjusting your filters or search terms</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CampaignsList;


