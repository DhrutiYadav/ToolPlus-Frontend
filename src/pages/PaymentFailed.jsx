import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

const PaymentFailed = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state || {};

  return (
    <div className="container py-5 text-center min-vh-100 d-flex flex-column align-items-center justify-content-center">
      <div className="card shadow-lg border-0 bg-white dark:bg-slate-900 transition-colors p-5 rounded-4" style={{ maxWidth: '600px', width: '100%' }}>
        <div className="mb-4">
          <i className="bi bi-x-circle-fill text-red-500" style={{ fontSize: '5rem' }}></i>
        </div>
        <h1 className="fw-bold text-slate-900 dark:text-white mb-3">Payment Failed</h1>
        <p className="text-slate-600 dark:text-slate-400 mb-4 fs-5">We're sorry, but your payment could not be processed.</p>
        
        {state.reason && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded p-4 mb-4 text-start">
            <p className="mb-0 text-red-700 dark:text-red-400"><strong>Reason:</strong> {state.reason}</p>
          </div>
        )}

        <div className="d-flex gap-3 justify-content-center mt-4">
          <button onClick={() => navigate('/cart')} className="btn btn-primary px-4 py-2 fw-medium shadow-sm">Back to Cart</button>
          <Link to="/deals" className="btn btn-outline-secondary px-4 py-2 fw-medium dark:text-slate-300 dark:border-slate-600 dark:hover:bg-slate-700">Continue Shopping</Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailed;
