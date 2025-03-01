import React from "react";
import { Clock } from "lucide-react";

const FreshnessMeter = ({ shelfLife }) => {
  // Parse shelf life string to get number and unit
  const parseShelfLife = () => {
    try {
      const match = shelfLife.match(/(\d+)\s+(\w+)/);
      if (match) {
        return {
          value: parseInt(match[1], 10),
          unit: match[2].toLowerCase(),
        };
      }
      return { value: parseInt(shelfLife, 10) || 7, unit: "days" };
    } catch (e) {
      return { value: 7, unit: "days" };
    }
  };

  const { value, unit } = parseShelfLife();

  // Calculate the freshness level (0-100)
  const calculateFreshnessPercentage = () => {
    // Convert different units to a percentage
    if (unit.includes("day")) {
      if (value <= 3) return 100;
      if (value <= 7) return 80;
      if (value <= 14) return 60;
      if (value <= 30) return 40;
      return 20;
    }

    if (unit.includes("week")) {
      if (value === 1) return 80;
      if (value === 2) return 60;
      if (value <= 4) return 40;
      return 20;
    }

    if (unit.includes("month")) {
      if (value === 1) return 40;
      if (value <= 3) return 20;
      return 10;
    }

    return 50; // Default value
  };

  const freshnessPercentage = calculateFreshnessPercentage();

  // Determine color based on freshness level
  const getFreshnessColor = () => {
    if (freshnessPercentage >= 80) return "text-green-500 bg-green-100";
    if (freshnessPercentage >= 60) return "text-green-600 bg-green-50";
    if (freshnessPercentage >= 40) return "text-yellow-500 bg-yellow-50";
    if (freshnessPercentage >= 20) return "text-orange-500 bg-orange-50";
    return "text-red-500 bg-red-50";
  };

  const getFreshnessText = () => {
    if (freshnessPercentage >= 80) return "Very Fresh";
    if (freshnessPercentage >= 60) return "Fresh";
    if (freshnessPercentage >= 40) return "Moderately Fresh";
    if (freshnessPercentage >= 20) return "Store Appropriately";
    return "Limited Shelf Life";
  };

  return (
    <div className="rounded-lg p-3 bg-gray-50">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium text-gray-700 flex items-center">
          <Clock size={16} className="mr-2" />
          Freshness Level
        </h3>
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${getFreshnessColor()}`}
        >
          {getFreshnessText()}
        </span>
      </div>

      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div
          className="h-2.5 rounded-full bg-gradient-to-r from-green-300 to-green-600"
          style={{ width: `${freshnessPercentage}%` }}
        ></div>
      </div>

      <div className="mt-2 text-sm text-gray-600">
        <span className="font-medium">Shelf Life: </span>
        {shelfLife}
      </div>

      <div className="mt-1 text-xs text-gray-500">
        For best quality, consume within the recommended shelf life period.
      </div>
    </div>
  );
};

export default FreshnessMeter;
