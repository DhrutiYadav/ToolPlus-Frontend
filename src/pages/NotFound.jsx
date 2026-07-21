import React from "react";
import { Link } from "react-router-dom";
import "../styles/NotFound.css";

function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center not-found-shell">
      <span className="text-6xl font-extrabold font-extrabold text-orange-500 mb-6 transition-colors">404</span>
      <h2 className="font-bold text-slate-900 dark:text-white mb-2 transition-colors">Deal Not Found</h2>
      <p className="text-slate-500 dark:text-slate-400 mx-auto mb-6 transition-colors not-found-copy">
        The page you are looking for has been removed, renamed, or is temporarily unavailable. Browse other amazing lifetime software deals below.
      </p>
      <div className="gap-3 flex">
        <Link to="/" className="btn btn-primary rounded-full px-6 py-2 font-bold uppercase shadow-sm hover-lift">
          Go to Homepage
        </Link>
        <Link to="/deals" className="btn btn-outline-secondary dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 rounded-full px-6 py-2 font-bold uppercase transition-colors">
          Browse All Deals
        </Link>
      </div>
    </div>
  );
}

export default NotFound;
