import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import '../styles/PaymentSuccess.css';

// Confetti piece component
const ConfettiPiece = ({ style }) => (
  <div className="confetti-piece" style={style}></div>
);

const PaymentSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state || {};
  const [showConfetti, setShowConfetti] = useState(Boolean(state.orderId));

  useEffect(() => {
    if (!state.orderId) return;
    const t = setTimeout(() => setShowConfetti(false), 4500);
    return () => clearTimeout(t);
  }, [state.orderId]);

  const confettiPieces = useMemo(() => Array.from({ length: 40 }, (_, i) => {
    const confettiColors = ['#f97316', '#3b82f6', '#22c55e', '#ec4899', '#a855f7', '#eab308'];
    const left = ((i * 37) % 100) + 0.5;
    const size = 6 + (i % 10);
    const color = confettiColors[i % confettiColors.length];
    const delay = (i % 5) * 0.4;
    const duration = 2.5 + (i % 4) * 0.35;
    const radius = i % 2 === 0 ? '50%' : '2px';
    const rotation = (i * 27) % 360;
    return {
      id: i,
      style: {
        left: `${left}%`,
        width: `${size}px`,
        height: `${size}px`,
        background: color,
        animationDelay: `${delay}s`,
        animationDuration: `${duration}s`,
        borderRadius: radius,
        transform: `rotate(${rotation}deg)`,
      }
    };
  }), []);

  const handleShare = (platform) => {
    const text = encodeURIComponent("Just got an amazing lifetime deal on ToolPlus! 🚀 Check it out:");
    const url = encodeURIComponent("https://toolplus.app/deals");
    if (platform === 'whatsapp') {
      window.open(`https://api.whatsapp.com/send?text=${text}%20${url}`, '_blank');
    }
  };

  if (!state.orderId) {
    return (
      <div className="container py-5 text-center min-vh-100 d-flex flex-column align-items-center justify-content-center">
        <div className="card shadow-lg border-0 bg-white dark:bg-slate-900 transition-colors p-5 rounded-4 payment-empty-card">
          <div className="mb-4">
            <div className="bg-slate-100 dark:bg-slate-800 rounded-circle d-inline-flex align-items-center justify-content-center transition-colors payment-icon-circle">
              <i className="bi bi-bag-x payment-icon-medium payment-empty-icon"></i>
            </div>
          </div>
          <h1 className="fw-bold text-slate-900 dark:text-white mb-3">No Recent Purchases Found</h1>
          <p className="text-slate-600 dark:text-slate-400 mb-4 fs-5">We couldn't find a recent order associated with this session.</p>
          <div className="d-flex justify-content-center gap-3">
            <button onClick={() => navigate('/')} className="btn btn-primary rounded-pill px-4 py-2 fw-medium shadow-sm">Go Home</button>
            <Link to="/deals" className="btn btn-outline-secondary rounded-pill px-4 py-2 fw-medium dark:text-slate-300 dark:border-slate-600">Browse Deals</Link>
          </div>
        </div>
      </div>
    );
  }

  const orderDate = state.timestamp ? new Date(state.timestamp).toLocaleString() : new Date().toLocaleString();

  return (
    <div className="container py-5 text-center min-vh-100 d-flex flex-column align-items-center justify-content-center payment-page-container">
      {/* Confetti */}
      {showConfetti && (
        <div className="confetti-container" aria-hidden="true">
          {confettiPieces.map(p => <ConfettiPiece key={p.id} style={p.style} />)}
        </div>
      )}

      <div className="card shadow-lg border-0 bg-white dark:bg-slate-900 transition-colors p-5 rounded-4 payment-card">
        {/* Success icon */}
        <div className="mb-4">
          <div className="bg-emerald-100 dark:bg-emerald-900/30 rounded-circle d-inline-flex align-items-center justify-content-center transition-colors payment-icon-circle">
            <i className="bi bi-check-circle-fill text-emerald-500 payment-icon-large"></i>
          </div>
        </div>

        <h1 className="fw-bold text-slate-900 dark:text-white mb-2">Payment Successful! 🎉</h1>
        <p className="text-slate-600 dark:text-slate-400 mb-4 fs-5">Thank you for your purchase. Your order has been placed successfully.</p>

        <div className="bg-slate-50 dark:bg-slate-800 rounded-4 p-4 mb-4 text-start transition-colors">
          <div className="d-flex justify-content-between mb-2">
            <span className="text-slate-500 dark:text-slate-400 fw-medium">Order ID</span>
            <span className="fw-bold text-slate-900 dark:text-white">#{state.orderId}</span>
          </div>
          <div className="d-flex justify-content-between">
            <span className="text-slate-500 dark:text-slate-400 fw-medium">Date</span>
            <span className="text-slate-700 dark:text-slate-300">{orderDate}</span>
          </div>
        </div>

        {state.deals && state.deals.length > 0 && (
          <div className="mb-4 text-start">
            <h5 className="fw-bold text-slate-900 dark:text-white mb-3">Order Summary</h5>
            <div className="table-responsive">
              <table className="table align-middle">
                <thead className="bg-slate-100 dark:bg-slate-700">
                  <tr>
                    <th>Product</th>
                    <th>Price</th>
                    <th>Qty</th>
                    <th className="text-end">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {state.deals.map((deal, idx) => (
                    <tr key={idx}>
                      <td>
                        
                        <div className="d-flex align-items-center">
                          {deal.imageUrl ? (
                            // Support absolute URLs and relative paths stored in public folder
                            <img
                              src={/^(https?:)?\/\//.test(deal.imageUrl) ? deal.imageUrl : `${import.meta.env.BASE_URL}${deal.imageUrl.replace(/^\//, '')}`}
                              alt={deal.title}
                              className="rounded me-2 order-item-thumb"
                            />
                          ) : (
                            <div className="rounded me-2 bg-slate-200 dark:bg-slate-600 d-flex justify-content-center align-items-center order-item-placeholder">
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
                    <td className="text-end fw-bold text-orange-500 fs-5">₹{(state.amount || 0).toFixed(2)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        )}

        {/* Share row */}
          <div className="d-flex align-items-center justify-content-center gap-3 mb-4 p-3 bg-slate-50 dark:bg-slate-800 rounded-3 transition-colors">
          <span className="text-slate-500 dark:text-slate-400 fw-medium fs-7">Share this deal:</span>
          <button
            className="btn btn-sm d-flex align-items-center gap-2 rounded-pill px-3 fw-bold border-0 share-whatsapp"
            onClick={() => handleShare('whatsapp')}
          >
            <i className="bi bi-whatsapp"></i> WhatsApp
          </button>
        </div>

        <div className="d-flex gap-3 justify-content-center">
          <Link to="/orders" className="btn btn-primary px-4 py-2 fw-medium shadow-sm rounded-pill">
            <i className="bi bi-bag-check me-2"></i>View Orders
          </Link>
          <Link to="/deals" className="btn btn-outline-secondary px-4 py-2 fw-medium dark:text-slate-300 dark:border-slate-600 dark:hover:bg-slate-700 rounded-pill">
            Continue Shopping
          </Link>
        </div>
      </div>

      {/* confetti styles moved to PaymentSuccess.css */}
    </div>
  );
};

export default PaymentSuccess;
