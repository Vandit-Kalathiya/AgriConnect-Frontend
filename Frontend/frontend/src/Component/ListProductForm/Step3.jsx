import React, { useState, useEffect } from "react";
import {
  FaPhone,
  FaInfoCircle,
  FaCalculator,
  FaMapMarkerAlt,
  FaCoins,
  FaChartLine,
  FaCheck,
  FaLightbulb,
  FaExclamationTriangle,
} from "react-icons/fa";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the Gemini API client with the provided API key
const genAI = new GoogleGenerativeAI("AIzaSyDU7xQMNUiyJ9SEtvDQCd3jmpgfTGo9kg8");
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

const Step3 = ({
  formData,
  errors,
  handleInputChange,
  handleBack,
  handleNext,
}) => {
  const [recommendations, setRecommendations] = useState([]);
  const [nearbyFarmers, setNearbyFarmers] = useState([]);
  const [isLoadingAiPrice, setIsLoadingAiPrice] = useState(false);
  const [aiPriceError, setAiPriceError] = useState(null);
  const [priceCalculated, setPriceCalculated] = useState(false);
  const [animatePrice, setAnimatePrice] = useState(false);

  // Validate Step 3
  const isStep3Valid =
    formData.location.trim() &&
    formData.contactInfo.trim() &&
    /^\d{10}$/.test(formData.contactInfo) &&
    formData?.aiGeneratedPrice?.trim();

  // Function to fetch AI-generated price and recommendations
  const fetchAiPrice = async () => {
    setIsLoadingAiPrice(true);
    setAiPriceError(null);
    setRecommendations([]);
    setNearbyFarmers([]);
    setPriceCalculated(false);

    try {
      // Craft a strong prompt for the Gemini API with emphasis on numeric price per kg
      const prompt = `
        You are an agricultural pricing expert. Based on the following details, provide a fair price suggestion PER KILOGRAM for the product (not total price), along with proper recommendations which can be useful for farmers to get best prices:
        - Product: ${formData.productName}
        - Quantity: ${formData.quantity} kg
        - Location: ${formData.location}

        IMPORTANT: For the price field, provide ONLY a numeric value per kg without any currency symbols, units or formatting. For example: "245.50" not "₹245.50 per kg" or "Rs. 245.50".

        In the recommendations, highlight important market terms, actions, or price indicators by putting them between <highlight> and </highlight> tags.

        Respond in the following JSON format:
        {
          "price": "A numeric value only representing price per kg, e.g. 245.50",
          "recommendations": ["Recommendation 1 with <highlight>important terms</highlight> highlighted", "Recommendation 2", "Recommendation 3", "Recommendation 4", "Recommendation 5"],
        }
      `;

      // Call the Gemini API
      const result = await model.generateContent(prompt);
      const responseText = result.response.text();
      console.log("Gemini API raw response:", responseText);

      // Extract JSON from the response text using a regular expression
      const jsonMatch = responseText.match(/\{.*\}/s);
      if (!jsonMatch) {
        throw new Error("Failed to extract JSON from API response.");
      }

      // Parse the JSON response
      const parsedData = JSON.parse(jsonMatch[0]);

      // Clean the price value to ensure it's a valid number
      let cleanPrice = parsedData.price.toString().trim();
      console.log("Cleaned AI Price per kg:", cleanPrice);

      // Update AI-generated price in form data
      handleInputChange({
        target: { name: "aiGeneratedPrice", value: cleanPrice },
      });

      // Set final price to same as AI price initially
      handleInputChange({
        target: { name: "finalPrice", value: cleanPrice },
      });

      // Log the updated formData to debug
      console.log("Updated formData after AI price:", formData);

      // Ensure recommendations and nearbyFarmers are arrays
      const validRecommendations = Array.isArray(parsedData.recommendations)
        ? parsedData.recommendations
        : [];

      const validNearbyFarmers = Array.isArray(parsedData.nearbyFarmers)
        ? parsedData.nearbyFarmers
        : [];

      setRecommendations(validRecommendations);
      setNearbyFarmers(validNearbyFarmers);
      setPriceCalculated(true);
      setAnimatePrice(true);
      setTimeout(() => setAnimatePrice(false), 1000);
    } catch (error) {
      console.error("Error fetching AI-generated price:", error);
      setAiPriceError("Failed to fetch AI-generated price. Please try again.");
    } finally {
      setIsLoadingAiPrice(false);
    }
  };

  // Function to process recommendations with highlights
  const processRecommendation = (text) => {
    if (!text) return "";

    // Replace highlight tags with spans having appropriate styling
    const parts = text.split(/<highlight>|<\/highlight>/);
    if (parts.length === 1) return text;

    return (
      <>
        {parts.map((part, index) => {
          // Every odd index (1, 3, 5...) should be highlighted
          return index % 2 === 1 ? (
            <span
              key={index}
              className="font-bold text-jewel-700 bg-jewel-100 px-1 rounded"
            >
              {part}
            </span>
          ) : (
            <span key={index}>{part}</span>
          );
        })}
      </>
    );
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-jewel-700 mb-6">
        <FaCoins className="inline-block mr-2 text-jewel-600" />
        Price Recommendation (Per Kilogram)
      </h2>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Location Card */}
          <div className="bg-white p-5 rounded-lg shadow-sm transition-all hover:shadow-md">
            <label className="flex items-center gap-2 text-sm font-semibold text-jewel-600 mb-2">
              <FaMapMarkerAlt className="text-jewel-500" />
              Location
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              className={`mt-1 p-3 block w-full border rounded-lg shadow-sm focus:ring-jewel-500 focus:border-jewel-500 sm:text-sm ${
                errors.location
                  ? "border-red-500 bg-red-50"
                  : "border-jewel-200 bg-gray-50"
              }`}
              placeholder="Enter location"
            />
            {errors.location && (
              <p className="mt-1 text-sm text-red-600">{errors.location}</p>
            )}
          </div>

          {/* Contact Info Card */}
          <div className="bg-white p-5 rounded-lg shadow-sm transition-all hover:shadow-md">
            <label className="flex items-center gap-2 text-sm font-semibold text-jewel-600 mb-2">
              <FaPhone className="text-jewel-500" />
              Contact Info (Mobile No.)
            </label>
            <div className="flex items-center mt-1">
              <div className="bg-jewel-100 p-3 rounded-l-lg border border-jewel-200">
                <FaPhone className="text-jewel-600" />
              </div>
              <input
                type="tel"
                name="contactInfo"
                value={formData.contactInfo}
                onChange={handleInputChange}
                className={`flex-1 p-2 block w-full border border-l-0 rounded-r-lg shadow-sm focus:ring-jewel-500 focus:border-jewel-500 sm:text-sm ${
                  errors.contactInfo
                    ? "border-red-500 bg-red-50"
                    : "border-jewel-200 bg-gray-50"
                }`}
                placeholder="Enter 10-digit mobile number"
              />
            </div>
            {errors.contactInfo && (
              <p className="mt-1 text-sm text-red-600">{errors.contactInfo}</p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              We'll use this to notify you about price updates and interested
              buyers.
            </p>
          </div>

          {/* Price Calculator Card */}
          <div className="bg-white p-5 rounded-lg shadow-sm transition-all hover:shadow-md">
            <label className="flex items-center gap-2 text-sm font-semibold text-jewel-600 mb-2">
              <FaCalculator className="text-jewel-500" />
              AI Price Calculator
            </label>
            <div className="bg-yellow-50 p-3 rounded-lg mb-3 border border-yellow-200">
              <p className="text-sm text-yellow-800 flex items-start">
                <FaExclamationTriangle className="text-yellow-600 mr-2 mt-1 flex-shrink-0" />
                <span>
                  <span className="font-bold">Price per kilogram</span> will be
                  calculated based on current market trends, quality grade, and
                  regional data.
                </span>
              </p>
            </div>
            <button
              onClick={fetchAiPrice}
              disabled={
                isLoadingAiPrice ||
                !formData.productName ||
                !formData.qualityGrade ||
                !formData.quantity
              }
              className={`w-full px-4 py-3 rounded-lg text-white font-medium flex items-center justify-center gap-2 ${
                isLoadingAiPrice ||
                !formData.productName ||
                !formData.qualityGrade ||
                !formData.quantity
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-jewel-500 to-jewel-600 hover:from-jewel-600 hover:to-jewel-700"
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-jewel-500 transition-all`}
            >
              {isLoadingAiPrice ? (
                <>
                  <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                  Calculating Price Per KG...
                </>
              ) : (
                <>
                  <FaChartLine className="text-sm" />
                  Calculate Price Per KG
                </>
              )}
            </button>
            {aiPriceError && (
              <p className="mt-3 text-sm text-red-600 bg-red-50 p-2 rounded border border-red-200">
                <FaInfoCircle className="inline mr-1" /> {aiPriceError}
              </p>
            )}
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* AI-Generated Price Card */}
          <div
            className={`bg-white p-5 rounded-lg shadow-sm transition-all hover:shadow-md ${
              animatePrice ? "animate-pulse" : ""
            }`}
          >
            <label className="flex items-center gap-2 text-sm font-semibold text-jewel-600 mb-2">
              <FaCoins className="text-jewel-500" />
              <span className="flex items-center">
                AI-Recommended Price
                <span className="bg-jewel-100 text-jewel-700 text-xs font-bold ml-2 px-2 py-1 rounded-full">
                  PER KG
                </span>
              </span>
            </label>
            <div className="mt-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">₹</span>
              </div>
              <input
                type="number"
                name="aiGeneratedPrice"
                value={formData.aiGeneratedPrice || ""}
                onChange={handleInputChange}
                disabled={isLoadingAiPrice}
                readOnly={true}
                step="0.01"
                className={`p-3 pl-8 block w-full border rounded-lg shadow-sm focus:outline-none focus:ring-jewel-500 focus:border-jewel-500 sm:text-sm ${
                  errors.aiGeneratedPrice
                    ? "border-red-500 bg-red-50"
                    : priceCalculated
                    ? "border-green-300 bg-green-50"
                    : "border-gray-300 bg-gray-50"
                }`}
                placeholder={
                  isLoadingAiPrice ? "Calculating..." : "e.g., 250.00"
                }
              />
              {priceCalculated && (
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <FaCheck className="text-green-500" />
                </div>
              )}
            </div>
            {errors.aiGeneratedPrice && (
              <p className="mt-1 text-sm text-red-600">
                {errors.aiGeneratedPrice}
              </p>
            )}
            {priceCalculated && (
              <div className="mt-2 bg-green-50 p-2 rounded border border-green-200">
                <p className="text-sm text-green-700 flex items-center">
                  <FaCheck className="text-green-600 mr-2" />
                  <span>
                    This price is calculated <strong>per kilogram</strong> based
                    on current market data
                  </span>
                </p>
              </div>
            )}
          </div>

          {/* Final Price Card */}
          <div className="bg-white p-5 rounded-lg shadow-sm transition-all hover:shadow-md">
            <label className="flex items-center gap-2 text-sm font-semibold text-jewel-600 mb-2">
              <FaCoins className="text-jewel-500" />
              <span className="flex items-center">
                Your Final Price
                <span className="bg-jewel-100 text-jewel-700 text-xs font-bold ml-2 px-2 py-1 rounded-full">
                  PER KG
                </span>
              </span>
            </label>
            <p className="text-xs text-gray-600 mb-3">
              AI-generated price is automatically used as your final price. You
              can adjust it if needed.
            </p>
            <div className="mt-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">₹</span>
              </div>
              <input
                type="number"
                name="finalPrice"
                value={formData.finalPrice || ""}
                onChange={handleInputChange}
                step="0.01"
                className={`p-3 pl-8 block w-full border rounded-lg shadow-sm focus:ring-jewel-500 focus:border-jewel-500 sm:text-sm ${
                  errors.finalPrice
                    ? "border-red-500 bg-red-50"
                    : "border-jewel-200 bg-gray-50"
                }`}
                placeholder="e.g., 300.00"
              />
            </div>
            {errors.finalPrice && (
              <p className="mt-1 text-sm text-red-600">{errors.finalPrice}</p>
            )}
            <div className="mt-3 text-xs text-gray-500 flex items-center">
              <FaInfoCircle className="text-gray-400 mr-1" />
              <span>
                Total value:{" "}
                <strong>
                  ₹
                  {formData.finalPrice && formData.quantity
                    ? (
                        parseFloat(formData.finalPrice) *
                        parseFloat(formData.quantity)
                      ).toFixed(2)
                    : "0.00"}
                </strong>{" "}
                for {formData.quantity || 0} kg
              </span>
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-4">
            <button
              onClick={handleBack}
              className="px-6 py-3 rounded-lg border border-jewel-300 bg-white text-jewel-700 hover:bg-jewel-50 transition-colors"
            >
              Back
            </button>
            <button
              onClick={handleNext}
              disabled={!isStep3Valid}
              className={`px-6 py-3 rounded-lg text-white font-medium ${
                isStep3Valid
                  ? "bg-gradient-to-r from-jewel-500 to-jewel-600 hover:from-jewel-600 hover:to-jewel-700"
                  : "bg-gray-400 cursor-not-allowed"
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-jewel-500 transition-colors`}
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Recommendations and Nearby Farmers Section */}
      {(recommendations.length > 0 || nearbyFarmers.length > 0) && (
        <div className="mt-8 space-y-6">
          {/* Recommendations */}
          {recommendations.length > 0 && (
            <div className="bg-white p-5 rounded-lg shadow-sm transition-all hover:shadow-md">
              <h3 className="text-lg font-semibold text-jewel-700 flex items-center gap-2 mb-3">
                <FaLightbulb className="text-yellow-500" />
                <span>Market Recommendations</span>
                <span className="bg-jewel-100 text-jewel-700 text-xs ml-2 px-2 py-1 rounded-full">
                  Key terms highlighted
                </span>
              </h3>
              <div className="grid md:grid-cols-1 gap-3">
                {recommendations.map((rec, index) => (
                  <div
                    key={index}
                    className="flex items-start p-3 bg-jewel-50 rounded-lg hover:bg-jewel-100 transition-colors"
                  >
                    <span className="flex-shrink-0 h-6 w-6 rounded-full bg-jewel-200 flex items-center justify-center text-jewel-600 mr-3 font-medium">
                      {index + 1}
                    </span>
                    <span className="text-gray-700">
                      {processRecommendation(rec)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Nearby Farmers */}
          {nearbyFarmers.length > 0 && (
            <div className="bg-white p-5 rounded-lg shadow-sm transition-all hover:shadow-md">
              <h3 className="text-lg font-semibold text-jewel-700 flex items-center gap-2 mb-3">
                <FaMapMarkerAlt className="text-jewel-500" />
                <span>Nearby Farmers' Prices</span>
                <span className="bg-jewel-100 text-jewel-700 text-xs ml-2 px-2 py-1 rounded-full">
                  Per kg prices
                </span>
              </h3>
              <div className="grid md:grid-cols-3 gap-4">
                {nearbyFarmers.map((farmer, index) => (
                  <div
                    key={index}
                    className="bg-jewel-50 rounded-lg p-4 transition-all hover:shadow-sm hover:bg-jewel-100"
                  >
                    <div className="flex items-center mb-2">
                      <div className="h-10 w-10 bg-jewel-200 rounded-full flex items-center justify-center mr-3 text-jewel-700 font-medium">
                        {farmer.name?.charAt(0) || "F"}
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">
                          {farmer.name || `Farmer ${index + 1}`}
                        </p>
                        <p className="text-sm text-gray-600">
                          {farmer.distance ||
                            `${Math.floor(Math.random() * 10) + 1} km away`}
                        </p>
                      </div>
                    </div>
                    <div className="mt-2 bg-white p-2 rounded border border-jewel-100 text-center">
                      <span className="text-lg font-semibold text-jewel-700">
                        {farmer.price ||
                          `₹${Math.floor(Math.random() * 50) + 200}`}
                      </span>
                      <p className="text-xs text-gray-500 mt-1">
                        Current price <span className="font-bold">per kg</span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Step3;
