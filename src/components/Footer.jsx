import React from "react";
import { Link } from "react-router-dom";
import "../styles/Footer.css";

function Footer() {
  return (
    <footer className="footer bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white pt-5 pb-4 transition-colors">
      <div className="container">
        <div className="row">
          {/* Column 1 - Brand Info */}
          <div className="col-lg-4 col-md-6 mb-4 mb-md-0 px-4">
            <div className="mb-3">
              {/* Light Mode Logo */}
              <img
                src="/logo/logo-horizontal.png"
                alt="ToolPlus Logo"
                className="img-fluid dark:hidden"
                style={{ maxHeight: "35px", width: "auto" }}
              />
              {/* Dark Mode Logo */}
              <img
                src="/logo/logo-white.png"
                alt="ToolPlus Logo"
                className="img-fluid hidden dark:block"
                style={{ maxHeight: "35px", width: "auto" }}
              />
            </div>
            <p className="text-slate-500 dark:text-slate-400 fs-7 transition-colors">
              The premier marketplace for software, tools, and digital resources. Discover amazing lifetime deals for your business and productivity workflows.
            </p>
            <div className="mt-3">
              <span className="text-slate-500 dark:text-slate-400 fs-7 transition-colors">📍 Made for modern creators.</span>
            </div>
          </div>

          {/* Column 2 - Explore */}
          <div className="col-lg-2 col-md-6 mb-4 mb-md-0 px-4">
            <h6 className="text-uppercase fw-bold text-slate-700 dark:text-slate-300 mb-3 fs-8 transition-colors">Explore</h6>
            <ul className="list-unstyled mb-0 footer-links">
              <li className="mb-2">
                <Link to="/products" className="text-slate-500 dark:text-slate-400 hover:text-orange-500 dark:hover:text-orange-400 text-decoration-none fs-7 transition-colors d-inline-block">Products</Link>
              </li>
              <li className="mb-2">
                <Link to="/categories" className="text-slate-500 dark:text-slate-400 hover:text-orange-500 dark:hover:text-orange-400 text-decoration-none fs-7 transition-colors d-inline-block">Categories</Link>
              </li>
              <li className="mb-2">
                <Link to="/deals" className="text-slate-500 dark:text-slate-400 hover:text-orange-500 dark:hover:text-orange-400 text-decoration-none fs-7 transition-colors d-inline-block">Deals</Link>
              </li>
            </ul>
          </div>

          {/* Column 3 - Company */}
          <div className="col-lg-2 col-md-6 mb-4 mb-md-0 px-4">
            <h6 className="text-uppercase fw-bold text-slate-700 dark:text-slate-300 mb-3 fs-8 transition-colors">Company</h6>
            <ul className="list-unstyled mb-0 footer-links">
              <li className="mb-2">
                <Link to="/about" className="text-slate-500 dark:text-slate-400 hover:text-orange-500 dark:hover:text-orange-400 text-decoration-none fs-7 transition-colors d-inline-block">About</Link>
              </li>
              <li className="mb-2">
                <Link to="/faq" className="text-slate-500 dark:text-slate-400 hover:text-orange-500 dark:hover:text-orange-400 text-decoration-none fs-7 transition-colors d-inline-block">FAQ</Link>
              </li>
              <li className="mb-2">
                <Link to="/privacy" className="text-slate-500 dark:text-slate-400 hover:text-orange-500 dark:hover:text-orange-400 text-decoration-none fs-7 transition-colors d-inline-block">Privacy Policy</Link>
              </li>
              <li className="mb-2">
                <Link to="/terms" className="text-slate-500 dark:text-slate-400 hover:text-orange-500 dark:hover:text-orange-400 text-decoration-none fs-7 transition-colors d-inline-block">Terms</Link>
              </li>
            </ul>
          </div>

          {/* Column 4 - Legal / Newsletter */}
          <div className="col-lg-4 col-md-6 px-4">
            <h6 className="text-uppercase fw-bold text-slate-700 dark:text-slate-300 mb-3 fs-8 transition-colors">Stay updated</h6>
            <p className="text-slate-500 dark:text-slate-400 fs-7 mb-3 transition-colors">Join our newsletter to receive the hottest lifetime software deals directly in your inbox.</p>
            <div className="input-group mb-4 footer-newsletter border border-slate-200 dark:border-slate-700 rounded-pill transition-colors overflow-hidden focus-within:shadow-sm focus-within:border-orange-500 bg-white dark:bg-slate-800">
              <input type="email" className="form-control bg-transparent text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 border-0 transition-colors focus:ring-0 ps-3" placeholder="Enter email address" />
              <button className="btn btn-primary fw-bold px-4" type="button">Subscribe</button>
            </div>
            <div className="d-flex gap-3">
              <a href="#" className="text-slate-400 hover:text-orange-500 dark:hover:text-orange-400 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16"><path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951z"/></svg>
              </a>
              <a href="#" className="text-slate-400 hover:text-orange-500 dark:hover:text-orange-400 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16"><path d="M5.026 15c6.038 0 9.341-5.003 9.341-9.334 0-.14 0-.282-.006-.422A6.685 6.685 0 0 0 16 3.542a6.658 6.658 0 0 1-1.889.518 3.301 3.301 0 0 0 1.447-1.817 6.533 6.533 0 0 1-2.087.793A3.286 3.286 0 0 0 7.875 6.03a9.325 9.325 0 0 1-6.767-3.429 3.289 3.289 0 0 0 1.018 4.382A3.323 3.323 0 0 1 .64 6.575v.045a3.288 3.288 0 0 0 2.632 3.218 3.203 3.203 0 0 1-.865.115 3.23 3.23 0 0 1-.614-.057 3.283 3.283 0 0 0 3.067 2.277A6.588 6.588 0 0 1 .78 13.58a6.32 6.32 0 0 1-.78-.045A9.344 9.344 0 0 0 5.026 15z"/></svg>
              </a>
              <a href="#" className="text-slate-400 hover:text-orange-500 dark:hover:text-orange-400 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z"/></svg>
              </a>
            </div>
          </div>
        </div>

        <hr className="my-5 border-slate-200 dark:border-slate-800 transition-colors" />

        <div className="row align-items-center">
          <div className="col-md-6 text-center text-md-start">
            <span className="text-slate-500 dark:text-slate-400 fs-7 transition-colors">© 2026 ToolPlus. All rights reserved. Built with passion.</span>
          </div>
          <div className="col-md-6 text-center text-md-end mt-2 mt-md-0">
            <Link to="/privacy" className="text-slate-500 dark:text-slate-400 hover:text-orange-500 dark:hover:text-orange-400 text-decoration-none fs-7 me-3 transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="text-slate-500 dark:text-slate-400 hover:text-orange-500 dark:hover:text-orange-400 text-decoration-none fs-7 transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;