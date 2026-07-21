import React, { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import "../styles/Footer.css";

function Footer() {
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) {
      toast.error("Please enter your email address.");
      return;
    }
    setSubscribed(true);
    setNewsletterEmail("");
    toast.success("🎉 Thanks for subscribing! You'll get the best deals in your inbox.");
  };

  return (
    <footer className="footer bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white transition-colors">
      {/* Newsletter Row */}
      <div className="footer-newsletter-strip border-b border-slate-200 dark:border-slate-800 py-12 transition-colors">
        <div className="container">
          <div className="row items-center gap-6">
            <div className="col-lg-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="bg-orange-100 dark:bg-orange-500/10 text-orange-500 rounded-full flex items-center justify-center newsletter-icon">
                  <i className="bi bi-envelope-heart-fill text-lg"></i>
                </div>
                <div>
                  <h4 className="font-extrabold text-slate-900 dark:text-white mb-0 transition-colors">Get the best deals in your inbox</h4>
                  <p className="text-slate-500 dark:text-slate-400 text-sm mb-0 transition-colors">Join 10,000+ entrepreneurs. Unsubscribe anytime.</p>
                </div>
              </div>
            </div>
            <div className="col-lg-6">
              {subscribed ? (
                <div className="relative bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 rounded-full px-6 py-2 mb-0 flex items-center gap-2">
                  <i className="bi bi-check-circle-fill"></i>
                  <span className="font-semibold">You're subscribed! Look out for great deals.</span>
                </div>
              ) : (
                <form onSubmit={handleNewsletterSubmit}>
                  <div className="footer-newsletter-input-group flex gap-2">
                    <input
                      type="email"
                      className="form-control py-2 px-6 rounded-full border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white transition-colors"
                      placeholder="Enter your email address..."
                      value={newsletterEmail}
                      onChange={(e) => setNewsletterEmail(e.target.value)}
                      
                    />
                    <button
                      type="submit"
                      className="btn btn-primary rounded-full px-12 font-bold border-0 shadow-sm footer-subscribe-btn"
                    >
                      <i className="bi bi-send-fill mr-2"></i>Subscribe
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container pt-[38px] pb-[26px]">
        <div className="row">
          {/* Column 1 - Brand Info */}
          <div className="col-lg-4 col-md-6 mb-6 md:mb-0 px-6">
            <div className="mb-6">
              {/* Light Mode Logo */}
              <img
                src="/logo/logo-horizontal.png"
                alt="ToolPlus Logo"
                className="max-w-full h-auto dark:hidden footer-logo-img"
              />
              {/* Dark Mode Logo */}
              <img
                src="/logo/logo-white.png"
                alt="ToolPlus Logo"
                className="max-w-full h-auto hidden dark:block footer-logo-img"
              />
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-sm transition-colors">
              The premier marketplace for software, tools, and digital resources. Discover amazing lifetime deals for your business and productivity workflows.
            </p>
            <div className="mt-6 mb-6">
              <div className="flex items-center mb-2">
                <span className="text-warning mr-2">⭐⭐⭐⭐⭐</span>
                <span className="text-slate-700 dark:text-slate-300 text-sm font-bold">Trusted by 10,000+ Customers</span>
              </div>
              <div className="flex items-center mb-2">
                <span className="text-emerald-500 mr-2">🛡️</span>
                <span className="text-slate-600 dark:text-slate-400 text-sm">Secure Payments &amp; 60-Day Refund</span>
              </div>
              <div className="flex items-center">
                <span className="text-orange-500 mr-2">⚡</span>
                <span className="text-slate-600 dark:text-slate-400 text-sm">Instant Deal Access</span>
              </div>
            </div>

            {/* Social Icons */}
            <div className="flex gap-2 mt-6">
              <a href="#" className="footer-social-btn" title="GitHub" aria-label="GitHub">
                <i className="bi bi-github"></i>
              </a>
              <a href="#" className="footer-social-btn" title="Twitter / X" aria-label="Twitter">
                <i className="bi bi-twitter-x"></i>
              </a>
              <a href="#" className="footer-social-btn" title="LinkedIn" aria-label="LinkedIn">
                <i className="bi bi-linkedin"></i>
              </a>
              <a href="#" className="footer-social-btn" title="YouTube" aria-label="YouTube">
                <i className="bi bi-youtube"></i>
              </a>
            </div>
          </div>

          {/* Column 2 - Explore */}
          <div className="col-lg-2 col-md-6 mb-6 md:mb-0 px-6">
            <h6 className="uppercase font-bold text-slate-700 dark:text-slate-300 mb-6 text-xs transition-colors">Explore</h6>
            <ul className="list-none mb-0 footer-links">
              <li className="mb-[8px]">
                <Link to="/products" className="text-slate-500 dark:text-slate-400 hover:text-orange-500 dark:hover:text-orange-400 no-underline text-sm transition-colors inline-block">Products</Link>
              </li>
              <li className="mb-[8px]">
                <Link to="/categories" className="text-slate-500 dark:text-slate-400 hover:text-orange-500 dark:hover:text-orange-400 no-underline text-sm transition-colors inline-block">Categories</Link>
              </li>
              <li className="mb-[8px]">
                <Link to="/deals" className="text-slate-500 dark:text-slate-400 hover:text-orange-500 dark:hover:text-orange-400 no-underline text-sm transition-colors inline-block">Deals</Link>
              </li>
            </ul>
          </div>

          {/* Column 3 - Company */}
          <div className="col-lg-2 col-md-6 mb-6 md:mb-0 px-6">
            <h6 className="uppercase font-bold text-slate-700 dark:text-slate-300 mb-6 text-xs transition-colors">Company</h6>
            <ul className="list-none mb-0 footer-links">
              <li className="mb-[8px]">
                <Link to="/about" className="text-slate-500 dark:text-slate-400 hover:text-orange-500 dark:hover:text-orange-400 no-underline text-sm transition-colors inline-block">About</Link>
              </li>
              <li className="mb-[8px]">
                <Link to="/faq" className="text-slate-500 dark:text-slate-400 hover:text-orange-500 dark:hover:text-orange-400 no-underline text-sm transition-colors inline-block">FAQ</Link>
              </li>
              <li className="mb-[8px]">
                <Link to="/privacy" className="text-slate-500 dark:text-slate-400 hover:text-orange-500 dark:hover:text-orange-400 no-underline text-sm transition-colors inline-block">Privacy Policy</Link>
              </li>
              <li className="mb-[8px]">
                <Link to="/terms" className="text-slate-500 dark:text-slate-400 hover:text-orange-500 dark:hover:text-orange-400 no-underline text-sm transition-colors inline-block">Terms</Link>
              </li>
            </ul>
          </div>

          {/* Column 4 - Support */}
          <div className="col-lg-4 col-md-6 px-6">
            <h6 className="uppercase font-bold text-slate-700 dark:text-slate-300 mb-6 text-xs transition-colors">Support</h6>
            <ul className="list-none mb-0 footer-links mb-6">
              <li className="mb-[8px]">
                <Link to="/orders" className="text-slate-500 dark:text-slate-400 hover:text-orange-500 dark:hover:text-orange-400 no-underline text-sm transition-colors inline-block">My Orders</Link>
              </li>
              <li className="mb-[8px]">
                <Link to="/profile" className="text-slate-500 dark:text-slate-400 hover:text-orange-500 dark:hover:text-orange-400 no-underline text-sm transition-colors inline-block">My Account</Link>
              </li>
              <li className="mb-[8px]">
                <Link to="/my-reviews" className="text-slate-500 dark:text-slate-400 hover:text-orange-500 dark:hover:text-orange-400 no-underline text-sm transition-colors inline-block">My Reviews</Link>
              </li>
            </ul>

            {/* Trust badges */}
            <div className="flex flex-wrap gap-2">
              <span className="footer-trust-badge">🔒 SSL Secure</span>
              <span className="footer-trust-badge">✅ Verified Deals</span>
              <span className="footer-trust-badge">🛡️ Buyer Protection</span>
            </div>
          </div>
        </div>

        <hr className="my-[28px] border-slate-200 dark:border-slate-800 transition-colors" />

        {/* Bottom Bar */}
        <div className="row items-center gap-2">
          <div className="col-md-4 text-center md:text-left">
            <span className="text-slate-500 dark:text-slate-400 text-sm transition-colors">
              © 2025 ToolPlus. All rights reserved.
            </span>
          </div>
          <div className="col-md-4 text-center">
            <span className="text-slate-400 dark:text-slate-500 text-xs transition-colors">
              Made with ❤️ for entrepreneurs
            </span>
          </div>
          <div className="col-md-4 text-center md:text-right">
            <Link to="/privacy" className="text-slate-500 dark:text-slate-400 hover:text-orange-500 dark:hover:text-orange-400 no-underline text-sm mr-4 transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="text-slate-500 dark:text-slate-400 hover:text-orange-500 dark:hover:text-orange-400 no-underline text-sm transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;