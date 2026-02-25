import React, { useState, useEffect } from "react";
import IntroPage from "./components/IntroPage";
import Header from "./components/Header";
import SearchBox from "./components/SearchBox";
import WeatherDisplay from "./components/WeatherDisplay";
import WeatherAnimation from "./components/WeatherAnimation";
import { useTheme } from "./hooks/useTheme";
import { fetchWeatherData } from "./utils/weatherApi";

const App = () => {
  const [showIntro, setShowIntro] = useState(true);
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [displayName, setDisplayName] = useState("Loading...");
  const [currentWeatherCode, setCurrentWeatherCode] = useState(0);
  const [isDay, setIsDay] = useState(true);
  const { isDark, toggleTheme } = useTheme();

  const loadWeather = async (lat, lon, name) => {
    setLoading(true);
    try {
      const data = await fetchWeatherData(lat, lon);
      setWeatherData(data);
      setDisplayName(name);
      const code = data.current_weather?.weathercode ?? data.daily?.weathercode?.[0] ?? 0;
      setCurrentWeatherCode(code);
      setIsDay(data.current_weather?.is_day === 1);
    } catch (error) {
      console.error("Failed to load weather:", error);
      alert("Failed to load weather data. Try again or check network.");
    } finally {
      setLoading(false);
    }
  };

  const handleEnter = () => {
    setShowIntro(false);
    // Load default location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const { latitude: lat, longitude: lon } = pos.coords;
          try {
            const r = await fetch(
              `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`
            );
            const loc = await r.json();
            const cityName = loc.city ? `${loc.city}, ${loc.countryName}` : "Your Location";
            loadWeather(lat, lon, cityName);
          } catch {
            loadWeather(lat, lon, "Your Location");
          }
        },
        () => {
          // Fallback to Chennai
          loadWeather(13.0827, 80.2707, "Chennai, India");
        },
        { timeout: 8000 }
      );
    } else {
      loadWeather(13.0827, 80.2707, "Chennai, India");
    }
  };

  return (
    <div className={isDark ? "dark" : ""}>
      <WeatherAnimation weatherCode={currentWeatherCode} isDay={isDay} />
      {showIntro ? (
        <IntroPage onEnter={handleEnter} onToggleTheme={toggleTheme} />
      ) : (
        <div className="min-h-screen flex flex-col items-center p-4 md:p-6 transition-all duration-1000">
          <div className="w-full max-w-6xl">
            <Header onToggleTheme={toggleTheme} isDark={isDark} />
            <SearchBox onSearch={loadWeather} />
            {loading ? (
              <div className="glass-effect rounded-2xl p-6 mb-6 shadow-2xl animate-pulse">
                <div className="h-8 w-48 bg-gray-300 dark:bg-gray-600 rounded mb-4"></div>
                <div className="flex items-center justify-between mb-6">
                  <div className="h-24 w-24 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
                  <div className="h-20 w-32 bg-gray-300 dark:bg-gray-600 rounded"></div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-20 bg-gray-300 dark:bg-gray-600 rounded-xl"></div>
                  ))}
                </div>
              </div>
            ) : weatherData && (
              <WeatherDisplay weatherData={weatherData} displayName={displayName} isDark={isDark} />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default App;