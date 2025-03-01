import React from "react";

const DemandAnalytics = () => {
  const demands = [
    { crop: "Corn", demand: "High", trend: "+15%" },
    { crop: "Rice", demand: "Moderate", trend: "-5%" },
  ];

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Demand Analytics</h2>
      <ul className="space-y-3">
        {demands.map((item, index) => (
          <li key={index} className="flex justify-between items-center">
            <span>{item.crop}</span>
            <div>
              <span
                className={`font-semibold ${
                  item.demand === "High" ? "text-green-600" : "text-yellow-600"
                }`}
              >
                {item.demand}
              </span>
              <span
                className={`ml-2 text-sm ${
                  item.trend.startsWith("+") ? "text-green-500" : "text-red-500"
                }`}
              >
                {item.trend}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DemandAnalytics;
