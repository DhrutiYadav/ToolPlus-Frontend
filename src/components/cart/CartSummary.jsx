import React from "react";
import { Ticket, X, Loader2, ShieldCheck } from "lucide-react";

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
  isCheckingOut,
}) => {
  if (!summary || summary.items.length === 0) return null;

  const discountAmount = appliedCoupon ? appliedCoupon.discountAmount : 0;
  const finalTotal = summary.totalAmount - discountAmount;

  return (
    <div
      className="
        sticky
        top-24
        rounded-3xl
        border
        border-slate-200
        dark:border-slate-700
        bg-white
        dark:bg-slate-900
        shadow-xl
        overflow-hidden
        ring-1
        ring-black/5
        dark:ring-white/5
        "
    >
      <div className="flex-1 p-6">
        <h5 className="text-lg font-bold mb-6 text-slate-900 dark:text-white transition-colors">
          Order Summary
        </h5>

        {/* Cart Items List Mini */}
        <div className="mb-6">
          {summary.items.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between mb-2 text-sm"
            >
              <span className="mr-2 max-w-[200px] truncate text-slate-500 transition-colors dark:text-slate-400">
                • {item.title}{" "}
                <span className="font-medium text-slate-900 dark:text-white transition-colors">
                  ×{item.quantity}
                </span>
              </span>
              <span className="text-slate-900 dark:text-white font-medium transition-colors">
                ₹{(item.discountPrice * item.quantity).toFixed(2)}
              </span>
            </div>
          ))}
        </div>

        {/* Coupon Section */}
        <div className="mb-6 pt-6 border-t border-slate-100 dark:border-slate-800">
          <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
            Have a Promo Code?
          </label>

          {!appliedCoupon ? (
            <form
              onSubmit={onApplyCoupon}
              className="flex flex-col gap-3 sm:flex-row sm:items-center"
            >
              <input
                type="text"
                value={couponCodeInput}
                onChange={(e) =>
                  setCouponCodeInput(e.target.value.toUpperCase())
                }
                placeholder="Enter code (e.g. SUMMER50)"
                className=" 
                  min-w-0
                  flex-1
                  rounded-xl
                  border
                  border-slate-300
                  dark:border-slate-700
                  bg-white
                  dark:bg-slate-950
                  px-4
                  py-2.5
                  text-sm
                  font-mono
                  text-slate-900
                  dark:text-white
                  placeholder:text-slate-400
                  outline-none
                  transition
                  focus:outline-none
                  focus:ring-2
                  focus:ring-orange-500/30
                  focus:border-orange-500
                                    "
              />
              <button
                type="submit"
                disabled={isApplyingCoupon || !couponCodeInput.trim()}
                className="
                  shrink-0 
                  sm:w-32
                  w-full
                  gap-2
                  inline-flex
                  items-center
                  justify-center
                  rounded-xl
                  border
                  border-orange-500
                  px-4
                  py-2.5
                  text-sm
                  font-semibold
                  text-orange-600
                  dark:text-orange-400
                  hover:bg-orange-500
                  hover:text-white
                  transition
                  disabled:opacity-50
                  disabled:cursor-not-allowed
                  "
              >
                {isApplyingCoupon ? (
                  <Loader2 size={14} className="animate-spin mr-1" />
                ) : (
                  <Ticket
                    size={14}
                  />
                )}
                Apply
              </button>
            </form>
          ) : (
            <div className="flex items-center justify-between bg-orange-50 dark:bg-orange-500/10 border border-orange-200 dark:border-orange-500/20 p-2.5 rounded-xl transition-all">
              <div className="flex items-center">
                <Ticket className="text-orange-500 mr-2" size={16} />
                <div>
                  <span className="font-mono text-sm font-bold text-orange-600 dark:text-orange-400">
                    {appliedCoupon.code}
                  </span>
                  <p className="mb-0 text-[10px] text-slate-500 dark:text-slate-400">
                    Coupon applied successfully
                  </p>
                </div>
              </div>
              <button
                onClick={onRemoveCoupon}
                className="
                  rounded-full
                  p-2
                  text-slate-400
                  transition
                  hover:bg-orange-100
                  hover:text-orange-600
                  dark:hover:bg-orange-500/20
                  dark:hover:text-orange-300
                  "
              >
                <X size={16} />
              </button>
            </div>
          )}
        </div>

        {/* Pricing Breakdown */}
        <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-slate-500 dark:text-slate-400 transition-colors">
              Subtotal ({summary.totalItems} items)
            </span>
            <span className="font-semibold text-slate-900 dark:text-white transition-colors">
              ₹{summary.totalAmount.toFixed(2)}
            </span>
          </div>

          <div className="flex items-center justify-between mb-6 text-emerald-600 dark:text-emerald-400 transition-colors">
            <span>Coupon Discount</span>
            <span className="font-bold">-₹{discountAmount.toFixed(2)}</span>
          </div>

          <div className="my-6 h-px bg-slate-200 dark:bg-slate-700" />

          <div className="flex items-center justify-between mb-6 text-slate-900 dark:text-white transition-colors">
            <span className="font-bold text-lg">Total</span>
            <span className="font-bold text-lg">₹{finalTotal.toFixed(2)}</span>
          </div>
        </div>

        {/* Checkout Button */}
        <button
          onClick={onCheckout}
          disabled={isCheckingOut}
          className="
            flex
            w-full
            items-center
            justify-center
            rounded-xl
            bg-orange-500
            px-5
            py-3
            font-semibold
            text-white
            shadow-md
            transition
            hover:bg-orange-600
            hover:shadow-lg
            disabled:cursor-not-allowed
            disabled:opacity-50
            mb-4
            focus:outline-none
            focus:ring-2
            focus:ring-orange-500
            focus:ring-offset-2
            dark:focus:ring-offset-slate-900
            hover:scale-[1.01]
            active:scale-[0.99]
            "
        >
          {isCheckingOut ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              Processing Checkout...
            </>
          ) : (
            "Proceed to Checkout"
          )}
        </button>

        <button
          className="
            w-full
            rounded-xl
            border
            border-red-500
            px-5
            py-3
            font-medium
            text-red-500
            transition
            hover:bg-red-500
            hover:text-white
            disabled:opacity-50
            disabled:cursor-not-allowed
            focus:outline-none
            focus:ring-2
            focus:ring-red-500
            focus:ring-offset-2
            dark:focus:ring-offset-slate-900
            hover:scale-[1.01]
            active:scale-[0.99]
            "
          onClick={onClearCart}
          disabled={isClearing || isCheckingOut}
        >
          {isClearing ? "Clearing..." : "Clear Cart"}
        </button>

        <div className="mt-6 text-center">
          <p className="flex items-center justify-center gap-2 text-sm text-slate-500 dark:text-slate-400">
            <ShieldCheck
              size={16}
              className="text-emerald-500 dark:text-emerald-400"
            />
            Secure Checkout
          </p>
        </div>
      </div>
    </div>
  );
};

export default CartSummary;
