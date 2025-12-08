import React, { useEffect, useRef } from "react";

const WeatherAnimation = ({ weatherCode, isDay }) => {
  const containerRef = useRef(null);
  const animationIntervalRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Clear previous animations
    container.innerHTML = "";
    if (animationIntervalRef.current) clearInterval(animationIntervalRef.current);

    // Update body background
    const body = document.body;
    body.className = "min-h-screen flex flex-col items-center p-4 md:p-6 transition-all duration-1000";

    const createRain = () => {
      const rain = document.createElement("div");
      rain.className = "rain";
      rain.style.left = Math.random() * 100 + "%";
      rain.style.animationDuration = Math.random() * 0.6 + 0.6 + "s";
      rain.style.opacity = Math.random() * 0.7 + 0.3;
      container.appendChild(rain);
      setTimeout(() => rain.remove(), 3000);
    };

    const createSnow = () => {
      const snow = document.createElement("div");
      snow.className = "snow";
      snow.style.left = Math.random() * 100 + "%";
      snow.style.animationDuration = Math.random() * 3 + 4 + "s";
      snow.style.opacity = Math.random() * 0.8 + 0.2;
      snow.style.filter = `drop-shadow(0 0 ${Math.random() * 3 + 1}px rgba(255, 255, 255, 0.6))`;
      container.appendChild(snow);
      setTimeout(() => snow.remove(), 8000);
    };

    const createCloud = () => {
      const cloud = document.createElement("div");
      cloud.className = "cloud";
      cloud.style.top = Math.random() * 40 + "%";
      cloud.style.left = "-20%";
      cloud.style.width = Math.random() * 100 + 120 + "px";
      cloud.style.height = Math.random() * 30 + 40 + "px";
      cloud.style.animationDuration = Math.random() * 30 + 40 + "s";
      cloud.style.opacity = Math.random() * 0.3 + 0.4;
      container.appendChild(cloud);
      setTimeout(() => cloud.remove(), 60000);
    };

    const createLightning = () => {
      const lightning = document.createElement("div");
      lightning.className = "lightning";
      lightning.style.left = Math.random() * 100 + "%";
      lightning.style.opacity = Math.random() * 0.6 + 0.4;
      container.appendChild(lightning);
      setTimeout(() => lightning.remove(), 300);
    };

    const createStars = () => {
      for (let i = 0; i < 60; i++) {
        const star = document.createElement("div");
        star.className = "star";
        star.style.left = Math.random() * 100 + "%";
        star.style.top = Math.random() * 100 + "%";
        star.style.animationDelay = Math.random() * 3 + "s";
        container.appendChild(star);
      }
    };

    const createLayeredClouds = () => {
      // Create multiple cloud layers for overcast/cloudy effect
      for (let i = 0; i < 3; i++) {
        setTimeout(() => createCloud(), i * 2000);
      }
    };

    const code = Number(weatherCode);

    if ([0, 1].includes(code)) {
      // Clear Sky - Sun with rays
      body.classList.add(isDay ? "bg-clear-day" : "bg-clear-night");
      if (!isDay) createStars();
    } else if ([2, 3].includes(code)) {
      // Partly Cloudy
      body.classList.add("bg-cloudy");
      createLayeredClouds();
      animationIntervalRef.current = setInterval(createCloud, 10000);
    } else if ([45, 48].includes(code)) {
      // Foggy
      body.classList.add("bg-foggy");
      animationIntervalRef.current = setInterval(createCloud, 4000);
    } else if (code >= 51 && code <= 82) {
      // Rain - Animated falling raindrops
      body.classList.add("bg-rainy");
      animationIntervalRef.current = setInterval(createRain, 80);
    } else if (code >= 71 && code <= 86) {
      // Snow - Rotating snowflakes falling
      body.classList.add("bg-snowy");
      animationIntervalRef.current = setInterval(createSnow, 250);
    } else if (code >= 95 && code <= 99) {
      // Thunderstorm - Flashing lightning with rain
      body.classList.add("bg-thunderstorm");
      animationIntervalRef.current = setInterval(() => {
        createRain();
        if (Math.random() > 0.92) createLightning();
      }, 120);
    } else {
      // Default - Cloudy/Overcast
      body.classList.add("bg-cloudy");
      animationIntervalRef.current = setInterval(createCloud, 8000);
      createCloud();
    }

    return () => {
      if (animationIntervalRef.current) clearInterval(animationIntervalRef.current);
    };
  }, [weatherCode, isDay]);

  return <div id="weatherAnimation" className="weather-animation" ref={containerRef}></div>;
};

export default WeatherAnimation;
