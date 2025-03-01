import React from "react";
import { FaPhone } from "react-icons/fa"; // For contact info icon

const Step3 = ({
  formData,
  errors,
  handleInputChange,
  handleBack,
  handleNext,
  isLoadingAiPrice,
}) => {
  const isStep3Valid =
    formData.location.trim() &&
    formData.contactInfo.trim() &&
    /^\d{10}$/.test(formData.contactInfo) &&
    formData.aiGenPrice.trim() &&
    !isNaN(formData.aiGenPrice) &&
    Number(formData.aiGenPrice) > 0 &&
    formData.finalPrice.trim() &&
    !isNaN(formData.finalPrice) &&
    Number(formData.finalPrice) > 0;

  return (
    <div className="space-y-6">
      {/* Location */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Location
        </label>
        <input
          type="text"
          name="location"
          value={formData.location}
          onChange={handleInputChange}
          className={`mt-1 p-2 block w-full border rounded-lg shadow-sm focus:ring-jewel-500 focus:border-jewel-500 sm:text-sm ${
            errors.location
              ? "border-red-500 bg-red-50"
              : "border-gray-300 bg-gray-50"
          }`}
          placeholder="Enter location"
        />
        {errors.location && (
          <p className="mt-1 text-sm text-red-600">{errors.location}</p>
        )}
      </div>

      {/* Contact Info (Mobile No.) */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Contact Info (Mobile No.)
        </label>
        <div className="flex items-center gap-2 mt-1">
          <input
            type="tel"
            name="contactInfo"
            value={formData.contactInfo}
            onChange={handleInputChange}
            className={`flex-1 p-2 block w-full border rounded-lg shadow-sm focus:ring-jewel-500 focus:border-jewel-500 sm:text-sm ${
              errors.contactInfo
                ? "border-red-500 bg-red-50"
                : "border-gray-300 bg-gray-50"
            }`}
            placeholder="Enter 10-digit mobile number"
          />
        </div>
        {errors.contactInfo && (
          <p className="mt-1 text-sm text-red-600">{errors.contactInfo}</p>
        )}
      </div>

      {/* AI-Generated Price with Conditions */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          AI-Generated Price (per kg)
        </label>
        <div className="mt-1 flex items-center gap-2">
          <input
            type="number"
            name="aiGenPrice"
            value={formData.aiGenPrice}
            onChange={handleInputChange}
            step="0.01"
            disabled={isLoadingAiPrice || formData.aiGenPrice === ""}
            className={`p-2 block w-full border rounded-lg shadow-sm focus:outline-none focus:ring-jewel-500 focus:border-jewel-500 sm:text-sm ${
              errors.aiGenPrice
                ? "border-red-500 bg-red-50"
                : "border-gray-300 bg-gray-50"
            }`}
            placeholder={isLoadingAiPrice ? "Calculating..." : "e.g., 250.00"}
          />
          {isLoadingAiPrice && (
            <span className="text-sm text-gray-500 animate-pulse">
              Loading...
            </span>
          )}
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Based on market trends, quality, quantity, harvest/availability date,
          and shelf life.
        </p>
        {errors.aiGenPrice && (
          <p className="mt-1 text-sm text-red-600">{errors.aiGenPrice}</p>
        )}
      </div>

      {/* Final Price */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Final Price (per kg)
        </label>
        <input
          type="number"
          name="finalPrice"
          value={formData.finalPrice}
          onChange={handleInputChange}
          step="0.01"
          className={`mt-1 p-2 block w-full border rounded-lg shadow-sm focus:ring-jewel-500 focus:border-jewel-500 sm:text-sm ${
            errors.finalPrice
              ? "border-red-500 bg-red-50"
              : "border-gray-300 bg-gray-50"
          }`}
          placeholder="e.g., 300.00"
        />
        {errors.finalPrice && (
          <p className="mt-1 text-sm text-red-600">{errors.finalPrice}</p>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <button
          onClick={handleBack}
          className="px-4 py-2 rounded-lg bg-gray-300 text-gray-700 hover:bg-gray-400 transition-colors"
        >
          Back
        </button>
        <button
          onClick={handleNext}
          disabled={!isStep3Valid}
          className={`px-4 py-2 rounded-lg text-white font-medium ${
            isStep3Valid
              ? "bg-jewel-500 hover:bg-jewel-600"
              : "bg-gray-400 cursor-not-allowed"
          } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-jewel-500 transition-colors`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Step3;
