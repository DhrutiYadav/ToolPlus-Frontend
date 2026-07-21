import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useNavigate, Link, useLocation } from "react-router-dom";
import cartService from "../services/cartService";
import couponService from "../services/couponService";
import * as orderService from "../services/orderService";
import * as paymentService from "../api/paymentApi";
import { useCart } from "../context/CartContext";
import CartItem from "../components/cart/CartItem";
import CartSummary from "../components/cart/CartSummary";
import EmptyCart from "../components/cart/EmptyCart";
import { invokeRazorpayFlow } from "../utils/razorpayUtils";

const Cart = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const buyNowItem = location.state?.buyNowItem;
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [clearing, setClearing] = useState(false);
  const { refreshCart } = useCart();

  // Coupon state
  const [couponCodeInput, setCouponCodeInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const fetchCart = async () => {
    if (buyNowItem) {
      setSummary({
        items: [buyNowItem],
        totalAmount: buyNowItem.discountPrice * buyNowItem.quantity,
        totalItems: buyNowItem.quantity
      });
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const data = await cartService.getCartSummary();
      setSummary(data);
    } catch (error) {
      toast.error("Failed to load cart");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const handleUpdateQuantity = async (id, newQuantity) => {
    if (newQuantity < 1) return;
    try {
      setUpdatingId(id);

      // Optimistic update
      setSummary((prev) => {
        if (!prev) return prev;
        const newItems = prev.items.map((item) =>
          item.id === id ? { ...item, quantity: newQuantity } : item,
        );
        const totalAmount = newItems.reduce(
          (sum, item) => sum + item.discountPrice * item.quantity,
          0,
        );
        const totalItems = newItems.reduce(
          (sum, item) => sum + item.quantity,
          0,
        );
        return { items: newItems, totalAmount, totalItems };
      });

      // Clear coupon on changes to avoid mismatch
      if (appliedCoupon) {
        setAppliedCoupon(null);
        setCouponCodeInput("");
        toast.info("Cart updated. Coupon cleared.");
      }

      if (buyNowItem && id === buyNowItem.id) {
        const updatedItem = { ...buyNowItem, quantity: newQuantity };
        navigate("/cart", { state: { buyNowItem: updatedItem }, replace: true });
        return;
      }

      await cartService.updateQuantity(id, newQuantity);
      refreshCart();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update quantity");
      fetchCart(); // revert
    } finally {
      setUpdatingId(null);
    }
  };

  const handleRemoveItem = async (id) => {
    try {
      setUpdatingId(id);

      // Optimistic update
      setSummary((prev) => {
        if (!prev) return prev;
        const newItems = prev.items.filter((item) => item.id !== id);
        const totalAmount = newItems.reduce(
          (sum, item) => sum + item.discountPrice * item.quantity,
          0,
        );
        const totalItems = newItems.reduce(
          (sum, item) => sum + item.quantity,
          0,
        );
        return { items: newItems, totalAmount, totalItems };
      });

      // Clear coupon on changes to avoid mismatch
      if (appliedCoupon) {
        setAppliedCoupon(null);
        setCouponCodeInput("");
        toast.info("Cart updated. Coupon cleared.");
      }

      if (buyNowItem && id === buyNowItem.id) {
        toast.success("Item removed from cart");
        navigate("/deals", { replace: true });
        return;
      }

      await cartService.removeItem(id);
      toast.success("Item removed from cart");
      refreshCart();
    } catch (error) {
      toast.error("Failed to remove item");
      fetchCart(); // revert
    } finally {
      setUpdatingId(null);
    }
  };

  const handleClearCart = async () => {
    if (!window.confirm("Are you sure you want to clear your entire cart?")) {
      return;
    }

    try {
      setClearing(true);
      
      if (buyNowItem) {
         setSummary({ items: [], totalAmount: 0, totalItems: 0 });
         setAppliedCoupon(null);
         setCouponCodeInput("");
         toast.success("Cart cleared successfully");
         navigate("/deals", { replace: true });
         return;
      }

      await cartService.clearCart();
      setSummary({ items: [], totalAmount: 0, totalItems: 0 });
      setAppliedCoupon(null);
      setCouponCodeInput("");
      toast.success("Cart cleared successfully");
      refreshCart();
    } catch (error) {
      toast.error("Failed to clear cart");
    } finally {
      setClearing(false);
    }
  };

  const handleApplyCoupon = async (e) => {
    if (e) e.preventDefault();
    if (!couponCodeInput.trim()) return;

    try {
      setIsApplyingCoupon(true);
      const items = summary?.items || [];
      if (items.length === 0) {
        toast.error("Cart is empty");
        return;
      }

      // Sort items descending by subtotal to find the most eligible item to apply the coupon to
      const sortedItems = [...items].sort(
        (a, b) => b.discountPrice * b.quantity - a.discountPrice * a.quantity,
      );
      const bestItem = sortedItems[0];
      const bestSubtotal = bestItem.discountPrice * bestItem.quantity;

      const validationResult = await couponService.validateCoupon(
        couponCodeInput,
        bestSubtotal,
      );

      if (validationResult.isValid) {
        setAppliedCoupon({
          ...validationResult,
          targetItemId: bestItem.id,
          targetDealId: bestItem.dealId,
        });
        toast.success(
          validationResult.message || "Coupon applied successfully!",
        );
      } else {
        toast.error(validationResult.message || "Invalid coupon");
      }
    } catch (error) {
      const msg = error.response?.data?.message || "Failed to validate coupon";
      toast.error(msg);
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCodeInput("");
    toast.info("Coupon removed.");
  };

  const handleCheckout = async () => {
    setIsCheckingOut(true);
    const items = summary?.items || [];
    if (items.length === 0) {
      setIsCheckingOut(false);
      return;
    }

    await invokeRazorpayFlow({
      items,
      appliedCouponCode: appliedCoupon?.code || null,
      navigate,
      onSuccessCallback: async () => {
        if (!buyNowItem) {
          await cartService.clearCart();
        }
        refreshCart();
      },
      finallyCallback: () => {
        setIsCheckingOut(false);
      }
    });
  };

  if (loading) {
    return (
      <div className="container py-12">
        <h2 className="mb-6 font-bold text-slate-900 dark:text-white transition-colors">
          Shopping Cart
        </h2>
        <div className="flex flex-wrap -mx-6">
          <div className="col-lg-8">
            {[1, 2].map((n) => (
              <div
                key={n}
                className="flex flex-col relative min-w-0 break-words mb-6 border border-slate-100 dark:border-slate-800 shadow-sm placeholder-glow bg-white dark:bg-slate-900 transition-colors"
              >
                <div className="flex-1 p-4 flex items-center">
                  <div
                    className="placeholder col-2 rounded bg-slate-200 dark:bg-slate-700 transition-colors"
                    style={{ height: "80px", width: "80px" }}
                  ></div>
                  <div className="ml-4 grow">
                    <h5 className="placeholder col-6 mb-2"></h5>
                    <p className="placeholder col-4 mb-2"></p>
                    <p className="placeholder col-2"></p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="col-lg-4">
            <div className="flex flex-col relative min-w-0 break-words border border-slate-100 dark:border-slate-800 shadow-sm placeholder-glow bg-white dark:bg-slate-900 transition-colors">
              <div className="flex-1 p-6">
                <h5 className="placeholder col-6 mb-6"></h5>
                <p className="placeholder col-12 mb-2"></p>
                <p className="placeholder col-12 mb-6"></p>
                <button className="btn btn-primary disabled placeholder col-12 py-2"></button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!summary || summary.items.length === 0) {
    return (
      <div className="container py-12">
        <EmptyCart />
      </div>
    );
  }

  return (
    <div className="container py-12">
      <div className="flex items-center mb-6">
        <h2 className="font-bold mb-0 text-slate-900 dark:text-white transition-colors">
          Shopping Cart
        </h2>
        <span className="inline-block leading-none text-center whitespace-nowrap align-baseline px-2 py-1 bg-orange-500 rounded-full ml-4 text-base transition-colors text-white">
          {summary.totalItems} {summary.totalItems === 1 ? "Item" : "Items"}
        </span>
      </div>

      <div className="flex flex-wrap -mx-6">
        <div className="col-lg-8 mb-6 lg:mb-0">
          <div className="cart-items-container">
            {summary.items.map((item) => (
              <CartItem
                key={item.id}
                item={item}
                onUpdateQuantity={handleUpdateQuantity}
                onRemove={handleRemoveItem}
                isUpdating={updatingId === item.id}
              />
            ))}
          </div>
          <div className="mt-6">
            <Link
              to="/deals"
              className="no-underline text-orange-500 dark:text-orange-400 font-medium hover:text-orange-600 dark:hover:text-orange-300 transition-colors"
            >
              <i className="bi bi-arrow-left mr-2"></i> Continue Shopping
            </Link>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="sticky-top" style={{ top: "2rem", zIndex: 10 }}>
            <CartSummary
              summary={summary}
              onClearCart={handleClearCart}
              isClearing={clearing}
              appliedCoupon={appliedCoupon}
              couponCodeInput={couponCodeInput}
              setCouponCodeInput={setCouponCodeInput}
              onApplyCoupon={handleApplyCoupon}
              onRemoveCoupon={handleRemoveCoupon}
              isApplyingCoupon={isApplyingCoupon}
              onCheckout={handleCheckout}
              isCheckingOut={isCheckingOut}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
