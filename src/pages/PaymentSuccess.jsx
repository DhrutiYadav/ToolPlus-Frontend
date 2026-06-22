import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

const PaymentSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state || {};

  if (!state.orderId) {
    return (
      <div className="container py-5 text-center">
        <h2>No Recent Purchases Found</h2>
        <button onClick={() => navigate('/')} className="btn btn-primary mt-3">Go Home</button>
      </div>
    );
  }

  return (
    <div className="container py-5 text-center min-vh-100 d-flex flex-column align-items-center justify-content-center">
      <div className="card shadow-lg border-0 bg-white dark:bg-slate-900 transition-colors p-5 rounded-4" style={{ maxWidth: '600px', width: '100%' }}>
        <div className="mb-4">
          <i className="bi bi-check-circle-fill text-green-500" style={{ fontSize: '5rem' }}></i>
        </div>
        <h1 className="fw-bold text-slate-900 dark:text-white mb-3">Payment Successful!</h1>
        <p className="text-slate-600 dark:text-slate-400 mb-4 fs-5">Thank you for your purchase. Your order has been placed successfully.</p>
        
        <div className="bg-slate-50 dark:bg-slate-800 rounded p-4 mb-4 text-start">
          <p className="mb-2"><strong className="text-slate-700 dark:text-slate-300">Order ID:</strong> <span className="text-slate-900 dark:text-white">{state.orderId}</span></p>
          <p className="mb-2"><strong className="text-slate-700 dark:text-slate-300">Date:</strong> <span className="text-slate-900 dark:text-white">{new Date().toLocaleString()}</span></p>
        </div>

        <div className="mb-4 text-start">
          <h4 className="fw-bold text-slate-900 dark:text-white mb-3">Order Summary</h4>
          <div className="table-responsive">
            <table className="table align-middle">
              <thead className="bg-slate-100 dark:bg-slate-700">
                <tr>
                  <th>Product</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th className="text-end">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {state.deals && state.deals.map((deal, idx) => (
                  <tr key={idx}>
                    <td>
                      <div className="d-flex align-items-center">
                        {deal.imageUrl ? (
                          <img src={deal.imageUrl} alt={deal.title} className="rounded me-2" style={{width: '40px', height: '40px', objectFit: 'cover'}} />
                        ) : (
                          <div className="rounded me-2 bg-slate-200 dark:bg-slate-600 d-flex justify-content-center align-items-center" style={{width: '40px', height: '40px'}}>
                            <span>📦</span>
                          </div>
                        )}
                        <span className="fw-semibold text-slate-900 dark:text-white">{deal.title || 'Software Deal'}</span>
                      </div>
                    </td>
                    <td>₹{(deal.discountPrice || 0).toFixed(2)}</td>
                    <td>{deal.quantity}</td>
                    <td className="text-end fw-bold">₹{((deal.discountPrice || 0) * deal.quantity).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan="3" className="text-end fw-bold">Total:</td>
                  <td className="text-end fw-bold text-orange-500 fs-5">₹{state.amount.toFixed(2)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        <div className="d-flex gap-3 justify-content-center">
          <Link to="/orders" className="btn btn-primary px-4 py-2 fw-medium shadow-sm">View Orders</Link>
          <Link to="/deals" className="btn btn-outline-secondary px-4 py-2 fw-medium dark:text-slate-300 dark:border-slate-600 dark:hover:bg-slate-700">Continue Shopping</Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
