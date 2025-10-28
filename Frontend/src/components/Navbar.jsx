import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Bars3Icon, 
  XMarkIcon, 
  UserCircleIcon,
  HeartIcon,
  PlusCircleIcon,
  ArrowRightOnRectangleIcon,
  MagnifyingGlassIcon,
  BellIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);

  // Categories for navigation
  const categories = [
    'Art', 'Comics', 'Crafts', 'Dance', 'Design', 'Fashion', 'Film', 'Food', 
    'Games', 'Journalism', 'Music', 'Photography', 'Publishing', 'Technology', 'Theater'
  ];

  // Detect scroll for navbar background change
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
    setProfileMenuOpen(false);
  };

  const submitSearch = (e) => {
    e.preventDefault();
    const q = searchQuery.trim();
    if (!q) return;
    navigate(`/campaigns?search=${encodeURIComponent(q)}`);
    setMobileMenuOpen(false);
    setSearchFocused(false);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-white shadow-lg' : 'bg-white/95 backdrop-blur-md shadow-md'
    }`}>
      <div className="container-custom">
        {/* Single Compact Row */}
        <div className="flex justify-between items-center h-16 gap-4">
          {/* Logo with Animation */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="relative">
              <HeartIcon className="h-8 w-8 text-primary-600 transition-transform group-hover:scale-110 group-hover:rotate-12 duration-300" />
              <div className="absolute inset-0 bg-primary-400 blur-lg opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
              CrowdFund
            </span>
          </Link>

          {/* Compact Search Bar - Center */}
          <div className="hidden md:flex flex-1 max-w-md">
            <form onSubmit={submitSearch} className="relative w-full">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search projects..."
                className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-primary-500 transition-colors"
              />
            </form>
          </div>

          {/* Compact Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            <Link 
              to="/campaigns" 
              className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-primary-600 transition-colors"
            >
              Explore
            </Link>
            <Link 
              to="/become-creator" 
              className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-primary-600 transition-colors"
            >
              Start a project
            </Link>
          </div>

          {/* Desktop Auth Buttons with Animations */}
          <div className="hidden md:flex items-center space-x-3">
            {isAuthenticated ? (
              <>
                {/* Notifications */}
                <button className="relative p-2 text-gray-600 hover:text-primary-600 hover:bg-gray-100 rounded-full transition-all duration-200">
                  <BellIcon className="h-6 w-6" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                </button>

                {/* Start Campaign Button with Gradient */}
                <Link 
                  to="/campaigns/create" 
                  className="group relative flex items-center space-x-2 px-5 py-2.5 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl font-semibold overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-primary-700 to-primary-800 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                  <PlusCircleIcon className="h-5 w-5 relative z-10" />
                  <span className="relative z-10">Start Campaign</span>
                </Link>

                {/* Profile Dropdown with Better Animation */}
                <div className="relative">
                  <button 
                    onClick={() => setProfileMenuOpen(!profileMenuOpen)} 
                    className="flex items-center space-x-2 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-xl transition-all duration-200"
                  >
                    <div className="w-9 h-9 bg-gradient-to-br from-primary-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold shadow-md">
                      {user?.firstName?.charAt(0) || user?.email?.charAt(0) || 'U'}
                    </div>
                    <span className="font-medium max-w-[100px] truncate">{user?.firstName || user?.email}</span>
                  </button>
                  {profileMenuOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 z-50 animate-slideDown">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-semibold text-gray-900">{user?.firstName || 'User'}</p>
                        <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                      </div>
                      <Link 
                        to="/profile" 
                        className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-colors" 
                        onClick={() => setProfileMenuOpen(false)}
                      >
                        My Profile
                      </Link>
                      <Link 
                        to="/my-campaigns" 
                        className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-colors" 
                        onClick={() => setProfileMenuOpen(false)}
                      >
                        My Campaigns
                      </Link>
                      <div className="border-t border-gray-100 mt-2 pt-2">
                        <button 
                          onClick={handleLogout} 
                          className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center space-x-2"
                        >
                          <ArrowRightOnRectangleIcon className="h-4 w-4" />
                          <span>Logout</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="px-5 py-2.5 text-primary-600 hover:bg-primary-50 font-semibold rounded-xl transition-all duration-200"
                >
                  Log in
                </Link>
                <Link 
                  to="/register" 
                  className="px-5 py-2.5 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                >
                  Sign up
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100">
            {mobileMenuOpen ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
          </button>
        </div>

      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="px-4 pt-3 pb-4 space-y-3">
            {/* Mobile Search */}
            <form onSubmit={submitSearch} className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search projects, creators, categories"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </form>

            {/* Mobile Links */}
            <Link to="/campaigns" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded" onClick={() => setMobileMenuOpen(false)}>Campaigns</Link>
            <Link to="/become-creator" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded" onClick={() => setMobileMenuOpen(false)}>Launch a project</Link>

            {/* Mobile Categories */}
            <div className="pt-2">
              <div className="text-xs uppercase tracking-wider text-gray-400 px-1 mb-1">Browse</div>
              <div className="flex flex-wrap gap-2">
                {categories.slice(0, 10).map((cat) => (
                  <Link key={cat} to={`/campaigns?category=${encodeURIComponent(cat)}`} className="px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-xs" onClick={() => setMobileMenuOpen(false)}>
                    {cat}
                  </Link>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t">
              {isAuthenticated ? (
                <>
                  <Link to="/campaigns/create" className="block px-4 py-2 bg-primary-600 text-white rounded-lg text-center mb-2" onClick={() => setMobileMenuOpen(false)}>Start Campaign</Link>
                  <Link to="/profile" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded" onClick={() => setMobileMenuOpen(false)}>My Profile</Link>
                  <Link to="/my-campaigns" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded" onClick={() => setMobileMenuOpen(false)}>My Campaigns</Link>
                  <button onClick={() => { handleLogout(); setMobileMenuOpen(false); }} className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100 rounded">Logout</button>
                </>
              ) : (
                <>
                  <Link to="/login" className="block px-4 py-2 text-center text-primary-600 border border-primary-600 rounded-lg mb-2" onClick={() => setMobileMenuOpen(false)}>Login</Link>
                  <Link to="/register" className="block px-4 py-2 text-center bg-primary-600 text-white rounded-lg" onClick={() => setMobileMenuOpen(false)}>Sign Up</Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;


