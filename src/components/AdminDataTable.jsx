import React from "react";
import "../styles/AdminDataTable.css";

function AdminDataTable({ columns, data, emptyMessage = "No records found.", emptyDescription, selectable, selectedIds = [], onSelectionChange, rowKey = "id" }) {
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      onSelectionChange(data.map(row => row[rowKey]));
    } else {
      onSelectionChange([]);
    }
  };

  const handleSelectRow = (e, id) => {
    if (e.target.checked) {
      onSelectionChange([...selectedIds, id]);
    } else {
      onSelectionChange(selectedIds.filter(selectedId => selectedId !== id));
    }
  };

  return (
    <div className="overflow-x-auto bg-[#ffffff] dark:!bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm max-h-[70vh]">
      <table className="w-full border-collapse text-left text-sm text-slate-600 dark:text-slate-300 relative">
        <thead className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-100 dark:border-slate-700 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 sticky top-0 z-10 backdrop-blur-md">
          <tr>
            {selectable && (
              <th className="px-6 py-4 w-12">
                <input 
                  type="checkbox" 
                  className="rounded border-slate-300 text-orange-500 focus:ring-orange-500 dark:border-slate-600 dark:bg-slate-700"
                  checked={data?.length > 0 && selectedIds.length === data.length}
                  onChange={handleSelectAll}
                />
              </th>
            )}
            {columns.map((col, idx) => (
              <th key={idx} className={`px-6 py-4 ${col.className || ''}`}>
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
          {data && data.length > 0 ? (
            data.map((row, rowIdx) => {
              const id = row[rowKey];
              const isSelected = selectedIds.includes(id);
              return (
                <tr 
                  key={rowIdx} 
                  className={`table-row-hover hover:bg-orange-50 dark:hover:bg-slate-800/60 transition-colors ${isSelected ? 'bg-orange-50/50 dark:bg-orange-500/10' : ''}`}
                >
                  {selectable && (
                    <td className="px-6 py-4 whitespace-nowrap align-middle">
                      <input 
                        type="checkbox" 
                        className="rounded border-slate-300 text-orange-500 focus:ring-orange-500 dark:border-slate-600 dark:bg-slate-700"
                        checked={isSelected}
                        onChange={(e) => handleSelectRow(e, id)}
                      />
                    </td>
                  )}
                  {columns.map((col, colIdx) => (
                    <td key={colIdx} className="px-6 py-4 whitespace-nowrap align-middle">
                      {col.render ? col.render(row) : row[col.accessor]}
                    </td>
                  ))}
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan={selectable ? columns.length + 1 : columns.length} className="px-6 py-12 text-center text-slate-400 dark:text-slate-500">
                <div className="d-flex flex-column items-center justify-center empty-state-container py-5 gap-2 rounded-4 shadow-sm">
                  <i className="bi bi-clipboard text-muted empty-state-icon"></i>
                  <h4 className="fw-bold text-slate-900 dark:text-white mb-1 transition-colors">{emptyMessage}</h4>
                  {emptyDescription && <p className="text-muted transition-colors empty-state-desc">{emptyDescription}</p>}
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default AdminDataTable;
