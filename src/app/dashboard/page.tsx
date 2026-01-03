"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { DailyRating, RatingStats } from "@/types/database";
import { format, subDays, parseISO, differenceInDays } from "date-fns";
import Header from "@/components/Header";
import RatingForm from "@/components/RatingForm";
import StatsCard from "@/components/StatsCard";
import RatingChart from "@/components/RatingChart";
import RatingHistory from "@/components/RatingHistory";
import { Loader2 } from "lucide-react";

export default function DashboardPage() {
  const [todayRating, setTodayRating] = useState<DailyRating | null>(null);
  const [allRatings, setAllRatings] = useState<DailyRating[]>([]);
  const [stats, setStats] = useState<RatingStats>({
    average7Days: null,
    average30Days: null,
    averageAll: null,
    streak: 0,
    totalRatings: 0,
  });
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  const calculateStats = useCallback((ratings: DailyRating[]): RatingStats => {
    if (ratings.length === 0) {
      return { average7Days: null, average30Days: null, averageAll: null, streak: 0, totalRatings: 0 };
    }

    const today = new Date();
    const last7Days = ratings.filter(
      (r) => differenceInDays(today, parseISO(r.date)) < 7
    );
    const last30Days = ratings.filter(
      (r) => differenceInDays(today, parseISO(r.date)) < 30
    );

    const avg = (arr: DailyRating[]) =>
      arr.length > 0 ? arr.reduce((sum, r) => sum + r.rating, 0) / arr.length : null;

    // Calculate streak
    let streak = 0;
    const sortedDates = ratings
      .map((r) => r.date)
      .sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

    const todayStr = format(today, "yyyy-MM-dd");
    const yesterdayStr = format(subDays(today, 1), "yyyy-MM-dd");

    if (sortedDates[0] === todayStr || sortedDates[0] === yesterdayStr) {
      streak = 1;
      for (let i = 1; i < sortedDates.length; i++) {
        const prevDate = parseISO(sortedDates[i - 1]);
        const currDate = parseISO(sortedDates[i]);
        if (differenceInDays(prevDate, currDate) === 1) {
          streak++;
        } else {
          break;
        }
      }
    }

    return {
      average7Days: avg(last7Days),
      average30Days: avg(last30Days),
      averageAll: avg(ratings),
      streak,
      totalRatings: ratings.length,
    };
  }, []);

  const fetchData = useCallback(async () => {
    const today = format(new Date(), "yyyy-MM-dd");

    const [todayResult, allResult] = await Promise.all([
      supabase
        .from("daily_ratings")
        .select("*")
        .eq("date", today)
        .single(),
      supabase
        .from("daily_ratings")
        .select("*")
        .order("date", { ascending: false }),
    ]);

    if (todayResult.data) {
      setTodayRating(todayResult.data);
    }

    if (allResult.data) {
      setAllRatings(allResult.data);
      setStats(calculateStats(allResult.data));
    }

    setLoading(false);
  }, [supabase, calculateStats]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />
      <main className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
          <RatingForm existingRating={todayRating} onSaved={fetchData} />
        </div>

        <StatsCard stats={stats} />

        <RatingChart ratings={allRatings} />

        <RatingHistory ratings={allRatings} />
      </main>
    </div>
  );
}
