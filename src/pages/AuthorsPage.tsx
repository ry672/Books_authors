import { useEffect, useMemo, useState } from "react";
import { useDeleteAuthorMutation, useGetAuthorQuery } from "../store/Api/AuthorApi";
import { Pagination } from "../components/Pagnatation";
import { CreateAuthorAside } from "../components/CreateAuthor";
import { AuthorFiltersAside } from "../components/AuthorFilterAside";
import { UpdateAuthorAside } from "../components/UpdateAuthor";
import defaultAvatar from "../images/icons8-user-default-64.png"
import { useNavigate } from "react-router-dom";
const TAKE = 5;

export const AuthorPage = () => {
  const [page, setPage] = useState(1);

  // asides
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const navigate = useNavigate()

  const [editId, setEditId] = useState<number | null>(null);
  const [deleteAuthor, { isLoading: isDeleting }] = useDeleteAuthorMutation();

  // filters
  const [search, setSearch] = useState("");
  const [name, setName] = useState("");
  const [fullName, setFullName] = useState("");

  const queryArgs = useMemo(
    () => ({
      search: search.trim() || undefined,
      page,
      take: TAKE,
      name: name.trim() || undefined,
      full_name: fullName.trim() || undefined,
    }),
    [search, page, name, fullName]
  );
  const authorPageClick = (id: number) => {
    navigate(`/profile-author-page/${id}`);
  };

  const { data, isLoading, isError } = useGetAuthorQuery(queryArgs);

  const totalPages = Math.max(data?.pages ?? 1, 1);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
    if (page < 1) setPage(1);
  }, [page, totalPages]);

  const clearFilters = () => {
    setSearch("");
    setName("");
    setFullName("");
    setPage(1);
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

  const openCreate = () => {
    setIsFiltersOpen(false);
    setIsUpdateOpen(false);
    setEditId(null);
    setIsCreateOpen(true);
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
            className="px-7 py-2 text-sm font-semibold rounded-full text-green-700/70 bg-green-300/30 hover:bg-green-500/70 hover:text-white"
          >
            Create Author
          </button>
        </div>

        <div className="mt-4">
          {isLoading && <div>Loading...</div>}
          {isError && <div>Error</div>}

          {!isLoading && !isError && (data?.rows?.length ?? 0) === 0 && (
            <div>No results</div>
          )}
        </div>

        <div className="divide-y divide-gray-200 mt-3">
          {data?.rows
            ?.filter((a) => a.is_deleted === false)
            .map((a) => (
              <div
                key={a.id}
                className="p-5 flex items-start justify-between gap-4"
              >
                <div className="flex items-start justify-between" onClick={()=>authorPageClick(a.id)}>
                  <div >
                    <img src={a.author_photo ? `http://localhost:5000${a.author_photo}` : defaultAvatar}
                      alt="Аватар"
                      className="rounded-[600px]  h-15 w-20" />
                  </div>
                  <div className="flex items-center justify-center flex-col ml-4 mt-2">
                    <div className="text-sm leading-6 font-medium truncate">
                    {a.name}
                  </div>
                  <div className="text-gray-600 text-xs truncate">
                    {a.full_name}
                  </div>
                  </div>
                  
                </div>

                <div className="gap-4 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      openUpdate(a.id);
                    }}
                    className="px-3 py-1 rounded-md border hover:bg-gray-50 text-sm shrink-0"
                  >
                    Update
                  </button>
                  <button
                    type="button"
                    disabled={isDeleting}
                    onClick={async (e) => {
                      e.stopPropagation();
                      await deleteAuthor(a.id).unwrap();
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
      <AuthorFiltersAside
        isOpen={isFiltersOpen}
        onClose={() => setIsFiltersOpen(false)}
        onClear={clearFilters}
        search={search}
        setSearch={setSearch}
        name={name}
        setName={setName}
        fullName={fullName}
        setFullName={setFullName}
        setPage={setPage}
      />

      {/* UPDATE ASIDE */}
      {isUpdateOpen && editId !== null && (
        <aside className="w-[420px] shrink-0 sticky top-0 h-screen overflow-auto p-6 bg-white rounded-lg shadow border">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Update Author</h2>
            <button
              onClick={closeUpdate}
              type="button"
              className="px-3 py-1 rounded-md border hover:bg-gray-50"
            >
              Close
            </button>
          </div>

          <UpdateAuthorAside id={editId} onSuccess={closeUpdate} />
        </aside>
      )}

      {/* CREATE ASIDE */}
      {isCreateOpen && (
        <aside className="w-[420px] shrink-0 sticky top-0 h-screen overflow-auto p-6 bg-white rounded-lg shadow border">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Create Author</h2>
            <button
              className="px-3 py-1 rounded-md border hover:bg-gray-50"
              onClick={() => setIsCreateOpen(false)}
              type="button"
            >
              Close
            </button>
          </div>

          <CreateAuthorAside onSuccess={() => setIsCreateOpen(false)} />
        </aside>
      )}
    </div>
  );
};