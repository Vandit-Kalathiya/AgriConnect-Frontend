import React, { useState, useEffect } from "react";
import PhotoUpload from "./PhotoUpload";
import { GoogleGenerativeAI } from "@google/generative-ai";
import toast from "react-hot-toast";

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
console.log(GEMINI_API_KEY);

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

const Step2 = ({
  formData,
  errors,
  handleInputChange,
  handlePhotoUpload,
  removePhoto,
  handleNext,
  handleBack,
  maxPhotos,
  setErrors,
}) => {
  const [isLoadingShelfLife, setIsLoadingShelfLife] = useState(false);
  const [harvestDateError, setHarvestDateError] = useState("");
  const dateInputRef = React.useRef(null);

  const isStep2Valid =
    formData.productPhotos.length > 0 &&
    formData.cropType.trim() &&
    formData.harvestDate &&
    !harvestDateError &&
    formData.storageConditions.trim() &&
    formData.shelfLife.trim() &&
    !isNaN(formData.shelfLife) &&
    Number(formData.shelfLife) > 0;

  // Function to predict shelf life using Gemini API
  const predictShelfLife = async (cropType) => {
    if (!cropType) {
      toast.error("Please select a crop type first");
      return;
    }

    setIsLoadingShelfLife(true);

    const productName = formData.productName || "product"; // Use product name if available, or default to "product"
    const prompt = `Predict the average shelf life in days for ${productName}, which is a ${cropType}. Return only a number value.`;

    try {
      const result = await model.generateContent(prompt);

      const responseText = result.response.text();
      console.log("Gemini response:", responseText);

      // Ensure responseText contains a valid number
      const matches = responseText.match(/\d+/);
      if (matches) {
        const shelfLifeDays = matches[0];

        // Update form data with the predicted shelf life
        handleInputChange({
          target: { name: "shelfLife", value: shelfLifeDays },
        });

        toast.success(`Shelf life predicted: ${shelfLifeDays} days`);
      } else {
        console.error("No valid number found in the response:", responseText);
        toast.error("Failed to predict shelf life. Please try again.");
      }
    } catch (error) {
      console.error("Error predicting shelf life:", error);
      toast.error("Error predicting shelf life. Please try again.");
    } finally {
      setIsLoadingShelfLife(false);
    }
  };

  // Validate that harvest date is NOT more than a week ago (within the past week)
  const validateHarvestDate = (date) => {
    if (!date) return;

    const harvestDate = new Date(date);
    const today = new Date();

    // Set hours, minutes, seconds, milliseconds to 0 for accurate day comparison
    today.setHours(0, 0, 0, 0);
    harvestDate.setHours(0, 0, 0, 0);

    // Calculate the minimum acceptable date (7 days ago)
    const minDate = new Date(today);
    minDate.setDate(today.getDate() - 7);

    if (harvestDate < minDate) {
      setHarvestDateError("Harvest date must not be more than 7 days ago");
      // Update errors object
      setErrors &&
        setErrors((prev) => ({
          ...prev,
          harvestDate: "Harvest date must not be more than 7 days ago",
        }));
      return false;
    } else {
      setHarvestDateError("");
      // Clear error if it exists
      setErrors &&
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors.harvestDate;
          return newErrors;
        });
      return true;
    }
  };

  // Handle harvest date change with validation
  const handleHarvestDateChange = (e) => {
    const { value } = e.target;
    handleInputChange(e);
    validateHarvestDate(value);
  };

  // Handle clicking on the date field wrapper to focus the input
  const handleDateFieldClick = () => {
    if (dateInputRef.current) {
      dateInputRef.current.showPicker();
    }
  };

  // Handle crop type change and trigger shelf life prediction
  const handleCropTypeChange = (e) => {
    const { value } = e.target;
    handleInputChange(e);

    // If a valid crop type is selected, automatically predict shelf life
    if (value && value !== "") {
      predictShelfLife(value);
    }
  };

  // Validate harvest date on component mount and when it changes
  useEffect(() => {
    validateHarvestDate(formData.harvestDate);
  }, [formData.harvestDate]);

  // Calculate the minimum allowed harvest date (7 days ago)
  const calculateMinHarvestDate = () => {
    const today = new Date();
    today.setDate(today.getDate() - 7);
    return today.toISOString().split("T")[0]; // Format: YYYY-MM-DD
  };

  return (
    <div className="space-y-6 bg-white p-6 rounded-xl shadow-sm">
      <h2 className="text-xl font-semibold text-jewel-700 mb-4">
        Product Details
      </h2>

      {/* Product Photos */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <PhotoUpload
          productPhotos={formData.productPhotos}
          handlePhotoUpload={handlePhotoUpload}
          removePhoto={removePhoto}
          maxPhotos={maxPhotos}
        />
        {errors.productPhotos && (
          <p className="mt-1 text-sm text-red-600">{errors.productPhotos}</p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* Crop Type Dropdown */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Crop Type <span className="text-red-500">*</span>
          </label>
          <select
            name="cropType"
            value={formData.cropType}
            onChange={handleCropTypeChange} // Use custom handler to trigger prediction
            className={`mt-1 p-2 block w-full border rounded-lg shadow-sm focus:ring-jewel-500 focus:border-jewel-500 sm:text-sm ${
              errors.cropType
                ? "border-red-500 bg-red-50"
                : "border-gray-300 bg-gray-50"
            }`}
            required
          >
            <option value="all">Select a crop type</option>
            <option value="Grains">Grains (e.g., Rice, Wheat)</option>
            <option value="Fruits">Fruits (e.g., Mango, Apple)</option>
            <option value="Vegetables">
              Vegetables (e.g., Tomato, Potato)
            </option>
            <option value="Pulses">Pulses (e.g., Lentils, Chickpeas)</option>
            <option value="Spices">Spices (e.g., Turmeric, Chili)</option>
            <option value="Oilseeds">Oilseeds (e.g., Soybean, Mustard)</option>
            <option value="Herbs">Herbs (e.g., Basil, Mint)</option>
            <option value="Nuts">Nuts (e.g., Almond, Cashew)</option>
            <option value="Sweetener">Sweetener (e.g., Jaggery)</option>
          </select>
          {errors.cropType && (
            <p className="mt-1 text-sm text-red-600">{errors.cropType}</p>
          )}
        </div>
      </div>

      {/* Harvest Date - Made fully clickable */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Harvest Date <span className="text-red-500">*</span>
        </label>
        <div
          className={`mt-1 relative cursor-pointer ${
            harvestDateError || errors.harvestDate
              ? "border-red-500 bg-red-50"
              : "border-gray-300 bg-gray-50"
          }`}
          onClick={handleDateFieldClick}
        >
          <input
            type="date"
            name="harvestDate"
            value={formData.harvestDate}
            onChange={handleHarvestDateChange}
            min={calculateMinHarvestDate()}
            className={`p-2 block w-full border rounded-lg shadow-sm focus:ring-jewel-500 focus:border-jewel-500 sm:text-sm cursor-pointer ${
              harvestDateError || errors.harvestDate
                ? "border-red-500 bg-red-50"
                : "border-gray-300 bg-gray-50"
            }`}
            required
            ref={dateInputRef}
          />
          {!harvestDateError && !errors.harvestDate && formData.harvestDate && (
            <span className="absolute right-3 top-2 text-green-500 pointer-events-none">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </span>
          )}
        </div>
        {harvestDateError && (
          <div className="mt-1 flex items-center space-x-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5 text-red-500"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
              />
            </svg>
            <p className="text-sm text-red-600">{harvestDateError}</p>
          </div>
        )}
        {errors.harvestDate && !harvestDateError && (
          <p className="mt-1 text-sm text-red-600">{errors.harvestDate}</p>
        )}
        <p className="mt-1 text-xs text-gray-500">
          The harvest date must not be more than 7 days ago to ensure freshness
          assessment.
        </p>
      </div>

      {/* Storage Conditions Dropdown */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Storage Conditions <span className="text-red-500">*</span>
        </label>
        <select
          name="storageConditions"
          value={formData.storageConditions}
          onChange={handleInputChange}
          className={`mt-1 p-2 block w-full border rounded-lg shadow-sm focus:ring-jewel-500 focus:border-jewel-500 sm:text-sm ${
            errors.storageConditions
              ? "border-red-500 bg-red-50"
              : "border-gray-300 bg-gray-50"
          }`}
          required
        >
          <option value="" disabled>
            Select storage condition
          </option>
          <option value="Room Temperature">Room Temperature</option>
          <option value="Refrigerated">Refrigerated (2-8°C)</option>
          <option value="Cold Storage">Cold Storage (-18°C or below)</option>
          <option value="Dry Storage">Dry Storage</option>
          <option value="Cool and Dry">Cool and Dry</option>
          <option value="Temperature Controlled">Temperature Controlled</option>
          <option value="Other">Other (specify in notes)</option>
        </select>
        {errors.storageConditions && (
          <p className="mt-1 text-sm text-red-600">
            {errors.storageConditions}
          </p>
        )}
      </div>

      {/* Shelf Life with AI Prediction */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="flex justify-between items-center mb-2">
          <label className="block text-sm font-medium text-gray-700">
            Shelf Life (days) <span className="text-red-500">*</span>
          </label>
          {isLoadingShelfLife && (
            <div className="flex items-center text-jewel-600 text-sm">
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-jewel-600"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Predicting shelf life...
            </div>
          )}
        </div>
        <div className="flex items-center">
          <input
            type="number"
            name="shelfLife"
            value={formData.shelfLife}
            onChange={handleInputChange}
            step="1"
            min="1"
            className={`mt-1 p-2 block w-full border rounded-lg shadow-sm focus:ring-jewel-500 focus:border-jewel-500 sm:text-sm ${
              errors.shelfLife
                ? "border-red-500 bg-red-50"
                : "border-gray-300 bg-gray-50"
            }`}
            placeholder="Auto-predicted when crop type is selected"
            readOnly // Make this read-only since it's auto-predicted
            required
          />
        </div>
        {formData.shelfLife && !errors.shelfLife && (
          <div className="mt-2 p-2 bg-green-50 border border-green-100 rounded-md">
            <div className="flex">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5 text-green-600 mr-2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="text-sm text-green-700">
                <span className="font-semibold">Predicted shelf life:</span>{" "}
                Your {formData.cropType.toLowerCase()} should stay fresh for
                approximately{" "}
                <span className="font-semibold">{formData.shelfLife} days</span>{" "}
                when stored in {formData.storageConditions.toLowerCase()}{" "}
                conditions.
              </p>
            </div>
          </div>
        )}
        {errors.shelfLife && (
          <p className="mt-1 text-sm text-red-600">{errors.shelfLife}</p>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between pt-4 border-t border-gray-200">
        <button
          onClick={handleBack}
          className="px-4 py-2 rounded-lg border border-jewel-300 bg-white text-jewel-700 hover:bg-jewel-50 transition-colors shadow-sm"
        >
          Back
        </button>
        <button
          onClick={handleNext}
          disabled={!isStep2Valid}
          className={`px-4 py-2 rounded-lg text-white font-medium ${
            isStep2Valid
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

export default Step2;
