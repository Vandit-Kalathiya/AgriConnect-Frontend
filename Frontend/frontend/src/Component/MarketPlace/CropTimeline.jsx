import React from "react";
import { Calendar, Clock, Truck } from "lucide-react";

const CropTimeline = ({ harvestDate, availabilityDate }) => {
  // Parse dates for calculation (assuming format is DD/MM/YYYY or similar)
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

  const daysBetween = calculateDaysBetween();

  return (
    <div className="bg-gray-50 rounded-lg p-4">
      <h3 className="text-md font-semibold text-gray-800 mb-4 flex items-center">
        <Calendar size={16} className="mr-2 text-green-600" />
        Crop Timeline
      </h3>

      <div className="relative">
        {/* Timeline track */}
        <div className="absolute top-5 left-5 h-full w-0.5 bg-gray-200"></div>

        {/* Harvest date point */}
        <div className="relative flex items-center mb-6">
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-green-100 flex items-center justify-center z-10">
            <Calendar size={16} className="text-green-600" />
          </div>
          <div className="ml-4">
            <h4 className="text-sm font-medium text-gray-700">Harvested</h4>
            <time className="text-xs text-gray-500">{harvestDate}</time>
            <p className="text-xs text-gray-600 mt-1">
              Crop freshly harvested from the farm
            </p>
          </div>
        </div>

        {/* Processing point (if days between > 2) */}
        {daysBetween && daysBetween > 2 && (
          <div className="relative flex items-center mb-6">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center z-10">
              <Clock size={16} className="text-blue-600" />
            </div>
            <div className="ml-4">
              <h4 className="text-sm font-medium text-gray-700">Processing</h4>
              <p className="text-xs text-gray-600">
                Quality check and preparation for delivery
              </p>
            </div>
          </div>
        )}

        {/* Availability date point */}
        <div className="relative flex items-center">
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center z-10">
            <Truck size={16} className="text-indigo-600" />
          </div>
          <div className="ml-4">
            <h4 className="text-sm font-medium text-gray-700">Available</h4>
            <time className="text-xs text-gray-500">{availabilityDate}</time>
            <p className="text-xs text-gray-600 mt-1">
              Ready for purchase and delivery
            </p>
          </div>
        </div>
      </div>

      {daysBetween && (
        <div className="text-xs text-gray-500 mt-4 text-center">
          {daysBetween} days from harvest to availability
        </div>
      )}
    </div>
  );
};

export default CropTimeline;
