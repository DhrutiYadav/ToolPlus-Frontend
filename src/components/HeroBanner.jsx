import React from "react";
import { Link } from "react-router-dom";
import "../styles/HeroBanner.css";

function HeroBanner() {
  return (
    <section className="hero-banner shadow-sm my-4">
      <div className="hero-content">
        <span className="hero-badge animate-pulse bg-orange-50 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400 border border-orange-200 dark:border-orange-500/30 transition-colors">
          🚀 Lifetime Software Deals
        </span>

        <h1 className="fw-extrabold text-slate-900 dark:text-white transition-colors">
          Discover Amazing Tools
          <br />
          <span className="text-orange-500 transition-colors">Without Monthly Fees</span>
        </h1>

        <p className="lead text-slate-600 dark:text-slate-300 my-3 transition-colors">
          Find powerful software deals for entrepreneurs, developers, marketers, and growing businesses. Save up to 95% today!
        </p>

        <div className="hero-buttons gap-3 mt-4">
          <Link to="/deals" className="btn btn-primary rounded-pill px-4 py-3 fw-bold shadow-sm text-uppercase tracking-wider hover-lift">
            Browse All Deals
          </Link>

          <Link to="/categories" className="btn btn-outline-secondary dark:text-slate-300 dark:border-slate-600 dark:hover:bg-slate-800 dark:hover:text-white rounded-pill px-4 py-3 fw-bold text-uppercase tracking-wider transition-colors hover-lift">
            View Categories
          </Link>
        </div>
      </div>

      <div className="hero-image d-none d-md-block">
        <img
          src="/hero-banner.png"
          alt="Hero Banner Illustration"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=600&auto=format&fit=crop&q=60";
          }}
        />
      </div>
    </section>
  );
}

export default HeroBanner;