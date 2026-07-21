import React from 'react';
import { Link } from 'react-router-dom';

const EmptyCart = () => {
  return (
    <div className="text-center py-12 rounded-2xl shadow-sm bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 transition-colors empty-state-container">
      <div className="empty-state-icon bg-orange-50 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400 mx-auto transition-colors mb-6">
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      </div>
      <h3 className="font-bold text-slate-900 dark:text-white mb-6 transition-colors">Your cart is empty</h3>
      <p className="text-slate-500 dark:text-slate-400 mb-6 transition-colors">
        Looks like you haven't added any deals to your cart yet.
      </p>
      <Link to="/deals" className="btn btn-primary px-6 py-2 font-semibold rounded-full shadow-sm hover-lift">
        Browse our latest lifetime deals
      </Link>
    </div>
  );
};

export default EmptyCart;
