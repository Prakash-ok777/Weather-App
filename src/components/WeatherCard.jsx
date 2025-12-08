// src/components/WeatherCard.jsx
import React, { useState, useEffect } from 'react';
import { getWeatherDescription, getWeatherIcon, formatTemp, formatWind, formatHumidity, getAQILabel, getAQIColor } from '../utils/weatherHelpers';

/**
 * Main weather summary card with current conditions and 7-day forecast
 */
const WeatherCard = ({ data, location, aqi }) => {
  const [localTime, setLocalTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setLocalTime(
        now.toLocaleString(undefined, {
          weekday: 'short',
          hour: '2-digit',
          minute: '2-digit'
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  const cw = data.current || {};
  const daily = data.daily || {};
  const hourly = data.hourly || {};
  const aqiValue = aqi?.current?.us_aqi || 0;
  const aqiLabel = getAQILabel(aqiValue);
  const aqiColor = getAQIColor(aqiValue);

  const weatherCode = cw.weather_code ?? (cw.weathercode ?? (daily.weathercode?.[0] || 0));

  return (
    <div className="space-y-4">
      {/* Current Weather Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-white/10 to-white/5 p-6 border border-white/20 shadow-xl transform transition-all duration-300 hover:shadow-2xl hover:border-white/30 animate-slideInUp">
        {/* Background animation */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-40 h-40 bg-blue-400 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-400 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>

        <div className="relative flex items-start justify-between">
          <div className="flex-1">
            <h2 className="text-3xl font-bold text-white mb-1 drop-shadow">{location.name}</h2>
            <p className="text-sm text-white/70 flex items-center gap-1">
              <i className="fas fa-clock text-yellow-300"></i>
              {localTime}
            </p>
          </div>
          <div className="text-right">
            <div className="text-6xl font-bold text-transparent bg-gradient-to-r from-yellow-300 to-orange-400 bg-clip-text drop-shadow-lg">
              {formatTemp(cw.temperature_2m)}
            </div>
            <div className="text-sm text-white/80 mt-2 flex items-center justify-end gap-2">
              <i className={`fas ${getWeatherIcon(weatherCode)} text-xl`}></i>
              <span>{getWeatherDescription(weatherCode)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Weather Details Grid */}
      <div className="grid grid-cols-2 gap-3 animate-slideInUp" style={{ animationDelay: '0.1s' }}>
        <div className="glass rounded-xl p-4 group hover:scale-105 transform transition-all duration-300 cursor-pointer">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-semibold text-white/60 uppercase tracking-wider">Wind</span>
            <i className="fas fa-wind text-blue-300 group-hover:rotate-12 transition-transform"></i>
          </div>
          <div className="text-2xl font-bold text-white">{formatWind(cw.windspeed_10m)}</div>
          <div className="text-xs text-white/50 mt-1">Direction: {cw.winddirection_10m}°</div>
        </div>

        <div className="glass rounded-xl p-4 group hover:scale-105 transform transition-all duration-300 cursor-pointer">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-semibold text-white/60 uppercase tracking-wider">Humidity</span>
            <i className="fas fa-droplet text-cyan-300 group-hover:animate-bounce transition-transform"></i>
          </div>
          <div className="text-2xl font-bold text-white">{formatHumidity(hourly.relativehumidity_2m?.[0])}</div>
          <div className="text-xs text-white/50 mt-1">Dew Point: —</div>
        </div>

        <div className="glass rounded-xl p-4 group hover:scale-105 transform transition-all duration-300 cursor-pointer">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-semibold text-white/60 uppercase tracking-wider">Pressure</span>
            <i className="fas fa-gauge text-purple-300 group-hover:animate-pulse transition-transform"></i>
          </div>
          <div className="text-2xl font-bold text-white">{cw.pressure_msl ?? '—'} hPa</div>
          <div className="text-xs text-white/50 mt-1">Station Level</div>
        </div>

        <div className="glass rounded-xl p-4 group hover:scale-105 transform transition-all duration-300 cursor-pointer">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-semibold text-white/60 uppercase tracking-wider">UV Index</span>
            <i className="fas fa-sun text-yellow-300 group-hover:rotate-12 transition-transform"></i>
          </div>
          <div className="text-2xl font-bold text-white">{Math.round(hourly.uv_index?.[0] || 0)}</div>
          <div className="text-xs text-white/50 mt-1">{Math.round(hourly.uv_index?.[0] || 0) > 6 ? 'Very High' : 'Moderate'}</div>
        </div>
      </div>

      {/* AQI Display */}
      <div className="glass rounded-2xl p-5 border border-white/20 transform transition-all duration-300 hover:shadow-lg animate-slideInUp" style={{ animationDelay: '0.2s', backgroundColor: `${aqiColor}20`, borderColor: aqiColor }}>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-white/70 uppercase tracking-wider mb-2 flex items-center gap-2">
              <i className="fas fa-leaf"></i>Air Quality
            </h3>
            <div className="text-4xl font-bold" style={{ color: aqiColor }}>{Math.round(aqiValue)}</div>
            <div className="text-sm text-white/60 mt-1">{aqiLabel}</div>
          </div>
          <div className="text-5xl" style={{ color: aqiColor }}>
            <i className={aqiValue <= 50 ? 'fas fa-smile' : aqiValue <= 100 ? 'fas fa-meh' : 'fas fa-frown'}></i>
          </div>
        </div>
      </div>

      {/* 7-Day Forecast */}
      {daily.time && (
        <div className="animate-slideInUp" style={{ animationDelay: '0.3s' }}>
          <h4 className="text-sm font-semibold text-white/80 mb-3 flex items-center gap-2">
            <i className="fas fa-calendar-days text-purple-300"></i>
            7-Day Forecast
          </h4>
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {daily.time.map((date, idx) => {
              if (idx >= 7) return null;
              const d = new Date(date);
              const dayName = d.toLocaleDateString(undefined, { weekday: 'short' });
              const max = Math.round(daily.temperature_2m_max[idx]);
              const min = Math.round(daily.temperature_2m_min[idx]);
              const code = daily.weathercode?.[idx] || 0;
              const isToday = idx === 0;

              return (
                <div
                  key={idx}
                  className={`flex-shrink-0 rounded-xl p-3 min-w-fit transition-all duration-300 transform hover:scale-110 cursor-pointer ${
                    isToday
                      ? 'glass border-2 border-yellow-400 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 shadow-lg'
                      : 'glass hover:bg-white/15'
                  }`}
                >
                  <div className="text-sm font-semibold text-white text-center mb-2">{dayName}</div>
                  <div className="text-2xl text-center mb-2">
                    <i className={`fas ${getWeatherIcon(code)}`}></i>
                  </div>
                  <div className="text-sm text-white font-medium text-center">
                    <span className="text-orange-300">{max}°</span>
                    <span className="text-white/50 mx-1">/</span>
                    <span className="text-blue-300">{min}°</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default WeatherCard;