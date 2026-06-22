import React, { useState } from "react";
import { Link } from "react-router-dom";
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
  } = deal;

  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const savingsPercent = originalPrice > 0 
    ? Math.round(((originalPrice - discountPrice) / originalPrice) * 100)
    : 0;

  const defaultImage = "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3";

  return (
    <div className="card deal-card deal-card-container h-100 card-shadow hover-lift border-0 overflow-hidden bg-white dark:bg-slate-900">
      <div className="deal-image-wrapper deal-card-img-container position-relative">
        {/* Loading skeleton behind image */}
        {!imageLoaded && !imageError && (
          <div className="position-absolute inset-0 w-100 h-100 d-flex align-items-center justify-content-center bg-slate-100 dark:bg-slate-800">
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
          className={`card-img-top deal-img ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
          style={{ transition: 'opacity 0.4s ease' }}
          onLoad={() => setImageLoaded(true)}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = defaultImage;
            setImageError(true);
            setImageLoaded(true);
          }}
        />
        {savingsPercent > 0 && (
          <span className="badge bg-danger position-absolute top-0 end-0 m-3 px-3 py-2 fw-bold text-uppercase savings-badge">
            -{savingsPercent}%
          </span>
        )}
        {categoryName && (
          <span className="badge bg-dark position-absolute bottom-0 start-0 m-3 px-2 py-1 text-uppercase fw-semibold category-badge">
            {categoryName}
          </span>
        )}
      </div>

      <div className="card-body d-flex flex-column p-4">
        {/* Badges row */}
        <div className="d-flex gap-2 mb-2 flex-wrap">
          {savingsPercent > 80 && <span className="badge badge-featured text-white fw-bold px-2 py-1" style={{fontSize: '0.68rem', borderRadius: '6px'}}>⚡ Featured</span>}
          {averageRating >= 4.5 && reviewCount > 0 && <span className="badge badge-bestseller text-white fw-bold px-2 py-1" style={{fontSize: '0.68rem', borderRadius: '6px'}}>🏆 Best Seller</span>}
          {stock <= 10 && stock > 0 && <span className="badge badge-limited text-dark fw-bold px-2 py-1" style={{fontSize: '0.68rem', borderRadius: '6px'}}>🔥 Limited</span>}
        </div>

        <h5 className="card-title text-slate-900 dark:text-white fw-bold mb-1 line-clamp-2 hover-primary" style={{fontSize: '1.05rem', lineHeight: 1.35}}>
          <Link to={`/deals/${id}`} className="text-decoration-none text-inherit text-dashboard-title" style={{fontSize: '1.05rem'}}>{title}</Link>
        </h5>
        
        {/* Premium Ratings section */}
        <div className="d-flex align-items-center mb-2 mt-1" style={{minHeight: "24px"}}>
          <div className={reviewCount > 0 ? "text-warning me-1" : "text-slate-300 dark:text-slate-600 me-1"} style={{fontSize: '0.85rem'}}>
            {renderStars(averageRating || 0)}
          </div>
          <span className="text-slate-900 dark:text-white fw-bold" style={{fontSize: '0.8rem'}}>{(averageRating || 0).toFixed(1)}</span>
          <span className="text-slate-400 dark:text-slate-500 ms-1" style={{fontSize: '0.8rem'}}>({reviewCount || 0})</span>
        </div>

        <p className="card-text text-slate-500 dark:text-slate-400 mb-3 line-clamp-2" style={{fontSize: '0.84rem', lineHeight: 1.55}}>{shortDescription}</p>

        <div className="mt-auto pt-3 border-top border-slate-100 dark:border-slate-800">
          {/* Price section */}
          <div className="d-flex align-items-baseline mb-3">
            <span className="deal-price-current text-slate-900 dark:text-white fs-4 me-2">
              ₹{discountPrice.toFixed(2)}
            </span>
            <span className="deal-price-original text-decoration-line-through text-slate-400 dark:text-slate-500 me-2">
              ₹{originalPrice.toFixed(2)}
            </span>
            {savingsPercent > 0 && (
              <span className="text-emerald-600 dark:text-emerald-400 fw-bold" style={{fontSize: '0.8rem'}}>
                Save {savingsPercent}%
              </span>
            )}
          </div>

          <div className="d-flex justify-content-between align-items-center">
            {/* Stock status indicator */}
            {stock <= 10 && stock > 0 ? (
              <div className="stock-indicator text-amber-600 dark:text-amber-400">
                <span>🔥</span> Only {stock} left
              </div>
            ) : stock === 0 ? (
              <div className="stock-indicator text-rose-500 dark:text-rose-400">
                <span>✕</span> Sold Out
              </div>
            ) : (
              <div className="stock-indicator text-emerald-600 dark:text-emerald-400">
                <span>✓</span> In Stock
              </div>
            )}

            <Link to={`/deals/${id}`} className="btn btn-outline-primary rounded-pill px-4 fw-bold deal-cta-btn">
              View Deal
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DealCard;
