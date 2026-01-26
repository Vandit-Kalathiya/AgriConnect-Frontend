import React from 'react';
import { FaSpinner, FaChevronDown } from 'react-icons/fa';

/**
 * Load More Button Component for Infinite Scroll Pattern
 * 
 * @param {Object} props
 * @param {Function} props.onLoadMore - Callback when button is clicked
 * @param {boolean} props.hasMore - Whether there are more items to load
 * @param {boolean} props.isLoading - Loading state
 * @param {string} props.color - Theme color (default: 'green')
 * @param {number} props.loadedCount - Number of items already loaded
 */
const LoadMoreButton = ({
  onLoadMore,
  hasMore,
  isLoading = false,
  color = 'green',
  loadedCount = 0,
}) => {
  if (!hasMore && !isLoading) {
    return (
      <div className="text-center py-6">
        <div className="inline-flex items-center px-4 py-2 rounded-full bg-gray-100 text-gray-600">
          <svg
            className="w-5 h-5 mr-2"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
          All items loaded ({loadedCount} total)
        </div>
      </div>
    );
  }

  const colorClasses = {
    green: 'bg-green-600 hover:bg-green-700 border-green-700',
    blue: 'bg-blue-600 hover:bg-blue-700 border-blue-700',
    red: 'bg-red-600 hover:bg-red-700 border-red-700',
  };

  const buttonColor = colorClasses[color] || colorClasses.green;

  return (
    <div className="text-center py-6">
      <button
        onClick={onLoadMore}
        disabled={isLoading || !hasMore}
        className={`inline-flex items-center px-6 py-3 rounded-lg font-semibold text-white transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none ${buttonColor}`}
      >
        {isLoading ? (
          <>
            <FaSpinner className="animate-spin mr-2" />
            Loading more...
          </>
        ) : (
          <>
            <FaChevronDown className="mr-2" />
            Load More
          </>
        )}
      </button>
      
      {hasMore && !isLoading && (
        <p className="text-sm text-gray-500 mt-2">
          Click to load more items
        </p>
      )}
    </div>
  );
};

export default LoadMoreButton;
