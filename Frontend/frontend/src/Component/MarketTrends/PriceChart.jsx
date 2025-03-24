import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const PriceChart = ({ historicalData, forecastData, crop }) => {
  const combinedData = [
    ...historicalData.map((d) => ({ ...d, type: "Historical" })),
    ...forecastData.map((d) => ({ ...d, type: "Forecast" })),
  ];

  return (
    <div className="bg-white p-4 rounded-lg shadow-lg">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">
        {crop} Price Trends
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={combinedData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="price"
            stroke="#82ca9d"
            name="Price (₹/Quintal)"
          />
        </LineChart>
      </ResponsiveContainer>
      <p className="text-sm text-gray-600 mt-2">
        Historical (Last 6 Months) and Forecast (Next 12 Months)
      </p>
    </div>
  );
};

export default PriceChart;
