import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { renderStars } from "../services/reviewService";
import "../styles/DealCard.css";

function DealCard({ deal }) {
  const {
    id,
    title,
    shortDescription,
    imageSrc,
    originalPrice,
    discountPrice,
    stock,
    categoryName,
    averageRating,
    reviewCount,
    expiresAt,
  } = deal;

  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const savingsPercent = originalPrice > 0
    ? Math.round(((originalPrice - discountPrice) / originalPrice) * 100)
    : 0;

  const defaultImage = "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3";

  // Calculate days left
  const getDaysLeft = () => {
    if (!expiresAt) return null;
    const now = new Date();
    const expires = new Date(expiresAt);
    const diffMs = expires - now;
    if (diffMs <= 0) return 0;
    return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  };

  const daysLeft = getDaysLeft();

  return (
    <motion.div
      className="deal-card-wrapper"
      whileHover={{ rotateY: 2, rotateX: -1, scale: 1.01 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <div className="flex flex-col relative min-w-0 break-words deal-card deal-card-container h-full border-0 overflow-hidden bg-white dark:bg-slate-900 rounded-2xl group">
        <div className="deal-image-wrapper deal-card-img-container relative overflow-hidden aspect-[2/1] bg-slate-100 dark:bg-slate-800">
          {/* Loading skeleton behind image */}
          {!imageLoaded && !imageError && (
            <div className="absolute inset-0 w-full h-full flex items-center justify-center bg-slate-100 dark:bg-slate-800">
              <div className="text-slate-400 dark:text-slate-600">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                  <circle cx="8.5" cy="8.5" r="1.5"/>
                  <polyline points="21 15 16 10 5 21"/>
                </svg>
              </div>
            </div>
          )}
          <img
            src={imageSrc || defaultImage}
            alt={title}
            className={`rounded-t-2xl deal-img w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
            onLoad={() => setImageLoaded(true)}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = defaultImage;
              setImageError(true);
              setImageLoaded(true);
            }}
          />
          {savingsPercent > 0 && (
            <span className="absolute top-0 end-0 m-6 px-6 py-1.5 font-bold bg-white dark:bg-slate-900 text-orange-600 dark:text-orange-500 rounded-full shadow-sm text-xs border border-slate-100 dark:border-slate-700">
              🔥 Save {savingsPercent}%
            </span>
          )}
          {categoryName && (
            <span className="inline-block text-[0.75em] leading-none text-center whitespace-nowrap align-baseline text-white bg-dark/80 backdrop-blur-sm absolute bottom-0 start-0 m-6 px-6 py-1.5 rounded-full uppercase font-semibold border border-white/10">
              {categoryName}
            </span>
          )}
        </div>

        <div className="flex-1 flex flex-col p-[16px]">
          {/* Premium Badges */}
          <div className="flex gap-2 mb-2 flex-wrap">
            {savingsPercent > 80 && (
              <span className="deal-badge deal-badge-featured">
                <i className="bi bi-lightning-charge-fill mr-1"></i>Featured
              </span>
            )}
            {averageRating >= 4.5 && reviewCount > 0 && (
              <span className="deal-badge deal-badge-bestseller">
                <i className="bi bi-trophy-fill mr-1"></i>Best Seller
              </span>
            )}
            {stock <= 10 && stock > 0 && (
              <span className="deal-badge deal-badge-limited">
                <i className="bi bi-fire mr-1"></i>Limited
              </span>
            )}
          </div>

          <h5 className="text-slate-900 dark:text-white font-bold mb-0 line-clamp-2 hover-primary deal-title">
            <Link to={`/deals/${id}`} className="no-underline text-inherit text-dashboard-title">{title}</Link>
          </h5>

          {/* Premium Ratings section */}
          <div className="flex items-center mb-6 mt-1 deal-rating-row">
            <div className={reviewCount > 0 ? "text-warning mr-2 flex items-center gap-1" : "text-slate-300 dark:text-slate-600 mr-2 flex items-center gap-1"}>
              {renderStars(averageRating || 0)}
            </div>
            <span className="text-slate-900 dark:text-white font-bold text-sm">{(averageRating || 0).toFixed(1)}</span>
            <span className="text-slate-400 dark:text-slate-500 ml-1 text-sm">({reviewCount || 0} reviews)</span>
          </div>

          <p className="text-slate-500 dark:text-slate-400 mb-[12px] line-clamp-2 deal-short-desc">{shortDescription}</p>

          <div className="mt-auto pt-[12px] border-t border-slate-100 dark:border-slate-800">
            {/* Price section */}
            <div className="flex items-baseline mb-2">
              <span className="deal-price-current text-slate-900 dark:text-white text-xl font-bold mr-2">
                ₹{discountPrice.toFixed(2)}
              </span>
              <span className="deal-price-original line-through text-slate-400 dark:text-slate-500 mr-2">
                ₹{originalPrice.toFixed(2)}
              </span>
              {savingsPercent > 0 && (
                <span className="text-emerald-600 dark:text-emerald-400 font-bold deal-save-percent">
                  Save {savingsPercent}%
                </span>
              )}
            </div>

            {/* Urgency indicator */}
            {daysLeft !== null ? (
              <div className="deal-urgency-badge mb-2">
                <i className="bi bi-clock mr-1"></i>
                {daysLeft === 0 ? "Expires today!" : `${daysLeft} days left`}
              </div>
            ) : (
              <div className="deal-urgency-badge-limited mb-2">
                <i className="bi bi-clock mr-1"></i>Limited Time
              </div>
            )}

            <div className="flex justify-between items-center mb-6">
              {/* Stock status indicator */}
              {stock <= 10 && stock > 0 ? (
                <div className="font-medium text-xs px-2 py-1 bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400 rounded-full">
                  🔥 Almost Gone
                </div>
              ) : stock === 0 ? (
                <div className="font-medium text-xs px-2 py-1 bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400 rounded-full">
                  ✕ Sold Out
                </div>
              ) : (
                <div className="font-medium text-xs px-2 py-1 bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400 rounded-full">
                  ✓ In Stock
                </div>
              )}
            </div>

            <Link
              to={`/deals/${id}`}
              className="deal-cta-btn btn w-full rounded-full h-[48px] flex items-center justify-center font-bold text-white"
            >
              <span className="deal-cta-text">Get Lifetime Deal</span>
              <span className="deal-cta-arrow ml-2">→</span>
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default DealCard;
