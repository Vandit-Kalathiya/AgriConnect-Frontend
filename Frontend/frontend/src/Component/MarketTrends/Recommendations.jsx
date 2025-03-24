import React from "react";

const Recommendations = ({ recommendations }) => {
  return (
    <div className="bg-yellow-50 p-6 rounded-lg shadow-lg mt-6">
      <h2 className="text-2xl font-bold text-yellow-800 mb-4">
        Top Crop Recommendations
      </h2>
      <p className="text-lg text-gray-700 mb-4">
        Based on current trends, these crops offer high profit potential for
        farmers:
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {recommendations.map((rec, index) => (
          <div
            key={index}
            className="bg-white p-4 rounded-lg shadow-md border border-yellow-200"
          >
            <h3 className="text-xl font-semibold text-green-800">{rec.crop}</h3>
            <p className="text-lg text-gray-700">
              Profit Potential: {rec.profitPotential}
            </p>
            <p className="text-sm text-gray-600">
              Growth Time: {rec.growthTime}
            </p>
            <p className="text-sm text-gray-600">
              Best Market: {rec.bestMarket}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Recommendations;
