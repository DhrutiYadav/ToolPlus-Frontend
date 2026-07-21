import React, { useEffect, useState } from "react";
import CategoryCard from "../components/CategoryCard";
import SkeletonLoader from "../components/SkeletonLoader";
import { getCategories, searchCategories } from "../services/categoryService";

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
    <div className="categories-page py-12">
      {/* Page Header */}
      <div className="text-center mb-12">
        <span className="text-orange-500 font-bold uppercase text-sm tracking-wider transition-colors">
          Browse by Field
        </span>
        <h1 className="font-extrabold text-slate-900 dark:text-white mt-1 transition-colors">
          Explore Software Categories
        </h1>
        <p className="lead text-slate-500 dark:text-slate-400 mx-auto transition-colors mx-auto max-w-2xl">
          Filter deals by business niche. Find exactly what your project needs
          from marketing to development.
        </p>

        {/* Inline Category Search */}
        <div className="mx-auto mt-6 max-w-md">
          <div className="flex items-center rounded-full border border-slate-200 bg-white px-4 py-3 shadow-sm transition-colors dark:border-slate-700 dark:bg-slate-800">
            <span className="mr-3 text-lg text-slate-400 dark:text-slate-500">
              🔍
            </span>

            <input
              type="text"
              placeholder="Search categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-transparent text-slate-900 placeholder:text-slate-400 outline-none dark:text-slate-100 dark:placeholder:text-slate-500"
            />
          </div>
        </div>
      </div>

      {loading ? (
        <SkeletonLoader type="category" />
      ) : categories.length === 0 ? (
        <div className="text-center py-12 border border-slate-100 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900 card-shadow transition-colors">
          <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-orange-50 text-orange-600 transition-colors dark:bg-orange-500/10 dark:text-orange-400">
            <span className="text-2xl font-bold">🗂️</span>
          </div>
          <h4 className="font-bold text-slate-900 dark:text-white transition-colors">
            No Categories Found
          </h4>
          <p className="text-slate-500 dark:text-slate-400 mb-0 transition-colors">
            No categories matching "{searchTerm}"
          </p>
        </div>
      ) : (
        <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-3">
          {categories.map((category) => (
            <div key={category.id}>
              <CategoryCard category={category} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Categories;
