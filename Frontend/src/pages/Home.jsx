import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { campaignAPI } from '../services/api';
import CampaignCard from '../components/CampaignCard';
import {
  SparklesIcon,
  RocketLaunchIcon,
  UserGroupIcon,
  CurrencyDollarIcon,
  CheckBadgeIcon,
  GlobeAltIcon,
  HeartIcon,
  ChartBarIcon,
  BanknotesIcon,
  BuildingLibraryIcon,
  GiftIcon,
  TrophyIcon,
} from '@heroicons/react/24/outline';

const Home = () => {
  const [trendingCampaigns, setTrendingCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTrendingCampaigns();
  }, []);

  const fetchTrendingCampaigns = async () => {
    try {
      const response = await campaignAPI.getTrendingCampaigns(6);
      setTrendingCampaigns(response.campaigns || []);
    } catch (error) {
      console.error('Error fetching trending campaigns:', error);
      setTrendingCampaigns([]);
    } finally {
      setLoading(false);
    }
  };

  // Four Funding Models
  const fundingModels = [
    {
      type: 'donation',
      icon: HeartIcon,
      title: 'Donation-Based',
      subtitle: 'Give Without Expecting Returns',
      description: 'Support causes you believe in - personal needs, charities, and community projects',
      color: 'from-red-500 to-pink-600',
      bgColor: 'bg-red-50',
      textColor: 'text-red-600',
      features: ['No repayment required', 'Tax deductible', 'Make a difference'],
      examples: ['Medical bills', 'Education', 'Disaster relief'],
    },
    {
      type: 'reward',
      icon: GiftIcon,
      title: 'Reward-Based',
      subtitle: 'Back Creative Projects',
      description: 'Support innovative products and get exclusive rewards, perks, or early access',
      color: 'from-purple-500 to-indigo-600',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600',
      features: ['Exclusive rewards', 'Pre-order products', 'Be first to try'],
      examples: ['Tech gadgets', 'Games', 'Creative arts'],
    },
    {
      type: 'equity',
      icon: ChartBarIcon,
      title: 'Equity-Based',
      subtitle: 'Invest in Startups',
      description: 'Invest in promising startups and businesses in exchange for equity shares',
      color: 'from-blue-500 to-cyan-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
      features: ['Own equity shares', 'Potential returns', 'Support innovation'],
      examples: ['Startups', 'Scale-ups', 'Growth companies'],
    },
    {
      type: 'debt',
      icon: BuildingLibraryIcon,
      title: 'Debt-Based',
      subtitle: 'Peer-to-Peer Lending',
      description: 'Lend money to entrepreneurs and businesses, earn interest on your investment',
      color: 'from-green-500 to-emerald-600',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600',
      features: ['Fixed interest returns', 'Defined repayment', 'Lower risk'],
      examples: ['Small business loans', 'Expansion capital', 'Working capital'],
    },
  ];

  const categories = [
    { name: 'Education', icon: '📚', color: 'from-blue-400 to-blue-600', count: '2.5K+' },
    { name: 'Medical', icon: '⚕️', color: 'from-red-400 to-red-600', count: '3.2K+' },
    { name: 'Technology', icon: '💻', color: 'from-purple-400 to-purple-600', count: '1.8K+' },
    { name: 'Arts', icon: '🎨', color: 'from-pink-400 to-pink-600', count: '1.2K+' },
    { name: 'Environment', icon: '🌱', color: 'from-green-400 to-green-600', count: '890+' },
    { name: 'Community', icon: '🏘️', color: 'from-orange-400 to-orange-600', count: '1.5K+' },
  ];

  const stats = [
    { icon: RocketLaunchIcon, value: '15,000+', label: 'Active Campaigns', color: 'text-blue-600' },
    { icon: UserGroupIcon, value: '250,000+', label: 'Active Users', color: 'text-green-600' },
    { icon: CurrencyDollarIcon, value: '$50M+', label: 'Total Raised', color: 'text-purple-600' },
    { icon: TrophyIcon, value: '98%', label: 'Success Rate', color: 'text-orange-600' },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-50 via-white to-primary-50 pt-20 pb-32 overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(0,0,0,0.15) 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }}></div>
        </div>

        <div className="container-custom relative">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-primary-100 to-purple-100 rounded-full mb-8">
              <SparklesIcon className="h-5 w-5 text-primary-600 mr-2" />
              <span className="text-sm font-semibold text-gray-700">
                4 Funding Models • One Platform • Unlimited Possibilities
              </span>
            </div>

            <h1 className="text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              The Complete
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 via-purple-600 to-pink-600"> Crowdfunding </span>
              Ecosystem
            </h1>

            <p className="text-xl text-gray-600 mb-12 leading-relaxed max-w-3xl mx-auto">
              Whether you're seeking donations, offering rewards, raising equity, or providing loans - 
              we've got the perfect funding model for your needs.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link
                to="/campaigns/create"
                className="group relative px-10 py-5 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-2xl font-bold text-lg shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 transition-all duration-300"
              >
                <span className="relative z-10">Start Your Campaign</span>
                <div className="absolute inset-0 bg-gradient-to-r from-primary-700 to-primary-800 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </Link>
              <Link
                to="/campaigns"
                className="px-10 py-5 bg-white border-2 border-gray-300 text-gray-700 rounded-2xl font-bold text-lg hover:border-primary-600 hover:text-primary-600 transition-all duration-300 shadow-lg"
              >
                Explore Opportunities
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 4 Funding Models - Main Feature */}
      <section className="py-20 bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-gray-900 mb-4">
              Choose Your Funding Model
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Different goals need different approaches. Select the model that fits your project perfectly.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {fundingModels.map((model, index) => (
              <Link
                key={index}
                to={`/campaigns?type=${model.type}`}
                className="group relative bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3"
              >
                {/* Gradient Header */}
                <div className={`h-48 bg-gradient-to-br ${model.color} p-8 relative overflow-hidden`}>
                  <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="relative z-10">
                    <model.icon className="h-16 w-16 text-white mb-4 transform group-hover:scale-110 transition-transform" />
                    <h3 className="text-2xl font-bold text-white mb-1">{model.title}</h3>
                    <p className="text-white/90 text-sm font-medium">{model.subtitle}</p>
                  </div>
                  
                  {/* Decorative Circle */}
                  <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-white/20 rounded-full"></div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {model.description}
                  </p>

                  {/* Features */}
                  <div className="space-y-3 mb-6">
                    {model.features.map((feature, i) => (
                      <div key={i} className="flex items-center text-sm">
                        <CheckBadgeIcon className={`h-5 w-5 mr-2 ${model.textColor}`} />
                        <span className="text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* Examples */}
                  <div className={`${model.bgColor} rounded-xl p-4`}>
                    <div className="text-xs font-semibold text-gray-500 uppercase mb-2">Popular For:</div>
                    <div className="flex flex-wrap gap-2">
                      {model.examples.map((example, i) => (
                        <span key={i} className={`text-xs ${model.textColor} font-medium px-3 py-1 bg-white rounded-full`}>
                          {example}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* CTA */}
                  <div className="mt-6">
                    <div className={`flex items-center justify-center ${model.textColor} font-semibold group-hover:gap-3 gap-2 transition-all`}>
                      <span>Explore {model.title}</span>
                      <svg className="w-5 h-5 transform group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* AI-Powered Recommendation */}
          <div className="mt-16 bg-gradient-to-r from-gray-900 to-gray-800 rounded-3xl p-10 text-white text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-6">
              <SparklesIcon className="h-10 w-10 text-white" />
            </div>
            <h3 className="text-3xl font-bold mb-4">Not sure which model to choose?</h3>
            <p className="text-gray-300 mb-6 text-lg">
              Our AI-powered recommendation tool analyzes your needs and suggests the perfect funding model
            </p>
            <Link
              to="/funding-guide"
              className="inline-flex items-center px-8 py-4 bg-white text-gray-900 font-bold rounded-xl hover:bg-gray-100 transition-all shadow-lg transform hover:-translate-y-1"
            >
              <SparklesIcon className="h-5 w-5 mr-2" />
              Get AI-Powered Recommendation →
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white border-y border-gray-200">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center transform hover:scale-105 transition-transform duration-300">
                <stat.icon className={`h-12 w-12 mx-auto mb-4 ${stat.color}`} />
                <div className="text-4xl font-bold text-gray-900 mb-2">{stat.value}</div>
                <div className="text-sm text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Browse by Category
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Find opportunities across all funding models and industries
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {categories.map((category, index) => (
              <Link
                key={index}
                to={`/campaigns?category=${category.name}`}
                className="group relative overflow-hidden bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
                <div className="relative p-8 text-center">
                  <div className="text-5xl mb-4 transform group-hover:scale-110 transition-transform duration-300">
                    {category.icon}
                  </div>
                  <div className="font-semibold text-gray-900 mb-2 group-hover:text-white transition-colors">
                    {category.name}
                  </div>
                  <div className="text-sm text-gray-500 group-hover:text-white transition-colors">
                    {category.count} active
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Trending Campaigns */}
      <section className="py-20 bg-white">
        <div className="container-custom">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-2">
                Trending Campaigns
              </h2>
              <p className="text-lg text-gray-600">Opportunities people are backing right now</p>
            </div>
            <Link
              to="/campaigns"
              className="hidden md:flex items-center text-primary-600 hover:text-primary-700 font-semibold group"
            >
              View All
              <svg className="w-5 h-5 ml-2 transform group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-16">
              <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-primary-600"></div>
              <p className="mt-4 text-gray-600 font-medium">Loading opportunities...</p>
            </div>
          ) : trendingCampaigns.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {trendingCampaigns.map((campaign) => (
                <CampaignCard key={campaign.id} campaign={campaign} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-gray-50 rounded-3xl">
              <RocketLaunchIcon className="h-20 w-20 text-gray-300 mx-auto mb-4" />
              <p className="text-xl text-gray-500 mb-2">No campaigns yet</p>
              <p className="text-gray-400 mb-6">Be the first to launch your campaign!</p>
              <Link
                to="/campaigns/create"
                className="inline-block px-8 py-3 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 transition"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* How Each Model Works */}
      <section className="py-20 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold mb-4">How Each Model Works</h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Understand the mechanics of each funding model
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {fundingModels.map((model, index) => (
              <div key={index} className="bg-gray-800/50 backdrop-blur rounded-2xl p-8 border border-gray-700 hover:border-primary-500 transition-all">
                <div className="flex items-start mb-6">
                  <div className={`p-3 bg-gradient-to-br ${model.color} rounded-xl mr-4`}>
                    <model.icon className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-2">{model.title}</h3>
                    <p className="text-gray-400">{model.subtitle}</p>
                  </div>
                </div>
                <p className="text-gray-300 leading-relaxed mb-4">
                  {model.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {model.features.map((feature, i) => (
                    <span key={i} className="text-xs bg-gray-700 text-gray-300 px-3 py-1 rounded-full">
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 via-purple-600 to-pink-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
            backgroundSize: '30px 30px'
          }}></div>
        </div>

        <div className="container-custom relative text-center">
          <h2 className="text-5xl font-bold mb-6">
            Ready to Fund Your Vision?
          </h2>
          <p className="text-2xl mb-10 text-white/90 max-w-3xl mx-auto">
            Join the future of funding. Choose your model, launch your campaign, and achieve your goals.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link
              to="/register"
              className="px-10 py-5 bg-white text-primary-600 rounded-2xl font-bold text-lg hover:bg-gray-100 transition-all duration-300 shadow-2xl transform hover:-translate-y-1"
            >
              Create Free Account
            </Link>
            <Link
              to="/campaigns"
              className="px-10 py-5 bg-transparent border-2 border-white text-white rounded-2xl font-bold text-lg hover:bg-white hover:text-primary-600 transition-all duration-300"
            >
              Browse All Campaigns
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
