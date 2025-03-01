// ActiveListings.jsx
import React from "react";

const ActiveListings = () => {
  const listings = [
    { crop: "Wheat", quantity: "500 kg", price: "₹320", status: "Active" },
    { crop: "Rice", quantity: "700 kg", price: "₹280", status: "Pending" },
    { crop: "Corn", quantity: "900 kg", price: "₹xx350", status: "Sold" },
  ];

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl">
      <h2 className="text-xl md:text-2xl font-bold mb-4 text-gray-800">
        Active Listings
      </h2>
      <ul className="space-y-4">
        {listings.map((item, index) => (
          <li
            key={index}
            className="flex justify-between items-center p-3 hover:bg-gray-50 rounded-lg transition-colors duration-200"
          >
            <div>
              <span className="font-medium">{item.crop}</span>
              <span className="text-gray-600 text-sm ml-2">
                ({item.quantity})
              </span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-green-600 font-semibold">{item.price}</span>
              <span
                className={`text-xs px-2 py-1 rounded-full ${
                  item.status === "Active"
                    ? "bg-green-100 text-green-800"
                    : item.status === "Pending"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {item.status}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ActiveListings;
