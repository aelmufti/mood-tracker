export interface User {
  id: string;
  email: string;
  created_at: string;
}

export interface DailyRating {
  id: string;
  user_id: string;
  date: string;
  rating: number;
  reason: string | null;
  created_at: string;
}

export interface RatingStats {
  average7Days: number | null;
  average30Days: number | null;
  averageAll: number | null;
  streak: number;
  totalRatings: number;
}
