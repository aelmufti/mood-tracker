"use client";

import { useState, useEffect } from "react";
import { Bell, BellOff } from "lucide-react";
import { requestNotificationPermission, setupForegroundNotifications, scheduleLocalReminder } from "@/lib/notifications";

export default function NotificationButton() {
  const [permission, setPermission] = useState<NotificationPermission>("default");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && "Notification" in window) {
      setPermission(Notification.permission);
      
      if (Notification.permission === "granted") {
        setupForegroundNotifications();
        scheduleLocalReminder();
      }
    }
  }, []);

  const handleEnable = async () => {
    setLoading(true);
    const token = await requestNotificationPermission();
    if (token) {
      setPermission("granted");
      setupForegroundNotifications();
      scheduleLocalReminder();
    } else {
      setPermission(Notification.permission);
    }
    setLoading(false);
  };

  if (typeof window === "undefined" || !("Notification" in window)) {
    return null;
  }

  return (
    <button
      onClick={handleEnable}
      disabled={loading || permission === "granted"}
      className={`p-2 rounded-lg transition-colors ${
        permission === "granted"
          ? "text-green-500 bg-green-100 dark:bg-green-900/30"
          : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300"
      }`}
      title={permission === "granted" ? "Notifications activées" : "Activer les notifications"}
    >
      {permission === "granted" ? (
        <Bell className="w-5 h-5" />
      ) : (
        <BellOff className="w-5 h-5" />
      )}
    </button>
  );
}
