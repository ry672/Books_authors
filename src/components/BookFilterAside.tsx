import React from "react";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onClear: () => void;

  search: string;
  setSearch: (v: string) => void;

  name: string;
  setName: (v: string) => void;

  price: string;
  setPrice: (v: string) => void;

  minPrice: number;
  setMinPrice: (v: number) => void;

  maxPrice: number;
  setMaxPrice: (v: number) => void;

  MIN: number;
  MAX: number;

  setPage: (v: number) => void;
};

export const BookFiltersAside: React.FC<Props> = ({
  isOpen,
  onClose,
  onClear,
  search,
  setSearch,
  name,
  setName,
  price,
  setPrice,
  minPrice,
  setMinPrice,
  maxPrice,
  setMaxPrice,
  MIN,
  MAX,
  setPage,
}) => {
  if (!isOpen) return null;

  const exactPriceActive = price.trim().length > 0;

  return (
    <aside className="w-[420px] shrink-0 sticky top-0 h-screen overflow-auto p-6 bg-white rounded-lg shadow border">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Filters</h2>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={onClear}
            className="px-3 py-1 rounded-md border hover:bg-gray-50"
          >
            Clear
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1 rounded-md border hover:bg-gray-50"
          >
            Close
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="space-y-2 mb-4">
        <label className="text-sm font-medium">Search</label>
        <input
          className="w-full rounded-md h-10 px-4 border-2 border-gray-100 shadow-sm"
          value={search}
          placeholder="Search..."
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />
      </div>

      {/* Name */}
      <div className="space-y-2 mb-4">
        <label className="text-sm font-medium">Name</label>
        <input
          className="w-full rounded-md h-10 px-4 border-2 border-gray-100 shadow-sm"
          value={name}
          placeholder="Filter by name..."
          onChange={(e) => {
            setName(e.target.value);
            setPage(1);
          }}
        />
      </div>

      {/* Exact price */}
      <div className="space-y-2 mb-4">
        <label className="text-sm font-medium">Price</label>
        <input
          className="w-full rounded-md h-10 px-4 border-2 border-gray-100 shadow-sm"
          type="number"
          value={price}
          placeholder="Find price..."
          onChange={(e) => {
            setPrice(e.target.value);
            setPage(1);
          }}
        />
      </div>

      {/* Range */}
      <div className="space-y-3">
        <div className="text-sm font-medium">
          Price range: {minPrice} – {maxPrice}
          {exactPriceActive && (
            <span className="ml-2 text-xs text-gray-500">
              (exact active, range ignored)
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs w-10">Min</span>
          <input
            type="range"
            min={MIN}
            max={MAX}
            step={1}
            value={minPrice}
            onChange={(e) => {
              const v = Number(e.target.value);
              setMinPrice(v);
              if (v > maxPrice) setMaxPrice(v);
              setPrice(""); 
              setPage(1);
            }}
            className="w-full"
          />
          <span className="text-xs w-12 text-right">{minPrice}</span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs w-10">Max</span>
          <input
            type="range"
            min={MIN}
            max={MAX}
            step={1}
            value={maxPrice}
            onChange={(e) => {
              const v = Number(e.target.value);
              setMaxPrice(v);
              if (v < minPrice) setMinPrice(v);
              setPrice(""); 
              setPage(1);
            }}
            className="w-full"
          />
          <span className="text-xs w-12 text-right">{maxPrice}</span>
        </div>
      </div>
    </aside>
  );
};