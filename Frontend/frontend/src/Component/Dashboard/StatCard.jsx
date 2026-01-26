import React from "react";
import { motion } from "framer-motion";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";

const StatCard = ({ title, value, icon, trend, trendUp, gradient }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.05, y: -5 }}
      transition={{ duration: 0.3 }}
      className="relative overflow-hidden bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 group"
    >
      <div
        className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
      ></div>

      <div className="relative p-4 md:p-6">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <p className="text-xs md:text-sm font-medium text-gray-600 mb-1">
              {title}
            </p>
            <h3 className="text-xl md:text-3xl font-bold text-gray-800">
              {value}
            </h3>
          </div>
          <div
            className={`p-2 md:p-3 rounded-xl bg-gradient-to-br ${gradient} shadow-lg`}
          >
            <span className="text-2xl md:text-3xl filter drop-shadow-lg">
              {icon}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
          <div
            className={`flex items-center gap-1 px-2 py-1 rounded-full ${
              trendUp ? "bg-green-100" : "bg-red-100"
            }`}
          >
            {trendUp ? (
              <FaArrowUp className="text-green-600 text-xs" />
            ) : (
              <FaArrowDown className="text-red-600 text-xs" />
            )}
            <span
              className={`text-xs font-bold ${
                trendUp ? "text-green-600" : "text-red-600"
              }`}
            >
              {trend}
            </span>
          </div>
          <span className="text-xs text-gray-500">vs last month</span>
        </div>
      </div>

      <div
        className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${gradient}`}
      ></div>
    </motion.div>
  );
};

export default StatCard;
