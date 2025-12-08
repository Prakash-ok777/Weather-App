import React, { useEffect, useState } from "react";
import HourlyChart from "./HourlyChart";
import SevenDayForecast from "./SevenDayForecast";
import WeatherIcon from "./WeatherIcon";
import { getWeatherIcon, getWeatherDescription } from "../utils/weatherHelpers";

const WeatherDisplay = ({ weatherData, displayName, isDark }) => {
  const [dateTime, setDateTime] = useState("");

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      setDateTime(
        now.toLocaleDateString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      );
    };
    updateDateTime();
    const interval = setInterval(updateDateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  if (!weatherData) return null;

  const cw = weatherData.current_weather || {};
  const hourly = weatherData.hourly || {};
  const daily = weatherData.daily || {};

  const temperature = cw.temperature
    ? Math.round(cw.temperature) + "°C"
    : hourly.temperature_2m
    ? Math.round(hourly.temperature_2m[0]) + "°C"
    : "—";

  const weatherCode = cw.weathercode ?? (daily.weathercode ? daily.weathercode[0] : 0);
  const description = getWeatherDescription(weatherCode);
  const icon = getWeatherIcon(weatherCode);

  const windSpeed = cw.windspeed ? Math.round(cw.windspeed) + " km/h" : "—";
  const windDirection = cw.winddirection ? Math.round(cw.winddirection) + "°" : "—";
  const humidity = hourly.relativehumidity_2m ? hourly.relativehumidity_2m[0] + "%" : "—";
  const pressure = weatherData?.pressure_msl
    ? Math.round(weatherData.pressure_msl) + " hPa"
    : "—";
  const visibility = hourly.visibility ? (hourly.visibility[0] / 1000).toFixed(1) + " km" : "—";
  const cloudCover = weatherData?.cloudcover ?? "—";
  const uvIndex = hourly.uv_index && hourly.uv_index[0] !== undefined ? Math.round(hourly.uv_index[0]) : "0";

  const sunrise = daily.sunrise
    ? new Date(daily.sunrise[0]).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
    : "—";
  const sunset = daily.sunset
    ? new Date(daily.sunset[0]).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
    : "—";

  const now = new Date();
  const currentTime = now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });

  return (
    <div id="weatherBox" className="glass-effect rounded-2xl p-8 shadow-2xl fade-in relative z-0">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 id="cityName" className="text-2xl md:text-3xl font-bold text-white flex items-center gap-2">
            <i className="fas fa-map-marker-alt"></i>
            {displayName}
          </h2>
          <p id="dateTime" className="text-white text-opacity-80 text-sm mt-1">
            {dateTime}
          </p>
        </div>
        <div id="weatherIcon" className="weather-icon">
          <WeatherIcon code={weatherCode} size="text-9xl" />
        </div>
      </div>

      <div className="text-center mb-6">
        <p id="temperature" className="text-6xl md:text-7xl font-bold text-white mb-2">
          {temperature}
        </p>
        <p id="description" className="text-xl text-white text-opacity-90 capitalize">
          {description}
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="weather-card bg-white bg-opacity-20 rounded-xl p-4 backdrop-blur-sm text-center hover:bg-opacity-30 transition">
          <i className="fas fa-wind text-3xl text-white mb-2"></i>
          <p className="text-white text-opacity-70 text-xs">Wind Speed</p>
          <p id="windSpeed" className="text-lg font-semibold text-white">
            {windSpeed}
          </p>
        </div>
        <div className="weather-card bg-white bg-opacity-20 rounded-xl p-4 backdrop-blur-sm text-center hover:bg-opacity-30 transition">
          <i className="fas fa-compass text-3xl text-white mb-2"></i>
          <p className="text-white text-opacity-70 text-xs">Direction</p>
          <p id="windDirection" className="text-lg font-semibold text-white">
            {windDirection}
          </p>
        </div>
        <div className="weather-card bg-white bg-opacity-20 rounded-xl p-4 backdrop-blur-sm text-center hover:bg-opacity-30 transition">
          <i className="fas fa-tint text-3xl text-white mb-2"></i>
          <p className="text-white text-opacity-70 text-xs">Humidity</p>
          <p id="humidity" className="text-lg font-semibold text-white">
            {humidity}
          </p>
        </div>
        <div className="weather-card bg-white bg-opacity-20 rounded-xl p-4 backdrop-blur-sm text-center hover:bg-opacity-30 transition">
          <i className="fas fa-gauge text-3xl text-white mb-2"></i>
          <p className="text-white text-opacity-70 text-xs">Pressure</p>
          <p id="pressure" className="text-lg font-semibold text-white">
            {pressure}
          </p>
        </div>

        <div className="weather-card bg-white bg-opacity-20 rounded-xl p-4 backdrop-blur-sm text-center hover:bg-opacity-30 transition">
          <i className="fas fa-eye text-3xl text-white mb-2"></i>
          <p className="text-white text-opacity-70 text-xs">Visibility</p>
          <p id="visibility" className="text-lg font-semibold text-white">
            {visibility}
          </p>
        </div>
        <div className="weather-card bg-white bg-opacity-20 rounded-xl p-4 backdrop-blur-sm text-center hover:bg-opacity-30 transition">
          <i className="fas fa-cloud text-3xl text-white mb-2"></i>
          <p className="text-white text-opacity-70 text-xs">Cloud Cover</p>
          <p id="cloudCover" className="text-lg font-semibold text-white">
            {cloudCover}%
          </p>
        </div>
        <div className="weather-card bg-white bg-opacity-20 rounded-xl p-4 backdrop-blur-sm text-center hover:bg-opacity-30 transition">
          <i className="fas fa-sun text-3xl text-white mb-2"></i>
          <p className="text-white text-opacity-70 text-xs">UV Index</p>
          <p id="uvIndex" className="text-lg font-semibold text-white">
            {uvIndex}
          </p>
        </div>
        <div className="weather-card bg-white bg-opacity-20 rounded-xl p-4 backdrop-blur-sm text-center hover:bg-opacity-30 transition">
          <i className="fas fa-clock text-3xl text-white mb-2"></i>
          <p className="text-white text-opacity-70 text-xs">Time</p>
          <p id="currentTime" className="text-lg font-semibold text-white">
            {currentTime}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="weather-card bg-white bg-opacity-20 rounded-xl p-4 backdrop-blur-sm flex items-center gap-3 hover:bg-opacity-30 transition">
          <i className="fas fa-sunrise text-3xl text-yellow-300"></i>
          <div>
            <p className="text-white text-opacity-70 text-sm">Sunrise</p>
            <p id="sunrise" className="text-xl font-semibold text-white">
              {sunrise}
            </p>
          </div>
        </div>
        <div className="weather-card bg-white bg-opacity-20 rounded-xl p-4 backdrop-blur-sm flex items-center gap-3 hover:bg-opacity-30 transition">
          <i className="fas fa-sunset text-3xl text-orange-300"></i>
          <div>
            <p className="text-white text-opacity-70 text-sm">Sunset</p>
            <p id="sunset" className="text-xl font-semibold text-white">
              {sunset}
            </p>
          </div>
        </div>
      </div>

      {hourly && hourly.temperature_2m && <HourlyChart hourly={hourly} isDark={isDark} />}

      {daily && <SevenDayForecast daily={daily} isDark={isDark} />}
    </div>
  );
};

export default WeatherDisplay;
