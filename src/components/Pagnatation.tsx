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
    <div className="flex items-center gap-2 my-5 flex-wrap">
      <button
        type="button"
        onClick={onPrev}
        disabled={safePage <= 1}
        className="px-3 py-2 bg-gray-200 text-gray-600 font-medium hover:bg-blue-500 hover:text-white rounded-md disabled:opacity-50 disabled:hover:bg-gray-200 disabled:hover:text-gray-600"
      >
        Previous
      </button>

      {items.map((it, idx) =>
        it === "..." ? (
          <span key={`dots-${idx}`} className="px-3 py-2 text-gray-500">
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
                ? "px-3 py-2 rounded-md bg-blue-500 text-white font-semibold disabled:opacity-100"
                : "px-3 py-2 rounded-md bg-gray-200 text-gray-600 font-medium hover:bg-blue-500 hover:text-white"
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
        className="px-3 py-2 bg-gray-200 text-gray-600 font-medium hover:bg-blue-500 hover:text-white rounded-md disabled:opacity-50 disabled:hover:bg-gray-200 disabled:hover:text-gray-600"
      >
        Next
      </button>
    </div>
  );
};