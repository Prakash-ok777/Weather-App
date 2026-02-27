import React from "react";

const Header = ({ onToggleTheme, isDark }) => {
  return (
    <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-4 md:gap-0 fade-in w-full">
      <div className="flex flex-col items-center md:items-start text-center md:text-left w-full md:w-auto">
        <div className="flex items-center gap-2 sm:gap-3 mb-1">
          <i className="fas fa-cloud-sun text-white text-3xl sm:text-4xl drop-shadow-lg"></i>
          <h1
            className="text-2xl sm:text-3xl md:text-4xl font-bold leading-tight"
            style={{
              color: isDark ? "#c4b5fd" : "#ffffff",
              textShadow: isDark
                ? "0 0 18px rgba(167,139,250,0.6), 0 0 32px rgba(6,182,212,0.3)"
                : "0 2px 8px rgba(0,0,0,0.25)",
            }}
          >
            Vaanilai Arikkai
          </h1>
        </div>
        <p
          className="text-xs sm:text-sm md:text-base font-medium"
          style={{ color: isDark ? "#a78bfa" : "rgba(255,255,255,0.85)" }}
        >
          உங்கள் வானிலை அறிக்கை
        </p>
      </div>
      <div className="flex flex-wrap justify-center items-center gap-2 sm:gap-3 w-full md:w-auto">
        <button
          id="speakBtn"
          className="px-4 py-2 rounded-xl flex items-center gap-2 font-semibold transition-all duration-300"
          style={
            isDark
              ? {
                background: "linear-gradient(135deg, #7c3aed 0%, #06b6d4 100%)",
                boxShadow: "0 0 18px rgba(139,92,246,0.5), 0 0 36px rgba(6,182,212,0.2)",
                color: "#fff",
                border: "none",
              }
              : {
                background: "rgba(255,255,255,0.22)",
                color: "#fff",
                border: "1px solid rgba(255,255,255,0.3)",
              }
          }
          onMouseEnter={(e) => {
            if (isDark) {
              e.currentTarget.style.boxShadow = "0 0 28px rgba(167,139,250,0.75), 0 0 52px rgba(34,211,238,0.35)";
              e.currentTarget.style.transform = "scale(1.05)";
            }
          }}
          onMouseLeave={(e) => {
            if (isDark) {
              e.currentTarget.style.boxShadow = "0 0 18px rgba(139,92,246,0.5), 0 0 36px rgba(6,182,212,0.2)";
              e.currentTarget.style.transform = "scale(1)";
            }
          }}
          onClick={() => {
            const city = document.getElementById("cityName")?.textContent || "Location";
            const temp = document.getElementById("temperature")?.textContent || "";
            const desc = document.getElementById("description")?.textContent || "";
            const uv = document.getElementById("uvIndex")?.textContent || "";
            const voices = window.speechSynthesis?.getVoices() || [];
            const hasTamil = voices.some((v) => /ta|tamil/i.test(v.lang));
            const summaryTa = `${city} இல் வானிலை: ${desc}. வெப்பநிலை ${temp}. UV குறியீடு ${uv}. பாதுகாப்பாக இருங்கள்.`;
            const summaryEn = `${city} weather: ${desc}. Temperature ${temp}. UV index ${uv}. Stay safe.`;
            const utter = new SpeechSynthesisUtterance(hasTamil ? summaryTa : summaryEn);
            const ta = voices.find((v) => /ta|tamil/i.test(v.lang)) || voices.find((v) => /en-/i.test(v.lang)) || voices[0];
            if (ta) utter.voice = ta;
            utter.rate = 0.95;
            window.speechSynthesis.cancel();
            window.speechSynthesis.speak(utter);
          }}
        >
          <i className="fas fa-volume-up"></i> Speak (TA)
        </button>
        <button
          onClick={onToggleTheme}
          className="px-4 py-2 rounded-xl flex items-center gap-2 font-semibold transition-all duration-300"
          style={
            isDark
              ? {
                background: "linear-gradient(135deg, #f472b6 0%, #a78bfa 50%, #22d3ee 100%)",
                boxShadow: "0 0 18px rgba(244,114,182,0.5), 0 0 36px rgba(167,139,250,0.3)",
                color: "#fff",
                border: "none",
              }
              : {
                background: "rgba(255,255,255,0.22)",
                color: "#fff",
                border: "1px solid rgba(255,255,255,0.3)",
              }
          }
          onMouseEnter={(e) => {
            if (isDark) {
              e.currentTarget.style.boxShadow = "0 0 28px rgba(244,114,182,0.75), 0 0 52px rgba(167,139,250,0.5)";
              e.currentTarget.style.transform = "scale(1.07)";
            }
          }}
          onMouseLeave={(e) => {
            if (isDark) {
              e.currentTarget.style.boxShadow = "0 0 18px rgba(244,114,182,0.5), 0 0 36px rgba(167,139,250,0.3)";
              e.currentTarget.style.transform = "scale(1)";
            }
          }}
        >
          <i className={`fas ${isDark ? "fa-sun" : "fa-moon"}`}></i>
          {isDark ? "Light Mode" : "Dark Mode"}
        </button>
      </div>
    </div>
  );
};

export default Header;