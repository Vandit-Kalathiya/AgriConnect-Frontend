import React from "react";
import { FaSearch } from "react-icons/fa";

const SearchBar = ({ searchQuery, setSearchQuery, handleSearch }) => {
  return (
    <form
      onSubmit={handleSearch}
      className="flex justify-center gap-2 max-w-md mx-auto"
    >
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search crops (e.g., Wheat, Rice, Tomato)"
        className="flex-1 p-3 text-lg rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 shadow-md placeholder-gray-400"
      />
      <button
        type="submit"
        className="p-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-md"
      >
        <FaSearch className="text-xl" />
      </button>
    </form>
  );
};

export default SearchBar;
