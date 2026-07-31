import React from "react";

function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  };

  return (
    <nav className="mt-12 flex justify-center" aria-label="Deals navigation">
      <div className="flex items-center overflow-hidden rounded-full border border-slate-200 bg-white shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900">
        {/* Previous */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`
          px-5 py-2.5 text-sm font-semibold transition-all
          ${
            currentPage === 1
              ? "cursor-not-allowed opacity-40"
              : "text-slate-600 hover:bg-slate-100 hover:text-orange-500 dark:text-slate-400 dark:hover:bg-slate-800"
          }
        `}
        >
          &laquo; Prev
        </button>

        {/* Page Numbers */}
        {getPageNumbers().map((pageNum) => (
          <button
            key={pageNum}
            onClick={() => onPageChange(pageNum)}
            className={`
            min-w-[42px] px-4 py-2.5 text-sm font-semibold transition-all
            ${
              currentPage === pageNum
                ? "bg-orange-500 text-white shadow-sm"
                : "text-slate-600 hover:bg-slate-100 hover:text-orange-500 dark:text-slate-400 dark:hover:bg-slate-800"
            }
          `}
          >
            {pageNum}
          </button>
        ))}

        {/* Next */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`
          px-5 py-2.5 text-sm font-semibold transition-all
          ${
            currentPage === totalPages
              ? "cursor-not-allowed opacity-40"
              : "text-slate-600 hover:bg-slate-100 hover:text-orange-500 dark:text-slate-400 dark:hover:bg-slate-800"
          }
        `}
        >
          Next &raquo;
        </button>
      </div>
    </nav>
  );
}

export default Pagination;
