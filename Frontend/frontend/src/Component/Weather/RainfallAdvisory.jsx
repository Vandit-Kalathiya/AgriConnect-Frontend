import React, { useState } from "react";
import axios from "axios";

const RainfallAdvisory = () => {
  const [state, setState] = useState("");
  const [month, setMonth] = useState("");
  const [rainfallPrediction, setRainfallPrediction] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const regions = [
    "ANDAMAN & NICOBAR ISLANDS",
    "ARUNACHAL PRADESH",
    "ASSAM & MEGHALAYA",
    "NAGA MANI MIZO TRIPURA",
    "SUB HIMALAYAN WEST BENGAL SIKKIM",
    "GANGETIC WEST BENGAL",
    "ORISSA",
    "JHARKHAND",
    "BIHAR",
    "EAST UTTAR PRADESH",
    "WEST UTTAR PRADESH",
    "UTTARAKHAND",
    "HARYANA DELHI & CHANDIGARH",
    "PUNJAB",
    "HIMACHAL PRADESH",
    "JAMMU & KASHMIR",
    "GUJARAT",
    "WEST RAJASTHAN",
    "EAST RAJASTHAN",
    "WEST MADHYA PRADESH",
    "EAST MADHYA PRADESH",
    "GUJARAT REGION",
    "SAURASHTRA & KUTCH",
    "KONKAN & GOA",
    "MADHYA MAHARASHTRA",
    "MATATHWADA",
    "VIDARBHA",
    "CHHATTISGARH",
    "COASTAL ANDHRA PRADESH",
    "TELANGANA",
    "RAYALSEEMA",
    "TAMIL NADU",
    "COASTAL KARNATAKA",
    "NORTH INTERIOR KARNATAKA",
    "SOUTH INTERIOR KARNATAKA",
    "KERALA",
    "LAKSHADWEEP",
  ];

  const months = [
    "JAN",
    "FEB",
    "MAR",
    "APR",
    "MAY",
    "JUN",
    "JUL",
    "AUG",
    "SEP",
    "OCT",
    "NOV",
    "DEC",
  ];

  const handleGetRainfall = async () => {
    if (!state || !month) {
      setError("Please select both region and month.");
      return;
    }

    setIsLoading(true);
    setError("");
    setRainfallPrediction(null);

    try {
      // Replace with your actual ML model API endpoint for rainfall prediction
      const response = await axios.get(
        `http://192.168.137.175:5000/predict_rainfall?state=${encodeURIComponent(
          state
        )}&month=${encodeURIComponent(month)}`
      );
      console.log("Rainfall Response:", response.data);
      setRainfallPrediction(response.data.predicted_rainfall); // Expecting a number (e.g., rainfall in mm)
    } catch (error) {
      console.error("Error fetching rainfall prediction:", error);
      setError("Failed to fetch rainfall prediction. Please try again.");
      // Mock data for testing
      setRainfallPrediction(120); // Example: 120 mm
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg p-4 md:p-6 flex flex-col">
      <h2 className="text-lg md:text-xl font-bold text-slate-800 mb-4 flex items-center">
        <span className="mr-2">☔</span> Rainfall Advisory
      </h2>

      <div className="space-y-3">
        <div>
          <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">
            Select Region
          </label>
          <select
            value={state}
            onChange={(e) => setState(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-sm"
          >
            <option value="">Select Region</option>
            {regions.map((region) => (
              <option key={region} value={region}>
                {region}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">
            Month
          </label>
          <select
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-sm"
          >
            <option value="">Select Month</option>
            {months.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={handleGetRainfall}
          disabled={isLoading}
          className={`w-full p-2 rounded-lg text-white font-medium transition-all duration-300 shadow-md ${
            isLoading
              ? "bg-blue-400 cursor-not-allowed"
              : "bg-jewel-600 hover:bg-jewel-700"
          }`}
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <svg
                className="animate-spin h-5 w-5 mr-2 text-white"
                viewBox="0 0 24 24"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                  opacity="0.2"
                />
                <path fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              Predicting...
            </span>
          ) : (
            "Get Rainfall Prediction"
          )}
        </button>

        {error && (
          <p className="text-red-500 text-xs text-center animate-fadeIn">
            {error}
          </p>
        )}

        {rainfallPrediction !== null && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg text-center animate-slideUp">
            <p className="text-sm text-gray-600">Predicted Rainfall</p>
            <p className="text-lg font-semibold text-jewel-700">
              {rainfallPrediction} mm
            </p>
            <p className="text-xs text-gray-500 mt-1">
              for {month} in {state}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RainfallAdvisory;
