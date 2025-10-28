import React from 'react';
import { Link } from 'react-router-dom';
import { HeartIcon, UserGroupIcon, MapPinIcon, ClockIcon, FireIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';

const CampaignCard = ({ campaign, onLike, featured = false }) => {
  const {
    id,
    title,
    description,
    goal_amount,
    raised_amount = 0,
    category,
    location,
    media,
    likes = 0,
    backers_count = 0,
    status,
    created_at,
  } = campaign;

  const percentageRaised = goal_amount > 0 ? Math.min((raised_amount / goal_amount) * 100, 100) : 0;
  const imageUrl = media?.images?.[0] || 'https://images.unsplash.com/photo-1559521783-1d1599583485?w=800';

  // Calculate days left (mock for now)
  const daysLeft = 30;
  const isHot = percentageRaised > 75;

  const getCategoryColor = (cat) => {
    const colors = {
      Education: 'bg-blue-500',
      Medical: 'bg-red-500',
      Charity: 'bg-green-500',
      Technology: 'bg-purple-500',
      Arts: 'bg-pink-500',
      Environment: 'bg-teal-500',
      Community: 'bg-orange-500',
      Other: 'bg-gray-500',
    };
    return colors[cat] || colors.Other;
  };

  return (
    <div className={`group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 ${featured ? 'ring-2 ring-yellow-400' : ''}`}>
      {/* Image Container */}
      <Link to={`/campaigns/${id}`} className="block relative overflow-hidden aspect-[16/10]">
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
        />
        
        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        {/* Category Badge */}
        <div className={`absolute top-4 left-4 ${getCategoryColor(category)} text-white px-4 py-2 rounded-full text-xs font-bold shadow-lg backdrop-blur-sm bg-opacity-90`}>
          {category}
        </div>

        {/* Hot Badge */}
        {isHot && (
          <div className="absolute top-4 right-4 bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-full text-xs font-bold shadow-lg animate-pulse flex items-center">
            <FireIcon className="h-4 w-4 mr-1" />
            HOT
          </div>
        )}

        {/* Featured Badge */}
        {featured && (
          <div className="absolute bottom-4 right-4 bg-yellow-400 text-gray-900 px-4 py-2 rounded-full text-xs font-bold shadow-lg">
            ⭐ Featured
          </div>
        )}
      </Link>

      {/* Content */}
      <div className="p-6">
        {/* Creator Info */}
        <div className="flex items-center mb-4">
          <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white font-bold">
            {title.charAt(0)}
          </div>
          <div className="ml-3">
            <div className="text-sm font-semibold text-gray-900">Creator Name</div>
            {location && (
              <div className="flex items-center text-xs text-gray-500">
                <MapPinIcon className="h-3 w-3 mr-1" />
                {location}
              </div>
            )}
          </div>
        </div>

        {/* Title */}
        <Link to={`/campaigns/${id}`}>
          <h3 className="text-xl font-bold text-gray-900 mb-3 hover:text-primary-600 transition-colors line-clamp-2 leading-tight">
            {title}
          </h3>
        </Link>

        {/* Description */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
          {description}
        </p>

        {/* Progress Section */}
        <div className="mb-4">
          {/* Progress Bar */}
          <div className="relative w-full bg-gray-200 rounded-full h-3 mb-3 overflow-hidden">
            <div
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary-500 to-primary-600 rounded-full transition-all duration-500 shadow-inner"
              style={{ width: `${percentageRaised}%` }}
            >
              <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="space-y-1">
            <div className="flex justify-between items-baseline">
              <div>
                <span className="font-bold text-gray-900 text-2xl">
                  ₹{(raised_amount / 1000).toFixed(0)}K
                </span>
                <span className="text-gray-500 text-sm ml-1">raised</span>
              </div>
              <div className="text-sm text-gray-600">
                of <span className="font-bold text-gray-900">₹{(goal_amount / 1000).toFixed(0)}K</span> goal
              </div>
            </div>
            <div className="flex justify-between text-sm">
              <div className="flex items-center text-gray-600">
                <UserGroupIcon className="h-4 w-4 mr-1" />
                <span className="font-semibold">{backers_count || 0}</span>
                <span className="ml-1 text-gray-500">backers</span>
              </div>
              <div className="flex items-center text-gray-600">
                <ClockIcon className="h-4 w-4 mr-1" />
                <span className="font-semibold">{daysLeft}</span>
                <span className="ml-1 text-gray-500">days to go</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Stats */}
        <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
          {/* Likes */}
          <button
            onClick={() => onLike && onLike(id)}
            className="flex items-center text-gray-600 hover:text-red-500 transition-colors group"
          >
            <HeartIcon className="h-5 w-5 mr-1 group-hover:scale-110 transition-transform" />
            <span className="font-semibold">{likes || 0}</span>
          </button>

          {/* View Button */}
          <Link
            to={`/campaigns/${id}`}
            className="px-6 py-2 bg-primary-600 text-white rounded-lg font-semibold text-sm hover:bg-primary-700 transition-all transform hover:scale-105"
          >
            Back this project
          </Link>
        </div>
      </div>

      {/* Hover Effect - Quick Actions */}
      <div className="absolute inset-0 bg-primary-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
    </div>
  );
};

export default CampaignCard;
