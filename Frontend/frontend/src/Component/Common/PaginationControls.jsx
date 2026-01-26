import React from 'react';
import { FaChevronLeft, FaChevronRight, FaRedo } from 'react-icons/fa';

/**
 * Pagination Controls Component for Cursor-Based Pagination
 * 
 * @param {Object} props
 * @param {boolean} props.hasNext - Whether there is a next page
 * @param {boolean} props.hasPrev - Whether there is a previous page
 * @param {Function} props.onNext - Callback for next page
 * @param {Function} props.onPrev - Callback for previous page
 * @param {Function} props.onRefresh - Callback for refresh
 * @param {boolean} props.isLoading - Loading state
 * @param {number} props.currentPage - Current page number
 * @param {number} props.returnedCount - Items in current page
 * @param {number} props.pageSize - Items per page
 * @param {string} props.color - Theme color (default: 'green')
 */
const PaginationControls = ({
  hasNext,
  hasPrev,
  onNext,
  onPrev,
  onRefresh,
  isLoading = false,
  currentPage = 1,
  returnedCount = 0,
  pageSize = 20,
  color = 'green',
}) => {
  const colorClasses = {
    green: {
      button: 'bg-green-600 hover:bg-green-700 text-white',
      buttonDisabled: 'bg-gray-300 text-gray-500',
      text: 'text-green-600',
    },
    blue: {
      button: 'bg-blue-600 hover:bg-blue-700 text-white',
      buttonDisabled: 'bg-gray-300 text-gray-500',
      text: 'text-blue-600',
    },
    red: {
      button: 'bg-red-600 hover:bg-red-700 text-white',
      buttonDisabled: 'bg-gray-300 text-gray-500',
      text: 'text-red-600',
    },
  };

  const theme = colorClasses[color] || colorClasses.green;

  return (
    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6 pt-4 border-t border-gray-200">
      {/* Page Info */}
      <div className="text-sm text-gray-600">
        <span className="font-medium">Page {currentPage}</span>
        <span className="mx-2">•</span>
        <span>
          Showing {returnedCount} {returnedCount === 1 ? 'item' : 'items'}
        </span>
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center gap-2">
        {/* Refresh Button */}
        <button
          onClick={onRefresh}
          disabled={isLoading}
          className={`p-2 rounded-lg transition-all duration-300 ${
            isLoading
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
          }`}
          title="Refresh current page"
        >
          <FaRedo className={isLoading ? 'animate-spin' : ''} />
        </button>

        {/* Previous Button */}
        <button
          onClick={onPrev}
          disabled={!hasPrev || isLoading}
          className={`flex items-center px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
            hasPrev && !isLoading
              ? theme.button
              : theme.buttonDisabled + ' cursor-not-allowed'
          }`}
        >
          <FaChevronLeft className="mr-2" />
          Previous
        </button>

        {/* Next Button */}
        <button
          onClick={onNext}
          disabled={!hasNext || isLoading}
          className={`flex items-center px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
            hasNext && !isLoading
              ? theme.button
              : theme.buttonDisabled + ' cursor-not-allowed'
          }`}
        >
          Next
          <FaChevronRight className="ml-2" />
        </button>
      </div>

      {/* Has More Indicator */}
      {hasNext && (
        <div className={`text-sm ${theme.text} font-medium`}>
          More items available →
        </div>
      )}
    </div>
  );
};

export default PaginationControls;
