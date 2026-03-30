import usePaginatedHistory from "../../hooks/usePaginatedHistory";
import { deleteAllAiHistory, fetchCropAdvisoryHistory } from "../../api/aiHistoryApi";
import { useCallback, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";

const formatDate = (dateTime) => new Date(dateTime).toLocaleString();

const parseResponse = (payload) => {
  try {
    return JSON.parse(payload);
  } catch {
    return null;
  }
};

const CropAdvisoryHistory = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const pageParam = Number(searchParams.get("page") || 0);
  const sizeParam = Number(searchParams.get("size") || 20);
  const [searchText, setSearchText] = useState("");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const updateQueryParams = useCallback(
    ({ page, size }) => {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        next.set("page", String(page));
        next.set("size", String(size));
        return next;
      });
    },
    [setSearchParams]
  );

  const handleReuseAdvisory = useCallback(
    (item) => {
      navigate("/crop-advisory", {
        state: {
          prefillAdvisory: {
            district: item?.district || "",
            state: item?.state || "",
            season: item?.season || "",
            soilType: item?.soilType || "",
          },
        },
      });
    },
    [navigate]
  );

  const {
    items,
    hasMore,
    loading,
    initialLoading,
    error,
    loadMore,
    refresh,
    replaceItems,
  } = usePaginatedHistory(fetchCropAdvisoryHistory, {
    initialPage: Number.isFinite(pageParam) ? pageParam : 0,
    initialSize: Number.isFinite(sizeParam) ? sizeParam : 20,
    onPageLoaded: updateQueryParams,
  });

  const handleDeleteAllAiHistory = useCallback(async () => {
    try {
      setDeleting(true);
      await deleteAllAiHistory();
      replaceItems([]);
      toast.success("All AI history deleted.");
      await refresh(0, sizeParam);
      setDeleteModalOpen(false);
    } catch (error) {
      console.error("Failed to delete all AI history:", error);
      toast.error("Failed to delete all AI history.");
    } finally {
      setDeleting(false);
    }
  }, [refresh, replaceItems, sizeParam]);

  const filteredItems = useMemo(() => {
    const text = searchText.trim().toLowerCase();
    if (!text) return items;
    return items.filter((item) => {
      const haystack = [
        item?.district || "",
        item?.state || "",
        item?.season || "",
        item?.soilType || "",
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(text);
    });
  }, [items, searchText]);

  if (initialLoading) {
    return <div className="rounded-xl border border-gray-200 bg-white p-4 text-sm text-gray-600">Loading crop advisory history...</div>;
  }

  if (error) {
    return <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>;
  }

  return (
    <div className="space-y-4">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-lg font-semibold md:text-xl">Crop Advisory History</h2>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => refresh(0, sizeParam)}
            className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm hover:bg-gray-50"
          >
            Refresh
          </button>
          <button
            onClick={() => setDeleteModalOpen(true)}
            className="rounded-lg border border-red-300 bg-red-50 px-3 py-1.5 text-sm text-red-800 hover:bg-red-100"
          >
            Delete all AI history
          </button>
        </div>
      </div>

      <div className="mb-3">
        <input
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          placeholder="Search by district, state, season, soil..."
          className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-green-200"
        />
      </div>

      {!filteredItems.length ? (
        <div className="rounded-xl border border-gray-200 bg-white p-4 text-sm text-gray-600">
          No crop advisory history yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {filteredItems.map((item, index) => {
            const parsed = parseResponse(item.responsePayload);
            const crops = parsed?.crops || [];

            return (
              <div key={`${item.createdAt}-${index}`} className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                <div className="mb-2 flex items-start justify-between gap-3">
                  <strong className="text-sm text-gray-900">
                    {item.district || "-"}, {item.state || "-"}
                  </strong>
                  <span className="text-xs text-gray-500">{formatDate(item.createdAt)}</span>
                </div>

                <div className="mb-3 flex flex-wrap gap-2">
                  <span className="rounded-full border border-gray-200 px-2 py-0.5 text-xs text-gray-600">
                    Season: {item.season || "-"}
                  </span>
                  <span className="rounded-full border border-gray-200 px-2 py-0.5 text-xs text-gray-600">
                    Soil: {item.soilType || "-"}
                  </span>
                  <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-700">
                    {item.source || "LLM"}
                  </span>
                </div>

                {crops.length > 0 ? (
                  <ul className="space-y-1 text-sm text-gray-800">
                    {crops.map((crop, cropIndex) => (
                      <li key={cropIndex}>
                        {crop.cropName || crop.name || "Crop"} - {crop.reason || crop.description || "Recommendation available"}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <pre className="overflow-auto rounded-lg bg-gray-50 p-2 text-xs text-gray-700">
                    {item.responsePayload}
                  </pre>
                )}

                <div className="mt-3 flex justify-end">
                  <button
                    onClick={() => handleReuseAdvisory(item)}
                    className="rounded-lg border border-green-200 bg-white px-3 py-1.5 text-xs font-medium text-green-700 hover:bg-green-50"
                  >
                    Reuse advisory
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {hasMore && (
        <button
          className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-70"
          onClick={loadMore}
          disabled={loading}
        >
          {loading ? "Loading..." : "Load More"}
        </button>
      )}

      {deleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-3">
          <div className="w-full max-w-md rounded-xl border border-gray-200 bg-white p-4 shadow-lg">
            <h3 className="text-base font-semibold text-gray-900">
              Confirm delete
            </h3>
            <p className="mt-1 text-sm text-gray-600">
              Delete all AI history (Kisan Mitra + Crop Advisory)?
            </p>
            <p className="mt-2 text-xs text-gray-500">
              This action cannot be undone.
            </p>
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => !deleting && setDeleteModalOpen(false)}
                disabled={deleting}
                className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-60"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAllAiHistory}
                disabled={deleting}
                className="rounded-lg bg-red-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-60"
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CropAdvisoryHistory;
