import React from 'react';
import { Link } from 'react-router-dom';

const EmptyCart = () => {
  return (
    <div className="text-center py-5">
      <div className="mb-4">
        <i className="bi bi-cart-x text-slate-400 dark:text-slate-500 transition-colors" style={{ fontSize: '5rem' }}></i>
      </div>
      <h3 className="fw-bold text-slate-900 dark:text-white mb-3 transition-colors">Your cart is empty</h3>
      <p className="text-slate-500 dark:text-slate-400 mb-4 transition-colors">
        Looks like you haven't added any deals to your cart yet.
      </p>
      <Link to="/deals" className="btn btn-primary px-4 py-2 fw-semibold rounded-pill shadow-sm hover-lift">
        Browse Deals
      </Link>
    </div>
  );
};

export default EmptyCart;
