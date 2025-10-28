import React, { useEffect, useState } from 'react';
import { HeartIcon } from '@heroicons/react/24/solid';

const SplashScreen = ({ onFinish }) => {
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // Start fade out after 30 seconds
    const fadeTimer = setTimeout(() => {
      setFadeOut(true);
    }, 30000);

    // Call onFinish after fade out completes
    const finishTimer = setTimeout(() => {
      onFinish();
    }, 30500);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(finishTimer);
    };
  }, [onFinish]);

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 transition-opacity duration-500 ${
        fadeOut ? 'opacity-0' : 'opacity-100'
      }`}
    >
      <div className="text-center">
        {/* Animated Logo */}
        <div className="mb-8 animate-bounce">
          <div className="inline-flex items-center justify-center w-32 h-32 bg-white rounded-full shadow-2xl">
            <HeartIcon className="w-20 h-20 text-primary-600 animate-pulse" />
          </div>
        </div>

        {/* App Name */}
        <h1 className="text-5xl font-bold text-white mb-4 animate-fade-in">
          CrowdFund
        </h1>
        
        {/* Tagline */}
        <p className="text-xl text-primary-100 animate-fade-in-delay">
          Turn Your Dreams Into Reality
        </p>

        {/* Loading Dots */}
        <div className="flex justify-center space-x-2 mt-8">
          <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;

