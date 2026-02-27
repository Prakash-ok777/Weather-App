import React, { useState } from "react";
import { searchCities, fetchLocationName } from "../utils/weatherApi";

const LeftPanel = ({ location, setLocation }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.length > 2) {
      setIsSearching(true);
      const results = await searchCities(query);
      setSearchResults(results);
      setIsSearching(false);
    } else {
      setSearchResults([]);
    }
  };

  const handleSelectCity = (city) => {
    setLocation({ lat: city.latitude, lon: city.longitude });
    setSearchQuery("");
    setSearchResults([]);
  };

  const handleCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lon: position.coords.longitude
          });
        },
        (error) => console.warn("Geolocation error:", error)
      );
    }
  };

  const addToFavorites = async () => {
    const locName = await fetchLocationName(location.lat, location.lon);
    if (!favorites.some(f => f.lat === location.lat && f.lon === location.lon)) {
      setFavorites([...favorites, { ...locName, lat: location.lat, lon: location.lon }]);
    }
  };

  return (
    <section className="glass rounded-2xl p-2 sm:p-4 md:p-6 shadow-2xl transform transition-all duration-300 hover:shadow-3xl animate-slideInLeft">
      {/* Search Section */}
      <div className="mb-4 sm:mb-6 relative z-10">
        <label className="block text-xs sm:text-sm font-semibold text-white/80 mb-2">Search Location</label>
        <div className="flex gap-1 sm:gap-2">
          <div className="flex-1 relative">
            <input 
              value={searchQuery}
              onChange={handleSearch}
              className="w-full p-2 sm:p-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all duration-300 backdrop-blur-md" 
              placeholder="Search city..." 
            />
            {isSearching && (
              <div className="absolute right-2 sm:right-3 top-2 sm:top-3 animate-spin">
                <i className="fas fa-spinner text-yellow-400 text-xs sm:text-base"></i>
              </div>
            )}
          </div>
        </div>
        {searchResults.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white/20 backdrop-blur-md rounded-lg border border-white/30 shadow-lg max-h-40 sm:max-h-48 overflow-y-auto z-50">
            {searchResults.map((city, idx) => (
              <button
                key={idx}
                onClick={() => handleSelectCity(city)}
                className="w-full p-2 sm:p-3 text-left hover:bg-white/20 border-b border-white/10 last:border-0 transition-colors duration-200 text-white"
              >
                <div className="font-medium text-xs sm:text-sm">{city.name}</div>
                <div className="text-xs sm:text-xs text-white/70">{city.admin1}, {city.country}</div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Location Actions */}
      <div className="flex gap-1 sm:gap-2 mb-4 sm:mb-6 animate-fadeIn">
        <button 
          onClick={handleCurrentLocation}
          className="flex-1 p-2 sm:p-3 rounded-lg bg-gradient-to-r from-blue-500/40 to-purple-500/40 hover:from-blue-500/60 hover:to-purple-500/60 border border-white/20 hover:border-white/40 transition-all duration-300 transform hover:scale-105 active:scale-95 text-white font-medium text-xs sm:text-sm shadow-lg hover:shadow-xl"
        >
          <i className="fas fa-location-dot mr-1 sm:mr-2"></i>
          <span className="hidden sm:inline">Current Location</span>
          <span className="sm:hidden">Location</span>
        </button>
        <button 
          onClick={addToFavorites}
          className="p-2 sm:p-3 rounded-lg bg-gradient-to-r from-yellow-500/40 to-orange-500/40 hover:from-yellow-500/60 hover:to-orange-500/60 border border-white/20 hover:border-white/40 transition-all duration-300 transform hover:scale-105 active:scale-95 text-yellow-200 shadow-lg hover:shadow-xl"
          title="Save current location to favorites"
        >
          <i className="fas fa-star"></i>
        </button>
      </div>

      {/* Favorites Section */}
      {favorites.length > 0 && (
        <div className="mb-4 sm:mb-6 animate-slideInUp">
          <h3 className="text-xs sm:text-sm font-semibold text-white/80 mb-2 sm:mb-3 flex items-center gap-1 sm:gap-2">
            <i className="fas fa-heart text-red-400 text-xs sm:text-sm"></i>
            <span className="hidden sm:inline">Favorites</span>
            <span className="sm:hidden">Fav</span>
          </h3>
          <div className="flex gap-1 sm:gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {favorites.map((fav, idx) => (
              <button
                key={idx}
                onClick={() => setLocation({ lat: fav.lat, lon: fav.lon })}
                className="p-2 sm:p-3 rounded-lg bg-white/5 hover:bg-white/15 border border-white/10 hover:border-white/30 transition-all duration-300 transform hover:scale-105 active:scale-95 text-white text-xs sm:text-sm font-medium whitespace-nowrap shadow-md hover:shadow-lg flex-shrink-0"
              >
                <i className="fas fa-map-pin mr-1 text-yellow-400"></i>{fav.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* AQI Section */}
      <div className="mb-4 sm:mb-6 animate-slideInUp" style={{ animationDelay: '0.1s' }}>
        <h3 className="text-xs sm:text-sm font-semibold text-white/80 mb-2 sm:mb-3 flex items-center gap-1 sm:gap-2">
          <i className="fas fa-wind text-blue-300 text-xs sm:text-sm"></i>
          <span className="hidden sm:inline">Air Quality (AQI)</span>
          <span className="sm:hidden">AQI</span>
        </h3>
        <div className="p-2 sm:p-4 rounded-lg bg-gradient-to-br from-white/5 to-white/10 border border-white/10 hover:border-white/20 transition-all duration-300 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl sm:text-4xl font-bold text-yellow-300">—</div>
              <div className="text-xs sm:text-sm text-white/70 mt-1">AQI Level</div>
            </div>
            <div className="text-right">
              <i className="fas fa-leaf text-green-400 text-xl sm:text-3xl mb-1 sm:mb-2 block"></i>
              <div className="text-[10px] sm:text-xs text-white/60">Real-time</div>
            </div>
          </div>
          <div className="mt-2 sm:mt-4 text-[10px] sm:text-xs text-white/60 grid grid-cols-2 gap-1 sm:gap-2">
            <div className="p-1 sm:p-2 rounded bg-white/5"><span className="text-white/80">PM2.5:</span> — μg/m³</div>
            <div className="p-1 sm:p-2 rounded bg-white/5"><span className="text-white/80">PM10:</span> — μg/m³</div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-4 sm:mb-6 animate-slideInUp" style={{ animationDelay: '0.2s' }}>
        <h3 className="text-xs sm:text-sm font-semibold text-white/80 mb-2 sm:mb-3 flex items-center gap-1 sm:gap-2">
          <i className="fas fa-zap text-yellow-300 text-xs sm:text-sm"></i>
          <span className="hidden sm:inline">Quick Actions</span>
          <span className="sm:hidden">Actions</span>
        </h3>
        <div className="flex gap-1 sm:gap-2">
          <button className="flex-1 p-1 sm:p-2 rounded-lg bg-white/5 hover:bg-white/15 border border-white/10 hover:border-white/30 transition-all duration-300 text-white text-xs sm:text-sm font-medium transform hover:scale-105 active:scale-95">
            <i className="fas fa-layer-group mr-1"></i>
            <span className="hidden sm:inline">Layers</span>
          </button>
          <button className="flex-1 p-1 sm:p-2 rounded-lg bg-white/5 hover:bg-white/15 border border-white/10 hover:border-white/30 transition-all duration-300 text-white text-xs sm:text-sm font-medium transform hover:scale-105 active:scale-95">
            <i className="fas fa-sync mr-1"></i>
            <span className="hidden sm:inline">Refresh</span>
          </button>
          <button className="flex-1 p-1 sm:p-2 rounded-lg bg-white/5 hover:bg-white/15 border border-white/10 hover:border-white/30 transition-all duration-300 text-white text-xs sm:text-sm font-medium transform hover:scale-105 active:scale-95">
            <i className="fas fa-trash mr-1"></i>
            <span className="hidden sm:inline">Clear</span>
          </button>
        </div>
      </div>

      {/* Timeline */}
      <div className="animate-slideInUp" style={{ animationDelay: '0.3s' }}>
        <h3 className="text-xs sm:text-sm font-semibold text-white/80 mb-2 sm:mb-3 flex items-center gap-1 sm:gap-2">
          <i className="fas fa-clock text-purple-300 text-xs sm:text-sm"></i>
          <span className="hidden sm:inline">48-hour Timeline</span>
          <span className="sm:hidden">Timeline</span>
        </h3>
        <div className="timeline p-2 sm:p-3 bg-white/5 rounded-lg border border-white/10 max-h-24 overflow-y-auto scrollbar-hide">
          <div className="text-center text-white/60 py-4 sm:py-6">
            <i className="fas fa-hourglass-start text-lg sm:text-2xl mb-2 block animate-pulse"></i>
            <span className="text-xs sm:text-sm">Fetching data...</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LeftPanel;