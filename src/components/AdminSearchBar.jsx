import React, { useState } from "react";
import { Search } from "lucide-react";

function AdminSearchBar({ placeholder = "Search...", onSearch }) {
  const [term, setTerm] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) onSearch(term);
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full sm:max-w-md flex-1">
      <input
        type="text"
        value={term}
        onChange={(e) => {
          setTerm(e.target.value);
          if (onSearch) onSearch(e.target.value);
        }}
        placeholder={placeholder}
        className="w-full pl-10 pr-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 dark:focus:ring-offset-slate-900 dark:focus:ring-offset-2 focus:border-orange-500 transition-all bg-white dark:bg-slate-800 shadow-sm"
      />
      <div className="absolute left-3 top-3 text-slate-400 dark:text-slate-500">
        <Search size={18} />
      </div>
      <button type="submit" className="hidden">Search</button>
    </form>
  );
}

export default AdminSearchBar;
