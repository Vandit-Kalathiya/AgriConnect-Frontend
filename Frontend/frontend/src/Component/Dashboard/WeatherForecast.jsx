// WeatherForecast.jsx
import React, { useState, useEffect } from "react";
import {
  FaSun,
  FaCloud,
  FaCloudRain,
  FaSnowflake,
  FaWind,
  FaTint,
  FaMapMarkerAlt,
  FaSyncAlt,
} from "react-icons/fa";
import Loader from "../Loader/Loader";

const WeatherForecast = () => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);
  const API_KEY = "3919f2231e07934b2048b0f97d3d5040"; // Replace with your API key

  // Fetch weather based on coordinates
  const fetchWeather = async (lat, lon) => {
    try {
      setLoading(true);
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
      );
      const data = await response.json();
      setWeather({
        temperature: `${Math.round(data.main.temp)}°C`,
        condition: data.weather[0].main,
        humidity: `${data.main.humidity}%`,
        windSpeed: `${Math.round(data.wind.speed)} km/h`,
        date: new Date().toLocaleDateString(),
        city: data.name,
        icon: getWeatherIcon(data.weather[0].main),
        feelsLike: `${Math.round(data.main.feels_like)}°C`,
      });
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch weather data");
      setLoading(false);
    }
  };

  // Get user's location
  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ lat: latitude, lon: longitude });
          fetchWeather(latitude, longitude);
        },
        (err) => {
          setError("Please allow location access to get local weather");
          setLoading(false);
        }
      );
    } else {
      setError("Geolocation is not supported by your browser");
      setLoading(false);
    }
  };

  // Weather icon mapping
  const getWeatherIcon = (condition) => {
    const iconClass = "text-5xl md:text-6xl transition-all duration-300";
    switch (condition.toLowerCase()) {
      case "clear":
        return (
          <FaSun className={`${iconClass} text-yellow-500 animate-pulse}`} />
        );
      case "clouds":
        return <FaCloud className={`${iconClass} text-gray-500`} />;
      case "rain":
        return (
          <FaCloudRain
            className={`${iconClass} text-blue-500 animate-bounce`}
          />
        );
      case "snow":
        return (
          <FaSnowflake
            className={`${iconClass} text-blue-300 animate-spin-slow`}
          />
        );
      default:
        return (
          <FaSun className={`${iconClass} text-yellow-500 animate-pulse}`} />
        );
    }
  };

  // Initial fetch
  useEffect(() => {
    getLocation();
  }, []);

  // Refresh weather
  const handleRefresh = () => {
    if (location) {
      fetchWeather(location.lat, location.lon);
    } else {
      getLocation();
    }
  };

  // Loading state
  if (loading) {
    // return (
    //   <div className="bg-white p-6 rounded-xl shadow-lg flex justify-center items-center h-72">
    //     <div className="animate-spin rounded-full h-10 w-10 border-4 border-green-600 border-t-transparent"></div>
    //   </div>
    // );

    return <Loader />
  }

  // Error state
  if (error) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-lg h-72 flex flex-col items-center justify-center">
        <p className="text-red-500 mb-4">{error}</p>
        <button
          onClick={getLocation}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl md:text-2xl font-bold text-gray-800 flex items-center gap-2">
          <FaMapMarkerAlt className="text-green-600" />
          Weather in {weather.city}
        </h3>
        <button
          onClick={handleRefresh}
          className="p-2 rounded-full hover:bg-gray-200 transition-colors duration-200"
          title="Refresh weather"
        >
          <FaSyncAlt
            className={`text-gray-600 ${loading ? "animate-spin" : ""}`}
          />
        </button>
      </div>

      <div className="flex flex-col md:flex-row items-center gap-6">
        {/* Weather Icon and Condition */}
        <div className="flex flex-col items-center">
          {weather.icon}
          <div className="text-lg md:text-xl font-semibold capitalize text-gray-700 mt-2">
            {weather.condition}
          </div>
        </div>

        {/* Weather Details */}
        <div className="flex-1 space-y-3">
          <div className="flex items-center gap-3">
            <span className="text-4xl md:text-5xl font-bold text-gray-800">
              {weather.temperature}
            </span>
            <span className="text-sm text-gray-500">
              Feels like: {weather.feelsLike}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 bg-gray-100 p-4 rounded-lg">
            <div className="flex items-center gap-2 text-gray-700">
              <FaTint className="text-blue-500" />
              <span className="text-sm">Humidity: {weather.humidity}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-700">
              <FaWind className="text-gray-500" />
              <span className="text-sm">Wind: {weather.windSpeed}</span>
            </div>
          </div>

          <div className="text-sm text-gray-500 text-center md:text-left">
            {weather.date}
          </div>
        </div>
      </div>

      {/* Quick Tips */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <p className="text-sm text-gray-600 italic">
          {weather.condition === "Rain"
            ? "Tip: Protect crops from excess water"
            : weather.condition === "Clear"
            ? "Tip: Good day for harvesting"
            : "Tip: Monitor crop conditions"}
        </p>
      </div>
    </div>
  );
};

// Add these to your CSS or Tailwind config
const customAnimations = `
  @keyframes spin-slow {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  .animate-spin-slow {
    animation: spin-slow 3s linear infinite;
  }
`;

export default WeatherForecast;
