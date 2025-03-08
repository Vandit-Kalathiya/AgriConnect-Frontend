import React from "react";
import { Clock } from "lucide-react";

const FreshnessMeter = ({ shelfLife }) => {
  // Parse shelf life
  const parseShelfLife = (shelfLifeStr) => {
    if (!shelfLifeStr) return { value: 0, unit: "days" };

    // const match = shelfLifeStr.match(/(\d+)\s*(\w+)/);
    if (shelfLifeStr) {
      return {
        value: parseInt(shelfLifeStr),
        unit: "days",
      };
    }

    // Try to parse just a number
    const numMatch = shelfLifeStr.match(/(\d+)/);
    if (numMatch) {
      return {
        value: parseInt(numMatch[1], 10),
        unit: "days",
      };
    }

    return { value: 0, unit: "days" };
  };

  const { value, unit } = parseShelfLife(shelfLife);

  // Calculate freshness level (1-5)
  const getFreshnessLevel = () => {
    if (unit === "months" || value > 30) return 5;
    if (value > 14) return 4;
    if (value > 7) return 3;
    if (value > 3) return 2;
    return 1;
  };

  const freshnessLevel = getFreshnessLevel();

  // Get color based on freshness level
  const getColor = () => {
    switch (freshnessLevel) {
      case 5:
        return { bg: "bg-green-500", text: "text-green-800" };
      case 4:
        return { bg: "bg-green-400", text: "text-green-800" };
      case 3:
        return { bg: "bg-yellow-400", text: "text-yellow-800" };
      case 2:
        return { bg: "bg-orange-400", text: "text-orange-800" };
      case 1:
        return { bg: "bg-red-400", text: "text-red-800" };
      default:
        return { bg: "bg-gray-300", text: "text-gray-800" };
    }
  };

  const { bg, text } = getColor();

  // Get freshness label
  const getFreshnessLabel = () => {
    switch (freshnessLevel) {
      case 5:
        return "Excellent";
      case 4:
        return "Very Good";
      case 3:
        return "Good";
      case 2:
        return "Fair";
      case 1:
        return "Short";
      default:
        return "Unknown";
    }
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
        <Clock size={18} className="mr-2 text-green-600" />
        Freshness Information
      </h3>

      <div className="mb-6">
        <div className="flex justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Shelf Life</span>
          <span className="text-sm font-bold text-gray-900">
            {value} {unit}
          </span>
        </div>

        <div className="w-full bg-gray-100 rounded-full h-2.5">
          <div
            className={`${bg} h-2.5 rounded-full`}
            style={{ width: `${freshnessLevel * 20}%` }}
          ></div>
        </div>

        <div className="flex justify-between mt-1">
          <span className="text-xs text-gray-500">Short</span>
          <span className="text-xs text-gray-500">Excellent</span>
        </div>
      </div>

      <div className={`${text.replace("text", "bg")}-50 p-4 rounded-lg`}>
        <div className="flex items-center">
          <div className={`w-3 h-3 rounded-full ${bg} mr-2`}></div>
          <span className={`font-medium ${text}`}>
            {getFreshnessLabel()} Freshness
          </span>
        </div>

        <p className="text-sm text-gray-600 mt-2">
          {freshnessLevel >= 4 &&
            "This crop has excellent shelf life and will remain fresh for an extended period."}
          {freshnessLevel === 3 &&
            "This crop has good shelf life and will maintain freshness for a moderate time."}
          {freshnessLevel <= 2 &&
            "This crop has limited shelf life and should be consumed soon for best quality."}
        </p>

        <div className="mt-3 text-xs text-gray-500">
          <p className="flex items-center">
            <span className="w-1.5 h-1.5 rounded-full bg-gray-400 mr-1.5"></span>
            Store in a cool, dry place for optimal freshness
          </p>
          {freshnessLevel <= 3 && (
            <p className="flex items-center mt-1">
              <span className="w-1.5 h-1.5 rounded-full bg-gray-400 mr-1.5"></span>
              Refrigeration recommended
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default FreshnessMeter;
