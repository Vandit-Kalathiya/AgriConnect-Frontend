import React, { useState } from "react";
import { ChevronDown, ChevronUp, X, Star, SlidersHorizontal } from "lucide-react";

/* ── collapsible section wrapper ── */
const Section = ({ title, children, defaultOpen = true }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-gray-100 py-4">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between text-sm font-semibold text-gray-800 hover:text-green-600 transition-colors"
      >
        {title}
        {open ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
      </button>
      {open && <div className="mt-3">{children}</div>}
    </div>
  );
};

/* ── checkbox item ── */
const CheckItem = ({ label, count, checked, onChange }) => (
  <label className="flex items-center justify-between gap-2 py-1 cursor-pointer group">
    <div className="flex items-center gap-2">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="h-4 w-4 rounded border-gray-300 text-green-600 accent-green-600 cursor-pointer"
      />
      <span className="text-sm text-gray-700 group-hover:text-green-700 transition-colors capitalize">
        {label}
      </span>
    </div>
    {count !== undefined && (
      <span className="text-xs text-gray-400 font-medium">({count})</span>
    )}
  </label>
);

/* ── price range dual input ── */
const PriceRange = ({ min, max, value, onChange }) => {
  const handleMin = (e) => {
    const v = Math.min(Number(e.target.value), value[1] - 1);
    onChange([v, value[1]]);
  };
  const handleMax = (e) => {
    const v = Math.max(Number(e.target.value), value[0] + 1);
    onChange([value[0], v]);
  };

  const minPct = ((value[0] - min) / (max - min)) * 100;
  const maxPct = ((value[1] - min) / (max - min)) * 100;

  return (
    <div className="space-y-4">
      {/* slider track */}
      <div className="relative h-5 flex items-center">
        <div className="absolute w-full h-1.5 bg-gray-200 rounded-full" />
        <div
          className="absolute h-1.5 bg-green-500 rounded-full"
          style={{ left: `${minPct}%`, right: `${100 - maxPct}%` }}
        />
        <input
          type="range"
          min={min}
          max={max}
          value={value[0]}
          onChange={handleMin}
          className="absolute w-full h-1.5 appearance-none bg-transparent cursor-pointer range-thumb"
          style={{ zIndex: value[0] > max - 100 ? 5 : 3 }}
        />
        <input
          type="range"
          min={min}
          max={max}
          value={value[1]}
          onChange={handleMax}
          className="absolute w-full h-1.5 appearance-none bg-transparent cursor-pointer range-thumb"
          style={{ zIndex: 4 }}
        />
      </div>

      {/* manual inputs */}
      <div className="flex items-center gap-2">
        <div className="flex-1 relative">
          <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs">₹</span>
          <input
            type="number"
            value={value[0]}
            min={min}
            max={value[1] - 1}
            onChange={handleMin}
            className="w-full pl-6 pr-2 py-1.5 border border-gray-200 rounded-lg text-xs text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent"
          />
        </div>
        <span className="text-gray-400 text-xs">—</span>
        <div className="flex-1 relative">
          <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs">₹</span>
          <input
            type="number"
            value={value[1]}
            min={value[0] + 1}
            max={max}
            onChange={handleMax}
            className="w-full pl-6 pr-2 py-1.5 border border-gray-200 rounded-lg text-xs text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent"
          />
        </div>
      </div>
    </div>
  );
};

/* ── star rating selector ── */
const RatingFilter = ({ value, onChange }) => (
  <div className="space-y-1.5">
    {[4, 3, 2, 1].map((r) => (
      <button
        key={r}
        onClick={() => onChange(value === r ? 0 : r)}
        className={`flex items-center gap-2 w-full px-2 py-1.5 rounded-lg text-sm transition-all ${
          value === r
            ? "bg-green-50 text-green-700 font-medium"
            : "text-gray-600 hover:bg-gray-50"
        }`}
      >
        <div className="flex">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              size={13}
              className={i < r ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}
            />
          ))}
        </div>
        <span className="text-xs">& above</span>
        {value === r && (
          <X size={13} className="ml-auto text-green-600" />
        )}
      </button>
    ))}
  </div>
);

/* ── main sidebar ── */
const FilterSidebar = ({
  filters,
  onFilterChange,
  onClearAll,
  cropTypes,
  grades,
  locations,
  certificationsList,
  priceRange,
  countMap,
  activeCount,
}) => {
  const toggle = (key, val) => {
    const arr = filters[key];
    onFilterChange({
      [key]: arr.includes(val) ? arr.filter((v) => v !== val) : [...arr, val],
    });
  };

  return (
    <aside className="w-full">
      {/* header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <SlidersHorizontal size={16} className="text-green-600" />
          <span className="font-bold text-gray-800 text-sm">Filters</span>
          {activeCount > 0 && (
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-green-600 text-white text-[10px] font-bold">
              {activeCount}
            </span>
          )}
        </div>
        {activeCount > 0 && (
          <button
            onClick={onClearAll}
            className="text-xs text-green-600 font-semibold hover:text-green-800 transition-colors"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Price Range */}
      <Section title="Price Range">
        <PriceRange
          min={priceRange.min}
          max={priceRange.max}
          value={[filters.priceMin ?? priceRange.min, filters.priceMax ?? priceRange.max]}
          onChange={([mn, mx]) => onFilterChange({ priceMin: mn, priceMax: mx })}
        />
      </Section>

      {/* Crop Type */}
      {cropTypes.length > 0 && (
        <Section title="Crop Type">
          <div className="space-y-0.5 max-h-52 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-gray-200">
            {cropTypes.map((t) => (
              <CheckItem
                key={t}
                label={t}
                count={countMap.types?.[t]}
                checked={filters.cropTypes.includes(t)}
                onChange={() => toggle("cropTypes", t)}
              />
            ))}
          </div>
        </Section>
      )}

      {/* Quality Grade */}
      {grades.length > 0 && (
        <Section title="Quality Grade" defaultOpen={false}>
          <div className="space-y-0.5">
            {grades.map((g) => (
              <CheckItem
                key={g}
                label={g}
                count={countMap.grades?.[g]}
                checked={filters.grades.includes(g)}
                onChange={() => toggle("grades", g)}
              />
            ))}
          </div>
        </Section>
      )}

      {/* Location */}
      {locations.length > 0 && (
        <Section title="Location" defaultOpen={false}>
          <div className="space-y-0.5 max-h-44 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-gray-200">
            {locations.map((loc) => (
              <CheckItem
                key={loc}
                label={loc}
                count={countMap.locations?.[loc]}
                checked={filters.locations.includes(loc)}
                onChange={() => toggle("locations", loc)}
              />
            ))}
          </div>
        </Section>
      )}

      {/* Certifications */}
      {certificationsList.length > 0 && (
        <Section title="Certifications" defaultOpen={false}>
          <div className="space-y-0.5">
            {certificationsList.map((cert) => (
              <CheckItem
                key={cert}
                label={cert}
                count={countMap.certs?.[cert]}
                checked={filters.certifications.includes(cert)}
                onChange={() => toggle("certifications", cert)}
              />
            ))}
          </div>
        </Section>
      )}

      {/* Rating */}
      <Section title="Minimum Rating" defaultOpen={false}>
        <RatingFilter
          value={filters.minRating}
          onChange={(v) => onFilterChange({ minRating: v })}
        />
      </Section>

      {/* slider thumb styles */}
      <style>{`
        .range-thumb::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: white;
          border: 2.5px solid #16a34a;
          cursor: pointer;
          box-shadow: 0 1px 4px rgba(0,0,0,0.15);
        }
        .range-thumb::-moz-range-thumb {
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: white;
          border: 2.5px solid #16a34a;
          cursor: pointer;
          box-shadow: 0 1px 4px rgba(0,0,0,0.15);
        }
      `}</style>
    </aside>
  );
};

export default FilterSidebar;
