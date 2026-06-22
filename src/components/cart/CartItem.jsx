import React from 'react';

const CartItem = ({ item, onUpdateQuantity, onRemove, isUpdating }) => {
  const API_BASE_URL = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api', '') : "https://localhost:7033";
  
  const getFullImageUrl = (url) => {
    if (!url || url.trim() === '') return 'https://placehold.co/150x150/e2e8f0/64748b?text=No+Image';
    if (url.startsWith('http')) return url;
    return `${API_BASE_URL}${url.startsWith('/') ? '' : '/'}${url}`;
  };

  const displayImageUrl = getFullImageUrl(item.imageUrl);

  return (
    <div className="card mb-3 shadow-sm border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 transition-colors">
      <div className="card-body">
        <div className="d-flex align-items-center">
          <div className="flex-shrink-0">
            <img
              src={displayImageUrl}
              alt={item.title}
              className="img-fluid rounded border border-slate-200 dark:border-slate-700 transition-colors"
              style={{ width: '90px', height: '90px', objectFit: 'cover' }}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://placehold.co/150x150/e2e8f0/64748b?text=No+Image';
              }}
            />
          </div>
          <div className="flex-grow-1 ms-3">
            <h6 className="mb-1 text-truncate text-slate-900 dark:text-white transition-colors" style={{ maxWidth: '250px' }}>{item.title}</h6>
            <div className="mb-2">
              <span className="text-orange-500 dark:text-orange-400 fw-bold fs-5 me-2 transition-colors">₹{item.discountPrice.toFixed(2)}</span>
              {item.originalPrice > item.discountPrice && (
                <span className="text-slate-500 dark:text-slate-400 text-decoration-line-through small transition-colors">
                  ₹{item.originalPrice.toFixed(2)}
                </span>
              )}
            </div>
            <div className="d-flex align-items-center justify-content-between">
              <div className="d-flex align-items-center border border-slate-200 dark:border-slate-700 rounded-pill px-2 py-1 bg-white dark:bg-slate-800 shadow-sm transition-colors" style={{ width: '110px' }}>
                <button
                  className="btn btn-sm text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-circle d-flex align-items-center justify-content-center border-0 p-0 transition-colors"
                  style={{ width: '28px', height: '28px' }}
                  onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                  disabled={isUpdating || item.quantity <= 1}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8z"/></svg>
                </button>
                <span className="mx-auto fw-bold text-slate-900 dark:text-white transition-colors">{item.quantity}</span>
                <button
                  className="btn btn-sm text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-circle d-flex align-items-center justify-content-center border-0 p-0 transition-colors"
                  style={{ width: '28px', height: '28px' }}
                  onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                  disabled={isUpdating}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/></svg>
                </button>
              </div>
              <button
                className="btn btn-sm btn-link text-rose-500 dark:text-rose-400 p-0 ms-2 text-decoration-none hover:text-rose-600 dark:hover:text-rose-300 transition-colors"
                onClick={() => onRemove(item.id)}
                disabled={isUpdating}
              >
                <i className="bi bi-trash ms-1"></i> Remove
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
