import { useEffect, useMemo, useState } from "react";
import { useDeleteBookMutation, useGetBookQuery } from "../store/Api/BookApi";
import { Pagination } from "../components/Pagnatation";
import { useNavigate } from "react-router-dom";
import { CreateBookAside } from "../components/CreateBookPage";
import { UpdateBookAside } from "../components/UpdateBook";
import { BookFiltersAside } from "../components/BookFilterAside";

const TAKE = 5;

// range limits
const MIN = 0;
const MAX = 1000;

export const BooksPage = () => {
  const [page, setPage] = useState(1);
  const navigate = useNavigate();

  // asides
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  const [editId, setEditId] = useState<number | null>(null);
  const [deleteBook, { isLoading: isDeleting }] = useDeleteBookMutation();

  // filters
  const [search, setSearch] = useState("");
  const [name, setName] = useState("");
  const [price, setPrice] = useState(""); // exact
  const [minPrice, setMinPrice] = useState<number>(MIN);
  const [maxPrice, setMaxPrice] = useState<number>(MAX);

  const exactPrice = useMemo(() => {
    const v = price.trim();
    if (!v) return undefined;
    const n = Number(v);
    return Number.isFinite(n) ? n : undefined;
  }, [price]);

  const { data: books, isLoading, isError } = useGetBookQuery({
    search: search.trim() || undefined,
    page,
    take: TAKE,

    name: name.trim() || undefined,

    // exact has priority
    price: exactPrice,

    // send range only if exact empty
    minPrice: exactPrice === undefined ? minPrice : undefined,
    maxPrice: exactPrice === undefined ? maxPrice : undefined,
  });

  const totalPages = Math.max(books?.pages ?? 1, 1);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
    if (page < 1) setPage(1);
  }, [page, totalPages]);

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

  const clearFilters = () => {
    setSearch("");
    setName("");
    setPrice("");
    setMinPrice(MIN);
    setMaxPrice(MAX);
    setPage(1);
  };

  const bookPageClick = (id: number) => {
    navigate(`/book-profile-page/${id}`);
  };

  return (
    <div className="flex gap-6">
      {/* MAIN */}
      <div className="flex-1 min-w-0 rounded-xl overflow-hidden border border-gray-300 px-5 py-5 bg-white">
        {/* top actions */}
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
            Create Book
          </button>
        </div>

        {/* states */}
        <div className="mt-4">
          {isLoading && <div>Loading...</div>}
          {isError && <div>Error</div>}

          {!isLoading && !isError && (books?.rows?.length ?? 0) === 0 && (
            <div>No results</div>
          )}
        </div>

        {/* list */}
        <div className="divide-y divide-gray-200 mt-3">
          {books?.rows
            ?.filter((b) => b.is_deleted === false)
            .map((b) => (
              <div key={b.id} className="p-5 flex items-center justify-between">
                <div
                  onClick={() => bookPageClick(b.id)}
                  className="cursor-pointer whitespace-nowrap text-sm leading-6 font-medium"
                >
                  {b.name}
                </div>

                <div className="gap-4 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      openUpdate(b.id);
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
                      await deleteBook(b.id).unwrap();
                    }}
                    className="px-3 py-1 rounded-md border hover:bg-red-50 text-sm disabled:opacity-50"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
        </div>

        {/* pagination */}
        <Pagination
          page={page}
          totalPages={totalPages}
          onPrev={() => setPage((p) => Math.max(p - 1, 1))}
          onNext={() => setPage((p) => Math.min(p + 1, totalPages))}
          onPage={(p) => setPage(p)}
        />
      </div>

      {/* FILTERS ASIDE */}
      <BookFiltersAside
        isOpen={isFiltersOpen}
        onClose={() => setIsFiltersOpen(false)}
        onClear={clearFilters}
        search={search}
        setSearch={setSearch}
        name={name}
        setName={setName}
        price={price}
        setPrice={setPrice}
        minPrice={minPrice}
        setMinPrice={setMinPrice}
        maxPrice={maxPrice}
        setMaxPrice={setMaxPrice}
        MIN={MIN}
        MAX={MAX}
        setPage={setPage}
      />

      {/* UPDATE ASIDE */}
      {isUpdateOpen && editId !== null && (
        <aside className="w-[420px] shrink-0 sticky top-0 h-screen overflow-auto p-6 bg-white rounded-lg shadow border">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Update Book</h2>
            <button
              onClick={closeUpdate}
              type="button"
              className="px-3 py-1 rounded-md border hover:bg-gray-50"
            >
              Close
            </button>
          </div>

          <UpdateBookAside id={editId} onSuccess={closeUpdate} />
        </aside>
      )}

      {/* CREATE ASIDE */}
      {isCreateOpen && (
        <aside className="w-[420px] shrink-0 sticky top-0 h-screen overflow-auto p-6 bg-white rounded-lg shadow border">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Create Book</h2>
            <button
              onClick={() => setIsCreateOpen(false)}
              type="button"
              className="px-3 py-1 rounded-md border hover:bg-gray-50"
            >
              Close
            </button>
          </div>

          <CreateBookAside onSuccess={() => setIsCreateOpen(false)} />
        </aside>
      )}
    </div>
  );
};