"use client";

import { DailyRating } from "@/types/database";
import { format, parseISO } from "date-fns";
import { fr } from "date-fns/locale";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useTheme } from "@/contexts/ThemeContext";

interface RatingChartProps {
  ratings: DailyRating[];
}

export default function RatingChart({ ratings }: RatingChartProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const data = [...ratings]
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(-30)
    .map((r) => ({
      date: format(parseISO(r.date), "dd/MM", { locale: fr }),
      rating: r.rating,
      fullDate: format(parseISO(r.date), "EEEE d MMMM", { locale: fr }),
    }));

  if (data.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Évolution des notes
        </h3>
        <p className="text-gray-500 dark:text-gray-400 text-center py-8">
          Pas encore de données à afficher
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Évolution des notes (30 derniers jours)
      </h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke={isDark ? "#374151" : "#e5e7eb"}
            />
            <XAxis
              dataKey="date"
              stroke={isDark ? "#9ca3af" : "#6b7280"}
              fontSize={12}
            />
            <YAxis
              domain={[1, 10]}
              ticks={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]}
              stroke={isDark ? "#9ca3af" : "#6b7280"}
              fontSize={12}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: isDark ? "#1f2937" : "#ffffff",
                border: "none",
                borderRadius: "8px",
                boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
              }}
              labelStyle={{ color: isDark ? "#f3f4f6" : "#111827" }}
              formatter={(value: number) => [value, "Note"]}
              labelFormatter={(label, payload) =>
                payload[0]?.payload?.fullDate || label
              }
            />
            <Line
              type="monotone"
              dataKey="rating"
              stroke="#0ea5e9"
              strokeWidth={2}
              dot={{ fill: "#0ea5e9", strokeWidth: 2 }}
              activeDot={{ r: 6, fill: "#0ea5e9" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
