// import React from "react";

// const CropAdvisory = () => {
//   const advice = [
//     {
//       type: "Rotation",
//       message: "Consider soybeans after wheat for soil health",
//     },
//     { type: "Pest", message: "Monitor for aphids; apply neem oil if needed" },
//   ];

//   return (
//     <div className="bg-white p-6 rounded-xl shadow-lg">
//       <h2 className="text-xl font-bold mb-4 text-gray-800">AI Crop Advisory</h2>
//       <ul className="space-y-3">
//         {advice.map((item, index) => (
//           <li key={index} className="flex items-start gap-2">
//             <span className="text-green-600 font-semibold">{item.type}:</span>
//             <span className="text-gray-700">{item.message}</span>
//           </li>
//         ))}
//       </ul>
//       <button className="mt-4 w-full p-2 bg-jewel-600 text-white rounded-lg hover:bg-jewel-700">
//         View Detailed Report
//       </button>
//     </div>
//   );
// };

// export default CropAdvisory;

import React, { useState, useEffect } from "react";
import axios from "axios";
import Loader from "../Loader/Loader";

const CropAdvisory = () => {
  const [state, setState] = useState("");
  const [district, setDistrict] = useState("");
  const [season, setSeason] = useState("");
  const [suggestedCrops, setSuggestedCrops] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [locationMode, setLocationMode] = useState("manual");
  const [liveLocation, setLiveLocation] = useState(null);

  const seasons = [
    "Kharif",
    "Rabi",
    "Winter",
    "Summer",
    "Whole Year",
    "Autumn",
  ];

  // Fetch live location
  const fetchLiveLocation = () => {
    if (navigator.geolocation) {
      setIsLoading(true);
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setLiveLocation({ lat: latitude, lon: longitude });
          const locationData = await reverseGeocode(latitude, longitude);
          setDistrict(locationData.district || "Unknown District");
          setState(locationData.state || "Unknown State");
          setIsLoading(false);
        },
        (error) => {
          console.error("Location error:", error);
          setError("Unable to fetch live location. Please try manual entry.");
          setIsLoading(false);
        }
      );
    } else {
      setError("Geolocation is not supported by your browser.");
    }
  };

  // Reverse geocode using Nominatim OpenStreetMap API
  const reverseGeocode = async (lat, lon) => {
    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`
      );
      const address = response.data.address;
      return {
        district: address.county || address.city_district || "N/A",
        state: address.state || "N/A",
      };
    } catch (error) {
      console.error("Error reverse geocoding:", error);
      return { district: "N/A", state: "N/A" };
    }
  };

  useEffect(() => {
    if (locationMode === "live") {
      fetchLiveLocation();
      setDistrict("");
      setState("");
    }
  }, [locationMode]);

  const handleGetAdvice = async () => {
    if (!state.trim() || !district.trim() || !season) {
      setError("Please fill in all fields.");
      return;
    }

    setIsLoading(true);
    setError("");
    setSuggestedCrops([]);

    try {
      const response = await axios.get(
        `http://192.168.137.175:5001/predict?state=${encodeURIComponent(
          state
        )}&district=${encodeURIComponent(district)}&season=${encodeURIComponent(
          season
        )}`
      );
      console.log("API Response:", response.data);

      const predictions = response.data.predictions;
      const sortedCrops = Object.entries(predictions)
        .map(([crop, percentage]) => ({
          name: crop,
          percentage: parseFloat(percentage.replace("%", "")),
        }))
        .sort((a, b) => b.percentage - a.percentage)
        .slice(0, 5);

      setSuggestedCrops(sortedCrops);
    } catch (error) {
      console.error("Error fetching crop advice:", error);
      setError("Failed to fetch crop suggestions. Please try again.");
      setSuggestedCrops([
        { name: "Wheat", percentage: 7 },
        { name: "Rice", percentage: 6 },
        { name: "Soybean", percentage: 5 },
        { name: "Maize", percentage: 4 },
        { name: "Cotton", percentage: 3 },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleManualChange = (e) => {
    const { name, value } = e.target;
    if (name === "district") setDistrict(value);
    if (name === "state") setState(value);
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-3 text-gray-800 flex items-center">
        <span className="mr-2">🌾</span> AI Crop Advisory
      </h2>

      {/* Location Mode Toggle */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setLocationMode("manual")}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            locationMode === "manual"
              ? "bg-green-600 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          Manual Entry
        </button>
        <button
          onClick={() => setLocationMode("live")}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            locationMode === "live"
              ? "bg-green-600 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          Live Tracking
        </button>
      </div>

      {/* Input Fields */}
      <div className="space-y-2 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            State
          </label>
          <input
            type="text"
            name="state"
            value={state}
            onChange={handleManualChange}
            placeholder="e.g., Gujarat"
            disabled={locationMode === "live"}
            className={`w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition ${
              locationMode === "live" ? "bg-gray-100 cursor-not-allowed" : ""
            }`}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            District
          </label>
          <input
            type="text"
            name="district"
            value={district}
            onChange={handleManualChange}
            placeholder="e.g., Amreli"
            disabled={locationMode === "live"}
            className={`w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition ${
              locationMode === "live" ? "bg-gray-100 cursor-not-allowed" : ""
            }`}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Season
          </label>
          <select
            value={season}
            onChange={(e) => setSeason(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition"
          >
            <option value="">Select Season</option>
            {seasons.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        {/* Get Crop Advice Button */}
        <button
          onClick={handleGetAdvice}
          disabled={isLoading}
          className={`w-full p-2 rounded-lg text-white font-medium transition-all duration-300 shadow-md ${
            isLoading ? "cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
          }`}
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <Loader />
            </span>
          ) : (
            "Get Crop Advice"
          )}
        </button>

        {/* Error Message */}
        {error && (
          <p className="text-red-500 text-sm text-center animate-fadeIn">
            {error}
          </p>
        )}
      </div>

      {/* Suggested Crops List */}
      {suggestedCrops.length > 0 && (
        <div className="mt-6 animate-slideUp">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            Top Suggested Crops
          </h3>
          <div className="flex flex-wrap gap-2 p-2 rounded-lg">
            {suggestedCrops.map((crop, index) => (
              <span
                key={index}
                className="flex items-center gap-1 px-3 py-1 bg-green-50 text-green-800 rounded-full shadow-sm hover:bg-green-100 transition"
              >
                <span className="text-green-600">🌱</span>
                {crop.name}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* No Suggestions Yet */}
      {!isLoading && suggestedCrops.length === 0 && !error && (
        <p className="text-gray-500 text-center mt-6 italic">
          Enter details above to get crop suggestions from AI.
        </p>
      )}
    </div>
  );
};

// Animation keyframes (add to your CSS file, e.g., index.css)
const styles = `
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  @keyframes slideUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .animate-fadeIn { animation: fadeIn 0.5s ease-in; }
  .animate-slideUp { animation: slideUp 0.5s ease-in; }
`;

export default CropAdvisory;