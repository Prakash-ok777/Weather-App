import React from "react";

const IntroPage = ({ onEnter, onToggleTheme }) => {
  return (
    <div className="w-full min-h-screen flex items-center justify-center fixed inset-0 z-20 bg-clear-day dark:bg-clear-night transition-all duration-1000">
      <div className="text-center max-w-2xl mx-auto px-4 relative z-10">
        <div className="mb-8 animate-bounce">
          <i className="fas fa-cloud-sun text-white text-8xl md:text-9xl drop-shadow-2xl"></i>
        </div>
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 drop-shadow-lg">Vaanilai Arikkai</h1>
        <p className="text-2xl md:text-3xl text-white text-opacity-90 mb-3">உங்கள் வானிலை அறிக்கை</p>
        <p className="text-lg md:text-xl text-white text-opacity-80 mb-12 max-w-lg mx-auto">
          Your personal weather companion. Get real-time updates, forecasts, and beautiful animations.
        </p>
        <div className="flex justify-center gap-4">
          <button
            onClick={onEnter}
            className="bg-white text-purple-600 px-8 py-4 rounded-full text-lg font-bold hover:bg-opacity-90 transition-all shadow-2xl hover:scale-105 transform"
          >
            <i className="fas fa-arrow-right mr-2"></i> Explore Weather
          </button>
          <button
            onClick={onToggleTheme}
            className="bg-white text-gray-700 px-4 py-4 rounded-full text-lg font-semibold hover:bg-opacity-90 transition-all shadow"
          >
            <i className="fas fa-moon"></i> Dark
          </button>
        </div>
      </div>
    </div>
  );
};

export default IntroPage;
