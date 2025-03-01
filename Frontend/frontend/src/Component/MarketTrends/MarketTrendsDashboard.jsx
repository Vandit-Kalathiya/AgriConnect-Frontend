import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  FaSearch,
  FaArrowUp,
  FaArrowDown,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";
import Loader from "../Loader/Loader";

const MarketTrendsDashboard = () => {
  const [marketData, setMarketData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedMarkets, setExpandedMarkets] = useState({});

  // Mock data with more cities
  const mockMarketData = [
    {
      crop: "Wheat",
      prices: {
        kgPrice: "₹28.62",
        tenKgPrice: "₹286.0",
        quintalPrice: "₹2860.0",
        tonPrice: "₹28600.0",
        averageMarketPrice: "₹2861 / Quintal",
        bestMarketPrice: "₹3950 / Quintal",
        lowestMarketPrice: "₹2000 / Quintal",
        bestPriceMarket: "Shimoga",
        lowestPriceMarket: "Pandariya",
        marketPrices: {
          Chhattisgarh: "₹2860",
          Gujarat: "₹2900",
          Karnataka: "₹3950",
          "Madhya Pradesh": "₹2800",
          Maharashtra: "₹2875",
          "Uttar Pradesh": "₹2850",
          Punjab: "₹2880",
          Haryana: "₹2870",
          Rajasthan: "₹2865",
          "Tamil Nadu": "₹2890",
          Kerala: "₹2900",
          "Andhra Pradesh": "₹2875",
          Telangana: "₹2860",
          Bihar: "₹2855",
          "West Bengal": "₹2885",
        },
      },
      summary:
        "As per the current market rates, the maximum price of Wheat is ₹3950 per Quintal, whereas the minimum rate is ₹2000 per Quintal across varieties. The average price is ₹2861 per Quintal across varieties.",
      trend: "+5%",
      trendUp: true,
    },
    {
      crop: "Rice",
      prices: {
        kgPrice: "₹35.50",
        tenKgPrice: "₹355.0",
        quintalPrice: "₹3550.0",
        tonPrice: "₹35500.0",
        averageMarketPrice: "₹3550 / Quintal",
        bestMarketPrice: "₹4200 / Quintal",
        lowestMarketPrice: "₹2900 / Quintal",
        bestPriceMarket: "Bhubaneswar",
        lowestPriceMarket: "Raipur",
        marketPrices: {
          Chhattisgarh: "₹3550",
          Gujarat: "₹3500",
          Karnataka: "₹3600",
          "Madhya Pradesh": "₹3525",
          Maharashtra: "₹3575",
          "Uttar Pradesh": "₹3540",
          Punjab: "₹3530",
          Haryana: "₹3520",
          Rajasthan: "₹3510",
          "Tamil Nadu": "₹4200",
          Kerala: "₹3555",
          "Andhra Pradesh": "₹3570",
          Telangana: "₹3545",
          Bihar: "₹3535",
          "West Bengal": "₹3560",
        },
      },
      summary:
        "As per the current market rates, the maximum price of Rice is ₹4200 per Quintal, minimum ₹2900 per Quintal. Average price is ₹3550 per Quintal.",
      trend: "-2%",
      trendUp: false,
    },
  ];

  useEffect(() => {
    setTimeout(() => {
      setMarketData(mockMarketData);
      setIsLoading(false);
    }, 1000);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchQuery(searchQuery.trim());
  };

  const toggleMarketExpansion = (crop) => {
    setExpandedMarkets((prev) => ({
      ...prev,
      [crop]: !prev[crop],
    }));
  };

  const filteredData = marketData.filter((item) =>
    item.crop.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white px-4 md:ml-20">
       <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="text-center p-6 bg-white rounded-xl shadow-lg w-full max-w-md">
          <div className="text-red-500 text-5xl md:text-6xl mb-4">⚠️</div>
          <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4">
            {error}
          </h2>
          <p className="text-md md:text-lg text-gray-600 mb-6">
            Please try searching again.
          </p>
          <form onSubmit={handleSearch} className="flex gap-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search crops (e.g., Wheat, Rice)"
              className="flex-1 p-2 md:p-3 text-md md:text-lg rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 shadow-sm"
            />
            <button
              type="submit"
              className="p-2 md:p-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-md"
            >
              <FaSearch className="text-lg md:text-2xl" />
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 md:px-6 lg:px-8 py-6 ml-0 lg:ml-16 mt-20">
      <div className="max-w-full md:max-w-5xl mx-auto">
        {/* Header */}
        <header className="mb-6 text-center">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-green-800 mb-4 md:mb-6">
            Today’s Market Trends
          </h1>
          <form
            onSubmit={handleSearch}
            className="flex justify-center gap-2 max-w-xs md:max-w-md mx-auto"
          >
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search crops (e.g., Wheat, Rice)"
              className="flex-1 p-2 md:p-3 text-md md:text-lg rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 shadow-md placeholder-gray-400"
            />
            <button
              type="submit"
              className="p-2 md:p-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-md"
            >
              <FaSearch className="text-lg md:text-2xl" />
            </button>
          </form>
        </header>

        {/* Market Trends */}
        {filteredData.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-lg md:text-xl text-gray-700 font-medium">
              No Crops Found
            </p>
            <p className="text-md md:text-lg text-gray-500 mt-2">
              Try a different search term.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredData.map((cropData, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-lg p-4 md:p-6 flex flex-col gap-4 md:gap-6"
              >
                {/* Crop Header */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-2">
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
                    {cropData.crop}
                  </h2>
                  <div className="flex items-center gap-2 bg-gray-100 px-2 md:px-3 py-1 rounded-full">
                    {cropData.trendUp ? (
                      <FaArrowUp className="text-green-600 text-lg md:text-xl" />
                    ) : (
                      <FaArrowDown className="text-red-600 text-lg md:text-xl" />
                    )}
                    <span
                      className={`text-md md:text-lg font-semibold ${
                        cropData.trendUp ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {cropData.trend}
                    </span>
                  </div>
                </div>

                {/* Key Price Highlights */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="bg-green-50 p-3 md:p-4 rounded-lg text-center border border-green-200">
                    <p className="text-md md:text-xl font-semibold text-green-800">
                      Best Price
                    </p>
                    <p className="text-lg md:text-2xl font-bold text-green-600 mt-1 md:mt-2">
                      {cropData.prices.bestMarketPrice}
                    </p>
                    <p className="text-sm md:text-lg text-gray-700 mt-1">
                      {cropData.prices.bestPriceMarket}
                    </p>
                  </div>
                  <div className="bg-yellow-50 p-3 md:p-4 rounded-lg text-center border border-yellow-200">
                    <p className="text-md md:text-xl font-semibold text-yellow-800">
                      Average Price
                    </p>
                    <p className="text-lg md:text-2xl font-bold text-yellow-600 mt-1 md:mt-2">
                      {cropData.prices.averageMarketPrice}
                    </p>
                  </div>
                  <div className="bg-red-50 p-3 md:p-4 rounded-lg text-center border border-red-200">
                    <p className="text-md md:text-xl font-semibold text-red-800">
                      Lowest Price
                    </p>
                    <p className="text-lg md:text-2xl font-bold text-red-600 mt-1 md:mt-2">
                      {cropData.prices.lowestMarketPrice}
                    </p>
                    <p className="text-sm md:text-lg text-gray-700 mt-1">
                      {cropData.prices.lowestPriceMarket}
                    </p>
                  </div>
                </div>

                {/* Detailed Prices */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="bg-gray-50 p-3 md:p-4 rounded-lg">
                    <p className="text-sm md:text-lg font-semibold text-gray-700">
                      Per Kg
                    </p>
                    <p className="text-md md:text-xl font-bold text-gray-800 mt-1">
                      {cropData.prices.kgPrice}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-3 md:p-4 rounded-lg">
                    <p className="text-sm md:text-lg font-semibold text-gray-700">
                      Per 10 Kg
                    </p>
                    <p className="text-md md:text-xl font-bold text-gray-800 mt-1">
                      {cropData.prices.tenKgPrice}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-3 md:p-4 rounded-lg">
                    <p className="text-sm md:text-lg font-semibold text-gray-700">
                      Per Quintal
                    </p>
                    <p className="text-md md:text-xl font-bold text-gray-800 mt-1">
                      {cropData.prices.quintalPrice}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-3 md:p-4 rounded-lg">
                    <p className="text-sm md:text-lg font-semibold text-gray-700">
                      Per Ton
                    </p>
                    <p className="text-md md:text-xl font-bold text-gray-800 mt-1">
                      {cropData.prices.tonPrice}
                    </p>
                  </div>
                </div>

                {/* Market Prices by Region */}
                <div className="bg-gray-50 p-3 md:p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-md md:text-lg font-semibold text-gray-700">
                      Prices by Market
                    </p>
                    <button
                      onClick={() => toggleMarketExpansion(cropData.crop)}
                      className="text-green-600 hover:text-green-700 flex items-center gap-1 text-sm md:text-base"
                    >
                      {expandedMarkets[cropData.crop] ? (
                        <>
                          <span>Show Less</span>
                          <FaChevronUp className="text-md md:text-lg" />
                        </>
                      ) : (
                        <>
                          <span>Show More</span>
                          <FaChevronDown className="text-md md:text-lg" />
                        </>
                      )}
                    </button>
                  </div>
                  <div
                    className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 transition-all duration-300 ${
                      expandedMarkets[cropData.crop]
                        ? "max-h-full"
                        : "max-h-24 md:max-h-32 overflow-hidden"
                    }`}
                  >
                    {Object.entries(cropData.prices.marketPrices).map(
                      ([market, price], idx) => (
                        <div
                          key={idx}
                          className="flex justify-between text-gray-800"
                        >
                          <span className="text-sm md:text-lg truncate">
                            {market}
                          </span>
                          <span className="text-sm md:text-lg font-medium">
                            {price} / Quintal
                          </span>
                        </div>
                      )
                    )}
                  </div>
                </div>

                {/* Summary */}
                <div className="bg-blue-50 p-3 md:p-4 rounded-lg">
                  <p className="text-md md:text-lg font-semibold text-blue-800">
                    Summary
                  </p>
                  <p className="text-sm md:text-lg text-gray-700 mt-1">
                    {cropData.summary}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MarketTrendsDashboard;
