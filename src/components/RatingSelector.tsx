"use client";

import { useState } from "react";

interface RatingSelectorProps {
  value: number | null;
  onChange: (rating: number) => void;
  disabled?: boolean;
}

const ratingColors: Record<number, string> = {
  1: "bg-red-500 hover:bg-red-600",
  2: "bg-red-400 hover:bg-red-500",
  3: "bg-orange-500 hover:bg-orange-600",
  4: "bg-orange-400 hover:bg-orange-500",
  5: "bg-yellow-500 hover:bg-yellow-600",
  6: "bg-yellow-400 hover:bg-yellow-500",
  7: "bg-lime-500 hover:bg-lime-600",
  8: "bg-green-400 hover:bg-green-500",
  9: "bg-green-500 hover:bg-green-600",
  10: "bg-emerald-500 hover:bg-emerald-600",
};

export default function RatingSelector({ value, onChange, disabled }: RatingSelectorProps) {
  const [hoveredRating, setHoveredRating] = useState<number | null>(null);

  return (
    <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((rating) => (
        <button
          key={rating}
          type="button"
          disabled={disabled}
          onClick={() => onChange(rating)}
          onMouseEnter={() => setHoveredRating(rating)}
          onMouseLeave={() => setHoveredRating(null)}
          className={`rating-btn text-white ${
            value === rating
              ? `${ratingColors[rating]} ring-2 ring-offset-2 ring-offset-white dark:ring-offset-gray-900 ring-current scale-110`
              : hoveredRating === rating
              ? ratingColors[rating]
              : "bg-gray-300 dark:bg-gray-600 hover:bg-gray-400"
          } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          {rating}
        </button>
      ))}
    </div>
  );
}
