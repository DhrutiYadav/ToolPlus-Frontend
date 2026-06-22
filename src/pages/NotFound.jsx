import React from "react";
import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="d-flex flex-column align-items-center justify-content-center py-5 text-center" style={{ minHeight: "75vh" }}>
      <span className="display-1 fw-extrabold text-orange-500 mb-3 transition-colors">404</span>
      <h2 className="fw-bold text-slate-900 dark:text-white mb-2 transition-colors">Deal Not Found</h2>
      <p className="text-slate-500 dark:text-slate-400 mx-auto mb-4 transition-colors" style={{ maxWidth: "450px" }}>
        The page you are looking for has been removed, renamed, or is temporarily unavailable. Browse other amazing lifetime software deals below.
      </p>
      <div className="gap-3 d-flex">
        <Link to="/" className="btn btn-primary rounded-pill px-4 py-2 fw-bold text-uppercase shadow-sm hover-lift">
          Go to Homepage
        </Link>
        <Link to="/deals" className="btn btn-outline-secondary dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 rounded-pill px-4 py-2 fw-bold text-uppercase transition-colors">
          Browse All Deals
        </Link>
      </div>
    </div>
  );
}

export default NotFound;
