// src/components/ProfileDropdown.jsx
import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const ProfileDropdown = ({ user, isAdmin, logout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    const handleEscape = (event) => {
      if (event.key === 'Escape') setIsOpen(false);
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  const getDisplayName = () => {
    if (user?.firstName || user?.name) return user.firstName || user.name;
    if (user?.email) {
      if (user.email.startsWith('fb_')) return 'Facebook User';
      if (user.email.startsWith('gh_')) return 'GitHub User';
      return user.email.split('@')[0];
    }
    return 'User';
  };

  const getInitials = () => getDisplayName().charAt(0).toUpperCase();

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 hover:bg-slate-100 dark:hover:bg-slate-800 px-3 py-1.5 rounded-2xl transition-all"
      >
        <div className="w-9 h-9 bg-gradient-to-br from-orange-500 to-rose-500 text-white rounded-full flex items-center justify-center font-bold text-lg shadow">
          {getInitials()}
        </div>

        <div className="hidden md:block text-left">
          <div className="font-semibold text-sm">{getDisplayName()}</div>
          {isAdmin && <span className="text-xs text-orange-500 font-bold">ADMIN</span>}
        </div>

        <svg 
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
          fill="none" 
          stroke="currentColor" 
          strokeWidth={3} 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute right-0 mt-3 w-64 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl shadow-2xl py-2 z-50 overflow-hidden"
          >
            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700">
              <p className="font-bold text-lg">{getDisplayName()}</p>
              {user?.email && <p className="text-sm text-slate-500 dark:text-slate-400 truncate">{user.email}</p>}
            </div>

            <Link to="/profile" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-6 py-3 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300">
              👤 My Profile
            </Link>
            <Link to="/orders" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-6 py-3 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300">
              📦 My Orders
            </Link>

            {isAdmin && (
              <Link to="/admin/dashboard" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-6 py-3 hover:bg-orange-50 dark:hover:bg-orange-900/30 text-orange-600 dark:text-orange-400">
                ⚙️ Admin Panel
              </Link>
            )}

            <div className="border-t border-slate-100 dark:border-slate-700 my-2"></div>

            <button
              onClick={() => {
                setIsOpen(false);
                logout();
              }}
              className="flex items-center gap-3 px-6 py-3 w-full text-left text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/30"
            >
              ← Logout
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProfileDropdown;