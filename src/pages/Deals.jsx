import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import DealCard from "../components/DealCard";
import Pagination from "../components/Pagination";
import SkeletonLoader from "../components/SkeletonLoader";
import { getCategories } from "../services/categoryService";
import { getDeals, searchDeals, getDealsByCategoryId } from "../services/dealService";

function Deals() {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get("category");
  const searchParam = searchParams.get("search");
  const pageParam = parseInt(searchParams.get("page")) || 1;

  const [deals, setDeals] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(categoryParam || "");
  const [searchTerm, setSearchTerm] = useState(searchParam || "");
  const [currentPage, setCurrentPage] = useState(pageParam);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("default");

  const pageSize = 6; // Display 6 deals per page

  // Fetch categories list on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data || []);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  // Sync state from query parameters
  useEffect(() => {
    setSelectedCategory(categoryParam || "");
  }, [categoryParam]);

  useEffect(() => {
    setSearchTerm(searchParam || "");
  }, [searchParam]);

  useEffect(() => {
    setCurrentPage(pageParam);
  }, [pageParam]);

  // Main fetch function for deals
  useEffect(() => {
    const fetchDeals = async () => {
      setLoading(true);
      try {
        if (selectedCategory) {
          // Fetch deals in category (not paginated on backend, so we page it on the frontend)
          const allCatDeals = await getDealsByCategoryId(selectedCategory);
          
          // Apply search filtering locally if searchTerm is active
          let filtered = allCatDeals || [];
          if (searchTerm.trim()) {
            const term = searchTerm.toLowerCase();
            filtered = filtered.filter(
              (d) =>
                d.title.toLowerCase().includes(term) ||
                (d.description && d.description.toLowerCase().includes(term)) ||
                (d.shortDescription && d.shortDescription.toLowerCase().includes(term))
            );
          }

          // Apply Sorting
          filtered = sortDeals(filtered, sortBy);

          // Calculate pagination client-side
          setTotalPages(Math.max(1, Math.ceil(filtered.length / pageSize)));
          const startIdx = (currentPage - 1) * pageSize;
          setDeals(filtered.slice(startIdx, startIdx + pageSize));
        } else {
          // Fetch from paginated backend search if no category is selected
          const response = await searchDeals(searchTerm.trim(), currentPage, pageSize);
          
          let fetchedItems = response.items || [];
          // Apply Sorting
          fetchedItems = sortDeals(fetchedItems, sortBy);

          setDeals(fetchedItems);
          setTotalPages(Math.max(1, Math.ceil(response.totalCount / pageSize)));
        }
      } catch (error) {
        console.error("Error fetching deals:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDeals();
  }, [selectedCategory, searchTerm, currentPage, sortBy]);

  const sortDeals = (dealList, sortType) => {
    const list = [...dealList];
    if (sortType === "price-low") {
      return list.sort((a, b) => a.discountPrice - b.discountPrice);
    }
    if (sortType === "price-high") {
      return list.sort((a, b) => b.discountPrice - a.discountPrice);
    }
    if (sortType === "savings") {
      return list.sort((a, b) => {
        const saveA = a.originalPrice - a.discountPrice;
        const saveB = b.originalPrice - b.discountPrice;
        return saveB - saveA;
      });
    }
    if (sortType === "alphabetical") {
      return list.sort((a, b) => a.title.localeCompare(b.title));
    }
    return list; // Default sorting (backend return order)
  };

  const handleCategoryChange = (e) => {
    const val = e.target.value;
    setSelectedCategory(val);
    setCurrentPage(1);
    
    // Update query params
    const params = {};
    if (val) params.category = val;
    if (searchTerm) params.search = searchTerm;
    setSearchParams(params);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setCurrentPage(1);

    const params = {};
    if (selectedCategory) params.category = selectedCategory;
    if (searchTerm) params.search = searchTerm;
    setSearchParams(params);
  };

  const handlePageChange = (pageNum) => {
    setCurrentPage(pageNum);
    
    const params = {};
    if (selectedCategory) params.category = selectedCategory;
    if (searchTerm) params.search = searchTerm;
    if (pageNum > 1) params.page = pageNum;
    setSearchParams(params);

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="deals-page py-4">
      {/* Top Banner / Breadcrumbs */}
      <div className="mb-4">
        <h1 className="fw-extrabold text-slate-900 dark:text-white mb-2 transition-colors">Browse Lifetime Software Deals</h1>
        <p className="text-slate-500 dark:text-slate-400 transition-colors">Find tools and packages to scale your business and automate tasks.</p>
      </div>

      {/* Filter and Search Bar Row */}
      <div className="card border border-slate-100 dark:border-slate-800 shadow-sm p-4 mb-5 rounded-4 bg-slate-50 dark:bg-slate-900 transition-colors">
        <form onSubmit={handleSearchSubmit} className="row g-3">
          {/* Search Input */}
          <div className="col-lg-5 col-md-4">
            <div className="input-group border border-slate-200 dark:border-slate-700 rounded-2 transition-colors">
              <span className="input-group-text bg-white dark:bg-slate-800 border-0 text-slate-400 dark:text-slate-500 ps-3 transition-colors">🔍</span>
              <input
                type="text"
                className="form-control border-0 ps-1 py-2 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 transition-colors focus:ring-0"
                placeholder="Search deals..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Category Dropdown */}
          <div className="col-lg-3 col-md-4">
            <select
              className="form-select py-2 fw-semibold border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 transition-colors"
              value={selectedCategory}
              onChange={handleCategoryChange}
            >
              <option value="">All Categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.dealCount || 0})
                </option>
              ))}
            </select>
          </div>

          {/* Sort By Dropdown */}
          <div className="col-lg-2 col-md-4">
            <select
              className="form-select py-2 fw-semibold border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 transition-colors"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="default">Sort: Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="savings">Discount: Big Savings</option>
              <option value="alphabetical">Name: A-Z</option>
            </select>
          </div>

          {/* Filter Action Buttons */}
          <div className="col-lg-2 col-md-12 d-grid">
            <button type="submit" className="btn btn-primary rounded-pill py-2 fw-bold text-uppercase">
              Filter
            </button>
          </div>
        </form>
      </div>

      {/* Deals Grid */}
      {loading ? (
        <SkeletonLoader type="deal" />
      ) : deals.length === 0 ? (
        <div className="text-center py-5 border border-slate-100 dark:border-slate-800 rounded-4 bg-white dark:bg-slate-900 shadow-sm transition-colors empty-state-container d-flex flex-column align-items-center gap-2">
          <i className="bi bi-tag text-muted" style={{ fontSize: '4rem' }}></i>
          <h4 className="fw-bold text-slate-900 dark:text-white transition-colors">No Deals Found</h4>
          <p className="text-muted mx-auto transition-colors" style={{ maxWidth: "400px" }}>
            We couldn't find any deals matching your criteria. Try adjusting your search term or category filters.
          </p>
          <button
            onClick={() => {
              setSelectedCategory("");
              setSearchTerm("");
              setSearchParams({});
            }}
            className="btn btn-outline-primary rounded-pill px-5 fw-bold mt-3 hover-lift shadow-sm"
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <>
          <div className="row g-4">
            {deals.map((deal) => (
              <div key={deal.id} className="col-lg-4 col-md-6">
                <DealCard deal={deal} />
              </div>
            ))}
          </div>

          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </div>
  );
}

export default Deals;
