import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import axios from "axios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import {
  WiHumidity,
  WiWindy,
  WiSunrise,
  WiSunset,
  WiBarometer,
  WiDaySunny,
  WiCloudy,
  WiRain,
  WiSnow,
  WiThunderstorm,
  WiDayCloudy,
} from "react-icons/wi";
import { FaRegCompass, FaSearch, FaMapMarkerAlt } from "react-icons/fa";
import Loader from "../Loader/Loader";
import RainfallAdvisory from "./RainfallAdvisory"; // Import the new component

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const WeatherDashboard = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [city, setCity] = useState(null);
  const [searchInput, setSearchInput] = useState("");
  const [citySuggestions, setCitySuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const API_KEY = "3919f2231e07934b2048b0f97d3d5040";

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          fetchWeatherByCoords(
            position.coords.latitude,
            position.coords.longitude
          );
        },
        (err) => {
          console.error("Geolocation error:", err);
          setCity("Anand");
        }
      );
    } else {
      setCity("Anand");
    }
  }, []);

  useEffect(() => {
    if (city) fetchWeatherData();
  }, [city]);

  const fetchWeatherByCoords = async (lat, lon) => {
    setIsLoading(true);
    try {
      const geoResponse = await axios.get(
        `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${API_KEY}`
      );
      setCity(
        geoResponse.data.length > 0
          ? `${geoResponse.data[0].name}, ${
              geoResponse.data[0].state || geoResponse.data[0].country
            }`
          : "Anand"
      );
      const weatherResponse = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
      );
      setWeatherData(weatherResponse.data);
      setError(null);
    } catch (error) {
      console.error("Error fetching weather by coords:", error);
      setError("Unable to fetch weather data. Using default city.");
      setCity("Anand");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchWeatherData = async () => {
    setIsLoading(true);
    try {
      const geoResponse = await axios.get(
        `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${API_KEY}`
      );
      if (geoResponse.data.length === 0) throw new Error("City not found");
      const { lat, lon } = geoResponse.data[0];
      const weatherResponse = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
      );
      setWeatherData(weatherResponse.data);
      setError(null);
    } catch (error) {
      console.error("Error fetching weather data:", error);
      setError("City not found. Please enter a valid city name.");
      setWeatherData(null);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCitySuggestions = async (query) => {
    if (!query.trim()) {
      setCitySuggestions([]);
      return;
    }
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5&appid=${API_KEY}`
      );
      setCitySuggestions(response.data);
    } catch (error) {
      console.error("Error fetching city suggestions:", error);
      setCitySuggestions([]);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCity(searchInput);
    setCitySuggestions([]);
  };

  const handleCitySelect = (selectedCity) => {
    setCity(
      `${selectedCity.name}, ${selectedCity.state || selectedCity.country}`
    );
    setSearchInput(
      `${selectedCity.name}, ${selectedCity.state || selectedCity.country}`
    );
    setCitySuggestions([]);
  };

  const getWeatherIcon = (condition) => {
    const code = condition.toLowerCase();
    if (code.includes("clear"))
      return <WiDaySunny className="text-4xl md:text-5xl text-yellow-500" />;
    if (code.includes("cloud"))
      return <WiCloudy className="text-4xl md:text-5xl text-gray-400" />;
    if (code.includes("rain"))
      return <WiRain className="text-4xl md:text-5xl text-blue-400" />;
    if (code.includes("snow"))
      return <WiSnow className="text-4xl md:text-5xl text-blue-100" />;
    if (code.includes("thunder"))
      return (
        <WiThunderstorm className="text-4xl md:text-5xl text-purple-500" />
      );
    return <WiDayCloudy className="text-4xl md:text-5xl text-gray-300" />;
  };

  const formatChartData = (data) => {
    if (!data) return null;
    const hourlyData = data.list.slice(0, 8);
    return {
      labels: hourlyData.map((item) =>
        new Date(item.dt * 1000).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })
      ),
      datasets: [
        {
          label: "Temperature (°C)",
          data: hourlyData.map((item) => Math.round(item.main.temp)),
          borderColor: "rgba(66, 133, 244, 0.8)",
          backgroundColor: "rgba(66, 133, 244, 0.2)",
          tension: 0.4,
          fill: true,
        },
      ],
    };
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "rgba(15, 23, 42, 0.8)",
        titleColor: "#fff",
        bodyColor: "#fff",
        padding: 8,
        displayColors: false,
      },
    },
    scales: {
      y: {
        beginAtZero: false,
        ticks: { color: "#64748b", font: { size: 10 } },
        grid: { color: "rgba(148, 163, 184, 0.1)" },
      },
      x: {
        ticks: { color: "#64748b", font: { size: 8, md: 10 } },
        grid: { display: false },
      },
    },
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center px-4 md:mt-40 md:ml-16 min-h-96">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 md:ml-16">
        <div className="text-center p-6 md:p-8 w-full max-w-md bg-white rounded-xl shadow-lg">
          <div className="text-red-500 text-4xl md:text-5xl mb-4">⚠️</div>
          <h2 className="text-lg md:text-2xl font-bold text-slate-800 mb-2">
            {error}
          </h2>
          <form onSubmit={handleSearch} className="flex gap-2 mt-4">
            <input
              type="text"
              value={searchInput}
              onChange={(e) => {
                setSearchInput(e.target.value);
                fetchCitySuggestions(e.target.value);
              }}
              placeholder="Enter city name..."
              className="flex-1 p-2 md:p-3 text-sm md:text-md rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="p-2 md:p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors shadow-md"
            >
              <FaSearch className="text-md md:text-lg" />
            </button>
          </form>
          {citySuggestions.length > 0 && (
            <ul className="mt-2 bg-white rounded-lg shadow-lg max-h-40 overflow-y-auto border border-slate-200 w-full">
              {citySuggestions.map((suggestion, index) => (
                <li
                  key={index}
                  className="p-2 hover:bg-jewel-100 cursor-pointer text-xs md:text-sm text-slate-700"
                  onClick={() => handleCitySelect(suggestion)}
                >
                  {suggestion.name}, {suggestion.state || suggestion.country}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    );
  }

  const current = weatherData.list[0];
  const forecast = weatherData.list
    .filter((item, index) => index % 8 === 0)
    .slice(0, 5);

  return (
    <div className="bg-gray-50 px-4 md:px-6 lg:px-8 py-6 ml-0 md:ml-16 mt-16 md:mt-20 min-h-screen">
      <div className="max-w-full md:max-w-5xl mx-auto">
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg p-4 mb-4 md:mb-6 flex flex-col gap-4 md:flex-row md:justify-between md:items-center">
          <div className="flex items-center space-x-2 md:space-x-3">
            <span className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-jewel-700 to-jewel-600">
              Weather
            </span>
            <span className="text-yellow-500 text-xl md:text-2xl">☀️</span>
          </div>
          <form
            onSubmit={handleSearch}
            className="flex gap-2 w-full md:w-auto md:max-w-xs"
          >
            <div className="relative flex-1">
              <span className="absolute left-2 md:left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm md:text-md">
                <FaMapMarkerAlt />
              </span>
              <input
                type="text"
                value={searchInput}
                onChange={(e) => {
                  setSearchInput(e.target.value);
                  fetchCitySuggestions(e.target.value);
                }}
                placeholder="Search cities..."
                className="w-full p-2 md:p-3 pl-8 md:pl-10 text-sm md:text-md rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-jewel-500 shadow-sm bg-white/80"
              />
              {citySuggestions.length > 0 && (
                <ul className="absolute mt-1 bg-white rounded-lg shadow-lg max-h-40 overflow-y-auto border border-slate-200 w-full z-10">
                  {citySuggestions.map((suggestion, index) => (
                    <li
                      key={index}
                      className="p-2 hover:bg-jewel-100 cursor-pointer text-xs md:text-sm text-slate-700"
                      onClick={() => handleCitySelect(suggestion)}
                    >
                      {suggestion.name},{" "}
                      {suggestion.state || suggestion.country}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <button
              type="submit"
              className="p-2 md:p-3 bg-jewel-500 text-white rounded-lg hover:bg-jewel-600 transition-colors shadow-md"
            >
              <FaSearch className="text-md md:text-lg" />
            </button>
          </form>
        </header>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          {/* Left Section: Current Weather & Rainfall Advisory */}
          <div className="lg:col-span-1 space-y-4 md:space-y-6">
            {/* Current Weather */}
            <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg p-4 md:p-6 flex flex-col">
              <div className="flex flex-col gap-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-lg md:text-xl font-bold text-slate-800">
                      Current Weather
                    </h2>
                    <p className="text-xs md:text-sm text-slate-500">
                      {new Date().toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                  <div className="bg-jewel-500/10 rounded-lg px-2 md:px-3 py-1">
                    <p className="text-jewel-600 text-xs md:text-sm font-medium">
                      {weatherData.city.name}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col items-center space-y-4 my-2 md:my-4">
                  {getWeatherIcon(current.weather[0].description)}
                  <div className="text-center">
                    <p className="text-4xl md:text-6xl font-bold text-slate-800">
                      {Math.round(current.main.temp)}°C
                    </p>
                    <p className="text-md md:text-lg text-slate-500 capitalize">
                      {current.weather[0].description}
                    </p>
                  </div>
                </div>

                <p className="text-center text-xs md:text-sm text-slate-600">
                  Feels like {Math.round(current.main.feels_like)}°C • Min{" "}
                  {Math.round(current.main.temp_min)}°C • Max{" "}
                  {Math.round(current.main.temp_max)}°C
                </p>
              </div>

              {/* Weather Details */}
              <div className="grid grid-cols-2 gap-2 md:gap-3 mt-4 md:mt-auto">
                <div className="flex items-center space-x-2 md:space-x-3 bg-blue-50 rounded-xl p-2 md:p-3">
                  <WiHumidity className="text-blue-600 text-2xl md:text-3xl" />
                  <div>
                    <p className="text-xs text-slate-500">Humidity</p>
                    <p className="text-md md:text-lg font-semibold text-slate-700">
                      {current.main.humidity}%
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2 md:space-x-3 bg-green-50 rounded-xl p-2 md:p-3">
                  <WiWindy className="text-green-600 text-2xl md:text-3xl" />
                  <div>
                    <p className="text-xs text-slate-500">Wind</p>
                    <p className="text-md md:text-lg font-semibold text-slate-700">
                      {current.wind.speed} m/s
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2 md:space-x-3 bg-amber-50 rounded-xl p-2 md:p-3">
                  <WiSunrise className="text-amber-600 text-2xl md:text-3xl" />
                  <div>
                    <p className="text-xs text-slate-500">Sunrise</p>
                    <p className="text-md md:text-lg font-semibold text-slate-700">
                      {new Date(current.sys.sunrise * 1000).toLocaleTimeString(
                        [],
                        { hour: "2-digit", minute: "2-digit" }
                      )}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2 md:space-x-3 bg-purple-50 rounded-xl p-2 md:p-3">
                  <WiSunset className="text-purple-600 text-2xl md:text-3xl" />
                  <div>
                    <p className="text-xs text-slate-500">Sunset</p>
                    <p className="text-md md:text-lg font-semibold text-slate-700">
                      {new Date(current.sys.sunset * 1000).toLocaleTimeString(
                        [],
                        { hour: "2-digit", minute: "2-digit" }
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Rainfall Advisory */}
            <RainfallAdvisory />
          </div>

          {/* Middle and Right Section */}
          <div className="lg:col-span-2 space-y-4 md:space-y-6">
            {/* Today's Temperature Chart */}
            <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg p-4 md:p-6">
              <h2 className="text-lg md:text-xl font-bold text-slate-800 mb-2 md:mb-4">
                Today's Temperature
              </h2>
              <div className="h-48 md:h-64">
                <Line
                  data={formatChartData(weatherData)}
                  options={chartOptions}
                />
              </div>
            </div>

            {/* 5-Day Forecast */}
            <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg p-4 md:p-6">
              <h2 className="text-lg md:text-xl font-bold text-slate-800 mb-2 md:mb-4">
                5-Day Forecast
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 md:gap-4">
                {forecast.map((day, index) => (
                  <div
                    key={index}
                    className="p-2 md:p-4 bg-gradient-to-b from-white to-blue-50 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-slate-100 flex flex-col items-center"
                  >
                    <p className="text-xs md:text-sm font-medium text-slate-800">
                      {index === 0
                        ? "Today"
                        : new Date(day.dt * 1000).toLocaleDateString("en-US", {
                            weekday: "short",
                          })}
                    </p>
                    <p className="text-xs text-slate-500">
                      {new Date(day.dt * 1000).toLocaleDateString("en-US", {
                        day: "numeric",
                        month: "short",
                      })}
                    </p>
                    {getWeatherIcon(day.weather[0].description)}
                    <p className="text-xs md:text-sm text-slate-600 mt-1 capitalize">
                      {day.weather[0].description}
                    </p>
                    <div className="mt-1 md:mt-2 flex items-center space-x-1 md:space-x-2">
                      <span className="text-blue-500 text-xs">
                        ↓{Math.round(day.main.temp_min)}°
                      </span>
                      <span className="text-red-500 text-xs">
                        ↑{Math.round(day.main.temp_max)}°
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Additional Weather Info Card */}
            <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg p-4 md:p-6">
              <h2 className="text-lg md:text-xl font-bold text-slate-800 mb-2 md:mb-4">
                Additional Details
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 md:gap-4">
                <div className="flex flex-col items-center p-2 md:p-3 bg-slate-50 rounded-xl">
                  <FaRegCompass className="text-teal-600 text-sm md:text-base mb-1 md:mb-2" />
                  <p className="text-xs text-slate-500">Wind Direction</p>
                  <p className="text-md md:text-lg font-semibold text-slate-700">
                    {(() => {
                      const deg = current.wind.deg;
                      if (deg >= 337.5 || deg < 22.5) return "N";
                      if (deg >= 22.5 && deg < 67.5) return "NE";
                      if (deg >= 67.5 && deg < 112.5) return "E";
                      if (deg >= 112.5 && deg < 157.5) return "SE";
                      if (deg >= 157.5 && deg < 202.5) return "S";
                      if (deg >= 202.5 && deg < 247.5) return "SW";
                      if (deg >= 247.5 && deg < 292.5) return "W";
                      return "NW";
                    })()}
                    <span className="text-xs ml-1">({current.wind.deg}°)</span>
                  </p>
                </div>
                <div className="flex flex-col items-center p-2 md:p-3 bg-slate-50 rounded-xl">
                  <WiBarometer className="text-slate-600 text-xl md:text-2xl mb-1 md:mb-2" />
                  <p className="text-xs text-slate-500">Pressure</p>
                  <p className="text-md md:text-lg font-semibold text-slate-700">
                    {current.main.pressure} <span className="text-xs">hPa</span>
                  </p>
                </div>
                <div className="flex flex-col items-center p-2 md:p-3 bg-slate-50 rounded-xl">
                  <WiCloudy className="text-blue-400 text-xl md:text-2xl mb-1 md:mb-2" />
                  <p className="text-xs text-slate-500">Clouds</p>
                  <p className="text-md md:text-lg font-semibold text-slate-700">
                    {current.clouds.all}%
                  </p>
                </div>
                <div className="flex flex-col items-center p-2 md:p-3 bg-slate-50 rounded-xl">
                  <WiDaySunny className="text-yellow-500 text-xl md:text-2xl mb-1 md:mb-2" />
                  <p className="text-xs text-slate-500">Visibility</p>
                  <p className="text-md md:text-lg font-semibold text-slate-700">
                    {(current.visibility / 1000).toFixed(1)}{" "}
                    <span className="text-xs">km</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherDashboard;
