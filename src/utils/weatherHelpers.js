/**
 * Weather helper utilities for formatting and interpretation
 */

// Weather code to icon and description mapping (WMO Weather interpretation codes)
const WMO_CODES = {
  0: { icon: 'fa-sun', description: 'Clear sky' },
  1: { icon: 'fa-cloud-sun', description: 'Mainly clear' },
  2: { icon: 'fa-cloud', description: 'Partly cloudy' },
  3: { icon: 'fa-cloud', description: 'Overcast' },
  45: { icon: 'fa-smog', description: 'Foggy' },
  48: { icon: 'fa-smog', description: 'Depositing rime fog' },
  51: { icon: 'fa-cloud-rain', description: 'Light drizzle' },
  53: { icon: 'fa-cloud-rain', description: 'Moderate drizzle' },
  55: { icon: 'fa-cloud-rain', description: 'Dense drizzle' },
  61: { icon: 'fa-cloud-rain', description: 'Slight rain' },
  63: { icon: 'fa-cloud-rain', description: 'Moderate rain' },
  65: { icon: 'fa-cloud-rain', description: 'Heavy rain' },
  71: { icon: 'fa-snowflake', description: 'Slight snow' },
  73: { icon: 'fa-snowflake', description: 'Moderate snow' },
  75: { icon: 'fa-snowflake', description: 'Heavy snow' },
  77: { icon: 'fa-snowflake', description: 'Snow grains' },
  80: { icon: 'fa-cloud-rain', description: 'Slight rain showers' },
  81: { icon: 'fa-cloud-rain', description: 'Moderate rain showers' },
  82: { icon: 'fa-cloud-rain', description: 'Violent rain showers' },
  85: { icon: 'fa-snowflake', description: 'Slight snow showers' },
  86: { icon: 'fa-snowflake', description: 'Heavy snow showers' },
  95: { icon: 'fa-bolt', description: 'Thunderstorm' },
  96: { icon: 'fa-bolt', description: 'Thunderstorm with hail' },
  99: { icon: 'fa-bolt', description: 'Thunderstorm with heavy hail' }
};

export const getWeatherIcon = (code) => {
  return WMO_CODES[code]?.icon || 'fa-cloud';
};

export const getWeatherDescription = (code) => {
  return WMO_CODES[code]?.description || 'Unknown';
};

export const formatTemp = (temp) => {
  return temp !== undefined && temp !== null ? `${Math.round(temp)}°` : '—';
};

export const formatWind = (windspeed) => {
  return windspeed !== undefined && windspeed !== null ? `${Math.round(windspeed)} km/h` : '—';
};

export const formatHumidity = (humidity) => {
  return humidity !== undefined && humidity !== null ? `${Math.round(humidity)}%` : '—';
};

export const getAQILabel = (aqi) => {
  if (aqi <= 50) return 'Good';
  if (aqi <= 100) return 'Moderate';
  if (aqi <= 150) return 'Unhealthy for Sensitive Groups';
  if (aqi <= 200) return 'Unhealthy';
  if (aqi <= 300) return 'Very Unhealthy';
  return 'Hazardous';
};

export const getAQIColor = (aqi) => {
  if (aqi <= 50) return '#10b981';
  if (aqi <= 100) return '#f59e0b';
  if (aqi <= 150) return '#ef4444';
  if (aqi <= 200) return '#dc2626';
  if (aqi <= 300) return '#7f1d1d';
  return '#4b0082';
};

export const formatTime = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
};

export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
};
