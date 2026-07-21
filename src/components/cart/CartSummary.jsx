import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/CartSummary.css';
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
    <div className="flex flex-col relative min-w-0 break-words rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 mb-6 sticky-top transition-colors cart-summary-sticky">
      <div className="flex-1 p-6">
        <h5 className="text-lg font-bold mb-6 text-slate-900 dark:text-white transition-colors">Order Summary</h5>
        
        {/* Cart Items List Mini */}
        <div className="mb-6">
          {summary.items.map((item) => (
            <div key={item.id} className="flex justify-between items-center mb-2 small">
              <span className="text-slate-500 dark:text-slate-400 truncate mr-2 transition-colors cart-summary-item-title">
                • {item.title} <span className="font-medium text-slate-900 dark:text-white transition-colors">×{item.quantity}</span>
              </span>
              <span className="text-slate-900 dark:text-white font-medium transition-colors">₹{(item.discountPrice * item.quantity).toFixed(2)}</span>
            </div>
          ))}
        </div>

        {/* Coupon Section */}
        <div className="mb-6 pt-6 border-t border-slate-100 dark:border-slate-800">
          <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
            Have a Promo Code?
          </label>
          
          {!appliedCoupon ? (
            <form onSubmit={onApplyCoupon} className="flex gap-2">
              <input
                type="text"
                value={couponCodeInput}
                onChange={(e) => setCouponCodeInput(e.target.value.toUpperCase())}
                placeholder="Enter code (e.g. SUMMER50)"
                className="form-control form-control-sm px-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white transition-all font-mono"
              />
              <button 
                type="submit" 
                disabled={isApplyingCoupon || !couponCodeInput.trim()}
                className="btn btn-sm btn-outline-primary font-bold whitespace-nowrap px-6 hover-lift flex items-center"
              >
                {isApplyingCoupon ? <Loader2 size={14} className="animate-spin mr-1" /> : <Ticket size={14} className="mr-1" />}
                Apply
              </button>
            </form>
          ) : (
            <div className="flex items-center justify-between bg-orange-50 dark:bg-orange-500/10 border border-orange-200 dark:border-orange-500/20 p-2.5 rounded-xl transition-all">
              <div className="flex items-center">
                <Ticket className="text-orange-500 mr-2" size={16} />
                <div>
                  <span className="font-mono text-sm font-bold text-orange-600 dark:text-orange-400">{appliedCoupon.code}</span>
                  <p className="mb-0 text-[10px] text-slate-500 dark:text-slate-400">Coupon applied successfully</p>
                </div>
              </div>
              <button 
                onClick={onRemoveCoupon}
                className="btn btn-sm p-1 rounded-full hover:bg-orange-100 dark:hover:bg-orange-500/20 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                title="Remove Coupon"
              >
                <X size={16} />
              </button>
            </div>
          )}
        </div>

        {/* Pricing Breakdown */}
        <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
          <div className="flex justify-between mb-2">
            <span className="text-slate-500 dark:text-slate-400 transition-colors">Subtotal ({summary.totalItems} items)</span>
            <span className="font-semibold text-slate-900 dark:text-white transition-colors">₹{summary.totalAmount.toFixed(2)}</span>
          </div>
          
          <div className="flex justify-between mb-6 text-emerald-600 dark:text-emerald-400 transition-colors">
            <span>Coupon Discount</span>
            <span className="font-bold">-₹{discountAmount.toFixed(2)}</span>
          </div>

          <hr className="my-6 border-slate-200 dark:border-slate-800 transition-colors" />

          <div className="flex justify-between mb-6 text-slate-900 dark:text-white transition-colors">
            <span className="font-bold text-lg">Total</span>
            <span className="font-bold text-lg">₹{finalTotal.toFixed(2)}</span>
          </div>
        </div>

        {/* Checkout Button */}
        <button 
          onClick={onCheckout}
          disabled={isCheckingOut}
          className="btn btn-primary w-full py-2.5 mb-6 font-bold shadow-sm hover-lift flex items-center justify-center"
        >
          {isCheckingOut ? (
            <>
              <Loader2 size={18} className="animate-spin mr-2" />
              Processing Checkout...
            </>
          ) : (
            'Proceed to Checkout'
          )}
        </button>

        <button 
          className="btn btn-outline-danger dark:border-rose-500 dark:text-rose-500 dark:hover:bg-rose-500 dark:hover:text-white w-full btn-sm transition-colors"
          onClick={onClearCart}
          disabled={isClearing || isCheckingOut}
        >
          {isClearing ? 'Clearing...' : 'Clear Cart'}
        </button>

        <div className="mt-6 text-center">
          <p className="small text-slate-500 dark:text-slate-400 mb-0 transition-colors">
            <i className="bi bi-shield-check text-emerald-500 dark:text-emerald-400 mr-1"></i>
            Secure Checkout
          </p>
        </div>
      </div>
    </div>
  );
};

export default CartSummary;
