import React from "react";
import { Link } from "react-router-dom";

const EmptyCart = () => {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900">
      <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-orange-100 text-orange-600 transition-colors dark:bg-orange-500/10 dark:text-orange-400">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="32"
          height="32"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
      </div>

      <h3 className="mb-4 text-2xl font-bold text-slate-900 transition-colors dark:text-white">
        Your cart is empty
      </h3>

      <p className="mx-auto mb-8 max-w-md text-slate-500 transition-colors dark:text-slate-400">
        Looks like you haven't added any deals to your cart yet.
      </p>

      <Link
        to="/deals"
        className="inline-flex items-center justify-center rounded-full bg-orange-500 px-7 py-3 text-sm font-semibold text-white shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:bg-orange-600 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-orange-300 dark:focus:ring-orange-500/40"
      >
        Browse our latest lifetime deals
      </Link>
    </div>
  );
};

export default EmptyCart;