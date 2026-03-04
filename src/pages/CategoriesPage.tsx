import { useEffect, useMemo, useState } from "react";
import { Pagination } from "../components/Pagnatation";
import { CreateCategoryAside } from "../components/CreateCategory";
import { CategoryFiltersAside } from "../components/CategoryFilter";
import { UpdateCategoryAside } from "../components/UpdateCategory";
import {
  useDeleteCategoryMutation,
  useGetCategoryQuery,
} from "../store/Api/CategoryApi";

const TAKE = 5;

export const CategoryPage = () => {
  const [page, setPage] = useState(1);

  // asides
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  const [editId, setEditId] = useState<number | null>(null);
  const [deleteCategory, { isLoading: isDeleting }] =
    useDeleteCategoryMutation();

  // filters
  const [search, setSearch] = useState("");
  const [name, setName] = useState("");

  const queryArgs = useMemo(
    () => ({
      search: search.trim() || undefined,
      name: name.trim() || undefined,
      page,
      take: TAKE,
    }),
    [search, name, page]
  );

  const { data, isLoading, isError } = useGetCategoryQuery(queryArgs);

  // ✅ if backend returns ARRAY
  const items = Array.isArray(data) ? data : (data as any)?.rows ?? [];
  const totalPages = Array.isArray(data)
    ? 1
    : Math.max((data as any)?.pages ?? 1, 1);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
    if (page < 1) setPage(1);
  }, [page, totalPages]);

  const clearFilters = () => {
    setSearch("");
    setName("");
    setPage(1);
  };

  const openCreate = () => {
    setIsFiltersOpen(false);
    setIsUpdateOpen(false);
    setEditId(null);
    setIsCreateOpen(true);
  };

  const openUpdate = (id: number) => {
    setIsFiltersOpen(false);
    setIsCreateOpen(false);
    setEditId(id);
    setIsUpdateOpen(true);
  };

  const closeUpdate = () => {
    setIsUpdateOpen(false);
    setEditId(null);
  };

  const openFilters = () => {
    setIsCreateOpen(false);
    setIsUpdateOpen(false);
    setEditId(null);
    setIsFiltersOpen(true);
  };

  return (
    <div className="flex gap-6">
      {/* MAIN */}
      <div className="flex-1 min-w-0 rounded-xl overflow-hidden border border-gray-300 px-5 py-5 bg-white">
        <div className="flex items-center gap-3 flex-wrap">
          <button
            type="button"
            onClick={openFilters}
            className="px-4 py-2 rounded-full border shadow-sm hover:bg-gray-50 text-sm"
          >
            Filters
          </button>

          <button
            type="button"
            onClick={openCreate}
            className="px-4 py-2 rounded-full text-green-700/70 bg-green-300/30 hover:bg-green-500/70 hover:text-white text-sm font-semibold"
          >
            Create Category
          </button>
        </div>

        <div className="mt-4">
          {isLoading && <div>Loading...</div>}
          {isError && <div>Error</div>}

          {!isLoading && !isError && items.length === 0 && <div>No results</div>}
        </div>

        <div className="divide-y divide-gray-200 mt-3">
          {items
            ?.filter((c: any) => c.is_deleted === false)
            .map((c: any) => (
              <div key={c.id} className="p-5 flex items-center justify-between">
                <div className="whitespace-nowrap text-sm leading-6 font-medium">
                  {c.name}
                </div>

                <div className="gap-3 flex items-center">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      openUpdate(c.id);
                    }}
                    className="px-3 py-1 rounded-md border hover:bg-gray-50 text-sm"
                  >
                    Update
                  </button>

                  <button
                    type="button"
                    disabled={isDeleting}
                    onClick={async (e) => {
                      e.stopPropagation();
                      await deleteCategory(c.id).unwrap();
                    }}
                    className="px-3 py-1 rounded-md border hover:bg-red-50 text-sm disabled:opacity-50"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
        </div>

        <Pagination
          page={page}
          totalPages={totalPages}
          onPrev={() => setPage((p) => Math.max(p - 1, 1))}
          onNext={() => setPage((p) => Math.min(p + 1, totalPages))}
          onPage={(p) => setPage(p)}
        />
      </div>

      {/* FILTERS ASIDE */}
      <CategoryFiltersAside
        isOpen={isFiltersOpen}
        onClose={() => setIsFiltersOpen(false)}
        onClear={clearFilters}
        search={search}
        setSearch={setSearch}
        name={name}
        setName={setName}
        setPage={setPage}
      />

      {/* UPDATE ASIDE */}
      {isUpdateOpen && editId !== null && (
        <aside className="w-[420px] shrink-0 sticky top-0 h-screen overflow-auto p-6 bg-white rounded-lg shadow border">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Update Category</h2>
            <button
              onClick={closeUpdate}
              type="button"
              className="px-3 py-1 rounded-md border hover:bg-gray-50"
            >
              Close
            </button>
          </div>

          <UpdateCategoryAside id={editId} onSuccess={closeUpdate} />
        </aside>
      )}

      {/* CREATE ASIDE */}
      {isCreateOpen && (
        <aside className="w-[420px] shrink-0 sticky top-0 h-screen overflow-auto p-6 bg-white rounded-lg shadow border">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Create Category</h2>
            <button
              onClick={() => setIsCreateOpen(false)}
              type="button"
              className="px-3 py-1 rounded-md border hover:bg-gray-50"
            >
              Close
            </button>
          </div>

          <CreateCategoryAside onSuccess={() => setIsCreateOpen(false)} />
        </aside>
      )}
    </div>
  );
};