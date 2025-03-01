import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaCloudRain, FaExclamationTriangle } from "react-icons/fa";

const AlertsPanel = () => {
  const [weatherAlerts, setWeatherAlerts] = useState([]);
  const API_KEY = "3919f2231e07934b2048b0f97d3d5040"; // Your OpenWeatherMap API key

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
    <div className="bg-white p-6 rounded-xl shadow-lg">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Alerts</h2>
      <ul className="space-y-3">
        {weatherAlerts.length > 0 ? (
          weatherAlerts.map((alert, index) => (
            <li
              key={index}
              className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg"
            >
              <span className="text-green-600">{alert.icon}</span>
              <div>
                <span className="font-semibold">{alert.type}:</span>
                <span className="ml-1 text-gray-700">{alert.message}</span>
              </div>
            </li>
          ))
        ) : (
          <li className="text-gray-500">Fetching weather data...</li>
        )}
      </ul>
    </div>
  );
};

export default AlertsPanel;
