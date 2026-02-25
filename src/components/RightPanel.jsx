import React, { useState, useEffect } from "react";
import { useWeatherData } from "../hooks/useWeatherData";
import { fetchLocationName } from "../utils/weatherApi";
import MapComponent from "./MapComponent";
import ChartComponent from "./ChartComponent";
import WeatherCard from "./WeatherCard";

const RightPanel = ({ location }) => {
  const { weatherData, aqiData, loading, error } = useWeatherData(location.lat, location.lon);
  const [locationName, setLocationName] = useState("Loading...");

  useEffect(() => {
    const getLocationName = async () => {
      const name = await fetchLocationName(location.lat, location.lon);
      setLocationName(name.name);
    };
    getLocationName();
  }, [location]);

  if (error) {
    return (
      <section className="glass rounded-2xl p-6 shadow-2xl animate-slideInRight">
        <div className="flex items-center justify-center gap-3 text-red-300 py-8">
          <i className="fas fa-exclamation-circle text-2xl"></i>
          <span className="font-medium">{error}</span>
        </div>
      </section>
    );
  }

  return (
    <section className="glass rounded-2xl p-6 shadow-2xl transform transition-all duration-300 hover:shadow-3xl animate-slideInRight">
      {loading ? (
        <div className="flex flex-col items-center justify-center py-16 gap-4">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 rounded-full border-4 border-white/20"></div>
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-yellow-400 border-r-purple-400 animate-spin"></div>
          </div>
          <p className="text-white/70 font-medium animate-pulse">Fetching weather data...</p>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Weather Summary */}
          <div className="flex-1 animate-fadeIn">
            <WeatherCard data={weatherData} location={{ name: locationName, lat: location.lat, lon: location.lon }} aqi={aqiData} />
          </div>

          {/* Map & Charts Section */}
          <div className="flex-1 flex flex-col gap-4 animate-fadeIn" style={{ animationDelay: '0.1s' }}>
            {/* Map */}
            <div className="rounded-xl overflow-hidden shadow-lg transform transition-all duration-300 hover:shadow-xl">
              <MapComponent lat={location.lat} lon={location.lon} />
            </div>

            {/* Temperature Chart */}
            <div className="bg-white/5 border border-white/10 p-4 rounded-xl shadow-lg transform transition-all duration-300 hover:shadow-xl">
              <h4 className="text-sm font-semibold text-white/80 mb-3 flex items-center gap-2">
                <i className="fas fa-chart-line text-yellow-400"></i>Hourly Temperature
              </h4>
              <canvas id="tempChart" height="120" className="animate-fadeIn"></canvas>
            </div>
          </div>
        </div>
      )}

      {/* Advanced Charts Grid */}
      {!loading && weatherData && (
        <div className="mt-6 animate-slideInUp" style={{ animationDelay: '0.2s' }}>
          <h3 className="text-lg font-semibold text-white/90 mb-4 flex items-center gap-2">
            <i className="fas fa-chart-bar text-blue-300"></i>Advanced Analytics
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="glass rounded-xl p-4 transform transition-all duration-300 hover:shadow-xl">
              <h4 className="text-sm font-semibold text-white/80 mb-3 flex items-center gap-2">
                <i className="fas fa-droplet text-blue-400"></i>Humidity & Temperature
              </h4>
              <canvas id="humTempChart" height="100"></canvas>
            </div>
            <div className="glass rounded-xl p-4 transform transition-all duration-300 hover:shadow-xl">
              <h4 className="text-sm font-semibold text-white/80 mb-3 flex items-center gap-2">
                <i className="fas fa-wind text-purple-400"></i>Wind & Pressure
              </h4>
              <canvas id="windPressChart" height="100"></canvas>
            </div>
          </div>
        </div>
      )}

      {/* Summary Stats */}
      {!loading && weatherData && (
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3 animate-slideInUp" style={{ animationDelay: '0.3s' }}>
          <div className="glass rounded-lg p-4 text-center transform transition-all duration-300 hover:scale-105">
            <div className="text-2xl font-bold text-yellow-300">
              {weatherData.current?.temperature_2m !== undefined ? Math.round(weatherData.current.temperature_2m) : '—'}°C
            </div>
            <div className="text-xs text-white/60 mt-1">Temperature</div>
          </div>
          <div className="glass rounded-lg p-4 text-center transform transition-all duration-300 hover:scale-105">
            <div className="text-2xl font-bold text-blue-300">
              {weatherData.current?.windspeed_10m !== undefined ? Math.round(weatherData.current.windspeed_10m) : '—'} km/h
            </div>
            <div className="text-xs text-white/60 mt-1">Wind Speed</div>
          </div>
          <div className="glass rounded-lg p-4 text-center transform transition-all duration-300 hover:scale-105">
            <div className="text-2xl font-bold text-purple-300">
              {aqiData?.current?.us_aqi !== undefined ? Math.round(aqiData.current.us_aqi) : '—'}
            </div>
            <div className="text-xs text-white/60 mt-1">AQI</div>
          </div>
          <div className="glass rounded-lg p-4 text-center transform transition-all duration-300 hover:scale-105">
            <div className="text-2xl font-bold text-green-300">
              {weatherData.current?.pressure_msl !== undefined ? Math.round(weatherData.current.pressure_msl) : '—'} hPa
            </div>
            <div className="text-xs text-white/60 mt-1">Pressure</div>
          </div>
        </div>
      )}
    </section>
  );
};

export default RightPanel;