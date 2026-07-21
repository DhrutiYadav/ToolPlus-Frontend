// src/components/Navbar.jsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useLogout } from "../hooks/useLogout";
import ThemeToggle from "./ThemeToggle";
import NotificationBell from "./NotificationBell";
import ProfileDropdown from "./ProfileDropdown";

function Navbar() {
  const { user, isAdmin } = useAuth();
  const { cartCount } = useCart();
  const logout = useLogout();
  const navigate = useNavigate();
  const location = useLocation();

  const [navSearch, setNavSearch] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setNavSearch(params.get("search") || "");
  }, [location.search]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
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

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-300 border-b backdrop-blur-md ${
        scrolled
          ? "bg-white/95 dark:bg-slate-950/95 shadow-sm border-slate-200 dark:border-slate-800"
          : "bg-white dark:bg-slate-950 border-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo - Square on Mobile, Horizontal on Desktop */}
          <Link to="/" className="flex items-center flex-shrink-0">
            {/* Mobile Square Logo - Light */}
            <img
              src="/logo/logo-square.png"
              alt="ToolPlus"
              className="h-9 block md:hidden dark:hidden"
            />

            {/* Mobile Square Logo - Dark */}
            <img
              src="/logo/logo-square-dark.png"
              alt="ToolPlus"
              className="h-9 hidden dark:block md:dark:hidden"
            />

            {/* Desktop Horizontal Logo - Light */}
            <img
              src="/logo/logo-horizontal.png"
              alt="ToolPlus"
              className="hidden h-9 md:block dark:hidden"
            />

            {/* Desktop Horizontal Logo - Dark */}
            <img
              src="/logo/dark-horizontal-logo.png"
              alt="ToolPlus"
              className="hidden h-9 md:dark:block"
            />
          </Link>

          {/* Search Bar */}
          <form
            onSubmit={handleSearchSubmit}
            className="hidden md:flex flex-1 max-w-xl mx-6"
          >
            <div className="relative w-full">
              <input
                type="text"
                value={navSearch}
                onChange={(e) => setNavSearch(e.target.value)}
                placeholder="Search lifetime deals..."
                className="w-full pl-12 py-3 bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-2xl focus:outline-none focus:border-orange-500 text-sm"
              />
              <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400">
                🔍
              </div>
            </div>
          </form>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-700 dark:text-slate-300">
            <Link
              to="/deals"
              className="hover:text-orange-500 transition-colors"
            >
              Deals
            </Link>
            <Link
              to="/categories"
              className="hover:text-orange-500 transition-colors"
            >
              Categories
            </Link>
            {user && (
              <Link
                to="/orders"
                className="hover:text-orange-500 transition-colors"
              >
                My Orders
              </Link>
            )}
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-4 md:gap-5">
            {/* <ThemeToggle /> */}

            {user ? (
              <div className="flex items-center gap-4 md:gap-6">
                <NotificationBell />

                <Link
                  to="/cart"
                  className="relative text-2xl hover:text-orange-500 transition-colors"
                >
                  🛒
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                      {cartCount}
                    </span>
                  )}
                </Link>

                <ThemeToggle />
                <ProfileDropdown
                  user={user}
                  isAdmin={isAdmin}
                  logout={logout}
                />
                
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-4">
                <ThemeToggle />
                <Link to="/login" className="font-medium hover:text-orange-500">
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2.5 rounded-2xl font-medium text-sm"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden text-3xl text-slate-700 dark:text-slate-300"
            >
              {isMobileMenuOpen ? "✕" : "☰"}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-6 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
            <div className="flex flex-col gap-4 px-4">
              <Link to="/deals" className="py-3 text-lg">
                Deals
              </Link>
              <Link to="/categories" className="py-3 text-lg">
                Categories
              </Link>
              {user && (
                <Link to="/orders" className="py-3 text-lg">
                  My Orders
                </Link>
              )}
              {!user && (
                <>
                  <Link to="/login" className="py-3 text-lg">
                    Login
                  </Link>
                  <Link to="/register" className="py-3 text-lg">
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;