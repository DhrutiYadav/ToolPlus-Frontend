import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import '../styles/PaymentFailed.css';

const PaymentFailed = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state || {};
  const [shake, setShake] = useState(false);

  useEffect(() => {
    setShake(true);
    const t = setTimeout(() => setShake(false), 800);
    return () => clearTimeout(t);
  }, []);

  const failureReasons = [
    {
      title: "Insufficient Funds",
      desc: "Your card may not have enough balance to complete this transaction. Please check your account balance and try again."
    },
    {
      title: "Incorrect Card Details",
      desc: "The card number, expiry date, or CVV entered may be incorrect. Double-check your card information before retrying."
    },
    {
      title: "Bank Declined",
      desc: "Your bank may have declined the transaction for security reasons. Contact your bank or try a different payment method."
    }
  ];

  return (
    <div className="container py-5 text-center min-vh-100 d-flex flex-column align-items-center justify-content-center">
      <div className="card shadow-lg border-0 bg-white dark:bg-slate-900 transition-colors p-5 rounded-4 payment-failed-card">
        {/* Shake icon */}
        <div className="mb-4">
          <div
            className={`bg-rose-100 dark:bg-rose-900/30 rounded-circle d-inline-flex align-items-center justify-content-center transition-colors payment-failed-icon ${shake ? 'payment-failed-shake' : ''}`}
          >
            <i className="bi bi-x-circle-fill text-rose-500 payment-failed-icon-symbol"></i>
          </div>
        </div>

        <h1 className="fw-bold text-slate-900 dark:text-white mb-2">Payment Failed</h1>
        <p className="text-slate-600 dark:text-slate-400 mb-4 fs-5">We're sorry, but your payment could not be processed.</p>

        {state.reason && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-3 p-4 mb-4 text-start transition-colors">
            <p className="mb-0 text-red-700 dark:text-red-400"><strong>Reason:</strong> {state.reason}</p>
          </div>
        )}

        {/* Common failure reasons — accordion */}
        <div className="mb-4 text-start">
          <p className="fw-semibold text-slate-700 dark:text-slate-300 mb-2 fs-7">Common reasons for failure:</p>
          <div className="accordion accordion-flush" id="failureAccordion">
            {failureReasons.map((reason, index) => (
              <div key={index} className="accordion-item bg-transparent border border-slate-100 dark:border-slate-700 rounded-3 mb-2 overflow-hidden transition-colors">
                <h2 className="accordion-header">
                  <button
                    className="accordion-button collapsed fw-semibold fs-7 text-slate-800 dark:text-slate-200 bg-slate-50 dark:bg-slate-800 py-2 px-3 transition-colors"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target={`#reason-${index}`}
                    aria-expanded="false"
                  >
                    <i className="bi bi-exclamation-triangle-fill text-amber-500 me-2"></i>
                    {reason.title}
                  </button>
                </h2>
                <div id={`reason-${index}`} className="accordion-collapse collapse" data-bs-parent="#failureAccordion">
                  <div className="accordion-body py-2 px-3 text-slate-600 dark:text-slate-400 fs-7 bg-white dark:bg-slate-800/50 transition-colors">
                    {reason.desc}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="d-flex gap-3 justify-content-center mt-2">
          <button onClick={() => navigate('/cart')} className="btn btn-primary px-4 py-2 fw-medium shadow-sm rounded-pill">
            <i className="bi bi-arrow-left me-2"></i>Back to Cart
          </button>
          <Link to="/deals" className="btn btn-outline-secondary px-4 py-2 fw-medium dark:text-slate-300 dark:border-slate-600 dark:hover:bg-slate-700 rounded-pill">
            Continue Shopping
          </Link>
        </div>
      </div>

    </div>
  );
};

export default PaymentFailed;
