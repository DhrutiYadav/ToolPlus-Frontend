import React from "react";
import { Minus, Plus, Trash2 } from "lucide-react";

const CartItem = ({ item, onUpdateQuantity, onRemove, isUpdating }) => {
  const API_BASE_URL = import.meta.env.VITE_API_URL
    ? import.meta.env.VITE_API_URL.replace("/api", "")
    : "https://localhost:7033";

  const getFullImageUrl = (url) => {
    if (!url || url.trim() === "")
      return "https://placehold.co/150x150/e2e8f0/64748b?text=No+Image";
    if (url.startsWith("http")) return url;
    return `${API_BASE_URL}${url.startsWith("/") ? "" : "/"}${url}`;
  };

  const displayImageUrl = getFullImageUrl(item.imageUrl);

  return (
    <div className="flex flex-col relative min-w-0 break-words rounded-xl mb-6 shadow-sm border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 transition-colors">
      <div className="flex-1 p-4">
        <div className="flex items-center">
          <div className="shrink-0">
            <img
              src={displayImageUrl}
              alt={item.title}
              className="h-[90px] w-[90px] rounded border border-slate-200 object-cover transition-colors dark:border-slate-700"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src =
                  "https://placehold.co/150x150/e2e8f0/64748b?text=No+Image";
              }}
            />
          </div>
          <div className="grow ml-4">
            <h6 className="mb-1 max-w-[250px] truncate font-semibold text-slate-900 dark:text-white">
              {item.title}
            </h6>
            <div className="mb-2">
              <span className="text-orange-500 dark:text-orange-400 font-bold text-lg mr-2 transition-colors">
                ₹{item.discountPrice.toFixed(2)}
              </span>
              {item.originalPrice > item.discountPrice && (
                <span className="text-sm text-slate-500 line-through dark:text-slate-400">
                  ₹{item.originalPrice.toFixed(2)}
                </span>
              )}
            </div>
            <div className="flex items-center justify-between">
              <div className="flex w-28 items-center rounded-full border border-slate-200 bg-white px-2 py-1 shadow-sm transition-colors dark:border-slate-700 dark:bg-slate-800">
                <button
                  className="flex h-7 w-7 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-50 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-white"
                  onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                  disabled={isUpdating || item.quantity <= 1}
                >
                  <Minus size={16} />
                </button>

                <span className="flex-1 text-center font-semibold text-slate-900 dark:text-white">
                  {item.quantity}
                </span>

                <button
                  className="flex h-7 w-7 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed disabled:opacity-50 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-white"
                  onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                  disabled={isUpdating}
                >
                  <Plus size={16} />
                </button>
              </div>
              <button
                className="btn btn-sm btn-link text-rose-500 dark:text-rose-400 p-0 ml-2 no-underline hover:text-rose-600 dark:hover:text-rose-300 transition-colors"
                onClick={() => onRemove(item.id)}
                disabled={isUpdating}
              >
                <i className="bi bi-trash ml-1"></i> Remove
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
