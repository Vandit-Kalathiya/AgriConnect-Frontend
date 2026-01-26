import { useState, useCallback } from 'react';

/**
 * Custom hook for cursor-based pagination
 * 
 * @param {Function} fetchFunction - Async function that fetches data (receives cursor, limit params)
 * @param {number} limit - Number of items per page (default: 20, max: 100)
 * @returns {Object} Pagination state and controls
 */
export const useCursorPagination = (fetchFunction, limit = 20) => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [metadata, setMetadata] = useState({
    nextCursor: null,
    prevCursor: null,
    hasNext: false,
    hasPrev: false,
    pageSize: limit,
    returnedCount: 0,
  });
  const [currentCursor, setCurrentCursor] = useState(null);
  const [cursorHistory, setCursorHistory] = useState([]); // Track cursor history for prev navigation

  /**
   * Load data with optional cursor
   * @param {string|null} cursor - Pagination cursor
   * @param {boolean} append - Whether to append to existing data (for infinite scroll)
   */
  const loadData = useCallback(async (cursor = null, append = false) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetchFunction(cursor, limit);
      
      if (response && response.data) {
        if (append) {
          setData(prev => [...prev, ...response.data]);
        } else {
          setData(response.data);
        }
        
        setMetadata(response.metadata || {
          nextCursor: null,
          prevCursor: null,
          hasNext: false,
          hasPrev: false,
          pageSize: limit,
          returnedCount: response.data.length,
        });
        
        setCurrentCursor(cursor);
      }
    } catch (err) {
      console.error('Error loading paginated data:', err);
      setError(err.response?.data?.message || err.message || 'Failed to load data');
    } finally {
      setIsLoading(false);
    }
  }, [fetchFunction, limit]);

  /**
   * Load first page
   */
  const loadFirstPage = useCallback(() => {
    setCursorHistory([]);
    loadData(null, false);
  }, [loadData]);

  /**
   * Load next page
   */
  const loadNextPage = useCallback(() => {
    if (metadata.hasNext && metadata.nextCursor) {
      // Save current cursor to history before moving forward
      if (currentCursor !== null) {
        setCursorHistory(prev => [...prev, currentCursor]);
      }
      loadData(metadata.nextCursor, false);
    }
  }, [metadata.hasNext, metadata.nextCursor, currentCursor, loadData]);

  /**
   * Load previous page
   */
  const loadPrevPage = useCallback(() => {
    if (cursorHistory.length > 0) {
      // Get the last cursor from history
      const prevCursor = cursorHistory[cursorHistory.length - 1];
      setCursorHistory(prev => prev.slice(0, -1));
      loadData(prevCursor, false);
    } else {
      // If no history, go to first page
      loadFirstPage();
    }
  }, [cursorHistory, loadData, loadFirstPage]);

  /**
   * Load more (for infinite scroll)
   */
  const loadMore = useCallback(() => {
    if (metadata.hasNext && metadata.nextCursor && !isLoading) {
      loadData(metadata.nextCursor, true);
    }
  }, [metadata.hasNext, metadata.nextCursor, isLoading, loadData]);

  /**
   * Refresh current page
   */
  const refresh = useCallback(() => {
    loadData(currentCursor, false);
  }, [currentCursor, loadData]);

  /**
   * Reset pagination state
   */
  const reset = useCallback(() => {
    setData([]);
    setMetadata({
      nextCursor: null,
      prevCursor: null,
      hasNext: false,
      hasPrev: false,
      pageSize: limit,
      returnedCount: 0,
    });
    setCurrentCursor(null);
    setCursorHistory([]);
    setError(null);
  }, [limit]);

  return {
    // Data
    data,
    metadata,
    isLoading,
    error,
    
    // Navigation
    loadFirstPage,
    loadNextPage,
    loadPrevPage,
    loadMore,
    refresh,
    reset,
    
    // State
    hasNextPage: metadata.hasNext,
    hasPrevPage: cursorHistory.length > 0 || currentCursor !== null,
    currentPage: cursorHistory.length + 1,
    totalItems: data.length,
  };
};

/**
 * Build URL params for pagination API calls
 * @param {string|null} cursor - Pagination cursor
 * @param {number} limit - Items per page
 * @param {string} sortDirection - Sort direction (ASC or DESC)
 * @returns {URLSearchParams}
 */
export const buildPaginationParams = (cursor = null, limit = 20, sortDirection = 'DESC') => {
  const params = new URLSearchParams({ limit: limit.toString() });
  
  if (cursor) {
    params.append('cursor', cursor);
  }
  
  if (sortDirection) {
    params.append('sortDirection', sortDirection);
  }
  
  return params;
};
