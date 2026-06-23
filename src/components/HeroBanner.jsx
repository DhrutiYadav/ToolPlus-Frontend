import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import "../styles/HeroBanner.css";

function HeroBanner() {
  return (
    <section className="hero-banner shadow-sm my-4 overflow-hidden position-relative rounded-4 bg-gradient-to-r from-slate-50 to-orange-50/30 dark:from-slate-900 dark:to-slate-800">
      <motion.div 
        className="hero-content z-10"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <motion.span 
          className="hero-badge bg-orange-50 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400 border border-orange-200 dark:border-orange-500/30 transition-colors shadow-sm"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          🚀 Lifetime Software Deals
        </motion.span>

        <motion.h1 
          className="fw-extrabold text-slate-900 dark:text-white transition-colors"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          Discover Amazing Tools
          <br />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-rose-500">Without Monthly Fees</span>
        </motion.h1>

        <motion.p 
          className="lead text-slate-600 dark:text-slate-300 my-3 transition-colors fw-medium"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          Find powerful software deals for entrepreneurs, developers, marketers, and growing businesses. Save up to 95% today!
        </motion.p>

        {/* Trust Badges */}
        <motion.div 
          className="d-flex flex-wrap gap-3 my-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <div className="d-flex align-items-center bg-white dark:bg-slate-800 px-3 py-2 rounded-pill shadow-sm border border-slate-100 dark:border-slate-700">
            <span className="me-2">⭐</span>
            <span className="fw-bold !text-slate-700 dark:!text-slate-300 fs-7">4.8 Rating</span>
          </div>
          <div className="d-flex align-items-center bg-white dark:bg-slate-800 px-3 py-2 rounded-pill shadow-sm border border-slate-100 dark:border-slate-700">
            <span className="me-2">🔥</span>
            <span className="fw-bold !text-slate-700 dark:!text-slate-300 fs-7">500+ Deals</span>
          </div>
          <div className="d-flex align-items-center bg-white dark:bg-slate-800 px-3 py-2 rounded-pill shadow-sm border border-slate-100 dark:border-slate-700">
            <span className="me-2">🛡️</span>
            <span className="fw-bold !text-slate-700 dark:!text-slate-300 fs-7">Secure Payments</span>
          </div>
        </motion.div>

        <motion.div 
          className="hero-buttons gap-3 mt-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <Link to="/deals" className="btn btn-primary bg-gradient-to-r from-orange-500 to-orange-600 border-0 rounded-pill px-4 py-3 fw-bold shadow-lg text-uppercase tracking-wider hover-lift hover:shadow-orange-500/30 transition-all duration-300">
            Browse All Deals
          </Link>

          <Link to="/categories" className="btn btn-outline-secondary bg-white dark:bg-slate-800 dark:text-slate-300 dark:border-slate-600 dark:hover:bg-slate-700 dark:hover:text-white rounded-pill px-4 py-3 fw-bold text-uppercase tracking-wider transition-colors hover-lift shadow-sm">
            View Categories
          </Link>
        </motion.div>
      </motion.div>

      <motion.div 
        className="hero-image d-none d-md-block z-10"
        initial={{ opacity: 0, scale: 0.9, x: 50 }}
        animate={{ opacity: 1, scale: 1, x: 0 }}
        transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
      >
        <img
          src="/hero-banner.png"
          alt="Hero Banner Illustration"
          className="drop-shadow-2xl hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=600&auto=format&fit=crop&q=60";
          }}
        />
      </motion.div>
      
      {/* Decorative background elements */}
      <div className="position-absolute top-0 end-0 w-50 h-100 bg-gradient-to-bl from-orange-100/50 to-transparent dark:from-orange-500/10 rounded-circle blur-3xl opacity-50 z-0 translate-x-1/4 -translate-y-1/4"></div>
    </section>
  );
}

export default HeroBanner;