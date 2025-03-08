import React, { useState, useEffect } from "react";
import {
  FaPhone,
  FaInfoCircle,
  FaCalculator,
  FaMapMarkerAlt,
  FaCoins,
  FaChartLine,
  FaCheck,
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
    formData?.aiGenPrice.trim();

  // Function to fetch AI-generated price and recommendations
  const fetchAiPrice = async () => {
    setIsLoadingAiPrice(true);
    setAiPriceError(null);
    setRecommendations([]);
    setNearbyFarmers([]);
    setPriceCalculated(false);

    try {
      // Craft a strong prompt for the Gemini API with emphasis on numeric price
      const prompt = `
        You are an agricultural pricing expert. Based on the following details, provide a fair price suggestion for the product, along with recommendations and nearby farmers' prices:
        - Product: ${formData.productName}
        - Quality Grade: ${formData.qualityGrade}
        - Quantity: ${formData.quantity} kg
        - Location: ${formData.location}

        IMPORTANT: For the price field, provide ONLY a numeric value without any currency symbols, units or formatting. For example: "245.50" not "₹245.50 per kg" or "Rs. 245.50".

        Respond in the following JSON format:
        {
          "price": "A numeric value only, e.g. 245.50",
          "recommendations": ["Recommendation 1", "Recommendation 2", ...],
          "nearbyFarmers": [
            {
              "name": "Farmer A",
              "price": "Price per kg",
              "distance": "Distance in km"
            },
            ...
          ]
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
      console.log("Cleaned AI Price:", cleanPrice);

      // Update AI-generated price in form data
      handleInputChange({
        target: { name: "aiGenPrice", value: cleanPrice },
      });

      // Set final price to same as AI price initially
      handleInputChange({
        target: { name: "finalPrice", value: cleanPrice },
      });

      // Log the updated formData to debug
      console.log("Updated formData after AI price:", formData);

      setRecommendations(parsedData.recommendations || []);
      setNearbyFarmers(parsedData.nearbyFarmers || []);
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

  return (
    <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-xl shadow-md space-y-6">
      <h2 className="text-2xl font-bold text-jewel-700 mb-6">
        Price Recommendation
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
              readOnly={true}
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
                className={`flex-1 p-3 block w-full border border-l-0 rounded-r-lg shadow-sm focus:ring-jewel-500 focus:border-jewel-500 sm:text-sm ${
                  errors.contactInfo
                    ? "border-red-500 bg-red-50"
                    : "border-jewel-200 bg-gray-50"
                }`}
                placeholder="Enter 10-digit mobile number"
                readOnly={true}
              />
            </div>
            {errors.contactInfo && (
              <p className="mt-1 text-sm text-red-600">{errors.contactInfo}</p>
            )}
          </div>

          {/* Price Calculator Card */}
          <div className="bg-white p-5 rounded-lg shadow-sm transition-all hover:shadow-md">
            <label className="flex items-center gap-2 text-sm font-semibold text-jewel-600 mb-2">
              <FaCalculator className="text-jewel-500" />
              AI Price Calculator
            </label>
            <p className="text-xs text-gray-600 mb-3">
              Our AI analyzes current market trends, quality ratings, quantity,
              and regional prices to suggest an optimal price.
            </p>
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
                  Calculating Optimal Price...
                </>
              ) : (
                <>
                  <FaChartLine className="text-sm" />
                  Calculate Optimal Price
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
              AI-Recommended Price (per kg)
            </label>
            <div className="mt-1 relative">
              <input
                type="number"
                name="aiGenPrice"
                value={formData.aiGenPrice} // Ensure controlled input with fallback
                onChange={handleInputChange}
                disabled={isLoadingAiPrice} // Disable only during loading
                readOnly={true} // Keep readonly to prevent manual edits
                step="0.01"
                className={`p-3 block w-full border rounded-lg shadow-sm focus:outline-none focus:ring-jewel-500 focus:border-jewel-500 sm:text-sm ${
                  errors.aiGenPrice
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
            {errors.aiGenPrice && (
              <p className="mt-1 text-sm text-red-600">{errors.aiGenPrice}</p>
            )}
          </div>

          {/* Final Price Card */}
          <div className="bg-white p-5 rounded-lg shadow-sm transition-all hover:shadow-md">
            <label className="flex items-center gap-2 text-sm font-semibold text-jewel-600 mb-2">
              <FaCoins className="text-jewel-500" />
              Your Final Price (per kg)
            </label>
            <p className="text-xs text-gray-600 mb-3">
              AI-generated price will automatically be used as your final price.
            </p>
            <div className="mt-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">₹</span>
              </div>
              <input
                type="number"
                name="finalPrice"
                value={formData.finalPrice || ""} // Ensure controlled input with fallback
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
                <FaInfoCircle className="text-jewel-500" />
                Market Recommendations
              </h3>
              <ul className="space-y-3">
                {recommendations.map((rec, index) => (
                  <li
                    key={index}
                    className="flex items-start p-2 bg-jewel-50 rounded-lg"
                  >
                    <span className="flex-shrink-0 h-6 w-6 rounded-full bg-jewel-100 flex items-center justify-center text-jewel-600 mr-3 font-medium">
                      {index + 1}
                    </span>
                    <span className="text-gray-700">{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Nearby Farmers */}
          {nearbyFarmers.length > 0 && (
            <div className="bg-white p-5 rounded-lg shadow-sm transition-all hover:shadow-md">
              <h3 className="text-lg font-semibold text-jewel-700 flex items-center gap-2 mb-3">
                <FaMapMarkerAlt className="text-jewel-500" />
                Nearby Farmers' Prices
              </h3>
              <ul className="space-y-4">
                {nearbyFarmers.map((farmer, index) => (
                  <li key={index} className="bg-jewel-50 rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <div className="h-10 w-10 bg-jewel-200 rounded-full flex items-center justify-center mr-3 text-jewel-700 font-medium">
                        {farmer.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">
                          {farmer.name}
                        </p>
                        <p className="text-sm text-gray-600">
                          {farmer.distance} km away
                        </p>
                      </div>
                    </div>
                    <div className="mt-2 bg-white p-2 rounded border border-jewel-100 text-center">
                      <span className="text-lg font-semibold text-jewel-700">
                        {farmer.price}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Step3;
