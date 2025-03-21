import React from "react";
import { FaSearch } from "react-icons/fa";

const SearchAndFilter = ({
  searchTerm,
  setSearchTerm,
  activeTab,
  setActiveTab,
}) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-4 mb-6 flex flex-col md:flex-row justify-between items-center animate-slideUp">
      <div className="relative w-full md:w-72 mb-4 md:mb-0">
        <input
          type="text"
          placeholder="Search bookings..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition"
        />
        <FaSearch className="absolute left-3 top-3 text-gray-400" />
      </div>
      <div className="flex gap-2">
        {["all", "approved", "pending"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              activeTab === tab
                ? "bg-green-600 text-white shadow-md"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SearchAndFilter;
