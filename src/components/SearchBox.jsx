import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";

const SearchBox = ({ onSearch }) => {
  const [searchInput, setSearchInput] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [debounceTimer, setDebounceTimer] = useState(null);
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [showCoordinates, setShowCoordinates] = useState(false);
  const [coordinateError, setCoordinateError] = useState("");
  const inputRef = useRef(null);
  const GEO_API = "https://geocoding-api.open-meteo.com/v1/search?name=";

  useEffect(() => {
    return () => {
      if (debounceTimer) clearTimeout(debounceTimer);
    };
  }, [debounceTimer]);

  const handleSearchInput = (value) => {
    setSearchInput(value);
    if (debounceTimer) clearTimeout(debounceTimer);
    if (!value.trim()) {
      setShowSuggestions(false);
      return;
    }
    const timer = setTimeout(async () => {
      try {
        const response = await fetch(GEO_API + encodeURIComponent(value));
        const data = await response.json();
        if (data.results) {
          setSuggestions(data.results.slice(0, 6));
          setShowSuggestions(true);
        } else {
          setShowSuggestions(false);
        }
      } catch (error) {
        setShowSuggestions(false);
      }
    }, 350);
    setDebounceTimer(timer);
  };

  const handleSuggestionClick = (city) => {
    setSearchInput(city.name);
    setShowSuggestions(false);
    onSearch(city.latitude, city.longitude, `${city.name}, ${city.country}`);
  };

  // Responsive dropdown position
  const getDropdownStyle = () => {
    if (!inputRef.current) return { left: 0, top: 0, width: "100%" };
    const rect = inputRef.current.getBoundingClientRect();
    return {
      left: rect.left + window.scrollX,
      top: rect.bottom + window.scrollY + 4,
      width: rect.width,
      maxWidth: "100vw",
    };
  };

  const handleCurrentLocation = async () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude: lat, longitude: lon } = position.coords;
        try {
          const res = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`
          );
          const loc = await res.json();
          const cityName = loc.city
            ? `${loc.city}, ${loc.countryName}`
            : loc.locality || "Your Location";
          onSearch(lat, lon, cityName);
        } catch {
          onSearch(lat, lon, "Current Location");
        }
      },
      () => alert("Unable to retrieve your location. Please allow location access."),
      { timeout: 10000 }
    );
  };

  const handleSearch = async () => {
    const query = searchInput.trim();
    if (!query) {
      alert("Please enter a city name");
      return;
    }

    try {
      const response = await fetch(GEO_API + encodeURIComponent(query));
      const data = await response.json();

      if (!data.results || data.results.length === 0) {
        alert("No cities found. Try another name.");
        return;
      }

      const city = data.results[0];
      const displayName = city.admin1
        ? `${city.name}, ${city.admin1}, ${city.country}`
        : `${city.name}, ${city.country}`;

      onSearch(city.latitude, city.longitude, displayName);
      setSearchInput(city.name);
      setShowSuggestions(false);
    } catch (err) {
      alert("Search failed. Please try again.");
    }
  };

  const validateCoordinates = (lat, lon) => {
    const latNum = parseFloat(lat);
    const lonNum = parseFloat(lon);

    if (isNaN(latNum) || isNaN(lonNum)) {
      setCoordinateError("Please enter valid numbers");
      return false;
    }
    if (latNum < -90 || latNum > 90) {
      setCoordinateError("Latitude must be between -90 and 90");
      return false;
    }
    if (lonNum < -180 || lonNum > 180) {
      setCoordinateError("Longitude must be between -180 and 180");
      return false;
    }
    setCoordinateError("");
    return true;
  };

  const handleCoordinateSearch = async (lat, lon) => {
    if (!validateCoordinates(lat, lon)) {
      return;
    }

    const latNum = parseFloat(lat);
    const lonNum = parseFloat(lon);

    try {
      // Fetch reverse geocoding to get location name
      const res = await fetch(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latNum}&longitude=${lonNum}&localityLanguage=en`
      );
      const loc = await res.json();
      const locationName = loc.city
        ? `${loc.city}, ${loc.countryName}`
        : `${latNum.toFixed(4)}, ${lonNum.toFixed(4)}`;

      onSearch(latNum, lonNum, locationName);
      setCoordinateError("");
    } catch (error) {
      console.error("Error fetching location name:", error);
      // Fallback to coordinates if reverse geocoding fails
      onSearch(latNum, lonNum, `${latNum.toFixed(4)}, ${lonNum.toFixed(4)}`);
    }
  };

  const handleCoordinateInputChange = (e, type) => {
    const value = e.target.value;
    if (type === "lat") {
      setLatitude(value);
    } else {
      setLongitude(value);
    }
  };

  const handleCoordinateKeyPress = (e) => {
    if (e.key === "Enter") {
      if (latitude && longitude) {
        handleCoordinateSearch(latitude, longitude);
      }
    }
  };

  return (
    <>
      <div className="glass-effect rounded-2xl p-4 md:p-6 mb-6 fade-in shadow-2xl w-full max-w-xl mx-auto">
        {!showCoordinates ? (
          <>
            <div className="relative mb-4">
              <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-purple-400"></i>
              <input
                ref={inputRef}
                type="text"
                placeholder="Search for a city..."
                autoComplete="off"
                value={searchInput}
                onChange={(e) => handleSearchInput(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:outline-none transition-all shadow-sm bg-white text-gray-900 placeholder-gray-500 dark:bg-[#0d0825] dark:border-purple-700 dark:text-white dark:placeholder-purple-400 dark:focus:border-cyan-400 dark:shadow-[0_0_12px_rgba(139,92,246,0.25)] text-base md:text-lg"
              />
            </div>
            <div className="flex gap-2 sm:gap-3 flex-col sm:flex-row">
              <button
                onClick={handleCurrentLocation}
                className="flex-[2] bg-gradient-to-r from-blue-500 to-blue-600 dark:from-violet-600 dark:to-cyan-500 text-white py-3 sm:py-4 rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl dark:hover:shadow-[0_0_24px_rgba(139,92,246,0.6)] flex items-center justify-center gap-2 text-sm sm:text-base md:text-lg px-2 sm:px-4 hover:scale-105 dark:hover:scale-[1.03]"
              >
                <i className="fas fa-location-crosshairs"></i> Use Current Location
              </button>
              <div className="flex gap-2 sm:gap-3 flex-1">
                <button
                  onClick={handleSearch}
                  className="flex-1 py-3 sm:py-0 px-2 sm:px-6 bg-white text-purple-600 font-semibold rounded-xl shadow hover:scale-105 transition dark:bg-gradient-to-r dark:from-purple-700 dark:to-violet-600 dark:text-white dark:shadow-[0_0_14px_rgba(139,92,246,0.4)] dark:hover:shadow-[0_0_22px_rgba(139,92,246,0.7)] text-sm sm:text-base md:text-lg"
                >
                  Search
                </button>
                <button
                  onClick={() => setShowCoordinates(true)}
                  className="flex-1 py-3 sm:py-0 px-2 sm:px-6 bg-gradient-to-r from-indigo-500 to-indigo-600 dark:from-cyan-600 dark:to-blue-600 text-white font-semibold rounded-xl shadow hover:scale-105 transition dark:shadow-[0_0_14px_rgba(6,182,212,0.4)] dark:hover:shadow-[0_0_22px_rgba(6,182,212,0.7)] text-sm sm:text-base md:text-lg flex items-center justify-center gap-1 sm:gap-2"
                  title="Search by latitude and longitude"
                >
                  <i className="fas fa-map-pin"></i> <span className="hidden sm:inline">Coordinates</span><span className="sm:hidden">Coords</span>
                </button>
              </div>
            </div>
          </>
        ) : (
          <>
            <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
              <i className="fas fa-map-pin text-indigo-500"></i> Search by Coordinates
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Enter latitude (-90 to 90) and longitude (-180 to 180) to fetch weather data
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Latitude
                </label>
                <input
                  type="number"
                  step="0.0001"
                  min="-90"
                  max="90"
                  placeholder="e.g., 51.5074"
                  value={latitude}
                  onChange={(e) => handleCoordinateInputChange(e, "lat")}
                  onKeyPress={handleCoordinateKeyPress}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:outline-none transition-all shadow-sm bg-white text-gray-900 placeholder-gray-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Longitude
                </label>
                <input
                  type="number"
                  step="0.0001"
                  min="-180"
                  max="180"
                  placeholder="e.g., -0.1278"
                  value={longitude}
                  onChange={(e) => handleCoordinateInputChange(e, "lon")}
                  onKeyPress={handleCoordinateKeyPress}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:outline-none transition-all shadow-sm bg-white text-gray-900 placeholder-gray-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                />
              </div>
            </div>
            {coordinateError && (
              <div className="mb-4 p-3 bg-red-100 dark:bg-red-900 border border-red-300 dark:border-red-700 rounded-lg text-red-700 dark:text-red-200 text-sm">
                <i className="fas fa-exclamation-circle mr-2"></i>{coordinateError}
              </div>
            )}
            <div className="flex gap-3 flex-col md:flex-row">
              <button
                onClick={() => {
                  if (latitude && longitude) {
                    handleCoordinateSearch(latitude, longitude);
                  }
                }}
                className="flex-1 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white py-3 rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
              >
                <i className="fas fa-search"></i> Fetch Weather
              </button>
              <button
                onClick={() => {
                  setShowCoordinates(false);
                  setLatitude("");
                  setLongitude("");
                  setCoordinateError("");
                }}
                className="px-6 bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-white font-semibold rounded-xl shadow hover:scale-105 transition"
              >
                Back
              </button>
            </div>
            <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded-lg text-blue-700 dark:text-blue-300 text-sm">
              <i className="fas fa-info-circle mr-2"></i>
              <strong>Tip:</strong> Use your current location to see real-time coordinates, then modify them to search nearby areas!
            </div>
          </>
        )}
      </div>
      {showSuggestions && suggestions.length > 0 && createPortal(
        <ul
          className="fixed bg-white dark:bg-[#100030] shadow-2xl dark:shadow-[0_0_32px_rgba(139,92,246,0.4)] rounded-xl border border-gray-100 dark:border-purple-700/50 z-[9999] overflow-y-auto max-h-80 w-full md:w-[32rem]"
          style={getDropdownStyle()}
        >
          {suggestions.map((city, index) => (
            <li
              key={index}
              onClick={() => handleSuggestionClick(city)}
              className="suggestion-item p-4 cursor-pointer border-b border-gray-100 dark:border-purple-900/40 last:border-b-0 flex items-center gap-3 hover:bg-gray-100 dark:hover:bg-purple-900/30 transition-all"
            >
              <i className="fas fa-map-marker-alt text-purple-500 dark:text-cyan-400"></i>
              <div>
                <p className="font-semibold text-gray-900 dark:text-white text-base md:text-lg">{city.name}</p>
                <p className="text-sm text-gray-600 dark:text-purple-300">
                  {city.admin1 || ""} {city.country || ""}
                </p>
              </div>
            </li>
          ))}
        </ul>,
        document.body
      )}
    </>
  );
};

export default SearchBox;