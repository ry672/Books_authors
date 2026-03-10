type Props = {
  page: number;
  totalPages: number;
  onPrev: () => void;
  onNext: () => void;
  onPage: (p: number) => void;
};

type PageItem = number | "...";

const getPages = (page: number, totalPages: number): PageItem[] => {
  if (totalPages <= 0) return [];

 
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const pages: PageItem[] = [];

  pages.push(1);

  const left = Math.max(2, page - 1);
  const right = Math.min(totalPages - 1, page + 1);

  if (left > 2) pages.push("...");

  for (let p = left; p <= right; p++) pages.push(p);

  if (right < totalPages - 1) pages.push("...");

  pages.push(totalPages);

  return pages;
};

export const Pagination = ({ page, totalPages, onPrev, onNext, onPage }: Props) => {
  const safeTotalPages = Math.max(totalPages, 1);
  const safePage = Math.min(Math.max(page, 1), safeTotalPages);

  const items = getPages(safePage, safeTotalPages);

  return (
    <div className="flex items-center gap-2 my-5 mx-2 flex-wrap w-60">
      <button
        type="button"
        onClick={onPrev}
        disabled={safePage <= 1}
        className="rounded-md border border-[#2D3748]  px-2 py-1  hover:bg-white hover:text-black disabled:opacity-50 disabled:hover:bg-gray-900 disabled:hover:text-white text-[14px]"
      >
        Previous
      </button>

      {items.map((it, idx) =>
        it === "..." ? (
          <span key={`dots-${idx}`} className="rounded-md border border-[#2D3748]  text-[14px] px-2 py-1  hover:bg-white hover:text-black disabled:opacity-50 disabled:hover:bg-gray-900 disabled:hover:text-white">
            ...
          </span>
        ) : (
          <button
            type="button"
            key={`page-${it}`}
            disabled={it === safePage}
            onClick={() => onPage(it)}
            className={
              it === safePage
                ? "rounded-md border border-[#2D3748]  text-[14px] px-2 py-1 text-black bg-white disabled:opacity-100"
                : "px-3 py-2 rounded-md bg-gray-200 text-gray-600 font-medium hover:bg-gray-900 hover:text-white"
            }
          >
            {it}
          </button>
        )
      )}

      <button
        type="button"
        onClick={onNext}
        disabled={safePage >= safeTotalPages}
        className="rounded-md border border-[#2D3748]  text-[14px] px-2 py-1  hover:bg-white hover:text-black disabled:opacity-50 disabled:hover:bg-gray-900 disabled:hover:text-white"
      >
        Next
      </button>
    </div>
  );
};