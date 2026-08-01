import React from "react";
import { Link } from "react-router-dom";
import "../styles/NotFound.css";

function NotFound() {
  return (
    <div className="not-found-shell flex flex-col items-center justify-center py-12 text-center">
      <span className="mb-6 text-6xl font-extrabold text-orange-500 transition-colors">
        404
      </span>

      <h2 className="mb-2 text-3xl font-bold text-slate-900 transition-colors dark:text-white">
        Deal Not Found
      </h2>

      <p className="not-found-copy mx-auto mb-6 text-slate-500 transition-colors dark:text-slate-400">
        The page you are looking for has been removed, renamed, or is
        temporarily unavailable. Browse other amazing lifetime software deals
        below.
      </p>

      <div className="flex flex-wrap justify-center gap-3">
        <Link
          to="/"
          className="hover-lift rounded-full bg-orange-500 px-6 py-2 font-bold uppercase text-white shadow-sm transition-all duration-300 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2"
        >
          Go to Homepage
        </Link>

        <Link
          to="/deals"
          className="rounded-full border border-slate-300 bg-white px-6 py-2 font-bold uppercase text-slate-700 transition-all duration-300 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          Browse All Deals
        </Link>
      </div>
    </div>
  );
}

export default NotFound;
