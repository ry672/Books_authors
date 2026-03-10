import { useEffect, useMemo, useState } from "react";
import { Pagination } from "../components/Pagnatation";
import { CreateCategoryAside } from "../components/CreateCategory";
import { CategoryFiltersAside } from "../components/CategoryFilter";
import { UpdateCategoryAside } from "../components/UpdateCategory";
import {
  useDeleteCategoryMutation,
  useGetCategoryQuery,
} from "../store/Api/CategoryApi";
import plisIcon from "../images/icons8-plus-24.png"
import { DeleteConfirm } from "../components/DeleteConfirm";
const TAKE = 5;

export const CategoryPage = () => {
  const [page, setPage] = useState(1);

  // asides
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);


  const [editId, setEditId] = useState<number | null>(null);
  const [deleteCategory, { isLoading: isDeleting }] =
    useDeleteCategoryMutation();

  // filters
  const [search, setSearch] = useState("");
  const [name, setName] = useState("");
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

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



  const openCreate = () => {

    setIsUpdateOpen(false);
    setEditId(null);
    setIsCreateOpen(true);
  };

  const openUpdate = (id: number) => {

    setIsCreateOpen(false);
    setEditId(id);
    setIsUpdateOpen(true);
  };

  const closeUpdate = () => {
    setIsUpdateOpen(false);
    setEditId(null);
  };

  const openDelete = (id: number) => {
    setDeleteId(id)
    setIsDeleteOpen(true)
  }
  const closeDelete = () => {
    setDeleteId(null)
    setIsDeleteOpen(false)
  }

  const confirmDelete = async ()=>{
    if (deleteId === null)return
    try {
      await deleteCategory(deleteId).unwrap();
      closeDelete()
    } catch (e) {
      console.log("Delete failed", e);
      
    }
  }



  return (
    <>
      {/* MAIN */}
      <div className="flex items-end gap-3 justify-between m-4">
        <CategoryFiltersAside
          search={search}
          setSearch={setSearch}
          name={name}
          setName={setName}
          setPage={setPage}
        />

        <button
          type="button"
          onClick={openCreate}
          className="rounded-md border bg-white px-2 py-2 text-[13px] text-black font-semibold flex gap-2"
        >
          Create
          <img src={plisIcon} alt="" className="w-3 h-3 mt-1" />
        </button>
      </div>




      <div className="overflow-hidden rounded-md border border-[#2D3748]">
        <table className="items-center w-full bg-transparent border-collapse">
          <div>
            {isLoading && <div>Loading...</div>}
            {isError && <div>Error</div>}

            {!isLoading && !isError && items.length === 0 && <div>No results</div>}
          </div>

          <thead>
            <tr>
              <th className="bg-gray-900 text-white text-left py-2 px-4 text-[12px] border-b border-[#2D3748] w-20">Name</th>
              <th className="bg-gray-900 text-white text-left py-2 px-4 text-[12px] border-b border-[#2D3748] w-20"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {items
              ?.filter((c: any) => c.is_deleted === false)
              .map((c: any) => (
                <tr key={c.id} className="text-gray-500">
                  <th className="text-white text-left py-1 px-4 text-[12px] border-b border-[#2D3748]">
                    {c.name}
                  </th>

                  <td className="border-b border-[#2D3748]">
                    <div className="gap-2 flex items-center justify-between m-2 w-60">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          openUpdate(c.id);
                        }}
                        className="rounded-md border bg-white px-2 py-2 text-[13px] text-black font-semibold"
                      >
                        Update
                      </button>

                      <button
                        type="button"
                        disabled={isDeleting}
                        onClick={ (e) => {
                          e.stopPropagation();
                          openDelete(c.id);
                        }}
                        className="rounded-md border bg-white px-2 py-2 text-[13px] text-black font-semibold"
                      >
                        Delete
                      </button>
                      <DeleteConfirm onClose={closeDelete} isOpen={isDeleteOpen} isLoading={isDeleting} onConfirm={confirmDelete}/>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
          <Pagination
            page={page}
            totalPages={totalPages}
            onPrev={() => setPage((p) => Math.max(p - 1, 1))}
            onNext={() => setPage((p) => Math.min(p + 1, totalPages))}
            onPage={(p) => setPage(p)}
          />
          {/* UPDATE ASIDE */}
          {isUpdateOpen && editId !== null && (
            <aside className="absolute right-0 top-0 h-screen w-[420px] bg-[#10141C] shadow-sm border p-6 overflow-auto">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Update Category</h2>
                <button
                  onClick={closeUpdate}
                  type="button"
                  className="brounded-md border bg-white px-2 py-2 text-[13px] text-black font-semibold rounded-md"
                >
                  Close
                </button>
              </div>

              <UpdateCategoryAside id={editId} onSuccess={closeUpdate} />
            </aside>
          )}

          {/* CREATE ASIDE */}
          {isCreateOpen && (
            <aside className="absolute right-0 top-0 h-screen w-[420px] bg-[#10141C] shadow-sm border p-6 overflow-auto">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Create Category</h2>
                <button
                  onClick={() => setIsCreateOpen(false)}
                  type="button"
                  className="brounded-md border bg-white px-2 py-2 text-[13px] text-black font-semibold rounded-md"
                >
                  Close
                </button>
              </div>

              <CreateCategoryAside onSuccess={() => setIsCreateOpen(false)} />
            </aside>
          )}
        </table>
      </div>








    </>
  );
};