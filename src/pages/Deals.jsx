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
  const [totalCount, setTotalCount] = useState(0);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(categoryParam || "");
  const [searchTerm, setSearchTerm] = useState(searchParam || "");
  const [currentPage, setCurrentPage] = useState(pageParam);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("default");
  const [viewMode, setViewMode] = useState("grid"); // 'grid' | 'list'
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Sidebar filter state
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState(categoryParam || "");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [minRating, setMinRating] = useState(0);

  const pageSize = 6;

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

  useEffect(() => { setSelectedCategory(categoryParam || ""); setSelectedCategoryFilter(categoryParam || ""); }, [categoryParam]);
  useEffect(() => { setSearchTerm(searchParam || ""); }, [searchParam]);
  useEffect(() => { setCurrentPage(pageParam); }, [pageParam]);

  useEffect(() => {
    const fetchDeals = async () => {
      setLoading(true);
      try {
        let filtered = [];

        if (selectedCategory || selectedCategoryFilter) {
          const catId = selectedCategoryFilter || selectedCategory;
          const allCatDeals = await getDealsByCategoryId(catId);
          filtered = allCatDeals || [];
        } else {
          const response = await searchDeals(searchTerm.trim(), currentPage, pageSize);
          filtered = response.items || [];
          setTotalPages(Math.max(1, Math.ceil(response.totalCount / pageSize)));
          setTotalCount(response.totalCount || filtered.length);

          filtered = applyLocalFilters(filtered);
          filtered = sortDeals(filtered, sortBy);
          setDeals(filtered);
          setLoading(false);
          return;
        }

        if (searchTerm.trim()) {
          const term = searchTerm.toLowerCase();
          filtered = filtered.filter(d =>
            d.title.toLowerCase().includes(term) ||
            (d.description && d.description.toLowerCase().includes(term)) ||
            (d.shortDescription && d.shortDescription.toLowerCase().includes(term))
          );
        }

        filtered = applyLocalFilters(filtered);
        filtered = sortDeals(filtered, sortBy);

        setTotalCount(filtered.length);
        setTotalPages(Math.max(1, Math.ceil(filtered.length / pageSize)));
        const startIdx = (currentPage - 1) * pageSize;
        setDeals(filtered.slice(startIdx, startIdx + pageSize));
      } catch (error) {
        console.error("Error fetching deals:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDeals();
  }, [selectedCategory, selectedCategoryFilter, searchTerm, currentPage, sortBy, minPrice, maxPrice, minRating]);

  const applyLocalFilters = (list) => {
    let result = [...list];
    if (minPrice !== "") result = result.filter(d => d.discountPrice >= parseFloat(minPrice));
    if (maxPrice !== "") result = result.filter(d => d.discountPrice <= parseFloat(maxPrice));
    if (minRating > 0) result = result.filter(d => (d.averageRating || 0) >= minRating);
    return result;
  };

  const sortDeals = (dealList, sortType) => {
    const list = [...dealList];
    if (sortType === "price-low") return list.sort((a, b) => a.discountPrice - b.discountPrice);
    if (sortType === "price-high") return list.sort((a, b) => b.discountPrice - a.discountPrice);
    if (sortType === "savings") return list.sort((a, b) => (b.originalPrice - b.discountPrice) - (a.originalPrice - a.discountPrice));
    if (sortType === "highest-rated") return list.sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0));
    if (sortType === "alphabetical") return list.sort((a, b) => a.title.localeCompare(b.title));
    return list;
  };

  const handleClearFilters = () => {
    setSelectedCategoryFilter("");
    setSelectedCategory("");
    setMinPrice("");
    setMaxPrice("");
    setMinRating(0);
    setSearchTerm("");
    setCurrentPage(1);
    setSearchParams({});
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    const params = {};
    if (selectedCategoryFilter) params.category = selectedCategoryFilter;
    if (searchTerm) params.search = searchTerm;
    setSearchParams(params);
  };

  const handlePageChange = (pageNum) => {
    setCurrentPage(pageNum);
    const params = {};
    if (selectedCategoryFilter) params.category = selectedCategoryFilter;
    if (searchTerm) params.search = searchTerm;
    if (pageNum > 1) params.page = pageNum;
    setSearchParams(params);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const FilterPanel = () => (
    <div className="flex flex-col gap-4">
      {/* Category Filter */}
      <div>
        <h6 className="font-bold text-slate-900 dark:text-white text-sm mb-6 uppercase tracking-wider transition-colors">Category</h6>
        <div className="flex flex-col gap-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="catFilter"
              checked={selectedCategoryFilter === ""}
              onChange={() => setSelectedCategoryFilter("")}
              className="form-check-input mt-0 accent-orange-500"
            />
            <span className="text-slate-700 dark:text-slate-300 text-sm transition-colors">All Categories</span>
          </label>
          {categories.map(cat => (
            <label key={cat.id} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="catFilter"
                checked={selectedCategoryFilter === cat.id.toString()}
                onChange={() => setSelectedCategoryFilter(cat.id.toString())}
                className="form-check-input mt-0"
              />
              <span className="text-slate-700 dark:text-slate-300 text-sm transition-colors">{cat.name}</span>
              <span className="ml-auto text-slate-400 dark:text-slate-500 text-xs">({cat.dealCount || 0})</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h6 className="font-bold text-slate-900 dark:text-white text-sm mb-6 uppercase tracking-wider transition-colors">Price Range</h6>
        <div className="flex gap-2">
          <input
            type="number"
            className="form-control py-1 px-2 bg-white dark:bg-slate-800 text-slate-900 dark:text-white border-slate-200 dark:border-slate-700 transition-colors"
            placeholder="Min ₹"
            value={minPrice}
            onChange={e => setMinPrice(e.target.value)}
            style={{ fontSize: 13 }}
          />
          <input
            type="number"
            className="form-control py-1 px-2 bg-white dark:bg-slate-800 text-slate-900 dark:text-white border-slate-200 dark:border-slate-700 transition-colors"
            placeholder="Max ₹"
            value={maxPrice}
            onChange={e => setMaxPrice(e.target.value)}
            style={{ fontSize: 13 }}
          />
        </div>
      </div>

      {/* Rating Filter */}
      <div>
        <h6 className="font-bold text-slate-900 dark:text-white text-sm mb-6 uppercase tracking-wider transition-colors">Min Rating</h6>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map(star => (
            <button
              key={star}
              onClick={() => setMinRating(minRating === star ? 0 : star)}
              className={`btn btn-sm rounded-full p-0 flex items-center justify-center transition-all ${
                minRating >= star ? "bg-warning border-warning text-white" : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400"
              }`}
              style={{ width: 32, height: 32, fontSize: 14 }}
              title={`${star} star${star > 1 ? 's' : ''}`}
            >
              ★
            </button>
          ))}
        </div>
        {minRating > 0 && <small className="text-slate-500 dark:text-slate-400 mt-1 block">{minRating}+ stars</small>}
      </div>

      {/* Clear All */}
      <button
        onClick={handleClearFilters}
        className="btn w-full rounded-full font-bold py-2 border-0 text-white"
        style={{ background: "linear-gradient(to right, #f97316, #ea580c)" }}
      >
        <i className="bi bi-x-circle mr-2"></i>Clear All Filters
      </button>
    </div>
  );

  return (
    <div className="deals-page py-6">
      {/* Mobile Filters Bottom Drawer */}
      {showMobileFilters && (
        <div className="lg:hidden">
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setShowMobileFilters(false)}
            style={{ zIndex: 1040 }}
          />
          <div
            className="fixed bottom-0 start-0 w-full bg-white dark:bg-slate-900 rounded-t-2xl p-6 transition-colors"
            style={{ zIndex: 1050, maxHeight: "80vh", overflowY: "auto" }}
          >
            <div className="flex justify-between items-center mb-6">
              <h5 className="font-bold text-slate-900 dark:text-white mb-0 transition-colors">Filters</h5>
              <button
                className="btn btn-link text-slate-500 dark:text-slate-400 p-0 transition-colors"
                onClick={() => setShowMobileFilters(false)}
              >
                <i className="bi bi-x-lg text-lg"></i>
              </button>
            </div>
            <FilterPanel />
          </div>
        </div>
      )}

      {/* Top Banner */}
      <div className="mb-6">
        <h1 className="font-extrabold text-slate-900 dark:text-white mb-2 transition-colors">Browse Lifetime Software Deals</h1>
        <p className="text-slate-500 dark:text-slate-400 transition-colors">Find tools and packages to scale your business and automate tasks.</p>
      </div>

      {/* Search & Sort Bar */}
      <div className="flex flex-col relative min-w-0 break-words border border-slate-100 dark:border-slate-800 shadow-sm p-6 mb-6 rounded-2xl bg-slate-50 dark:bg-slate-900 transition-colors">
        <form onSubmit={handleSearchSubmit} className="flex flex-wrap -mx-6 gap-4 items-center">
          <div className="col-lg-5 col-md-5">
            <div className="input-group border border-slate-200 dark:border-slate-700 rounded-full overflow-hidden transition-colors focus-within:border-orange-400 focus-within:shadow-md">
              <span className="input-group-text bg-white dark:bg-slate-800 border-0 text-slate-400 dark:text-slate-500 pl-4 transition-colors">
                <i className="bi bi-search"></i>
              </span>
              <input
                type="text"
                className="form-control border-0 pl-1 py-2 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 transition-colors focus:ring-0"
                placeholder="Search deals..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="col-lg-3 col-md-4">
            <select
              className="form-select py-2 font-semibold border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 transition-colors rounded-full"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="default">Sort: Newest</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="highest-rated">Highest Rated</option>
              <option value="savings">Big Savings First</option>
            </select>
          </div>

          <div className="col-lg-2 col-md-3 grid">
            <button type="submit" className="btn btn-primary rounded-full py-2 font-bold uppercase border-0 shadow-sm">
              Search
            </button>
          </div>

          {/* View toggle + Mobile filter */}
          <div className="col-auto flex gap-2 ml-auto">
            {/* Mobile filter toggle */}
            <button
              type="button"
              className="btn btn-outline-secondary rounded-full lg:hidden font-semibold"
              onClick={() => setShowMobileFilters(true)}
            >
              <i className="bi bi-funnel mr-1"></i>Filters
            </button>

            {/* View toggle buttons */}
            <div className="btn-group" role="group" aria-label="View mode">
              <button
                type="button"
                className={`btn rounded-l-full font-bold ${viewMode === "grid" ? "btn-primary border-0" : "btn-outline-secondary"}`}
                onClick={() => setViewMode("grid")}
                title="Grid view"
              >
                <i className="bi bi-grid-3x3-gap-fill"></i>
              </button>
              <button
                type="button"
                className={`btn rounded-r-full font-bold ${viewMode === "list" ? "btn-primary border-0" : "btn-outline-secondary"}`}
                onClick={() => setViewMode("list")}
                title="List view"
              >
                <i className="bi bi-list-ul"></i>
              </button>
            </div>
          </div>
        </form>
      </div>

      <div className="flex flex-wrap -mx-6 gap-6">
        {/* Sidebar Filters — Desktop */}
        <div className="col-lg-3 hidden lg:block">
          <div className="flex flex-col relative min-w-0 break-words border border-slate-100 dark:border-slate-800 shadow-sm p-6 rounded-2xl bg-white dark:bg-slate-900 sticky transition-colors" style={{ top: 80 }}>
            <FilterPanel />
          </div>
        </div>

        {/* Main content */}
        <div className="col-lg-9">
          {/* Results count */}
          {!loading && (
            <div className="flex items-center justify-between mb-6">
              <p className="text-slate-500 dark:text-slate-400 font-medium mb-0 text-sm transition-colors">
                <span className="text-slate-900 dark:text-white font-bold">{totalCount}</span> results found
              </p>
            </div>
          )}

          {loading ? (
            <SkeletonLoader type="deal" />
          ) : deals.length === 0 ? (
            <div className="text-center py-12 border border-slate-100 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900 shadow-sm transition-colors empty-state-container flex flex-col items-center gap-3">
              {/* Illustrated SVG */}
              <svg width="120" height="100" viewBox="0 0 120 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="20" y="30" width="80" height="50" rx="8" fill="#f1f5f9"/>
                <rect x="30" y="42" width="60" height="6" rx="3" fill="#e2e8f0"/>
                <rect x="30" y="54" width="40" height="6" rx="3" fill="#e2e8f0"/>
                <circle cx="90" cy="28" r="18" fill="#fef3c7"/>
                <path d="M90 20v8l5 3" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="90" cy="28" r="12" stroke="#f59e0b" strokeWidth="2" fill="none"/>
                <path d="M88 36l5-5" stroke="#f97316" strokeWidth="2.5" strokeLinecap="round"/>
                <circle cx="95" cy="39" r="3" fill="#f97316" opacity="0.6"/>
              </svg>
              <h4 className="font-bold text-slate-900 dark:text-white transition-colors mb-1">No Deals Found</h4>
              <p className="text-muted mx-auto transition-colors" style={{ maxWidth: "360px" }}>
                We couldn't find any deals matching your criteria. Try adjusting your search term or filters.
              </p>
              <button
                onClick={handleClearFilters}
                className="btn btn-primary rounded-full px-12 font-bold mt-2 hover-lift shadow-sm border-0"
                style={{ background: "linear-gradient(to right, #f97316, #ea580c)" }}
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <>
              {viewMode === "grid" ? (
                <div className="flex flex-wrap -mx-6 gap-6">
                  {deals.map((deal) => (
                    <div key={deal.id} className="col-lg-4 col-md-6">
                      <DealCard deal={deal} />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {deals.map((deal) => (
                    <div key={deal.id} className="flex flex-col relative min-w-0 break-words border border-slate-100 dark:border-slate-800 shadow-sm rounded-2xl bg-white dark:bg-slate-900 transition-colors hover-lift overflow-hidden">
                      <div className="flex items-center p-6 gap-3">
                        <img
                          src={deal.imageSrc || "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=200&auto=format&fit=crop&q=60"}
                          alt={deal.title}
                          className="rounded-lg object-cover"
                          style={{ width: 80, height: 80, flexShrink: 0 }}
                          onError={e => { e.target.src = "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=200&auto=format&fit=crop&q=60"; }}
                        />
                        <div className="grow">
                          <h6 className="font-bold text-slate-900 dark:text-white mb-1 transition-colors">{deal.title}</h6>
                          <p className="text-slate-500 dark:text-slate-400 text-xs mb-1 line-clamp-1 transition-colors">{deal.shortDescription}</p>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-orange-500">₹{deal.discountPrice.toFixed(2)}</span>
                            <span className="line-through text-slate-400 dark:text-slate-500 text-xs">₹{deal.originalPrice.toFixed(2)}</span>
                          </div>
                        </div>
                        <a href={`/deals/${deal.id}`} className="btn btn-primary btn-sm rounded-full px-6 font-bold border-0" style={{ background: "linear-gradient(to right, #f97316, #ea580c)", whiteSpace: "nowrap" }}>
                          View Deal →
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Deals;
