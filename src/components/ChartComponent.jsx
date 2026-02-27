import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

/**
 * Charts component showing multiple weather metrics
 * Uses Chart.js for rendering with enhanced styling
 */
const ChartComponent = ({ data }) => {
  const hourlyChartRef = useRef(null);
  const tempHumChartRef = useRef(null);
  const presWindChartRef = useRef(null);
  const uvCloudRainChartRef = useRef(null);

  const chartInstances = useRef({});

  useEffect(() => {
    if (!data || !data.hourly) return;

    const times = data.hourly.time || [];
    const temps = data.hourly.temperature_2m || [];
    const hums = data.hourly.relativehumidity_2m || [];
    const winds = data.hourly.windspeed_10m || [];
    const uvs = data.hourly.uv_index || [];
    const clouds = data.hourly.cloudcover || [];
    const rainp = data.hourly.precipitation_probability || [];

    // Get next 24 hours
    const labels = [];
    const t1 = [], h1 = [], w1 = [], uv1 = [], c1 = [], r1 = [];
    const now = new Date();

    for (let i = 0; i < times.length && labels.length < 24; i++) {
      const dt = new Date(times[i]);
      if (dt >= now) {
        labels.push(dt.toLocaleTimeString(undefined, { hour: '2-digit' }));
        t1.push(temps[i]);
        h1.push(hums[i]);
        w1.push(winds[i]);
        uv1.push(uvs[i] || 0);
        c1.push(clouds[i] || 0);
        r1.push(rainp[i] || 0);
      }
    }

    // Base chart options with glassmorphism styling
    const baseOptions = {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          display: true,
          labels: {
            color: 'rgba(255, 255, 255, 0.8)',
            font: { size: 11, weight: 'bold' },
            padding: 15,
            usePointStyle: true
          }
        }
      },
      scales: {
        x: {
          grid: { color: 'rgba(255, 255, 255, 0.05)', drawBorder: false },
          ticks: { color: 'rgba(255, 255, 255, 0.6)', font: { size: 10 } }
        },
        y: {
          grid: { color: 'rgba(255, 255, 255, 0.05)', drawBorder: false },
          ticks: { color: 'rgba(255, 255, 255, 0.6)', font: { size: 10 } }
        }
      }
    };

    // Helper to destroy and recreate charts
    const upsertChart = (ref, chartType, chartData, options) => {
      if (chartInstances.current[ref.current?.id]) {
        chartInstances.current[ref.current.id].destroy();
      }

      if (ref.current) {
        const ctx = ref.current.getContext('2d');
        chartInstances.current[ref.current.id] = new Chart(ctx, {
          type: chartType,
          data: chartData,
          options: { ...baseOptions, ...options }
        });
      }
    };

    // Hourly Temperature Chart
    upsertChart(
      hourlyChartRef,
      'line',
      {
        labels,
        datasets: [
          {
            label: 'Temperature °C',
            data: t1,
            fill: true,
            tension: 0.4,
            borderColor: 'rgb(255, 193, 7)',
            backgroundColor: 'rgba(255, 193, 7, 0.15)',
            borderWidth: 3,
            pointRadius: 4,
            pointBackgroundColor: 'rgb(255, 193, 7)',
            pointBorderColor: '#fff',
            pointBorderWidth: 2
          }
        ]
      },
      { plugins: { legend: { display: false } } }
    );

    // Temperature & Humidity Chart
    upsertChart(
      tempHumChartRef,
      'line',
      {
        labels,
        datasets: [
          {
            label: 'Temp °C',
            data: t1,
            tension: 0.4,
            borderColor: 'rgb(255, 99, 132)',
            backgroundColor: 'rgba(255, 99, 132, 0.1)',
            borderWidth: 2.5,
            pointRadius: 3,
            pointBackgroundColor: 'rgb(255, 99, 132)',
            yAxisID: 'y1'
          },
          {
            label: 'Humidity %',
            data: h1,
            tension: 0.4,
            borderColor: 'rgb(54, 162, 235)',
            backgroundColor: 'rgba(54, 162, 235, 0.1)',
            borderWidth: 2.5,
            pointRadius: 3,
            pointBackgroundColor: 'rgb(54, 162, 235)',
            yAxisID: 'y2'
          }
        ]
      },
      {
        interaction: { mode: 'index', intersect: false },
        scales: {
          y1: { position: 'left', grid: { display: true } },
          y2: { position: 'right', grid: { display: false } }
        }
      }
    );

    // Pressure & Wind Chart
    upsertChart(
      presWindChartRef,
      'line',
      {
        labels,
        datasets: [
          {
            label: 'Wind km/h',
            data: w1,
            tension: 0.4,
            borderColor: 'rgb(75, 192, 192)',
            backgroundColor: 'rgba(75, 192, 192, 0.1)',
            borderWidth: 2.5,
            pointRadius: 3,
            pointBackgroundColor: 'rgb(75, 192, 192)',
            yAxisID: 'y1'
          }
        ]
      },
      {
        scales: {
          y1: { position: 'left' }
        }
      }
    );

    // UV, Cloud & Rain Chart
    upsertChart(
      uvCloudRainChartRef,
      'bar',
      {
        labels,
        datasets: [
          {
            label: 'Cloud %',
            data: c1,
            backgroundColor: 'rgba(100, 200, 255, 0.6)',
            borderColor: 'rgba(100, 200, 255, 1)',
            borderWidth: 1
          },
          {
            label: 'Rain %',
            data: r1,
            backgroundColor: 'rgba(100, 150, 255, 0.6)',
            borderColor: 'rgba(100, 150, 255, 1)',
            borderWidth: 1
          }
        ]
      }
    );

    // Cleanup on unmount
    return () => {
      Object.values(chartInstances.current).forEach(chart => chart?.destroy?.());
    };
  }, [data]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 mt-4 animate-slideInUp" style={{ animationDelay: '0.2s' }}>
      <div className="glass rounded-lg sm:rounded-xl p-2 sm:p-4 transform transition-all duration-300 hover:shadow-lg hover:scale-[1.02]">
        <h5 className="text-xs sm:text-sm font-semibold text-white/80 mb-2 sm:mb-3 flex items-center gap-1 sm:gap-2">
          <i className="fas fa-thermometer-half text-yellow-400 text-xs sm:text-sm"></i>Temp
        </h5>
        <canvas ref={hourlyChartRef} height="70"></canvas>
      </div>

      <div className="glass rounded-lg sm:rounded-xl p-2 sm:p-4 transform transition-all duration-300 hover:shadow-lg hover:scale-[1.02]">
        <h5 className="text-xs sm:text-sm font-semibold text-white/80 mb-2 sm:mb-3 flex items-center gap-1 sm:gap-2">
          <i className="fas fa-droplet text-cyan-400 text-xs sm:text-sm"></i>Humidity
        </h5>
        <canvas ref={tempHumChartRef} height="70"></canvas>
      </div>

      <div className="glass rounded-lg sm:rounded-xl p-2 sm:p-4 transform transition-all duration-300 hover:shadow-lg hover:scale-[1.02]">
        <h5 className="text-xs sm:text-sm font-semibold text-white/80 mb-2 sm:mb-3 flex items-center gap-1 sm:gap-2">
          <i className="fas fa-wind text-blue-400 text-xs sm:text-sm"></i>Wind
        </h5>
        <canvas ref={presWindChartRef} height="70"></canvas>
      </div>

      <div className="glass rounded-lg sm:rounded-xl p-2 sm:p-4 transform transition-all duration-300 hover:shadow-lg hover:scale-[1.02]">
        <h5 className="text-xs sm:text-sm font-semibold text-white/80 mb-2 sm:mb-3 flex items-center gap-1 sm:gap-2">
          <i className="fas fa-cloud text-purple-400 text-xs sm:text-sm"></i>Rain
        </h5>
        <canvas ref={uvCloudRainChartRef} height="70"></canvas>
      </div>
    </div>
  );
};

export default ChartComponent;
