import React from "react";
import { Link } from "react-router-dom";
import "../styles/CategoryCard.css";

function CategoryCard({ category }) {
  const { id, name, description, dealCount } = category;

  // Modern illustrative icons mapped to category names
  const getCategoryIcon = (catName) => {
    const lowerName = catName.toLowerCase();
    if (lowerName.includes("ai") || lowerName.includes("artificial"))
      return "🤖";
    if (lowerName.includes("marketing") || lowerName.includes("growth"))
      return "📈";
    if (
      lowerName.includes("dev") ||
      lowerName.includes("code") ||
      lowerName.includes("web")
    )
      return "💻";
    if (lowerName.includes("design") || lowerName.includes("art")) return "🎨";
    if (lowerName.includes("productivity") || lowerName.includes("work"))
      return "📚";
    if (lowerName.includes("writing") || lowerName.includes("seo")) return "✍️";
    if (lowerName.includes("video") || lowerName.includes("audio")) return "🎬";
    if (lowerName.includes("sales") || lowerName.includes("crm")) return "🤝";
    return "🚀";
  };

  return (
    // <div className=" border-0 overflow-hidden text-center p-[18px] bg-white dark:bg-slate-900 transition-all duration-300 hover:-translate-y-2 group">
    <div className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200/70 bg-white p-6 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-orange-300 hover:shadow-xl dark:border-slate-700 dark:bg-slate-900 dark:hover:border-orange-500/40">
      <div
        className="
mx-auto
mb-6
flex
h-14
w-14
items-center
justify-center
rounded-full
border
border-slate-200
bg-slate-50
transition-all
duration-300
group-hover:scale-110
group-hover:border-orange-300
group-hover:bg-orange-50
dark:border-slate-700
dark:bg-slate-800
dark:group-hover:border-orange-500/40
dark:group-hover:bg-orange-500/10
"
      >
        <span className="category-icon text-3xl font-bold transition-transform duration-300">
          {getCategoryIcon(name)}
        </span>
      </div>

      <h4 className="font-bold mb-[8px] text-slate-900 dark:text-white transition-colors">
        {name}
      </h4>
      <p className="text-slate-500 dark:text-slate-400 text-truncate-2 text-sm mb-[16px] transition-colors">
        {description || "Explore specialized software deals in this category."}
      </p>

      <div className="mt-auto">
        <span className="
inline-flex
items-center
rounded-full
bg-orange-100
px-5
py-2
text-xs
font-semibold
text-orange-600
dark:bg-orange-500/10
dark:text-orange-400
">
          {dealCount || 0} {dealCount === 1 ? "Deal" : "Deals"} available
        </span>

        <div>
          <Link
            to={`/deals?category=${id}`}
            className="inline-flex items-center gap-1 font-semibold text-slate-800 transition-all duration-200 hover:gap-2 hover:text-orange-500 dark:text-slate-200 dark:hover:text-orange-400"
          >
            Explore Deals &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}

export default CategoryCard;
