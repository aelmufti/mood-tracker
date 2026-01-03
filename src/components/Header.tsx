"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { Sun, Moon, LogOut, Download } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { format } from "date-fns";
import NotificationButton from "./NotificationButton";

export default function Header() {
  const { user, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const supabase = createClient();

  const exportCSV = async () => {
    const { data } = await supabase
      .from("daily_ratings")
      .select("*")
      .order("date", { ascending: false });

    if (!data || data.length === 0) return;

    const csv = [
      "Date,Note,Raison",
      ...data.map(
        (r) => `${r.date},${r.rating},"${(r.reason || "").replace(/"/g, '""')}"`
      ),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `notes-${format(new Date(), "yyyy-MM-dd")}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm">
      <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold text-primary-600 dark:text-primary-400">
          Daily Mood
        </h1>
        <div className="flex items-center gap-2">
          <NotificationButton />
          <button
            onClick={exportCSV}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300"
            title="Exporter CSV"
          >
            <Download className="w-5 h-5" />
          </button>
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300"
            title={theme === "light" ? "Mode sombre" : "Mode clair"}
          >
            {theme === "light" ? (
              <Moon className="w-5 h-5" />
            ) : (
              <Sun className="w-5 h-5" />
            )}
          </button>
          {user && (
            <button
              onClick={signOut}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300"
              title="Déconnexion"
            >
              <LogOut className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
