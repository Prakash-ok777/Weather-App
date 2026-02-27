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
    <div id="weatherBox" className="glass-effect rounded-2xl p-4 sm:p-6 md:p-8 shadow-2xl fade-in relative z-0 w-full overflow-hidden">
      <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between mb-6 gap-4 sm:gap-0 w-full">
        <div className="text-center sm:text-left flex flex-col items-center sm:items-start w-full sm:w-auto">
          <h2 id="cityName" className="text-xl sm:text-2xl md:text-3xl font-bold text-white flex flex-col sm:flex-row items-center sm:items-start justify-center sm:justify-start gap-2 break-words text-center w-full">
            <i className="fas fa-map-marker-alt flex-shrink-0 mt-1 sm:mt-0"></i>
            <span className="break-words whitespace-normal text-center sm:text-left max-w-full line-clamp-2 leading-tight">{displayName}</span>
          </h2>
          <p id="dateTime" className="text-white text-opacity-80 text-xs sm:text-sm mt-1">
            {dateTime}
          </p>
        </div>
        <div id="weatherIcon" className="weather-icon flex-shrink-0 mt-2 sm:mt-0">
          <WeatherIcon code={weatherCode} size="text-7xl sm:text-8xl md:text-9xl" />
        </div>
      </div>

      <div className="text-center mb-6">
        <p id="temperature" className="text-5xl sm:text-6xl md:text-7xl font-bold text-white mb-2 tracking-tight">
          {temperature}
        </p>
        <p id="description" className="text-lg sm:text-xl text-white text-opacity-90 capitalize">
          {description}
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 mb-6">
        <div className="weather-card bg-white bg-opacity-20 dark:bg-gradient-to-br dark:from-violet-900/40 dark:to-blue-900/30 rounded-xl p-3 sm:p-4 backdrop-blur-sm text-center hover:bg-opacity-30 transition border border-transparent dark:border-violet-500/30 dark:shadow-[0_4px_18px_rgba(139,92,246,0.18)]">
          <i className="fas fa-wind text-2xl sm:text-3xl text-white dark:text-cyan-300 mb-1 sm:mb-2"></i>
          <p className="text-white text-opacity-70 dark:text-violet-300 text-[10px] sm:text-xs">Wind Speed</p>
          <p id="windSpeed" className="text-base sm:text-lg font-semibold text-white">
            {windSpeed}
          </p>
        </div>
        <div className="weather-card bg-white bg-opacity-20 dark:bg-gradient-to-br dark:from-blue-900/40 dark:to-cyan-900/30 rounded-xl p-3 sm:p-4 backdrop-blur-sm text-center hover:bg-opacity-30 transition border border-transparent dark:border-cyan-500/30 dark:shadow-[0_4px_18px_rgba(6,182,212,0.18)]">
          <i className="fas fa-compass text-2xl sm:text-3xl text-white dark:text-blue-300 mb-1 sm:mb-2"></i>
          <p className="text-white text-opacity-70 dark:text-blue-300 text-[10px] sm:text-xs">Direction</p>
          <p id="windDirection" className="text-base sm:text-lg font-semibold text-white">
            {windDirection}
          </p>
        </div>
        <div className="weather-card bg-white bg-opacity-20 dark:bg-gradient-to-br dark:from-cyan-900/40 dark:to-teal-900/30 rounded-xl p-3 sm:p-4 backdrop-blur-sm text-center hover:bg-opacity-30 transition border border-transparent dark:border-teal-500/30 dark:shadow-[0_4px_18px_rgba(20,184,166,0.18)]">
          <i className="fas fa-tint text-2xl sm:text-3xl text-white dark:text-teal-300 mb-1 sm:mb-2"></i>
          <p className="text-white text-opacity-70 dark:text-teal-300 text-[10px] sm:text-xs">Humidity</p>
          <p id="humidity" className="text-base sm:text-lg font-semibold text-white">
            {humidity}
          </p>
        </div>
        <div className="weather-card bg-white bg-opacity-20 dark:bg-gradient-to-br dark:from-purple-900/40 dark:to-pink-900/30 rounded-xl p-3 sm:p-4 backdrop-blur-sm text-center hover:bg-opacity-30 transition border border-transparent dark:border-pink-500/30 dark:shadow-[0_4px_18px_rgba(236,72,153,0.18)]">
          <i className="fas fa-gauge text-2xl sm:text-3xl text-white dark:text-pink-300 mb-1 sm:mb-2"></i>
          <p className="text-white text-opacity-70 dark:text-pink-300 text-[10px] sm:text-xs">Pressure</p>
          <p id="pressure" className="text-base sm:text-lg font-semibold text-white">
            {pressure}
          </p>
        </div>

        <div className="weather-card bg-white bg-opacity-20 dark:bg-gradient-to-br dark:from-indigo-900/40 dark:to-violet-900/30 rounded-xl p-3 sm:p-4 backdrop-blur-sm text-center hover:bg-opacity-30 transition border border-transparent dark:border-indigo-500/30 dark:shadow-[0_4px_18px_rgba(99,102,241,0.18)]">
          <i className="fas fa-eye text-2xl sm:text-3xl text-white dark:text-indigo-300 mb-1 sm:mb-2"></i>
          <p className="text-white text-opacity-70 dark:text-indigo-300 text-[10px] sm:text-xs">Visibility</p>
          <p id="visibility" className="text-base sm:text-lg font-semibold text-white">
            {visibility}
          </p>
        </div>
        <div className="weather-card bg-white bg-opacity-20 dark:bg-gradient-to-br dark:from-sky-900/40 dark:to-blue-900/30 rounded-xl p-3 sm:p-4 backdrop-blur-sm text-center hover:bg-opacity-30 transition border border-transparent dark:border-sky-500/30 dark:shadow-[0_4px_18px_rgba(56,189,248,0.18)]">
          <i className="fas fa-cloud text-2xl sm:text-3xl text-white dark:text-sky-300 mb-1 sm:mb-2"></i>
          <p className="text-white text-opacity-70 dark:text-sky-300 text-[10px] sm:text-xs">Cloud Cover</p>
          <p id="cloudCover" className="text-base sm:text-lg font-semibold text-white">
            {cloudCover}%
          </p>
        </div>
        <div className="weather-card bg-white bg-opacity-20 dark:bg-gradient-to-br dark:from-amber-900/40 dark:to-orange-900/30 rounded-xl p-3 sm:p-4 backdrop-blur-sm text-center hover:bg-opacity-30 transition border border-transparent dark:border-amber-500/30 dark:shadow-[0_4px_18px_rgba(245,158,11,0.18)]">
          <i className="fas fa-sun text-2xl sm:text-3xl text-white dark:text-amber-300 mb-1 sm:mb-2"></i>
          <p className="text-white text-opacity-70 dark:text-amber-300 text-[10px] sm:text-xs">UV Index</p>
          <p id="uvIndex" className="text-base sm:text-lg font-semibold text-white">
            {uvIndex}
          </p>
        </div>
        <div className="weather-card bg-white bg-opacity-20 dark:bg-gradient-to-br dark:from-fuchsia-900/40 dark:to-purple-900/30 rounded-xl p-3 sm:p-4 backdrop-blur-sm text-center hover:bg-opacity-30 transition border border-transparent dark:border-fuchsia-500/30 dark:shadow-[0_4px_18px_rgba(217,70,239,0.18)]">
          <i className="fas fa-clock text-2xl sm:text-3xl text-white dark:text-fuchsia-300 mb-1 sm:mb-2"></i>
          <p className="text-white text-opacity-70 dark:text-fuchsia-300 text-[10px] sm:text-xs">Time</p>
          <p id="currentTime" className="text-base sm:text-lg font-semibold text-white">
            {currentTime}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 mb-6">
        <div className="weather-card bg-white bg-opacity-20 dark:bg-gradient-to-br dark:from-yellow-900/40 dark:to-orange-900/30 rounded-xl p-3 sm:p-4 backdrop-blur-sm flex items-center gap-3 hover:bg-opacity-30 transition border border-transparent dark:border-yellow-500/30 dark:shadow-[0_4px_18px_rgba(234,179,8,0.2)]">
          <i className="fas fa-sunrise text-3xl sm:text-4xl text-yellow-300 flex-shrink-0"></i>
          <div className="min-w-0">
            <p className="text-white text-opacity-70 dark:text-yellow-300 text-xs sm:text-sm">Sunrise</p>
            <p id="sunrise" className="text-lg sm:text-xl font-semibold text-white truncate">
              {sunrise}
            </p>
          </div>
        </div>
        <div className="weather-card bg-white bg-opacity-20 dark:bg-gradient-to-br dark:from-orange-900/40 dark:to-red-900/30 rounded-xl p-3 sm:p-4 backdrop-blur-sm flex items-center gap-3 hover:bg-opacity-30 transition border border-transparent dark:border-orange-500/30 dark:shadow-[0_4px_18px_rgba(249,115,22,0.2)]">
          <i className="fas fa-sunset text-3xl sm:text-4xl text-orange-300 flex-shrink-0"></i>
          <div className="min-w-0">
            <p className="text-white text-opacity-70 dark:text-orange-300 text-xs sm:text-sm">Sunset</p>
            <p id="sunset" className="text-lg sm:text-xl font-semibold text-white truncate">
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
