import React from "react";
import { Calendar, Clock, Truck, ChevronRight } from "lucide-react";

const CropTimeline = ({ harvestDate, availabilityDate }) => {
  // Parse dates for calculation (assuming format is DD/MM/YYYY or similar)
  console.log(availabilityDate)
  const parseDateString = (dateStr) => {
    try {
      const parts = dateStr.split("/");
      if (parts.length === 3) {
        const [day, month, year] = parts.map(Number);
        return new Date(year, month - 1, day);
      }
      return new Date(dateStr); // Try direct parsing if not in DD/MM/YYYY format
    } catch (e) {
      return null;
    }
  };

  // Calculate days between harvest and availability
  const calculateDaysBetween = () => {
    try {
      const harvestDateObj = parseDateString(harvestDate);
      const availabilityDateObj = parseDateString(availabilityDate);

      if (!harvestDateObj || !availabilityDateObj) return null;

      const diffTime = Math.abs(availabilityDateObj - harvestDateObj);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays;
    } catch (e) {
      return null;
    }
  };

  // Format date for display
  const formatDate = (dateStr) => {
    try {
      const date = parseDateString(dateStr);
      if (!date) return dateStr;

      const options = { day: "numeric", month: "short", year: "numeric" };
      return date.toLocaleDateString("en-IN", options);
    } catch (e) {
      return dateStr;
    }
  };

  const daysBetween = calculateDaysBetween();
  const harvestDateFormatted = formatDate(harvestDate);
  const availabilityDateFormatted = formatDate(availabilityDate);

  // Check if current date is after availability date
  const now = new Date();
  const availabilityDateObj = parseDateString(availabilityDate);
  const isAvailableNow = availabilityDateObj && now >= availabilityDateObj;

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-800 mb-5 flex items-center">
        <Calendar size={18} className="mr-2 text-green-600" />
        Crop Journey
      </h3>

      <div className="relative">
        {/* Timeline track */}
        <div className="absolute top-5 left-5 h-full w-1 bg-gray-100 rounded-full"></div>

        {/* Harvest date point */}
        <div className="relative flex items-center mb-8">
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-green-100 flex items-center justify-center z-10 shadow-sm">
            <Calendar size={18} className="text-green-600" />
          </div>
          <div className="ml-4">
            <h4 className="text-sm font-medium text-gray-800">Harvested</h4>
            <time className="text-sm text-gray-600 font-medium">
              {harvestDateFormatted}
            </time>
            <p className="text-xs text-gray-500 mt-1">
              Freshly harvested crop from the farm
            </p>
          </div>
        </div>

        {/* Processing point (if days between > 2) */}
        {daysBetween && daysBetween > 2 && (
          <div className="relative flex items-center mb-8">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center z-10 shadow-sm">
              <Clock size={18} className="text-blue-600" />
            </div>
            <div className="ml-4">
              <h4 className="text-sm font-medium text-gray-800">Processing</h4>
              <time className="text-sm text-gray-600 font-medium">
                {daysBetween > 7
                  ? "Multiple days"
                  : `${Math.floor(daysBetween / 2)} days`}
              </time>
              <p className="text-xs text-gray-500 mt-1">
                Quality check, sorting, and preparation for market
              </p>
            </div>
          </div>
        )}

        {/* Availability date point */}
        <div className="relative flex items-center">
          <div
            className={`flex-shrink-0 w-10 h-10 rounded-full ${
              isAvailableNow ? "bg-green-500" : "bg-indigo-100"
            } flex items-center justify-center z-10 shadow-sm`}
          >
            <Truck
              size={18}
              className={isAvailableNow ? "text-white" : "text-indigo-600"}
            />
          </div>
          <div className="ml-4">
            <h4 className="text-sm font-medium text-gray-800">
              {isAvailableNow ? "Available Now" : "Available From"}
            </h4>
            <time className="text-sm text-gray-600 font-medium">
              {availabilityDateFormatted}
            </time>
            <p className="text-xs text-gray-500 mt-1">
              {isAvailableNow
                ? "Ready for immediate purchase and delivery"
                : "Will be ready for purchase on this date"}
            </p>
          </div>
        </div>
      </div>

      {daysBetween && (
        <div className="mt-6 pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
              <span className="text-xs font-medium text-gray-600">Harvest</span>
            </div>

            <div className="flex-1 mx-2 h-1 bg-gray-100 rounded relative">
              <div
                className="absolute left-0 top-0 h-1 bg-green-200 rounded"
                style={{ width: isAvailableNow ? "100%" : "90%" }}
              ></div>
            </div>

            <div className="flex items-center">
              <span className="text-xs font-medium text-gray-600">
                Available
              </span>
              <div className="w-2 h-2 rounded-full bg-indigo-500 ml-2"></div>
            </div>
          </div>

          <div className="text-xs text-gray-500 mt-3 text-center">
            <span className="font-medium">{daysBetween} days</span> from harvest
            to market availability
          </div>
        </div>
      )}

      {isAvailableNow && (
        <div className="mt-4 bg-green-50 p-3 rounded-lg">
          <p className="text-sm text-green-800 flex items-center">
            <span className="bg-green-200 rounded-full w-2 h-2 mr-2"></span>
            This crop is currently available for purchase
          </p>
        </div>
      )}
    </div>
  );
};

export default CropTimeline;
