import React from "react";

type Props = {
  onClear: () => void;

  search: string;
  setSearch: (v: string) => void;

  name: string;
  setName: (v: string) => void;

  price: string;
  setPrice: (v: string) => void;


  // minPrice: number;
  // setMinPrice: (v: number) => void;

  // maxPrice: number;
  // setMaxPrice: (v: number) => void;

  // MIN: number;
  // MAX: number;

  setPage: (v: number) => void;
};

export const BookFiltersAside: React.FC<Props> = ({


  search,
  setSearch,
  name,
  setName,
  price,
  setPrice,
  // minPrice,
  // setMinPrice,
  // maxPrice,
  // setMaxPrice,
  // MIN,
  // MAX,
  setPage,
}) => {
 

  // const exactPriceActive = price.trim().length > 0;

  return (
    

      <div className="flex justify-between gap-5 ">
        {/* Search */}
      <div className="space-y-2">
        <input
          className="w-full rounded-md border border-[#2D3748] bg-gray-900 px-2 py-1 placeholder:text-sm mt-4"
          value={search}
          placeholder="Search..."
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />
      </div>

      {/* Name
      <div className="space-y-2">
        <input
          className="w-full rounded-md border border-[#2D3748] bg-gray-900 px-2 py-1 placeholder:text-sm mt-4 "
          value={name}
          placeholder="Filter by name..."
          onChange={(e) => {
            setName(e.target.value);
            setPage(1);
          }}
        />
      </div> */}

      {/* Exact price
      <div className="space-y-2">
        <input
          className="w-full rounded-md border border-[#2D3748] bg-gray-900 px-2 py-1 placeholder:text-sm mt-4"
          type="number"
          value={price}
          placeholder="Find price..."
          onChange={(e) => {
            setPrice(e.target.value);
            setPage(1);
          }}
        />
      </div> */}

      {/* <div>
        <input type="text" />
      </div> */}

      {/* Range */}
      {/* <div className="space-y-3">
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
          <span className="text-xs w-12 text-right">{maxPrice}</span> */}
        {/* </div> */}
      {/* </div> */}

      </div>
  );
};