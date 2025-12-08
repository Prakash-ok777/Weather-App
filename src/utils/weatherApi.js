// Weather API integration with Open-Meteo endpoints
const OPEN_METEO_BASE = 'https://api.open-meteo.com/v1/forecast';
const OPEN_METEO_AQ_BASE = 'https://air-quality-api.open-meteo.com/v1/air-quality';

/**
 * Fetch weather forecast data from Open-Meteo
 * @param {number} latitude - Location latitude
 * @param {number} longitude - Location longitude
 * @returns {Promise<Object>} Weather data
 */
export const fetchWeatherData = async (latitude, longitude) => {
  try {
    const params = new URLSearchParams({
      latitude,
      longitude,
      hourly: 'temperature_2m,relativehumidity_2m,visibility,uv_index',
      daily: 'temperature_2m_max,temperature_2m_min,weathercode,sunrise,sunset',
      current_weather: 'true',
      timezone: 'auto'
    });

    const response = await fetch(`${OPEN_METEO_BASE}?${params}`);
    if (!response.ok) throw new Error('Weather data fetch failed');
    return await response.json();
  } catch (error) {
    console.error('Error fetching weather data:', error);
    throw error;
  }
};

/**
 * Fetch air quality data from Open-Meteo
 * @param {number} latitude - Location latitude
 * @param {number} longitude - Location longitude
 * @returns {Promise<Object>} Air quality data
 */
export const fetchAirQualityData = async (latitude, longitude) => {
  try {
    const params = new URLSearchParams({
      latitude,
      longitude,
      current: 'us_aqi,pm2_5,pm10,no2,o3,so2',
      hourly: 'us_aqi,pm2_5,pm10',
      timezone: 'auto'
    });

    const response = await fetch(`${OPEN_METEO_AQ_BASE}?${params}`);
    if (!response.ok) throw new Error('Air quality data fetch failed');
    return await response.json();
  } catch (error) {
    console.error('Error fetching air quality data:', error);
    throw error;
  }
};

/**
 * Get reverse geocoding (lat/lon to city name) using Open-Meteo Geocoding API
 * @param {number} latitude - Location latitude
 * @param {number} longitude - Location longitude
 * @returns {Promise<Object>} Location data
 */
export const fetchLocationName = async (latitude, longitude) => {
  try {
    const params = new URLSearchParams({
      latitude,
      longitude,
      language: 'en'
    });

    const response = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?${params}`
    );
    if (!response.ok) throw new Error('Geocoding failed');
    const data = await response.json();
    
    if (data.results && data.results.length > 0) {
      const result = data.results[0];
      return {
        name: result.name,
        country: result.country,
        admin1: result.admin1,
        lat: result.latitude,
        lon: result.longitude
      };
    }
    return { name: 'Unknown Location', country: '', admin1: '' };
  } catch (error) {
    console.error('Error fetching location name:', error);
    return { name: 'Unknown Location', country: '', admin1: '' };
  }
};

/**
 * Search for cities by name
 * @param {string} query - City name to search
 * @returns {Promise<Array>} Array of matching cities
 */
export const searchCities = async (query) => {
  try {
    if (!query || query.trim().length === 0) return [];

    const params = new URLSearchParams({
      name: query,
      count: 10,
      language: 'en',
      format: 'json'
    });

    const response = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?${params}`
    );
    if (!response.ok) throw new Error('Search failed');
    const data = await response.json();
    
    return data.results || [];
  } catch (error) {
    console.error('Error searching cities:', error);
    return [];
  }
};
