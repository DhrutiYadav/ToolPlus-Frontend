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
    <nav className="d-flex justify-content-center mt-5" aria-label="Deals navigation">
      <ul className="pagination pagination-md rounded-pill overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 transition-colors" style={{ boxShadow: 'var(--shadow-sm)' }}>
        <li className={`page-item ${currentPage === 1 ? "disabled opacity-40" : ""}`}>
          <button
            className="page-link py-2 px-3 border-0 fw-semibold bg-transparent text-slate-600 dark:text-slate-400 hover:text-orange-500 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            style={{ fontSize: '0.875rem' }}
          >
            &laquo; Prev
          </button>
        </li>
        
        {getPageNumbers().map((pageNum) => (
          <li
            key={pageNum}
            className={`page-item ${currentPage === pageNum ? "active" : ""}`}
          >
            <button
              className={`page-link py-2 px-3 border-0 fw-bold transition-colors ${
                currentPage === pageNum 
                  ? "bg-orange-500 text-white" 
                  : "bg-transparent text-slate-600 dark:text-slate-400 hover:text-orange-500 hover:bg-slate-50 dark:hover:bg-slate-800"
              }`}
              onClick={() => onPageChange(pageNum)}
              style={{ fontSize: '0.875rem', minWidth: '40px' }}
            >
              {pageNum}
            </button>
          </li>
        ))}
        
        <li className={`page-item ${currentPage === totalPages ? "disabled opacity-40" : ""}`}>
          <button
            className="page-link py-2 px-3 border-0 fw-semibold bg-transparent text-slate-600 dark:text-slate-400 hover:text-orange-500 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            style={{ fontSize: '0.875rem' }}
          >
            Next &raquo;
          </button>
        </li>
      </ul>
    </nav>
  );
}

export default Pagination;
