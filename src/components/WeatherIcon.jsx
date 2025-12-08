import React from "react";

const WeatherIcon = ({ code, size = "text-6xl" }) => {
  code = Number(code);

  // Dynamic emoji icons with animation classes
  const getEmojiIcon = (code) => {
    switch (code) {
      // Clear sky
      case 0:
        return { emoji: "🌞", label: "Clear Sky", animation: "rotating-sun" };
      
      // Mainly clear, partly cloudy
      case 1:
        return { emoji: "🌤️", label: "Partly Cloudy", animation: "pulse" };
      
      case 2:
      // Partly cloudy
      case 3:
        return { emoji: "⛅", label: "Partly Cloudy", animation: "gentle-float" };
      
      // Foggy
      case 45:
      case 48:
        return { emoji: "🌫️", label: "Foggy", animation: "fade-in-out" };
      
      // Drizzle and rain
      case 51:
      case 53:
      case 55:
      case 61:
      case 63:
      case 65:
      case 80:
      case 81:
      case 82:
        return { emoji: "🌧️", label: "Rain", animation: "bounce-rain" };
      
      // Snow
      case 71:
      case 73:
      case 75:
      case 77:
      case 85:
      case 86:
        return { emoji: "❄️", label: "Snow", animation: "rotating-snowflake" };
      
      // Thunderstorm
      case 95:
      case 96:
      case 99:
        return { emoji: "⚡", label: "Thunderstorm", animation: "flash-lightning" };
      
      // Cloudy/Overcast
      default:
        return { emoji: "☁️", label: "Cloudy", animation: "cloud-drift" };
    }
  };

  const { emoji, label, animation } = getEmojiIcon(code);

  // Handle both Tailwind classes and numeric sizes
  const sizeClass = typeof size === "string" ? size : `text-[${size}px]`;

  return (
    <div 
      className={`flex items-center justify-center w-full h-full weather-emoji ${animation} ${sizeClass}`}
      title={label}
    >
      {emoji}
    </div>
  );
};

export default WeatherIcon;
