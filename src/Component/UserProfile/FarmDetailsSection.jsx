import React from "react";
import { FaTractor, FaPlus } from "react-icons/fa";

const FarmDetailsSection = ({
  editMode,
  formData,
  userData,
  onInputChange,
  onAddFarmDetails,
}) => (
  <div className="border-t border-green-200 pt-4 md:pt-6">
    <div className="flex justify-between items-center mb-2 md:mb-4">
      <h3 className="text-lg md:text-xl font-semibold text-green-800 flex items-center">
        <FaTractor className="mr-2 text-green-600" /> Farm Details
      </h3>
      {editMode && !formData.farmDetails && (
        <button
          onClick={onAddFarmDetails}
          className="flex items-center space-x-2 px-3 md:px-4 py-1 md:py-2 rounded-lg bg-green-500 text-white hover:bg-green-600 transition-all shadow-md"
        >
          <FaPlus />
          <span>Add Farm Details</span>
        </button>
      )}
    </div>
    {formData.farmDetails ? (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        <div className="flex flex-col">
          <label className="text-sm md:text-md font-medium text-green-700 mb-1 md:mb-2">
            Farm Name (Optional)
          </label>
          {editMode ? (
            <input
              type="text"
              name="farmDetails.farmName"
              value={formData.farmDetails.farmName || ""}
              onChange={onInputChange}
              className="w-full p-2 md:p-3 text-sm md:text-md rounded-lg border border-green-300 focus:outline-none focus:ring-2 focus:ring-green-500 bg-green-50 transition"
              placeholder="Enter your farm name"
            />
          ) : (
            <p className="text-md md:text-lg text-gray-800">
              {userData.farmDetails?.farmName || "Not provided"}
            </p>
          )}
        </div>

        <div className="flex flex-col">
          <label className="text-sm md:text-md font-medium text-green-700 mb-1 md:mb-2">
            Farm Size (Optional)
          </label>
          {editMode ? (
            <input
              type="text"
              name="farmDetails.farmSize"
              value={formData.farmDetails.farmSize || ""}
              onChange={onInputChange}
              className="w-full p-2 md:p-3 text-sm md:text-md rounded-lg border border-green-300 focus:outline-none focus:ring-2 focus:ring-green-500 bg-green-50 transition"
              placeholder="e.g., 50 acres"
            />
          ) : (
            <p className="text-md md:text-lg text-gray-800">
              {userData.farmDetails?.farmSize || "Not provided"}
            </p>
          )}
        </div>

        <div className="flex flex-col md:col-span-2">
          <label className="text-sm md:text-md font-medium text-green-700 mb-1 md:mb-2">
            Farm Location (Optional)
          </label>
          {editMode ? (
            <input
              type="text"
              name="farmDetails.farmLocation"
              value={formData.farmDetails.farmLocation || ""}
              onChange={onInputChange}
              className="w-full p-2 md:p-3 text-sm md:text-md rounded-lg border border-green-300 focus:outline-none focus:ring-2 focus:ring-green-500 bg-green-50 transition"
              placeholder="Enter your farm location"
            />
          ) : (
            <p className="text-md md:text-lg text-gray-800">
              {userData.farmDetails?.farmLocation || "Not provided"}
            </p>
          )}
        </div>
      </div>
    ) : (
      <p className="text-md md:text-lg text-gray-600 italic">
        No farm details available
      </p>
    )}
  </div>
);

export default FarmDetailsSection;
