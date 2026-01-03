import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { app } from "./firebase";
import { createClient } from "./supabase/client";

const VAPID_KEY = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY;

export async function requestNotificationPermission(): Promise<string | null> {
  if (typeof window === "undefined" || !("Notification" in window)) {
    return null;
  }

  const permission = await Notification.requestPermission();
  if (permission !== "granted") {
    return null;
  }

  try {
    const messaging = getMessaging(app);
    const token = await getToken(messaging, { vapidKey: VAPID_KEY });
    
    if (token) {
      await saveFcmToken(token);
      return token;
    }
  } catch (error) {
    console.error("Error getting FCM token:", error);
  }
  
  return null;
}

async function saveFcmToken(token: string) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return;

  await supabase
    .from("user_fcm_tokens")
    .upsert({ 
      user_id: user.id, 
      fcm_token: token,
      updated_at: new Date().toISOString()
    }, { 
      onConflict: "user_id" 
    });
}

export function setupForegroundNotifications() {
  if (typeof window === "undefined") return;

  try {
    const messaging = getMessaging(app);
    onMessage(messaging, (payload) => {
      if (Notification.permission === "granted") {
        new Notification(payload.notification?.title || "Daily Mood", {
          body: payload.notification?.body,
          icon: "/icon-192.svg",
        });
      }
    });
  } catch (error) {
    console.error("Error setting up foreground notifications:", error);
  }
}

export function scheduleLocalReminder() {
  if (typeof window === "undefined" || !("Notification" in window)) return;
  
  const now = new Date();
  const reminder = new Date();
  reminder.setHours(23, 30, 0, 0);
  
  if (now > reminder) {
    reminder.setDate(reminder.getDate() + 1);
  }
  
  const delay = reminder.getTime() - now.getTime();
  
  setTimeout(async () => {
    const supabase = createClient();
    const today = new Date().toISOString().split("T")[0];
    
    const { data } = await supabase
      .from("daily_ratings")
      .select("id")
      .eq("date", today)
      .single();
    
    if (!data && Notification.permission === "granted") {
      new Notification("Daily Mood 🌟", {
        body: "N'oubliez pas de noter votre journée avant minuit !",
        icon: "/icon-192.svg",
        tag: "daily-reminder",
        requireInteraction: true,
      });
    }
    
    scheduleLocalReminder();
  }, delay);
}
