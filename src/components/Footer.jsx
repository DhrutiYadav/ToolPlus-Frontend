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
    toast.success(
      "🎉 Thanks for subscribing! You'll get the best deals in your inbox.",
    );
  };

  return (
    <footer className="bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white transition-colors">
      {/* Newsletter Row */}
      <div className="border-b border-slate-200 dark:border-slate-800 py-12 bg-gradient-to-r from-orange-50 via-white to-orange-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center gap-8">
            <div className="lg:w-1/2">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-11 h-11 bg-orange-100 dark:bg-orange-500/10 text-orange-500 rounded-full flex items-center justify-center">
                  <i className="bi bi-envelope-heart-fill text-xl"></i>
                </div>
                <div>
                  <h4 className="font-extrabold text-xl text-slate-900 dark:text-white mb-1">
                    Get the best deals in your inbox
                  </h4>
                  <p className="text-slate-500 dark:text-slate-400 text-sm">
                    Join 10,000+ entrepreneurs. Unsubscribe anytime.
                  </p>
                </div>
              </div>
            </div>

            <div className="lg:w-1/2 w-full">
              {subscribed ? (
                <div className="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 rounded-full px-6 py-3 flex items-center gap-2">
                  <i className="bi bi-check-circle-fill"></i>
                  <span className="font-semibold">
                    You're subscribed! Look out for great deals.
                  </span>
                </div>
              ) : (
                <form onSubmit={handleNewsletterSubmit} className="flex gap-3">
                  <input
                    type="email"
                    className="flex-1 px-6 py-3 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-orange-500 focus:ring-2 focus:ring-orange-200 dark:focus:ring-orange-500/30 outline-none transition-all"
                    placeholder="Enter your email address..."
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                  />
                  <button
                    type="submit"
                    className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold px-10 py-3 rounded-full flex items-center gap-2 transition-all shadow-sm hover:shadow-md whitespace-nowrap"
                  >
                    <i className="bi bi-send-fill"></i>
                    Subscribe
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-6 pt-10 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8">
          {/* Brand Info */}
          <div className="lg:col-span-5">
            <div className="mb-6">
              <img
                src="/logo/logo-horizontal.png"
                alt="ToolPlus Logo"
                className="h-9 dark:hidden"
              />
              <img
                src="/logo/dark-horizontal-logo.png"
                alt="ToolPlus Logo"
                className="h-9 hidden dark:block"
              />
            </div>

            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed max-w-md">
              The premier marketplace for software, tools, and digital
              resources. Discover amazing lifetime deals for your business and
              productivity workflows.
            </p>

            <div className="mt-8 space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <span className="text-amber-500">⭐⭐⭐⭐⭐</span>
                <span className="font-semibold text-slate-700 dark:text-slate-300">
                  Trusted by 10,000+ Customers
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-emerald-500">🛡️</span>
                <span className="text-slate-600 dark:text-slate-400">
                  Secure Payments &amp; 60-Day Refund
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-orange-500">⚡</span>
                <span className="text-slate-600 dark:text-slate-400">
                  Instant Deal Access
                </span>
              </div>
            </div>

            {/* Social Icons */}
            <div className="flex gap-3 mt-8">
              <a
                href="#"
                className="footer-social-btn"
                title="GitHub"
                aria-label="GitHub"
              >
                <i className="bi bi-github"></i>
              </a>
              <a
                href="#"
                className="footer-social-btn"
                title="Twitter / X"
                aria-label="Twitter"
              >
                <i className="bi bi-twitter-x"></i>
              </a>
              <a
                href="#"
                className="footer-social-btn"
                title="LinkedIn"
                aria-label="LinkedIn"
              >
                <i className="bi bi-linkedin"></i>
              </a>
              <a
                href="#"
                className="footer-social-btn"
                title="YouTube"
                aria-label="YouTube"
              >
                <i className="bi bi-youtube"></i>
              </a>
            </div>
          </div>

          {/* Explore */}
          <div className="lg:col-span-2">
            <h6 className="uppercase font-bold text-xs tracking-widest text-slate-700 dark:text-slate-300 mb-6">
              Explore
            </h6>
            <ul className="space-y-3 text-sm">
              <li>
                <Link to="/products" className="footer-link">
                  Products
                </Link>
              </li>
              <li>
                <Link to="/categories" className="footer-link">
                  Categories
                </Link>
              </li>
              <li>
                <Link to="/deals" className="footer-link">
                  Deals
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div className="lg:col-span-2">
            <h6 className="uppercase font-bold text-xs tracking-widest text-slate-700 dark:text-slate-300 mb-6">
              Company
            </h6>
            <ul className="space-y-3 text-sm">
              <li>
                <Link to="/about" className="footer-link">
                  About
                </Link>
              </li>
              <li>
                <Link to="/faq" className="footer-link">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="footer-link">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="footer-link">
                  Terms
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div className="lg:col-span-3">
            <h6 className="uppercase font-bold text-xs tracking-widest text-slate-700 dark:text-slate-300 mb-6">
              Support
            </h6>
            <ul className="space-y-3 text-sm mb-8">
              <li>
                <Link to="/orders" className="footer-link">
                  My Orders
                </Link>
              </li>
              <li>
                <Link to="/profile" className="footer-link">
                  My Account
                </Link>
              </li>
              <li>
                <Link to="/my-reviews" className="footer-link">
                  My Reviews
                </Link>
              </li>
            </ul>

            {/* Trust Badges */}
            <div className="flex flex-wrap gap-2">
              <span className="footer-trust-badge">🔒 SSL Secure</span>
              <span className="footer-trust-badge">✅ Verified Deals</span>
              <span className="footer-trust-badge">🛡️ Buyer Protection</span>
            </div>
          </div>
        </div>

        <hr className="my-10 border-slate-200 dark:border-slate-800" />

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-slate-500 dark:text-slate-400">
          <div>© 2025 ToolPlus. All rights reserved.</div>
          <div className="text-xs">Made with ❤️ for entrepreneurs</div>
          <div className="flex gap-6">
            <Link
              to="/privacy"
              className="hover:text-orange-500 transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              to="/terms"
              className="hover:text-orange-500 transition-colors"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
