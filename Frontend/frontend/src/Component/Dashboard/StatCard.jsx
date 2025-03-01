// StatCard.jsx
import React from "react";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";

const StatCard = ({ title, value, icon, trend, trendUp }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base md:text-lg font-semibold text-gray-700">
            {title}
          </h3>
          <p className="text-2xl md:text-3xl font-bold text-green-600 mt-2">
            {value}
          </p>
        </div>
        <span className="text-3xl">{icon}</span>
      </div>
      <div className="flex items-center gap-2 mt-2 text-sm">
        {trendUp ? (
          <FaArrowUp className="text-green-500" />
        ) : (
          <FaArrowDown className="text-red-500" />
        )}
        <span className={trendUp ? "text-green-500" : "text-red-500"}>
          {trend}
        </span>
        <span className="text-gray-500">vs last month</span>
      </div>
    </div>
  );
};

export default StatCard;
