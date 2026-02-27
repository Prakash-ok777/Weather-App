import React from "react";

const IntroPage = ({ onEnter, onToggleTheme }) => {
  return (
    <div className="w-full min-h-screen flex items-center justify-center fixed inset-0 z-20 bg-clear-day dark:bg-clear-night transition-all duration-1000">
      <div className="text-center max-w-2xl mx-auto px-4 relative z-10">
        <div className="mb-8 animate-bounce flex justify-center">
          {/* Use favicon for splash image, responsive for mobile */}
          <picture>
            <source srcSet="/favicon/apple-touch-icon.png" media="(max-width: 480px)" />
            <source srcSet="/favicon/web-app-manifest-192x192.png" media="(max-width: 768px)" />
            <img
              src="/favicon/web-app-manifest-512x512.png"
              alt="Weather App Icon"
              className="w-24 h-24 md:w-40 md:h-40 mx-auto rounded-full shadow-2xl bg-white bg-opacity-80"
              style={{ objectFit: 'cover' }}
            />
          </picture>
        </div>
        <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold text-white mb-4 drop-shadow-lg">Vaanilai Arikkai</h1>
        <p className="text-xl sm:text-2xl md:text-3xl text-white text-opacity-90 mb-3">உங்கள் வானிலை அறிக்கை</p>
        <p className="text-base sm:text-lg md:text-xl text-white text-opacity-80 mb-12 max-w-lg mx-auto">
          Your personal weather companion. Get real-time updates, forecasts, and beautiful animations.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button
            onClick={onEnter}
            className="bg-white text-purple-600 px-8 py-4 rounded-full text-lg font-bold hover:bg-opacity-90 transition-all shadow-2xl hover:scale-105 transform mb-2 sm:mb-0"
            style={{ boxShadow: "0 0 24px rgba(167,139,250,0.5)" }}
          >
            <i className="fas fa-arrow-right mr-2"></i> Explore Weather
          </button>
          <button
            onClick={onToggleTheme}
            className="px-6 py-4 rounded-full text-lg font-semibold transition-all shadow-2xl hover:scale-105 transform"
            style={{
              background: "linear-gradient(135deg, #7c3aed 0%, #06b6d4 100%)",
              boxShadow: "0 0 20px rgba(139,92,246,0.55), 0 0 40px rgba(6,182,212,0.25)",
              color: "#fff",
              border: "none",
            }}
          >
            <i className="fas fa-moon mr-2"></i> Dark Mode
          </button>
        </div>
      </div>
    </div>
  );
};

export default IntroPage;
