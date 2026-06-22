import React from 'react';
import { Link } from 'react-router-dom';
import { Ticket, X, Loader2 } from 'lucide-react';

const CartSummary = ({ 
  summary, 
  onClearCart, 
  isClearing,
  appliedCoupon,
  couponCodeInput,
  setCouponCodeInput,
  onApplyCoupon,
  onRemoveCoupon,
  isApplyingCoupon,
  onCheckout,
  isCheckingOut
}) => {
  if (!summary || summary.items.length === 0) return null;

  const discountAmount = appliedCoupon ? appliedCoupon.discountAmount : 0;
  const finalTotal = summary.totalAmount - discountAmount;

  return (
    <div className="card shadow-sm border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 mb-4 sticky-top transition-colors" style={{ top: '100px' }}>
      <div className="card-body p-4">
        <h5 className="card-title fw-bold mb-4 text-slate-900 dark:text-white transition-colors">Order Summary</h5>
        
        {/* Cart Items List Mini */}
        <div className="mb-4">
          {summary.items.map((item) => (
            <div key={item.id} className="d-flex justify-content-between align-items-center mb-2 small">
              <span className="text-slate-500 dark:text-slate-400 text-truncate me-2 transition-colors" style={{ maxWidth: '200px' }}>
                • {item.title} <span className="fw-medium text-slate-900 dark:text-white transition-colors">×{item.quantity}</span>
              </span>
              <span className="text-slate-900 dark:text-white fw-medium transition-colors">₹{(item.discountPrice * item.quantity).toFixed(2)}</span>
            </div>
          ))}
        </div>

        {/* Coupon Section */}
        <div className="mb-4 pt-3 border-t border-slate-100 dark:border-slate-800">
          <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
            Have a Promo Code?
          </label>
          
          {!appliedCoupon ? (
            <form onSubmit={onApplyCoupon} className="d-flex gap-2">
              <input
                type="text"
                value={couponCodeInput}
                onChange={(e) => setCouponCodeInput(e.target.value.toUpperCase())}
                placeholder="Enter code (e.g. SUMMER50)"
                className="form-control form-control-sm px-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white transition-all font-mono"
              />
              <button 
                type="submit" 
                disabled={isApplyingCoupon || !couponCodeInput.trim()}
                className="btn btn-sm btn-outline-primary fw-bold text-nowrap px-3 hover-lift d-flex align-items-center"
              >
                {isApplyingCoupon ? <Loader2 size={14} className="animate-spin me-1" /> : <Ticket size={14} className="me-1" />}
                Apply
              </button>
            </form>
          ) : (
            <div className="d-flex align-items-center justify-content-between bg-orange-50 dark:bg-orange-500/10 border border-orange-200 dark:border-orange-500/20 p-2.5 rounded-xl transition-all">
              <div className="d-flex align-items-center">
                <Ticket className="text-orange-500 me-2" size={16} />
                <div>
                  <span className="font-mono text-sm font-bold text-orange-600 dark:text-orange-400">{appliedCoupon.code}</span>
                  <p className="mb-0 text-[10px] text-slate-500 dark:text-slate-400">Coupon applied successfully</p>
                </div>
              </div>
              <button 
                onClick={onRemoveCoupon}
                className="btn btn-sm p-1 rounded-circle hover:bg-orange-100 dark:hover:bg-orange-500/20 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                title="Remove Coupon"
              >
                <X size={16} />
              </button>
            </div>
          )}
        </div>

        {/* Pricing Breakdown */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
          <div className="d-flex justify-content-between mb-2">
            <span className="text-slate-500 dark:text-slate-400 transition-colors">Subtotal ({summary.totalItems} items)</span>
            <span className="fw-semibold text-slate-900 dark:text-white transition-colors">₹{summary.totalAmount.toFixed(2)}</span>
          </div>
          
          <div className="d-flex justify-content-between mb-3 text-emerald-600 dark:text-emerald-400 transition-colors">
            <span>Coupon Discount</span>
            <span className="fw-bold">-₹{discountAmount.toFixed(2)}</span>
          </div>

          <hr className="my-3 border-slate-200 dark:border-slate-800 transition-colors" />

          <div className="d-flex justify-content-between mb-4 text-slate-900 dark:text-white transition-colors">
            <span className="fw-bold fs-5">Total</span>
            <span className="fw-bold fs-5">₹{finalTotal.toFixed(2)}</span>
          </div>
        </div>

        {/* Checkout Button */}
        <button 
          onClick={onCheckout}
          disabled={isCheckingOut}
          className="btn btn-primary w-100 py-2.5 mb-3 fw-bold shadow-sm hover-lift d-flex align-items-center justify-content-center"
        >
          {isCheckingOut ? (
            <>
              <Loader2 size={18} className="animate-spin me-2" />
              Processing Checkout...
            </>
          ) : (
            'Proceed to Checkout'
          )}
        </button>

        <button 
          className="btn btn-outline-danger dark:border-rose-500 dark:text-rose-500 dark:hover:bg-rose-500 dark:hover:text-white w-100 btn-sm transition-colors"
          onClick={onClearCart}
          disabled={isClearing || isCheckingOut}
        >
          {isClearing ? 'Clearing...' : 'Clear Cart'}
        </button>

        <div className="mt-4 text-center">
          <p className="small text-slate-500 dark:text-slate-400 mb-0 transition-colors">
            <i className="bi bi-shield-check text-emerald-500 dark:text-emerald-400 me-1"></i>
            Secure Checkout
          </p>
        </div>
      </div>
    </div>
  );
};

export default CartSummary;
