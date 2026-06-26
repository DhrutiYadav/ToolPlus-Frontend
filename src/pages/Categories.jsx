import React, { useEffect, useState } from "react";
import CategoryCard from "../components/CategoryCard";
import SkeletonLoader from "../components/SkeletonLoader";
import { getCategories, searchCategories } from "../services/categoryService";
import "../styles/Categories.css";

function Categories() {
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        let data;
        if (searchTerm.trim()) {
          data = await searchCategories(searchTerm.trim());
        } else {
          data = await getCategories();
        }
        setCategories(data || []);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };

    const delayDebounceFn = setTimeout(() => {
      fetchCategories();
    }, 300); // Debounce typing

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  return (
    <div className="categories-page py-5">
      {/* Page Header */}
      <div className="text-center mb-5">
        <span className="text-orange-500 fw-bold text-uppercase fs-7 tracking-wider transition-colors">Browse by Field</span>
        <h1 className="fw-extrabold text-slate-900 dark:text-white mt-1 transition-colors">Explore Software Categories</h1>
        <p className="lead text-slate-500 dark:text-slate-400 mx-auto transition-colors categories-copy-width">
          Filter deals by business niche. Find exactly what your project needs from marketing to development.
        </p>
        
        {/* Inline Category Search */}
        <div className="mx-auto mt-4 categories-search-width">
          <div className="input-group shadow-sm rounded-pill overflow-hidden border border-slate-200 dark:border-slate-700 transition-colors">
            <span className="input-group-text bg-white dark:bg-slate-800 border-end-0 text-slate-400 dark:text-slate-500 ps-3 py-2 transition-colors">🔍</span>
            <input
              type="text"
              className="form-control border-start-0 py-2 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 transition-colors focus:ring-0"
              placeholder="Search categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {loading ? (
        <SkeletonLoader type="category" />
      ) : categories.length === 0 ? (
        <div className="text-center py-5 border border-slate-100 dark:border-slate-800 rounded-4 bg-white dark:bg-slate-900 card-shadow transition-colors">
          <div className="bg-orange-50 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400 rounded-circle d-inline-flex align-items-center justify-content-center mb-3 transition-colors categories-empty-icon">
            <span className="fs-3">🗂️</span>
          </div>
          <h4 className="fw-bold text-slate-900 dark:text-white transition-colors">No Categories Found</h4>
          <p className="text-slate-500 dark:text-slate-400 mb-0 transition-colors">No categories matching "{searchTerm}"</p>
        </div>
      ) : (
        <div className="row g-4">
          {categories.map((category) => (
            <div key={category.id} className="col-lg-4 col-md-6">
              <CategoryCard category={category} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Categories;
