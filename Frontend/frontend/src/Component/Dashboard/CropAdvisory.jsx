import React from "react";

const CropAdvisory = () => {
  const advice = [
    {
      type: "Rotation",
      message: "Consider soybeans after wheat for soil health",
    },
    { type: "Pest", message: "Monitor for aphids; apply neem oil if needed" },
  ];

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg">
      <h2 className="text-xl font-bold mb-4 text-gray-800">AI Crop Advisory</h2>
      <ul className="space-y-3">
        {advice.map((item, index) => (
          <li key={index} className="flex items-start gap-2">
            <span className="text-green-600 font-semibold">{item.type}:</span>
            <span className="text-gray-700">{item.message}</span>
          </li>
        ))}
      </ul>
      <button className="mt-4 w-full p-2 bg-jewel-600 text-white rounded-lg hover:bg-jewel-700">
        View Detailed Report
      </button>
    </div>
  );
};

export default CropAdvisory;
