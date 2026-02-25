import React from "react";
import { getWeatherDescription } from "../utils/weatherHelpers";
import WeatherIcon from "./WeatherIcon";

const SevenDayForecast = ({ daily, isDark }) => {
  if (!daily || !daily.time) return null;

  return (
    <div className="glass-effect rounded-2xl p-4">
      <h3 className="text-white font-semibold mb-4">7-Day Forecast</h3>
      <div id="weekForecast" className="flex gap-4 overflow-x-auto pb-2">
        {daily.time.map((date, index) => {
          if (index >= 7) return null;
          const day = new Date(date);
          const dayName = day.toLocaleDateString("en-US", { weekday: "short" });
          const max = Math.round(daily.temperature_2m_max[index]);
          const min = Math.round(daily.temperature_2m_min[index]);
          const code = Number(daily.weathercode ? daily.weathercode[index] : 0);
          const description = getWeatherDescription(code);

          return (
            <div
              key={index}
              className="day-card weather-card bg-white bg-opacity-10 rounded-xl p-4 text-center min-w-[120px] flex-shrink-0 hover:bg-opacity-20 transition duration-300 transform hover:scale-105 cursor-pointer group backdrop-blur-sm"
              title={description}
            >
              <p className="text-white text-opacity-80 text-sm mb-2 font-medium">{dayName}</p>
              <div className="h-24 flex items-center justify-center mb-2 group-hover:scale-110 transition duration-300">
                <WeatherIcon code={code} size="text-7xl" />
              </div>
              <p className="text-white font-bold text-lg">
                {max}° <span className="text-white text-opacity-60 text-sm">/ {min}°</span>
              </p>
              <p className="text-white text-opacity-60 text-xs mt-1 truncate">{description}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SevenDayForecast;
