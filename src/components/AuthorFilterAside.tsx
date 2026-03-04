import React from "react";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onClear: () => void;

  search: string;
  setSearch: (v: string) => void;

  name: string;
  setName: (v: string) => void;

  fullName: string;
  setFullName: (v: string) => void;

  setPage: (v: number) => void;
};

export const AuthorFiltersAside: React.FC<Props> = ({
  isOpen,
  onClose,
  onClear,
  search,
  setSearch,
  name,
  setName,
  fullName,
  setFullName,
  setPage,
}) => {
  if (!isOpen) return null;

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

      {/* Full name */}
      <div className="space-y-2 mb-4">
        <label className="text-sm font-medium">Full name</label>
        <input
          className="w-full rounded-md h-10 px-4 border-2 border-gray-100 shadow-sm"
          value={fullName}
          placeholder="Filter by full name..."
          onChange={(e) => {
            setFullName(e.target.value);
            setPage(1);
          }}
        />
      </div>
    </aside>
  );
};