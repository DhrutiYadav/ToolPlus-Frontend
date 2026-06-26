import React from "react";
import { Link } from "react-router-dom";
import "../styles/CategoryCard.css";

function CategoryCard({ category }) {
  const { id, name, description, dealCount } = category;

  // Modern illustrative icons mapped to category names
  const getCategoryIcon = (catName) => {
    const lowerName = catName.toLowerCase();
    if (lowerName.includes("ai") || lowerName.includes("artificial")) return "🤖";
    if (lowerName.includes("marketing") || lowerName.includes("growth")) return "📈";
    if (lowerName.includes("dev") || lowerName.includes("code") || lowerName.includes("web")) return "💻";
    if (lowerName.includes("design") || lowerName.includes("art")) return "🎨";
    if (lowerName.includes("productivity") || lowerName.includes("work")) return "📚";
    if (lowerName.includes("writing") || lowerName.includes("seo")) return "✍️";
    if (lowerName.includes("video") || lowerName.includes("audio")) return "🎬";
    if (lowerName.includes("sales") || lowerName.includes("crm")) return "🤝";
    return "🚀";
  };

  return (
    <div className="card category-card h-100 shadow-sm hover:shadow-xl border-0 overflow-hidden text-center p-[18px] bg-white dark:bg-slate-900 transition-all duration-300 hover:-translate-y-2 group">
      <div className="category-icon-wrapper mb-3 mx-auto bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-circle d-flex align-items-center justify-content-center transition-all duration-300 group-hover:bg-orange-50 dark:group-hover:bg-orange-500/10 group-hover:border-orange-200 dark:group-hover:border-orange-500/30 group-hover:scale-110">
        <span className="category-icon fs-2 transition-transform duration-300">{getCategoryIcon(name)}</span>
      </div>
      
      <h4 className="fw-bold mb-[8px] text-slate-900 dark:text-white transition-colors">{name}</h4>
      <p className="text-slate-500 dark:text-slate-400 text-truncate-2 fs-7 mb-[16px] transition-colors">{description || "Explore specialized software deals in this category."}</p>
      
      <div className="mt-auto">
        <span className="badge bg-orange-500 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400 border border-orange-200 dark:border-orange-500/30 px-3 py-1.5 rounded-pill fw-bold mb-[8px] d-inline-block transition-colors">
          {dealCount || 0} {dealCount === 1 ? "Deal" : "Deals"} available
        </span>
        
        <div>
          <Link to={`/deals?category=${id}`} className="btn btn-link text-decoration-none fw-bold text-slate-800 dark:text-slate-200 category-link hover-primary transition-colors">
            Explore Deals &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}

export default CategoryCard;
