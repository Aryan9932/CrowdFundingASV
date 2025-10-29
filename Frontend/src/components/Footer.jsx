import React from 'react';
import { Link } from 'react-router-dom';
import { HeartIcon } from '@heroicons/react/24/solid';
import {
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
} from '@heroicons/react/24/outline';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    'Start a Campaign': [
      { name: 'How it Works', href: '/how-it-works' },
      { name: 'Pricing', href: '/pricing' },
      { name: 'Success Stories', href: '/success-stories' },
      { name: 'Campaign Tips', href: '/tips' },
    ],
    'Discover': [
      { name: 'Explore Campaigns', href: '/campaigns' },
      { name: 'Categories', href: '/categories' },
      { name: 'Trending', href: '/trending' },
      { name: 'Recently Funded', href: '/recent' },
    ],
    'Company': [
      { name: 'About Us', href: '/about' },
      { name: 'Careers', href: '/careers' },
      { name: 'Press', href: '/press' },
      { name: 'Blog', href: '/blog' },
    ],
    'Support': [
      { name: 'Help Center', href: '/help' },
      { name: 'Trust & Safety', href: '/trust' },
      { name: 'Contact Us', href: '/contact' },
      { name: 'FAQs', href: '/faq' },
    ],
  };

  const socialLinks = [
    { name: 'Facebook', icon: '📘', href: '#' },
    { name: 'Twitter', icon: '🐦', href: '#' },
    { name: 'Instagram', icon: '📷', href: '#' },
    { name: 'LinkedIn', icon: '💼', href: '#' },
    { name: 'YouTube', icon: '📺', href: '#' },
  ];

  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Main Footer */}
      <div className="container-custom py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center space-x-2 mb-6">
              <HeartIcon className="h-10 w-10 text-primary-500" />
              <span className="text-2xl font-bold text-white">CrowdFund</span>
            </Link>
            <p className="text-gray-400 mb-6 leading-relaxed">
              Empowering creators and entrepreneurs to bring their dreams to life through the power of community support.
            </p>

            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center text-sm">
                <EnvelopeIcon className="h-5 w-5 text-primary-500 mr-3" />
                <a href="mailto:support@crowdfund.com" className="hover:text-white transition">
                  support@crowdfund.com
                </a>
              </div>
              <div className="flex items-center text-sm">
                <PhoneIcon className="h-5 w-5 text-primary-500 mr-3" />
                <a href="tel:+1234567890" className="hover:text-white transition">
                  +1 (234) 567-890
                </a>
              </div>
              <div className="flex items-start text-sm">
                <MapPinIcon className="h-5 w-5 text-primary-500 mr-3 mt-1" />
                <span>123 Innovation Street, Tech City, TC 12345</span>
              </div>
            </div>
          </div>

          {/* Links Columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="text-white font-bold text-lg mb-6">{title}</h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.href}
                      className="text-gray-400 hover:text-white transition-colors text-sm block"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter Section */}
        <div className="mt-16 pt-12 border-t border-gray-800">
          <div className="max-w-2xl">
            <h3 className="text-white font-bold text-2xl mb-4">
              Stay Updated
            </h3>
            <p className="text-gray-400 mb-6">
              Get the latest campaigns, success stories, and platform updates delivered to your inbox.
            </p>
            <div className="flex gap-4">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-6 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-white"
              />
              <button className="px-8 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="container-custom py-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            {/* Copyright */}
            <div className="text-gray-400 text-sm">
              © {currentYear} CrowdFund. All rights reserved. Made with{' '}
              <HeartIcon className="inline h-4 w-4 text-red-500" /> for creators worldwide.
            </div>

            {/* Social Links */}
            <div className="flex items-center space-x-6">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  className="text-2xl hover:scale-110 transform transition-transform"
                  aria-label={social.name}
                  title={social.name}
                >
                  {social.icon}
                </a>
              ))}
            </div>

            {/* Legal Links */}
            <div className="flex items-center space-x-6 text-sm">
              <Link to="/privacy" className="text-gray-400 hover:text-white transition">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-gray-400 hover:text-white transition">
                Terms of Service
              </Link>
              <Link to="/cookies" className="text-gray-400 hover:text-white transition">
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Trust Badges */}
      <div className="bg-gray-950 py-6">
        <div className="container-custom">
          <div className="flex flex-wrap justify-center items-center gap-8 text-gray-500 text-sm">
            <div className="flex items-center">
              <span className="text-2xl mr-2">🔒</span>
              <span>SSL Secured</span>
            </div>
            <div className="flex items-center">
              <span className="text-2xl mr-2">✓</span>
              <span>Verified Platform</span>
            </div>
            <div className="flex items-center">
              <span className="text-2xl mr-2">💳</span>
              <span>Secure Payments</span>
            </div>
            <div className="flex items-center">
              <span className="text-2xl mr-2">🌍</span>
              <span>Global Coverage</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;




