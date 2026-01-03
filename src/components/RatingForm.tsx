"use client";

import { useState, useEffect } from "react";
import { format, isToday, parseISO } from "date-fns";
import { fr } from "date-fns/locale";
import { createClient } from "@/lib/supabase/client";
import { DailyRating } from "@/types/database";
import RatingSelector from "./RatingSelector";
import { Loader2, Check, AlertCircle } from "lucide-react";

interface RatingFormProps {
  existingRating?: DailyRating | null;
  onSaved?: () => void;
}

export default function RatingForm({ existingRating, onSaved }: RatingFormProps) {
  const [rating, setRating] = useState<number | null>(existingRating?.rating ?? null);
  const [reason, setReason] = useState(existingRating?.reason ?? "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const supabase = createClient();

  const today = format(new Date(), "yyyy-MM-dd");
  const canEdit = !existingRating || isToday(parseISO(existingRating.date));

  useEffect(() => {
    if (existingRating) {
      setRating(existingRating.rating);
      setReason(existingRating.reason ?? "");
    }
  }, [existingRating]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rating) return;

    if (rating === 10 && !reason.trim()) {
      setError("Pourquoi cette journée est un 10/10 ? Ce champ est obligatoire.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Non authentifié");

      const ratingData = {
        user_id: user.id,
        date: today,
        rating,
        reason: rating === 10 ? reason.trim() : reason.trim() || null,
      };

      if (existingRating) {
        const { error } = await supabase
          .from("daily_ratings")
          .update(ratingData)
          .eq("id", existingRating.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("daily_ratings")
          .insert(ratingData);
        if (error) throw error;
      }

      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
      onSaved?.();
    } catch (err: any) {
      setError(err.message || "Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          {existingRating ? "Modifier votre note" : "Comment s'est passée votre journée ?"}
        </h2>
        <p className="text-gray-500 dark:text-gray-400">
          {format(new Date(), "EEEE d MMMM yyyy", { locale: fr })}
        </p>
      </div>

      <RatingSelector value={rating} onChange={setRating} disabled={!canEdit || loading} />

      {rating === 10 && (
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Pourquoi cette journée est un 10/10 ? <span className="text-red-500">*</span>
          </label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            disabled={!canEdit || loading}
            placeholder="Décrivez ce qui a rendu cette journée parfaite..."
            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
            rows={3}
          />
        </div>
      )}

      {rating && rating < 10 && (
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Note (optionnel)
          </label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            disabled={!canEdit || loading}
            placeholder="Ajoutez une note sur votre journée..."
            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
            rows={3}
          />
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 text-red-500 text-sm">
          <AlertCircle className="w-4 h-4" />
          {error}
        </div>
      )}

      {canEdit && (
        <button
          type="submit"
          disabled={!rating || loading}
          className="w-full py-3 px-4 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : success ? (
            <>
              <Check className="w-5 h-5" />
              Enregistré !
            </>
          ) : existingRating ? (
            "Modifier"
          ) : (
            "Enregistrer"
          )}
        </button>
      )}

      {!canEdit && (
        <p className="text-center text-gray-500 dark:text-gray-400 text-sm">
          Vous ne pouvez plus modifier cette note car la journée est passée.
        </p>
      )}
    </form>
  );
}
