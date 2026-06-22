import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useLogout } from "../hooks/useLogout";
import { useCart } from "../context/CartContext";
import ThemeToggle from "./ThemeToggle";
import NotificationBell from "./NotificationBell";
import "../styles/Navbar.css";

function Navbar() {
  const { user, isAdmin } = useAuth();
  const { cartCount } = useCart();
  const logout = useLogout();
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const urlSearch = searchParams.get("search") || "";
  
  const [navSearch, setNavSearch] = useState(urlSearch);
  const [scrolled, setScrolled] = useState(false);

  // Sync navSearch with URL if it changes externally
  useEffect(() => {
    setNavSearch(urlSearch);
  }, [urlSearch]);

  // Add scroll shadow effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 8);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (navSearch.trim()) {
      navigate(`/deals?search=${encodeURIComponent(navSearch.trim())}`);
    } else {
      navigate("/deals");
    }
  };

  const isActive = (path) => location.pathname === path ? "active" : "";

  return (
    <nav className={`navbar navbar-expand-lg sticky-top bg-[#ffffff] dark:!bg-slate-900 border-b border-slate-100 dark:border-slate-800 py-2 transition-colors duration-300 ${scrolled ? 'scrolled' : ''}`}>
      <div className="container px-3 px-lg-4">
        {/* Brand/Logo */}
        <Link to="/" className="navbar-brand d-flex align-items-center me-3">
            <img
              src="/logo/logo-horizontal.png"
              alt="ToolPlus Logo"
              className="img-fluid dark:hidden"
              style={{ maxHeight: "48px", width: "auto" }}
            />
            <img
              src="/logo/dark-horizontal-logo.png"
              alt="ToolPlus Logo"
              className="img-fluid hidden dark:block"
              style={{ maxHeight: "48px", width: "auto" }}
            />
        </Link>

        {/* Toggle Button for Mobile */}
        <button
          className="navbar-toggler border-0 dark:invert p-2"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarContent"
          aria-controls="navbarContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Navbar Content */}
        <div className="collapse navbar-collapse" id="navbarContent">
          <form className="d-flex mx-auto my-2 my-lg-0 navbar-search-form px-lg-3" onSubmit={handleSearchSubmit}>
            <div className="input-group search-group rounded-pill overflow-hidden border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 transition-all duration-300 focus-within:shadow-sm focus-within:border-orange-300 dark:focus-within:border-orange-500/50">
              <span className="input-group-text border-0 px-3 bg-transparent d-flex align-items-center !text-slate-400 dark:!text-slate-500">
                <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </span>
              <input
                type="text"
                className="form-control border-0 py-2 pe-4 ps-0 navbar-search-input bg-transparent !text-slate-900 dark:!text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:ring-0"
                placeholder="Search software deals..."
                value={navSearch}
                onChange={(e) => setNavSearch(e.target.value)}
              />
            </div>
          </form>

          {/* Right Links */}
          <ul className="navbar-nav align-items-lg-center ms-auto gap-lg-1">
            <li className="nav-item">
              <Link to="/deals" className={`nav-link fw-bold px-3 !text-slate-700 dark:!text-slate-300 hover:!text-orange-500 dark:hover:!text-orange-400 transition-colors ${isActive("/deals")}`}>
                Browse Deals
              </Link>
            </li>
            <li className="nav-item">
              <Link to="/categories" className={`nav-link fw-bold px-3 !text-slate-700 dark:!text-slate-300 hover:!text-orange-500 dark:hover:!text-orange-400 transition-colors ${isActive("/categories")}`}>
                Categories
              </Link>
            </li>

            {user ? (
              <>
                <li className="nav-item">
                  <NotificationBell />
                </li>
                <li className="nav-item ms-lg-1 mt-2 mt-lg-0">
                  <Link to="/cart" className="nav-link d-flex align-items-center cart-link py-2 px-3 rounded-pill !text-slate-700 dark:!text-slate-300 bg-slate-50 dark:bg-slate-800 hover:bg-orange-50 dark:hover:bg-slate-700 hover:!text-orange-600 transition-all hover-lift">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    {cartCount > 0 && (
                      <span className="cart-badge ms-1 fw-bold d-flex align-items-center justify-content-center bg-orange-500 text-white rounded-circle shadow-sm" style={{ width: '20px', height: '20px', fontSize: '0.7rem' }}>
                        {cartCount}
                      </span>
                    )}
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/orders" className={`nav-link fw-bold px-3 !text-slate-700 dark:!text-slate-300 hover:!text-orange-500 dark:hover:!text-orange-400 transition-colors ${isActive("/orders")}`}>
                    My Orders
                  </Link>
                </li>
                
                {/* Theme Toggle */}
                <li className="nav-item d-flex align-items-center ms-lg-1">
                  <ThemeToggle />
                </li>

                {/* User Dropdown Profile / Logout */}
                <li className="nav-item dropdown ms-lg-2 mt-2 mt-lg-0">
                  <a
                    className="nav-link dropdown-toggle rounded-pill px-3 py-2 fw-semibold d-flex flex-nowrap align-items-center border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 !text-slate-700 dark:!text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors text-nowrap"
                    href="#"
                    id="navbarUserDropdown"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <span className="bg-gradient-to-br from-orange-400 to-orange-600 text-white rounded-circle d-flex align-items-center justify-content-center me-2" style={{ width: '26px', height: '26px', fontSize: '0.75rem', fontWeight: 700 }}>
                      {user.email?.charAt(0).toUpperCase()}
                    </span>
                    <span className="user-email-text">{user.email?.split("@")[0]}</span>
                    {isAdmin && (
                      <span className="badge bg-orange-500 text-uppercase ms-2 admin-badge">
                        Admin
                      </span>
                    )}
                  </a>
                  <ul className="dropdown-menu dropdown-menu-end border border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-lg mt-2 p-2 rounded-3" aria-labelledby="navbarUserDropdown">
                    <li>
                      <Link to="/orders" className="dropdown-item py-2 rounded-2 fw-semibold !text-slate-700 dark:!text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                        📦 My Orders
                      </Link>
                    </li>
                    <li>
                      <Link to="/my-reviews" className="dropdown-item py-2 rounded-2 fw-semibold !text-slate-700 dark:!text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                        ⭐ My Reviews
                      </Link>
                    </li>
                    <li>
                      <Link to="/profile" className="dropdown-item py-2 rounded-2 fw-semibold !text-slate-700 dark:!text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                        ⚙️ Profile Settings
                      </Link>
                    </li>
                    {isAdmin && (
                      <li>
                        <Link to="/admin/dashboard" className="dropdown-item py-2 rounded-2 fw-semibold !text-orange-500 dark:!text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-500/10 transition-colors">
                          🛡️ Admin Panel
                        </Link>
                      </li>
                    )}
                    <li>
                      <hr className="dropdown-divider border-slate-100 dark:border-slate-700 my-1" />
                    </li>
                    <li>
                      <button className="dropdown-item py-2 !text-rose-500 rounded-2 fw-semibold hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors" onClick={logout}>
                        🚪 Logout
                      </button>
                    </li>
                  </ul>
                </li>
              </>
            ) : (
              <div className="d-flex align-items-center mt-3 mt-lg-0 ms-lg-3 gap-2">
                {/* Theme Toggle for unauthenticated users */}
                <ThemeToggle />
                <Link to="/login" className="btn btn-link text-decoration-none fw-bold !text-slate-700 dark:!text-slate-300 hover:!text-orange-500 dark:hover:!text-orange-400 transition-colors">
                  Log In
                </Link>
                <Link to="/register" className="btn btn-primary rounded-pill px-4 fw-bold shadow-sm hover-lift">
                  Sign Up
                </Link>
              </div>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
