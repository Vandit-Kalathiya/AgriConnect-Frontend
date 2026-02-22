import React from "react";

const PriceSuggestions = () => {
  const suggestions = [
    {
      crop: "Wheat",
      suggestedPrice: "$330",
      currentPrice: "$320",
      confidence: "92%",
    },
    {
      crop: "Rice",
      suggestedPrice: "$290",
      currentPrice: "$280",
      confidence: "88%",
    },
  ];

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg">
      <h2 className="text-xl font-bold mb-4 text-gray-800">
        AI Price Suggestions
      </h2>
      <ul className="space-y-4">
        {suggestions.map((item, index) => (
          <li
            key={index}
            className="flex justify-between items-center p-2 hover:bg-gray-50 rounded-lg"
          >
            <div>
              <span className="font-medium">{item.crop}</span>
              <span className="text-sm text-gray-500 ml-2">
                ({item.confidence} confidence)
              </span>
            </div>
            <div className="text-right">
              <span className="text-green-600 font-semibold">
                {item.suggestedPrice}
              </span>
              <span className="text-sm text-gray-500 block">
                Current: {item.currentPrice}
              </span>
            </div>
          </li>
        ))}
      </ul>
      <button className="mt-4 w-full p-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
        Apply Suggestions
      </button>
    </div>
  );
};

export default PriceSuggestions;
