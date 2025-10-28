import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  HeartIcon, 
  GiftIcon, 
  ChartBarIcon, 
  BuildingLibraryIcon,
  SparklesIcon,
  CheckBadgeIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';

const BecomeCreator = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const models = [
    {
      key: 'donation',
      title: 'Donation-Based',
      subtitle: 'Give without expecting returns',
      description: 'Perfect for personal causes, charities, community and social impact projects.',
      icon: HeartIcon,
      gradient: 'from-rose-500 to-pink-600',
      bullets: ['Fast setup', 'No repayment', 'Tax-deductible'],
    },
    {
      key: 'reward',
      title: 'Reward-Based',
      subtitle: 'Backers receive perks/products',
      description: 'Launch creative projects and pre-sell products with tiered rewards.',
      icon: GiftIcon,
      gradient: 'from-violet-500 to-indigo-600',
      bullets: ['Tiered rewards', 'Pre-orders', 'Community building'],
    },
    {
      key: 'equity',
      title: 'Equity-Based',
      subtitle: 'Investors get shares',
      description: 'Raise capital for startups or businesses in exchange for equity.',
      icon: ChartBarIcon,
      gradient: 'from-sky-500 to-cyan-600',
      bullets: ['No debt', 'High growth', 'Investor network'],
    },
    {
      key: 'debt',
      title: 'Debt-Based',
      subtitle: 'Peer-to-peer lending',
      description: 'Borrow funds with fixed interest and defined repayment schedule.',
      icon: BuildingLibraryIcon,
      gradient: 'from-emerald-500 to-green-600',
      bullets: ['Keep ownership', 'Fixed terms', 'Credit building'],
    },
  ];

  const handleStart = (type) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    navigate(`/campaigns/create?typeOfCampaign=${type}`);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-50 via-white to-primary-50 pt-20 pb-16">
        <div className="container-custom text-center">
          <div className="inline-flex items-center px-4 py-2 bg-primary-100 rounded-full mb-6">
            <SparklesIcon className="h-5 w-5 text-primary-600 mr-2" />
            <span className="text-sm font-semibold text-primary-700">Launch your project</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">Become a Creator</h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            Choose the funding model that fits your vision. Create, share and raise funds — all in one place.
          </p>
        </div>
      </section>

      {/* Models */}
      <section className="py-12">
        <div className="container-custom grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {models.map((m) => (
            <div key={m.key} className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100">
              <div className={`h-36 bg-gradient-to-br ${m.gradient} p-6 text-white relative`}>
                <m.icon className="h-10 w-10 opacity-90" />
                <div className="absolute -bottom-6 right-6 w-16 h-16 bg-white/20 rounded-xl rotate-6" />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900">{m.title}</h3>
                <div className="text-sm text-gray-500 mb-2">{m.subtitle}</div>
                <p className="text-gray-600 mb-4">{m.description}</p>
                <ul className="text-sm text-gray-700 space-y-1 mb-6">
                  {m.bullets.map((b, i) => (
                    <li key={i} className="flex items-center"><CheckBadgeIcon className="h-4 w-4 text-primary-600 mr-2" />{b}</li>
                  ))}
                </ul>
                <button
                  onClick={() => handleStart(m.key)}
                  className="w-full py-3 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 transition"
                >
                  Start with {m.title}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Steps */}
      <section className="py-12 bg-gray-50 border-t">
        <div className="container-custom">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">How it works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[ 
              { step: '1', title: 'Tell your story', desc: 'Add title, description, media and goals.' },
              { step: '2', title: 'Choose model', desc: 'Pick donation, reward, equity or debt.' },
              { step: '3', title: 'Launch & share', desc: 'Promote your campaign and start raising.' },
            ].map((s) => (
              <div key={s.step} className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
                <div className="text-5xl font-extrabold text-primary-600">{s.step}</div>
                <div className="mt-3 text-xl font-semibold text-gray-900">{s.title}</div>
                <div className="text-gray-600">{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12">
        <div className="container-custom bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-8 text-white text-center">
          <h3 className="text-2xl md:text-3xl font-bold mb-2">Ready to launch your project?</h3>
          <p className="text-primary-100 mb-6">It takes less than 5 minutes to set up your campaign.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/campaigns/create" className="px-8 py-3 bg-white text-primary-600 rounded-xl font-semibold hover:bg-gray-100 transition">Create Campaign</Link>
            <Link to="/campaigns" className="px-8 py-3 border-2 border-white rounded-xl font-semibold hover:bg-white hover:text-primary-700 transition">Explore Campaigns</Link>
          </div>
          <div className="mt-6 flex items-center justify-center text-sm text-primary-100">
            <ShieldCheckIcon className="h-5 w-5 mr-2" /> Secure • Verified • 24/7 Support
          </div>
        </div>
      </section>
    </div>
  );
};

export default BecomeCreator;
