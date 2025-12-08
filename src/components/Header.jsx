import React from "react";

const Header = ({ onToggleTheme, isDark }) => {
  return (
    <div className="flex items-center justify-between mb-6 fade-in">
      <div className="text-left">
        <div className="flex items-center gap-3">
          <i className="fas fa-cloud-sun text-white text-4xl"></i>
          <h1 className="text-3xl md:text-4xl font-bold text-white">Vaanilai Arikkai</h1>
        </div>
        <p className="text-white text-opacity-90 text-sm md:text-base">உங்கள் வானிலை அறிக்கை</p>
      </div>
      <div className="flex items-center gap-3">
        <button
          id="speakBtn"
          className="bg-white bg-opacity-20 text-white px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-opacity-30 transition-all"
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
          className="bg-white bg-opacity-20 text-white px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-opacity-30 transition-all"
        >
          <i className="fas fa-adjust"></i> Toggle Theme
        </button>
      </div>
    </div>
  );
};

export default Header;