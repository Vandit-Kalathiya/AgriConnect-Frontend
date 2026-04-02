import React, {
  useState, useEffect, useMemo, useCallback, useRef,
} from "react";
import { Link } from "react-router-dom";
import { FaStar } from "react-icons/fa";
import FilterSidebar from "./FilterSidebar";
import api from "../../config/axiosInstance";
import Loader from "../Loader/Loader";
import { getCurrentUser } from "../../../helper";
import { API_CONFIG } from "../../config/apiConfig";
import {
  Search, X, SlidersHorizontal, LayoutGrid, List,
  PackageSearch, RefreshCw, ChevronLeft, ChevronRight,
  MapPin,
} from "lucide-react";

const BASE_URL = API_CONFIG.MARKET_ACCESS;
const ITEMS_PER_PAGE = 40;

/* ─── debounce ─── */
const useDebounce = (value, delay = 350) => {
  const [d, setD] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setD(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return d;
};

/* ─── sort tabs ─── */
const SORT_TABS = [
  { value: "relevance",  label: "Relevance" },
  { value: "newest",     label: "Newest First" },
  { value: "price_asc",  label: "Price — Low to High" },
  { value: "price_desc", label: "Price — High to Low" },
  { value: "rating",     label: "Top Rated" },
  { value: "qty_desc",   label: "Most Quantity" },
];

const DEFAULT_FILTERS = {
  priceMin: 0, priceMax: 999999,
  cropTypes: [], grades: [], locations: [], certifications: [],
  minRating: 0, sortBy: "relevance",
};

/* ─── pagination helper ─── */
const getPageNumbers = (current, total) => {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages = new Set([1, 2, total - 1, total, current - 1, current, current + 1].filter(p => p >= 1 && p <= total));
  const sorted = [...pages].sort((a, b) => a - b);
  const result = [];
  let prev = null;
  for (const p of sorted) {
    if (prev !== null && p - prev > 1) result.push("…");
    result.push(p);
    prev = p;
  }
  return result;
};

/* ═══════════════════════ MAIN PAGE ═══════════════════════ */
export const CropListingPage = () => {
  const [listings, setListings]         = useState([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState(null);
  const [searchInput, setSearchInput]   = useState("");
  const [filters, setFilters]           = useState(DEFAULT_FILTERS);
  const [viewMode, setViewMode]         = useState("grid");
  const [mobileSidebar, setMobileSidebar] = useState(false);
  const [priceRange, setPriceRange]     = useState({ min: 0, max: 10000 });
  const [currentPage, setCurrentPage]   = useState(1);

  const searchRef       = useRef(null);
  const topRef          = useRef(null);
  const debouncedSearch = useDebounce(searchInput);

  /* ── fetch ── */
  const fetchAllListings = useCallback(async () => {
    setLoading(true);
    try {
      const [res, user] = await Promise.all([
        api.get(`${BASE_URL}/listings/all/active`, { withCredentials: true }),
        getCurrentUser(),
      ]);
      const payload = res?.data;
      const listingsArray = Array.isArray(payload)
        ? payload
        : Array.isArray(payload?.content)
          ? payload.content
          : [];
      const raw = listingsArray.filter(l => l.contactOfFarmer !== user.phoneNumber);
      const mapped = raw.map(l => ({
        id:               l.id,
        images:           l.images,
        type:             l.productType   || "",
        variety:          l.productName   || "",
        grade:            l.qualityGrade  || "",
        certifications:   l.certifications ? l.certifications.split(", ") : [],
        quantity:         l.quantity,
        unit:             l.unitOfQuantity || "",
        location:         l.location      || "",
        harvestDate:      l.harvestedDate,
        availabilityDate: l.availabilityDate,
        shelfLife:        l.shelfLifetime,
        price:            `₹${l.finalPrice}`,
        priceNum:         parseFloat(l.finalPrice) || 0,
        priceUnit:        "per " + (l.unitOfQuantity || "unit"),
        description:      l.productDescription || "",
        contact:          l.contactOfFarmer,
        lastUpdatedDate:  l.lastUpdatedDate,
        createdDate:      l.createdDate,
        createdTime:      l.createdTime,
        rating:           4.5,
      }));
      setListings(mapped);
      if (mapped.length) {
        const prices = mapped.map(l => l.priceNum);
        const mn = Math.floor(Math.min(...prices));
        const mx = Math.ceil(Math.max(...prices));
        setPriceRange({ min: mn, max: mx });
        setFilters(f => ({ ...f, priceMin: mn, priceMax: mx }));
      }
      setError(null);
    } catch (err) {
      const rawError = err?.response?.data;
      const safeMessage =
        typeof rawError === "string"
          ? rawError
          : rawError?.message || err?.message || "Unknown error";
      setError(`Failed to fetch listings: ${safeMessage}`);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAllListings(); }, [fetchAllListings]);

  /* ── derived options ── */
  const cropTypes = useMemo(() => [...new Set(listings.map(l => l.type).filter(Boolean))].sort(), [listings]);
  const grades    = useMemo(() => [...new Set(listings.map(l => l.grade).filter(Boolean))].sort(), [listings]);
  const locations = useMemo(() => [...new Set(listings.map(l => l.location?.split(",")[0]?.trim()).filter(Boolean))].sort(), [listings]);
  const certificationsList = useMemo(() => [...new Set(listings.flatMap(l => l.certifications).filter(Boolean))].sort(), [listings]);

  const countMap = useMemo(() => {
    const types = {}, grds = {}, locs = {}, certs = {};
    listings.forEach(l => {
      if (l.type)  types[l.type] = (types[l.type] || 0) + 1;
      if (l.grade) grds[l.grade] = (grds[l.grade] || 0) + 1;
      const loc = l.location?.split(",")[0]?.trim();
      if (loc) locs[loc] = (locs[loc] || 0) + 1;
      l.certifications.forEach(c => { certs[c] = (certs[c] || 0) + 1; });
    });
    return { types, grades: grds, locations: locs, certs };
  }, [listings]);

  /* ── filter + sort ── */
  const filteredListings = useMemo(() => {
    let r = [...listings];
    const q = debouncedSearch.trim().toLowerCase();
    if (q) r = r.filter(l =>
      l.type?.toLowerCase().includes(q) || l.variety?.toLowerCase().includes(q) ||
      l.location?.toLowerCase().includes(q) || l.description?.toLowerCase().includes(q) ||
      l.grade?.toLowerCase().includes(q)
    );
    r = r.filter(l => l.priceNum >= filters.priceMin && l.priceNum <= filters.priceMax);
    if (filters.cropTypes.length)      r = r.filter(l => filters.cropTypes.includes(l.type));
    if (filters.grades.length)         r = r.filter(l => filters.grades.includes(l.grade));
    if (filters.locations.length)      r = r.filter(l => filters.locations.some(loc => l.location?.includes(loc)));
    if (filters.certifications.length) r = r.filter(l => filters.certifications.some(c => l.certifications.includes(c)));
    if (filters.minRating > 0)         r = r.filter(l => l.rating >= filters.minRating);
    switch (filters.sortBy) {
      case "price_asc":  r.sort((a, b) => a.priceNum - b.priceNum); break;
      case "price_desc": r.sort((a, b) => b.priceNum - a.priceNum); break;
      case "rating":     r.sort((a, b) => b.rating - a.rating);     break;
      case "qty_desc":   r.sort((a, b) => (b.quantity||0) - (a.quantity||0)); break;
      case "oldest":     r.sort((a, b) => new Date(a.createdDate) - new Date(b.createdDate)); break;
      case "newest":     r.sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate)); break;
      default: break; // relevance = original order
    }
    return r;
  }, [listings, debouncedSearch, filters]);

  /* reset to page 1 when filters/search change */
  useEffect(() => { setCurrentPage(1); }, [debouncedSearch, filters]);

  const totalPages    = Math.max(1, Math.ceil(filteredListings.length / ITEMS_PER_PAGE));
  const pageStart     = (currentPage - 1) * ITEMS_PER_PAGE;
  const pageEnd       = Math.min(pageStart + ITEMS_PER_PAGE, filteredListings.length);
  const pageListings  = filteredListings.slice(pageStart, pageEnd);
  const pageNumbers   = getPageNumbers(currentPage, totalPages);

  const goToPage = (p) => {
    setCurrentPage(p);
    topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  /* ── chip helpers ── */
  const updateFilter = useCallback(patch => setFilters(f => ({ ...f, ...patch })), []);
  const toggleArr    = useCallback((key, val) =>
    setFilters(f => ({
      ...f,
      [key]: f[key].includes(val) ? f[key].filter(v => v !== val) : [...f[key], val],
    })), []);
  const clearAll = useCallback(() => {
    setSearchInput("");
    setFilters({ ...DEFAULT_FILTERS, priceMin: priceRange.min, priceMax: priceRange.max });
  }, [priceRange]);

  const activeFilterCount = useMemo(() => {
    let n = 0;
    if (filters.cropTypes.length)      n += filters.cropTypes.length;
    if (filters.grades.length)         n += filters.grades.length;
    if (filters.locations.length)      n += filters.locations.length;
    if (filters.certifications.length) n += filters.certifications.length;
    if (filters.minRating > 0)         n++;
    if (filters.priceMin !== priceRange.min || filters.priceMax !== priceRange.max) n++;
    return n;
  }, [filters, priceRange]);

  const activeChips = useMemo(() => {
    const chips = [];
    if (debouncedSearch) chips.push({ key: "search", label: `"${debouncedSearch}"`, onRemove: () => setSearchInput("") });
    if (filters.priceMin !== priceRange.min || filters.priceMax !== priceRange.max)
      chips.push({ key: "price", label: `₹${filters.priceMin}–₹${filters.priceMax}`, onRemove: () => updateFilter({ priceMin: priceRange.min, priceMax: priceRange.max }) });
    filters.cropTypes.forEach(t => chips.push({ key: `t-${t}`, label: t, onRemove: () => toggleArr("cropTypes", t) }));
    filters.grades.forEach(g => chips.push({ key: `g-${g}`, label: g, onRemove: () => toggleArr("grades", g) }));
    filters.locations.forEach(l => chips.push({ key: `l-${l}`, label: l, onRemove: () => toggleArr("locations", l) }));
    filters.certifications.forEach(c => chips.push({ key: `c-${c}`, label: c, onRemove: () => toggleArr("certifications", c) }));
    if (filters.minRating > 0)
      chips.push({ key: "rating", label: `${filters.minRating}★ & above`, onRemove: () => updateFilter({ minRating: 0 }) });
    return chips;
  }, [debouncedSearch, filters, priceRange]);

  /* ═══ render ═══ */
  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-[#f1f3f6] md:ml-14 font-poppins overflow-x-hidden">

      {/* ════ MOBILE FILTER OVERLAY ════ */}
      {mobileSidebar && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileSidebar(false)} />
          <div className="relative ml-auto w-72 max-w-full h-full bg-white shadow-2xl flex flex-col">
            <div className="flex items-center justify-between px-4 py-3.5 border-b border-gray-100">
              <span className="font-bold text-gray-800 text-sm">Filters</span>
              <button onClick={() => setMobileSidebar(false)}><X size={18} className="text-gray-500" /></button>
            </div>
            <div className="flex-1 overflow-y-auto px-4 py-2">
              <FilterSidebar filters={filters} onFilterChange={updateFilter} onClearAll={clearAll}
                cropTypes={cropTypes} grades={grades} locations={locations}
                certificationsList={certificationsList} priceRange={priceRange}
                countMap={countMap} activeCount={activeFilterCount} />
            </div>
            <div className="px-4 py-3 border-t border-gray-100 flex gap-3">
              <button onClick={clearAll} className="flex-1 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-600">Clear All</button>
              <button onClick={() => setMobileSidebar(false)} className="flex-1 py-2.5 bg-green-600 text-white rounded-lg text-sm font-semibold">
                Show {filteredListings.length} Results
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ════ INNER LAYOUT ════ */}
      <div className="flex min-h-[calc(100vh-3.5rem)]" ref={topRef}>

        {/* ── LEFT SIDEBAR (desktop) ── */}
        <aside className="hidden lg:block w-56 xl:w-60 flex-shrink-0">
          <div className="sticky top-11  h-[calc(100vh-3.5rem)] sm:h-[calc(100vh-3.5rem)] overflow-y-auto bg-white border-r border-gray-200 scrollbar-thin scrollbar-thumb-gray-200 px-4 pt-4 pb-8">
            <FilterSidebar filters={filters} onFilterChange={updateFilter} onClearAll={clearAll}
              cropTypes={cropTypes} grades={grades} locations={locations}
              certificationsList={certificationsList} priceRange={priceRange}
              countMap={countMap} activeCount={activeFilterCount} />
          </div>
        </aside>

        {/* ── RIGHT CONTENT AREA ── */}
        <div className="flex-1 min-w-0">

          {/* ── TOP BAR: MOBILE ── */}
          <div className="md:hidden bg-white border-b border-gray-200 px-3 py-3 sticky top-0 z-20">
            <div className="flex items-center justify-between mb-2">
              <h1 className="text-base font-semibold text-gray-800 truncate">
                Fresh Produce Marketplace
              </h1>
              <span className="text-xs text-gray-500 ml-2 shrink-0">
                {filteredListings.length} items
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setMobileSidebar(true)}
                className="flex items-center gap-1.5 px-3 py-2 border border-gray-200 rounded-lg text-xs font-medium text-gray-700 bg-white shrink-0"
              >
                <SlidersHorizontal size={14} />
                Filters
                {activeFilterCount > 0 && (
                  <span className="flex h-4 w-4 items-center justify-center rounded-full bg-green-600 text-white text-[9px] font-bold">
                    {activeFilterCount}
                  </span>
                )}
              </button>
              <div className="relative flex-1 min-w-0">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                <input
                  ref={searchRef}
                  type="text"
                  value={searchInput}
                  onChange={e => setSearchInput(e.target.value)}
                  placeholder="Search crops, location"
                  className="w-full pl-8 pr-8 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all"
                />
                {searchInput && (
                  <button onClick={() => setSearchInput("")} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    <X size={13} />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* ── TOP BAR: DESKTOP/TABLET ── */}
          <div className="hidden md:flex bg-white border-b border-gray-200 px-4 py-2.5 items-center justify-between gap-4 sticky top-0 z-20">
            <div className="flex items-center gap-1.5 text-xs text-gray-500 min-w-0">
              <span className="font-medium text-gray-700 text-sm truncate">Fresh Produce Marketplace</span>
              {debouncedSearch && (
                <>
                  <span className="text-gray-300">›</span>
                  <span className="text-gray-600 truncate max-w-[160px]">"{debouncedSearch}"</span>
                </>
              )}
            </div>

            {/* search — right side, medium width */}
            <div className="flex items-center gap-2 flex-shrink-0">
              {/* mobile filter button */}
              <button
                onClick={() => setMobileSidebar(true)}
                className="flex lg:hidden items-center gap-1.5 px-3 py-2 border border-gray-200 rounded-lg text-xs font-medium text-gray-700 bg-white"
              >
                <SlidersHorizontal size={14} />
                Filters
                {activeFilterCount > 0 && (
                  <span className="flex h-4 w-4 items-center justify-center rounded-full bg-green-600 text-white text-[9px] font-bold">{activeFilterCount}</span>
                )}
              </button>

              {/* search input — medium, right-aligned */}
              <div className="relative w-48 sm:w-64 md:w-72">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                <input
                  ref={searchRef}
                  type="text"
                  value={searchInput}
                  onChange={e => setSearchInput(e.target.value)}
                  placeholder="Search crops, location…"
                  className="w-full pl-8 pr-8 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all"
                />
                {searchInput && (
                  <button onClick={() => setSearchInput("")} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    <X size={13} />
                  </button>
                )}
              </div>

              {/* view toggle */}
              <div className="hidden sm:flex items-center border border-gray-200 rounded-lg overflow-hidden">
                <button onClick={() => setViewMode("grid")} title="Grid view"
                  className={`p-2 transition-colors ${viewMode === "grid" ? "bg-green-600 text-white" : "bg-white text-gray-500 hover:bg-gray-50"}`}>
                  <LayoutGrid size={14} />
                </button>
                <button onClick={() => setViewMode("list")} title="List view"
                  className={`p-2 transition-colors ${viewMode === "list" ? "bg-green-600 text-white" : "bg-white text-gray-500 hover:bg-gray-50"}`}>
                  <List size={14} />
                </button>
              </div>
            </div>
          </div>

          {/* ── SORT TABS + RESULTS INFO ── */}
          {!loading && !error && (
            <div className="bg-white border-b border-gray-200 px-4">
              <div className="flex items-center justify-between">
                {/* sort tabs */}
                <div className="hidden md:flex items-center gap-0 overflow-x-auto scrollbar-none">
                  <span className="text-xs font-semibold text-gray-500 pr-3 whitespace-nowrap py-3 border-r border-gray-100 mr-2">Sort By</span>
                  {SORT_TABS.map(tab => (
                    <button
                      key={tab.value}
                      onClick={() => updateFilter({ sortBy: tab.value })}
                      className={`whitespace-nowrap px-3 py-3 text-xs font-medium transition-colors border-b-2 ${
                        filters.sortBy === tab.value
                          ? "border-green-600 text-green-700 font-semibold"
                          : "border-transparent text-gray-600 hover:text-green-600 hover:border-green-300"
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
                {/* mobile sort select */}
                <div className="md:hidden flex items-center gap-2 py-2">
                  <span className="text-xs font-semibold text-gray-500">Sort:</span>
                  <select
                    value={filters.sortBy}
                    onChange={(e) => updateFilter({ sortBy: e.target.value })}
                    className="text-xs border border-gray-200 rounded-md px-2 py-1.5 bg-white text-gray-700"
                  >
                    {SORT_TABS.map((tab) => (
                      <option key={tab.value} value={tab.value}>
                        {tab.label}
                      </option>
                    ))}
                  </select>
                </div>
                {/* results count */}
                <p className="text-xs text-gray-500 whitespace-nowrap pl-4 hidden sm:block">
                  {filteredListings.length === 0 ? "0 results" :
                    <>
                      <span className="font-semibold text-gray-800">{pageStart + 1}–{pageEnd}</span>
                      {" of "}
                      <span className="font-semibold text-gray-800">{filteredListings.length.toLocaleString()}</span>
                      {" results"}
                      {debouncedSearch && <span className="text-gray-500"> for "<em>{debouncedSearch}</em>"</span>}
                    </>
                  }
                </p>
              </div>
            </div>
          )}

          {/* ── ACTIVE CHIPS ── */}
          {activeChips.length > 0 && (
            <div className="bg-white px-4 py-2 border-b border-gray-100 flex flex-wrap gap-1.5 items-center">
              {activeChips.map(chip => (
                <span key={chip.key} className="inline-flex items-center gap-1 px-2.5 py-1 bg-gray-100 text-gray-700 border border-gray-200 rounded-full text-xs font-medium">
                  {chip.label}
                  <button onClick={chip.onRemove} className="hover:text-red-500 transition-colors"><X size={11} /></button>
                </span>
              ))}
              <button onClick={clearAll} className="text-xs text-green-600 font-semibold hover:underline ml-1">Clear all</button>
            </div>
          )}

          {/* ── MAIN AREA ── */}
          <div className="px-3 py-3 pb-20 md:pb-3">

            {/* loading */}
            {loading && (
              <div className="flex justify-center items-center py-32"><Loader /></div>
            )}

            {/* error */}
            {error && (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="text-4xl mb-3">⚠️</div>
                <p className="text-red-500 font-medium mb-4 text-sm">{error}</p>
                <button onClick={fetchAllListings} className="px-5 py-2 bg-green-600 text-white rounded-lg text-sm font-semibold hover:bg-green-700 transition-colors">
                  Try again
                </button>
              </div>
            )}

            {/* no results */}
            {!loading && !error && filteredListings.length === 0 && (
              <div className="flex flex-col items-center justify-center py-16 md:py-24 text-center bg-white border border-gray-100 rounded-xl">
                <PackageSearch size={56} className="text-gray-200 mb-4" />
                <h3 className="text-xl font-bold text-gray-700 mb-1">No listings found</h3>
                <p className="text-gray-400 text-sm mb-5 max-w-xs">
                  {listings.length === 0
                    ? "No active listings yet. Check back soon!"
                    : "Try adjusting your search or filters."}
                </p>
                <div className="flex flex-col sm:flex-row gap-2">
                  {listings.length > 0 && (
                    <button onClick={clearAll} className="flex items-center justify-center gap-2 px-5 py-2 bg-green-600 text-white rounded-lg text-sm font-semibold hover:bg-green-700 transition-colors">
                      <RefreshCw size={14} /> Clear filters
                    </button>
                  )}
                  <button onClick={fetchAllListings} className="flex items-center justify-center gap-2 px-5 py-2 border border-gray-200 bg-white text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-50 transition-colors">
                    Refresh
                  </button>
                </div>
              </div>
            )}

            {/* ── GRID ── */}
            {!loading && !error && pageListings.length > 0 && (
              viewMode === "grid" ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-2.5">
                  {pageListings.map(crop => (
                    <CompactCropCard key={crop.id} crop={crop} />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  {pageListings.map(crop => (
                    <ListCropCard key={crop.id} crop={crop} />
                  ))}
                </div>
              )
            )}

            {/* ── PAGINATION ── */}
            {!loading && !error && totalPages > 1 && (
              <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white rounded-xl px-5 py-4 border border-gray-100 shadow-sm">
                {/* left: showing info */}
                <p className="text-xs text-gray-500 order-2 sm:order-1">
                  Page <span className="font-semibold text-gray-700">{currentPage}</span> of{" "}
                  <span className="font-semibold text-gray-700">{totalPages.toLocaleString()}</span>
                  {" · "}
                  <span className="font-semibold text-gray-700">{filteredListings.length.toLocaleString()}</span> total listings
                </p>

                {/* center: page numbers */}
                <div className="flex items-center gap-1 order-1 sm:order-2">
                  {/* prev */}
                  <button
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="flex items-center gap-1 px-3 py-1.5 border border-gray-200 rounded-lg text-xs font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft size={13} /> Prev
                  </button>

                  {pageNumbers.map((p, i) =>
                    p === "…" ? (
                      <span key={`e${i}`} className="px-2 py-1.5 text-xs text-gray-400 select-none">…</span>
                    ) : (
                      <button
                        key={p}
                        onClick={() => goToPage(p)}
                        className={`min-w-[32px] px-2 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                          p === currentPage
                            ? "bg-green-600 text-white shadow-sm"
                            : "border border-gray-200 text-gray-600 hover:bg-gray-50"
                        }`}
                      >
                        {p}
                      </button>
                    )
                  )}

                  {/* next */}
                  <button
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="flex items-center gap-1 px-3 py-1.5 border border-gray-200 rounded-lg text-xs font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    Next <ChevronRight size={13} />
                  </button>
                </div>

                {/* right: jump to page */}
                <div className="hidden sm:flex items-center gap-2 order-3 text-xs text-gray-500">
                  Go to page
                  <input
                    type="number"
                    min={1}
                    max={totalPages}
                    defaultValue={currentPage}
                    key={currentPage}
                    onKeyDown={e => {
                      if (e.key === "Enter") {
                        const v = Math.min(Math.max(1, Number(e.target.value)), totalPages);
                        goToPage(v);
                      }
                    }}
                    className="w-14 px-2 py-1.5 border border-gray-200 rounded-lg text-xs text-center focus:outline-none focus:ring-2 focus:ring-green-400"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

/* ═══════════════════════ COMPACT GRID CARD ═══════════════════════ */
const CompactCropCard = ({ crop }) => {
  const [images, setImages] = useState([]);
  const [imgLoading, setImgLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const urls = await Promise.all(
          crop.images.map(img =>
            api.get(`${API_CONFIG.MARKET_ACCESS}/image/${img.id}`, { withCredentials: true, responseType: "blob" })
              .then(r => URL.createObjectURL(r.data))
          )
        );
        if (!cancelled) { setImages(urls); setImgLoading(false); }
      } catch { if (!cancelled) setImgLoading(false); }
    })();
    return () => {
      cancelled = true;
      images.forEach(u => URL.revokeObjectURL(u));
    };
  }, [crop.id]);

  return (
    <Link to={`/crop/${crop.id}`} state={{ cropData: crop, images }}>
      <div className="bg-white rounded-lg border border-gray-100 hover:shadow-md hover:border-green-200 transition-all duration-200 overflow-hidden group cursor-pointer h-full flex flex-col">
        {/* image */}
        <div className="relative overflow-hidden bg-gray-50">
          {imgLoading ? (
            <div className="w-full h-36 bg-gray-100 animate-pulse" />
          ) : (
            <img
              src={images[0] || "https://via.placeholder.com/300x200?text=No+Image"}
              alt={`${crop.type} - ${crop.variety}`}
              className="w-full h-36 object-cover group-hover:scale-105 transition-transform duration-300"
            />
          )}
          {crop.grade && (
            <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 bg-blue-600 text-white text-[10px] font-bold rounded">
              {crop.grade}
            </span>
          )}
        </div>
        {/* info */}
        <div className="p-2.5 flex-1 flex flex-col justify-between gap-1">
          <div>
            <h3 className="text-xs font-semibold text-gray-800 line-clamp-2 leading-tight group-hover:text-green-700 transition-colors">
              {crop.type} — {crop.variety}
            </h3>
          </div>
          <div>
            <div className="flex items-center gap-1 mb-1">
              <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-green-600 text-white text-[10px] font-bold rounded">
                <FaStar size={8} /> {crop.rating.toFixed(1)}
              </span>
              {crop.certifications[0] && (
                <span className="text-[10px] text-green-700 font-medium bg-green-50 px-1.5 py-0.5 rounded border border-green-100 truncate max-w-[80px]">
                  {crop.certifications[0]}
                </span>
              )}
            </div>
            <p className="text-sm font-bold text-gray-900">
              {crop.price}
              <span className="text-[10px] font-normal text-gray-500 ml-1">{crop.priceUnit}</span>
            </p>
            {crop.location && (
              <p className="flex items-center gap-0.5 text-[10px] text-gray-400 mt-0.5 truncate">
                <MapPin size={9} /> {crop.location.split(",")[0]}
              </p>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

/* ═══════════════════════ LIST CARD ═══════════════════════ */
const ListCropCard = ({ crop }) => {
  const [images, setImages] = useState([]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const urls = await Promise.all(
          crop.images.map(img =>
            api.get(`${API_CONFIG.MARKET_ACCESS}/image/${img.id}`, { withCredentials: true, responseType: "blob" })
              .then(r => URL.createObjectURL(r.data))
          )
        );
        if (!cancelled) setImages(urls);
      } catch { /* silent */ }
    })();
    return () => { cancelled = true; images.forEach(u => URL.revokeObjectURL(u)); };
  }, [crop.id]);

  return (
    <Link to={`/crop/${crop.id}`} state={{ cropData: crop, images }}>
      <div className="bg-white rounded-lg border border-gray-100 hover:shadow-md hover:border-green-200 transition-all duration-200 flex gap-3 p-3 group cursor-pointer">
        <img
          src={images[0] || "https://via.placeholder.com/100x80?text=No+Image"}
          alt={`${crop.type}`}
          className="w-24 h-20 object-cover rounded-lg flex-shrink-0 group-hover:opacity-90 transition-opacity"
        />
        <div className="flex-1 min-w-0 flex flex-col justify-between">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-sm font-semibold text-gray-800 line-clamp-1 group-hover:text-green-700 transition-colors">
              {crop.type} — {crop.variety}
            </h3>
            <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-green-600 text-white text-[10px] font-bold rounded flex-shrink-0">
              <FaStar size={8} /> {crop.rating.toFixed(1)}
            </span>
          </div>
          <p className="text-xs text-gray-400 line-clamp-1 mt-0.5">{crop.description}</p>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1.5">
            <span className="text-base font-bold text-gray-900">
              {crop.price}
              <span className="text-xs font-normal text-gray-500 ml-1">{crop.priceUnit}</span>
            </span>
            {crop.grade && <span className="px-1.5 py-0.5 bg-blue-50 text-blue-700 text-[10px] font-semibold rounded">Grade {crop.grade}</span>}
            {crop.location && <span className="flex items-center gap-0.5 text-xs text-gray-400"><MapPin size={10} />{crop.location.split(",")[0]}</span>}
            {crop.quantity && <span className="text-xs text-gray-400">📦 {crop.quantity} {crop.unit}</span>}
            {crop.certifications.slice(0, 2).map(c => (
              <span key={c} className="px-1.5 py-0.5 bg-green-50 text-green-700 text-[10px] font-medium rounded border border-green-100">{c}</span>
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CropListingPage;
