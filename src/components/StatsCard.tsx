"use client";

import { RatingStats } from "@/types/database";
import { TrendingUp, Calendar, Flame, BarChart3 } from "lucide-react";

interface StatsCardProps {
  stats: RatingStats;
}

export default function StatsCard({ stats }: StatsCardProps) {
  const formatAverage = (avg: number | null) => 
    avg !== null ? avg.toFixed(1) : "-";

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
        <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 mb-1">
          <Calendar className="w-4 h-4" />
          <span className="text-xs">7 jours</span>
        </div>
        <p className="text-2xl font-bold text-gray-900 dark:text-white">
          {formatAverage(stats.average7Days)}
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
        <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 mb-1">
          <TrendingUp className="w-4 h-4" />
          <span className="text-xs">30 jours</span>
        </div>
        <p className="text-2xl font-bold text-gray-900 dark:text-white">
          {formatAverage(stats.average30Days)}
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
        <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 mb-1">
          <BarChart3 className="w-4 h-4" />
          <span className="text-xs">Global</span>
        </div>
        <p className="text-2xl font-bold text-gray-900 dark:text-white">
          {formatAverage(stats.averageAll)}
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
        <div className="flex items-center gap-2 text-orange-500 mb-1">
          <Flame className="w-4 h-4" />
          <span className="text-xs">Streak</span>
        </div>
        <p className="text-2xl font-bold text-gray-900 dark:text-white">
          {stats.streak} <span className="text-sm font-normal">jours</span>
        </p>
      </div>
    </div>
  );
}
