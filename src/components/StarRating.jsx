import { Star } from "lucide-react";

export default function StarRating({ rating = 0 }) {
  const rounded = Math.round(rating);

  return (
    <div className="flex items-center gap-1">
      {[...Array(5)].map((_, index) => (
        <Star
          key={index}
          size={16}
          className={
            index < rounded
              ? "fill-yellow-400 text-yellow-400"
              : "text-slate-300 dark:text-slate-600"
          }
        />
      ))}
    </div>
  );
}