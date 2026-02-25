import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

const HourlyChart = ({ hourly, isDark }) => {
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);

  useEffect(() => {
    if (!hourly || !hourly.time || !hourly.temperature_2m) return;

    const labels = [];
    const temps = [];
    const now = new Date();

    for (let i = 0; i < hourly.time.length; i++) {
      const t = new Date(hourly.time[i]);
      if (t >= now && labels.length < 24) {
        labels.push(t.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }));
        temps.push(hourly.temperature_2m[i]);
      }
    }

    if (!chartRef.current) return;

    const ctx = chartRef.current.getContext("2d");

    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    chartInstanceRef.current = new Chart(ctx, {
      type: "line",
      data: {
        labels,
        datasets: [
          {
            label: "Temperature (°C)",
            data: temps,
            fill: true,
            tension: 0.3,
            borderWidth: 2,
            pointRadius: 2,
            borderColor: "rgba(168, 85, 247, 1)",
            backgroundColor: "rgba(168, 85, 247, 0.1)",
            pointBackgroundColor: "rgba(168, 85, 247, 1)",
            pointBorderColor: "#fff",
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
        },
        scales: {
          x: {
            grid: { display: false, color: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)" },
            ticks: { color: isDark ? "#fff" : "#000" },
          },
          y: {
            ticks: { beginAtZero: false, color: isDark ? "#fff" : "#000" },
            grid: { color: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)" },
          },
        },
      },
    });

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, [hourly, isDark]);

  return (
    <div className="glass-effect rounded-2xl p-4 mb-6">
      <h3 className="text-white font-semibold mb-3">Hourly Temperature</h3>
      <div className="chart-wrap">
        <canvas ref={chartRef}></canvas>
      </div>
    </div>
  );
};

export default HourlyChart;
