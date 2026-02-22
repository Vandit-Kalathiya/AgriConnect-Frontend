import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { FaCloudRain, FaExclamationTriangle, FaBell } from "react-icons/fa";
import { OPENWEATHER_API_KEY } from "../../config/apiConfig";

const AlertsPanel = () => {
  const [weatherAlerts, setWeatherAlerts] = useState([]);
  const API_KEY = OPENWEATHER_API_KEY; // Your OpenWeatherMap API key

  // Function to fetch weather data based on coordinates
  const fetchWeatherData = async (lat, lon) => {
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
      );
      const weatherData = response.data;
      processWeatherData(weatherData);
    } catch (error) {
      console.error("Error fetching weather data:", error);
      setWeatherAlerts([
        {
          type: "Weather",
          message: "Unable to fetch weather data",
          icon: <FaExclamationTriangle />,
        },
      ]);
    }
  };

  // Function to process weather data and generate alerts
  const processWeatherData = (data) => {
    const alerts = [];

    // Example conditions for alerts
    if (data.weather[0].main === "Rain" && data.rain && data.rain["1h"] > 5) {
      alerts.push({
        type: "Weather",
        message: "Heavy rain expected soon",
        icon: <FaCloudRain />,
      });
    }
    if (data.main.temp < 0) {
      alerts.push({
        type: "Weather",
        message: "Freezing temperatures detected",
        icon: <FaExclamationTriangle />,
      });
    }
    if (data.wind.speed > 10) {
      alerts.push({
        type: "Weather",
        message: "High winds in your area",
        icon: <FaExclamationTriangle />,
      });
    }

    // If no specific alerts, show current weather description
    if (alerts.length === 0) {
      alerts.push({
        type: "Weather",
        message: `Current weather: ${data.weather[0].description}`,
        icon: <FaCloudRain />,
      });
    }

    setWeatherAlerts(alerts);
  };

  // Fetch user's location and weather data on component mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetchWeatherData(latitude, longitude);
        },
        (error) => {
          console.error("Error getting location:", error);
          setWeatherAlerts([
            {
              type: "Weather",
              message: "Location access denied. Please enable it.",
              icon: <FaExclamationTriangle />,
            },
          ]);
        }
      );
    } else {
      setWeatherAlerts([
        {
          type: "Weather",
          message: "Geolocation is not supported by your browser.",
          icon: <FaExclamationTriangle />,
        },
      ]);
    }
  }, []);

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-orange-500 to-red-500 p-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <FaBell className="animate-pulse" />
          Alerts & Notifications
        </h2>
      </div>

      <div className="p-4">
        <div className="space-y-3">
          {weatherAlerts.length > 0 ? (
            weatherAlerts.map((alert, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start gap-3 p-3 bg-gradient-to-r from-orange-50 to-red-50 rounded-xl border-l-4 border-orange-500 hover:shadow-md transition-all duration-300"
              >
                <div className="p-2 bg-white rounded-full shadow-sm">
                  <span className="text-orange-600">{alert.icon}</span>
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-800 text-sm">
                    {alert.type}
                  </p>
                  <p className="text-xs text-gray-600 mt-1">{alert.message}</p>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="flex items-center justify-center py-6">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-2"></div>
                <p className="text-sm text-gray-500">Fetching alerts...</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AlertsPanel;
