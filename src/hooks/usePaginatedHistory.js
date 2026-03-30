import { useCallback, useEffect, useState } from "react";

const usePaginatedHistory = (
  fetchFn,
  {
    initialPage = 0,
    initialSize = 20,
    autoLoad = true,
    onPageLoaded,
  } = {}
) => {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(initialPage);
  const [size, setSize] = useState(initialSize);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(autoLoad);
  const [error, setError] = useState("");

  const loadPage = useCallback(
    async (targetPage, reset = false, targetSize = size) => {
      try {
        setLoading(true);
        setError("");
        const data = await fetchFn({ page: targetPage, size: targetSize });
        const nextItems = data?.history || [];

        setItems((prev) => (reset ? nextItems : [...prev, ...nextItems]));
        const nextPage = data?.page ?? targetPage;
        setPage(nextPage);
        setHasMore(Boolean(data?.hasMore));
        if (typeof onPageLoaded === "function") {
          onPageLoaded({ page: nextPage, size: targetSize });
        }
      } catch (e) {
        setError(e?.response?.data?.message || "Failed to load history.");
      } finally {
        setLoading(false);
        setInitialLoading(false);
      }
    },
    [fetchFn, onPageLoaded, size]
  );

  const refresh = useCallback(
    (targetPage = 0, targetSize = size) => {
      setItems([]);
      setHasMore(true);
      setInitialLoading(true);
      setPage(targetPage);
      setSize(targetSize);
      return loadPage(targetPage, true, targetSize);
    },
    [loadPage, size]
  );

  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      loadPage(page + 1, false, size);
    }
  }, [hasMore, loadPage, loading, page, size]);

  const replaceItems = useCallback((nextItems = []) => {
    setItems(Array.isArray(nextItems) ? nextItems : []);
  }, []);

  useEffect(() => {
    if (autoLoad) {
      refresh(initialPage, initialSize);
    }
  }, [autoLoad, initialPage, initialSize]);

  return {
    items,
    page,
    hasMore,
    loading,
    initialLoading,
    error,
    refresh,
    loadMore,
    setSize,
    replaceItems,
  };
};

export default usePaginatedHistory;
