// src/hooks/useWeatherData.js
import { useState, useEffect } from "react";
import { fetchWeatherData, fetchAirQualityData } from "../utils/weatherApi";

export function useWeatherData(lat, lon) {
  const [weatherData, setWeatherData] = useState(null);
  const [aqiData, setAqiData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    if (lat === undefined || lon === undefined) return;
    
    try {
      setLoading(true);
      setError(null);

      // Fetch weather and air quality data in parallel
      const [weatherRes, aqiRes] = await Promise.all([
        fetchWeatherData(lat, lon),
        fetchAirQualityData(lat, lon)
      ]);

      setWeatherData(weatherRes);
      setAqiData(aqiRes);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [lat, lon]);

  const refetch = async () => {
    await fetchData();
  };

  return { weatherData, aqiData, loading, error, refetch };
}
