import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "../styles/HeroBanner.css";

function HeroBanner() {
  const navigate = useNavigate();
  const [heroSearch, setHeroSearch] = useState("");

  const handleHeroSearch = (e) => {
    e.preventDefault();
    const q = heroSearch.trim();
    if (q) {
      navigate(`/deals?search=${encodeURIComponent(q)}`);
    } else {
      navigate("/deals");
    }
  };

  return (
    <section className="hero-banner shadow-sm mb-3 overflow-hidden position-relative rounded-4">
      <motion.div
        className="hero-content z-10"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <motion.span
          className="hero-badge mb-[10px] d-inline-block bg-orange-50 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400 border border-orange-200 dark:border-orange-500/30 transition-colors shadow-sm"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          🚀 Lifetime Software Deals
        </motion.span>

        <motion.h1
          className="fw-extrabold text-slate-900 dark:text-white transition-colors mb-[12px]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          Discover Amazing Tools
          <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-rose-500">Without Monthly Fees</span>
        </motion.h1>

        <motion.p
          className="lead text-slate-600 dark:text-slate-300 mb-[14px] transition-colors fw-medium"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          Find powerful software deals for entrepreneurs, developers, and growing businesses. Save up to 95% today!
        </motion.p>

        {/* Hero Search Bar */}
        <motion.form
          onSubmit={handleHeroSearch}
          className="hero-search-form mb-[16px]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.45 }}
        >
          <div className="hero-search-wrapper">
            <svg className="hero-search-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              className="hero-search-input"
              placeholder="Search 500+ software deals..."
              value={heroSearch}
              onChange={(e) => setHeroSearch(e.target.value)}
            />
            <button type="submit" className="hero-search-btn">
              Search
            </button>
          </div>
        </motion.form>

        {/* Trust Badges */}
        <motion.div
          className="d-flex flex-wrap gap-[8px] mb-[14px]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          {[
            { icon: "⭐", text: "4.8 Rating" },
            { icon: "🔥", text: "500+ Deals" },
            { icon: "🛡️", text: "Secure Payments" },
            { icon: "✅", text: "60-Day Guarantee" },
            { icon: "⚡", text: "Instant Access" },
          ].map((badge, i) => (
            <div key={i} className="d-flex align-items-center bg-white dark:bg-slate-800 px-[14px] py-[6px] rounded-pill shadow-sm border border-slate-100 dark:border-slate-700">
              <span className="me-2">{badge.icon}</span>
              <span className="fw-bold !text-slate-700 dark:!text-slate-300 fs-7">{badge.text}</span>
            </div>
          ))}
        </motion.div>

        <motion.div
          className="hero-buttons gap-[14px] mt-[12px] d-flex flex-wrap"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <Link
            to="/deals"
            className="btn btn-primary border-0 rounded-pill fw-bold shadow-lg text-uppercase tracking-wider hero-cta-primary"
          >
            Browse All Deals →
          </Link>

          <Link
            to="/categories"
            className="btn rounded-pill fw-bold text-uppercase tracking-wider hero-cta-secondary"
          >
            View Categories
          </Link>
        </motion.div>
      </motion.div>

      {/* Animated SVG Illustration */}
      <motion.div
        className="hero-image d-none d-md-block z-10"
        initial={{ opacity: 0, scale: 0.9, x: 50 }}
        animate={{ opacity: 1, scale: 1, x: 0 }}
        transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
      >
        <div className="hero-svg-illustration">
          <svg width="380" height="320" viewBox="0 0 380 320" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Main dashboard card */}
            <rect x="40" y="60" width="200" height="140" rx="16" fill="white" className="hero-svg-card-light" filter="url(#shadow1)"/>
            <rect x="40" y="60" width="200" height="140" rx="16" fill="#1e293b" className="hero-svg-card-dark" filter="url(#shadow1)"/>
            {/* Card header bar */}
            <rect x="40" y="60" width="200" height="40" rx="16" fill="#f97316" />
            <rect x="40" y="82" width="200" height="18" fill="#f97316" />
            {/* Header dots */}
            <circle cx="62" cy="80" r="5" fill="rgba(255,255,255,0.5)"/>
            <circle cx="80" cy="80" r="5" fill="rgba(255,255,255,0.5)"/>
            <circle cx="98" cy="80" r="5" fill="rgba(255,255,255,0.5)"/>
            {/* Stat rows */}
            <rect x="56" y="118" width="80" height="8" rx="4" fill="#e2e8f0"/>
            <rect x="56" y="134" width="120" height="6" rx="3" fill="#e2e8f0"/>
            <rect x="56" y="148" width="60" height="6" rx="3" fill="#e2e8f0"/>
            {/* Progress bar */}
            <rect x="56" y="162" width="168" height="8" rx="4" fill="#f1f5f9"/>
            <rect x="56" y="162" width="120" height="8" rx="4" fill="#f97316"/>
            {/* Price badge on card */}
            <rect x="160" y="114" width="64" height="32" rx="10" fill="#fff7ed"/>
            <text x="170" y="134" fontSize="13" fontWeight="700" fill="#f97316" fontFamily="system-ui">₹999</text>

            {/* Floating tool icons */}
            {/* Tool card 1 - top right */}
            <g className="hero-float-1">
              <rect x="260" y="30" width="100" height="70" rx="12" fill="white" filter="url(#shadow2)"/>
              <rect x="268" y="42" width="40" height="40" rx="8" fill="#eff6ff"/>
              <text x="276" y="68" fontSize="20">⚡</text>
              <rect x="316" y="50" width="36" height="6" rx="3" fill="#e2e8f0"/>
              <rect x="316" y="62" width="26" height="5" rx="2.5" fill="#e2e8f0"/>
            </g>

            {/* Tool card 2 - bottom right */}
            <g className="hero-float-2">
              <rect x="270" y="130" width="100" height="70" rx="12" fill="white" filter="url(#shadow2)"/>
              <rect x="278" y="142" width="40" height="40" rx="8" fill="#f0fdf4"/>
              <text x="285" y="168" fontSize="20">🛡️</text>
              <rect x="326" y="150" width="36" height="6" rx="3" fill="#e2e8f0"/>
              <rect x="326" y="162" width="26" height="5" rx="2.5" fill="#e2e8f0"/>
            </g>

            {/* Tool card 3 - bottom left */}
            <g className="hero-float-3">
              <rect x="30" y="230" width="100" height="65" rx="12" fill="white" filter="url(#shadow2)"/>
              <rect x="40" y="242" width="36" height="36" rx="8" fill="#fef3c7"/>
              <text x="46" y="266" fontSize="20">🏆</text>
              <rect x="84" y="250" width="38" height="6" rx="3" fill="#e2e8f0"/>
              <rect x="84" y="262" width="28" height="5" rx="2.5" fill="#e2e8f0"/>
            </g>

            {/* Notification badge */}
            <g className="hero-float-4">
              <rect x="170" y="210" width="160" height="50" rx="12" fill="white" filter="url(#shadow2)"/>
              <circle cx="194" cy="235" r="14" fill="#dcfce7"/>
              <text x="186" y="240" fontSize="16">✅</text>
              <rect x="216" y="226" width="96" height="7" rx="3.5" fill="#e2e8f0"/>
              <rect x="216" y="239" width="72" height="5" rx="2.5" fill="#e2e8f0"/>
            </g>

            {/* Defs */}
            <defs>
              <filter id="shadow1" x="-10%" y="-10%" width="120%" height="120%">
                <feDropShadow dx="0" dy="4" stdDeviation="10" floodColor="#00000020"/>
              </filter>
              <filter id="shadow2" x="-10%" y="-10%" width="130%" height="130%">
                <feDropShadow dx="0" dy="4" stdDeviation="8" floodColor="#00000018"/>
              </filter>
            </defs>
          </svg>
        </div>
      </motion.div>

      {/* Decorative background elements */}
      <div className="position-absolute top-0 end-0 w-50 h-100 bg-gradient-to-bl from-orange-100/50 to-transparent dark:from-orange-500/10 rounded-circle blur-3xl opacity-50 z-0 translate-x-1/4 -translate-y-1/4"></div>

      {/* "As Seen On" Strip */}
      <div className="hero-seen-on-strip w-100 position-absolute bottom-0 start-0 px-4 py-2 d-flex align-items-center gap-3 flex-wrap">
        <span className="text-slate-400 dark:text-slate-600 fs-8 fw-semibold text-uppercase tracking-wider me-1">As seen on</span>
        {["Product Hunt", "TechCrunch", "Forbes", "Indie Hackers"].map((brand) => (
          <span
            key={brand}
            className="seen-on-badge px-[10px] py-[4px] rounded-pill border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-500 fs-8 fw-bold bg-white/70 dark:bg-slate-800/60 backdrop-blur-sm"
          >
            {brand}
          </span>
        ))}
      </div>
    </section>
  );
}

export default HeroBanner;