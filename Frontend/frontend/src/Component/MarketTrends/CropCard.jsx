import React, { useState } from "react";
import {
  FaArrowUp,
  FaArrowDown,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";
import PriceChart from "./PriceChart";

const CropCard = ({ cropData }) => {
  const [expanded, setExpanded] = useState(false);

  const historicalData = cropData.historicalData || [];
  const forecastData = cropData.forecastData || [];

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col gap-6">
      {/* Crop Header */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-2">
        <h2 className="text-3xl font-bold text-gray-800">{cropData.crop}</h2>
        <div className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full">
          {cropData.trendUp ? (
            <FaArrowUp className="text-green-600 text-xl" />
          ) : (
            <FaArrowDown className="text-red-600 text-xl" />
          )}
          <span
            className={`text-lg font-semibold ${
              cropData.trendUp ? "text-green-600" : "text-red-600"
            }`}
          >
            {cropData.trend}
          </span>
        </div>
      </div>

      {/* Key Price Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <div className="bg-green-50 p-4 rounded-lg text-center border border-green-200">
          <p className="text-xl font-semibold text-green-800">Best Price</p>
          <p className="text-2xl font-bold text-green-600 mt-2">
            {cropData.prices.bestMarketPrice}
          </p>
          <p className="text-lg text-gray-700 mt-1">
            {cropData.prices.bestPriceMarket}
          </p>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg text-center border border-yellow-200">
          <p className="text-xl font-semibold text-yellow-800">Average Price</p>
          <p className="text-2xl font-bold text-yellow-600 mt-2">
            {cropData.prices.averageMarketPrice}
          </p>
        </div>
        <div className="bg-red-50 p-4 rounded-lg text-center border border-red-200">
          <p className="text-xl font-semibold text-red-800">Lowest Price</p>
          <p className="text-2xl font-bold text-red-600 mt-2">
            {cropData.prices.lowestMarketPrice}
          </p>
          <p className="text-lg text-gray-700 mt-1">
            {cropData.prices.lowestPriceMarket}
          </p>
        </div>
      </div>

      {/* Detailed Prices */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-lg font-semibold text-gray-700">Per Kg</p>
          <p className="text-xl font-bold text-gray-800 mt-1">
            {cropData.prices.kgPrice}
          </p>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-lg font-semibold text-gray-700">Per 10 Kg</p>
          <p className="text-xl font-bold text-gray-800 mt-1">
            {cropData.prices.tenKgPrice}
          </p>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-lg font-semibold text-gray-700">Per Quintal</p>
          <p className="text-xl font-bold text-gray-800 mt-1">
            {cropData.prices.quintalPrice}
          </p>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-lg font-semibold text-gray-700">Per Ton</p>
          <p className="text-xl font-bold text-gray-800 mt-1">
            {cropData.prices.tonPrice}
          </p>
        </div>
      </div>

      {/* Market Prices by Region */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="flex justify-between items-center mb-2">
          <p className="text-lg font-semibold text-gray-700">
            Prices by Market
          </p>
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-green-600 hover:text-green-700 flex items-center gap-1 text-base"
          >
            {expanded ? (
              <>
                <span>Show Less</span>
                <FaChevronUp className="text-lg" />
              </>
            ) : (
              <>
                <span>Show More</span>
                <FaChevronDown className="text-lg" />
              </>
            )}
          </button>
        </div>
        <div
          className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 transition-all duration-300 ${
            expanded ? "max-h-full" : "max-h-32 overflow-hidden"
          }`}
        >
          {Object.entries(cropData.prices.marketPrices).map(
            ([market, price], idx) => (
              <div key={idx} className="flex justify-between text-gray-800">
                <span className="text-lg truncate">{market}</span>
                <span className="text-lg font-medium">{price} / Quintal</span>
              </div>
            )
          )}
        </div>
      </div>

      {/* Price Trends Chart */}
      {expanded && (
        <PriceChart
          historicalData={historicalData}
          forecastData={forecastData}
          crop={cropData.crop}
        />
      )}

      {/* Summary */}
      <div className="bg-blue-50 p-4 rounded-lg">
        <p className="text-lg font-semibold text-blue-800">Summary</p>
        <p className="text-lg text-gray-700 mt-1">{cropData.summary}</p>
      </div>
    </div>
  );
};

export default CropCard;
