"use client";

import { DailyRating } from "@/types/database";
import { format, parseISO } from "date-fns";
import { fr } from "date-fns/locale";

interface RatingHistoryProps {
  ratings: DailyRating[];
}

const ratingColors: Record<number, string> = {
  1: "bg-red-500",
  2: "bg-red-400",
  3: "bg-orange-500",
  4: "bg-orange-400",
  5: "bg-yellow-500",
  6: "bg-yellow-400",
  7: "bg-lime-500",
  8: "bg-green-400",
  9: "bg-green-500",
  10: "bg-emerald-500",
};

export default function RatingHistory({ ratings }: RatingHistoryProps) {
  const sortedRatings = [...ratings].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  if (sortedRatings.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Historique
        </h3>
        <p className="text-gray-500 dark:text-gray-400 text-center py-8">
          Aucune note enregistrée
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Historique
      </h3>
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {sortedRatings.map((rating) => (
          <div
            key={rating.id}
            className="flex items-center gap-4 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50"
          >
            <div
              className={`w-10 h-10 rounded-full ${ratingColors[rating.rating]} flex items-center justify-center text-white font-bold`}
            >
              {rating.rating}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {format(parseISO(rating.date), "EEEE d MMMM yyyy", { locale: fr })}
              </p>
              {rating.reason && (
                <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                  {rating.reason}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
