"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Info, CheckCircle2, AlertTriangle, AlertCircle, X, ChevronRight } from "lucide-react";
import { settingsAPI, SystemNotificationData } from "@/lib/api";

export default function SystemNotificationWidget() {
  const [notification, setNotification] = useState<SystemNotificationData | null>(null);
  const [isDismissed, setIsDismissed] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchNotification = async () => {
      try {
        const res = await settingsAPI.getSystemNotification();
        if (res && res.success && res.data && isMounted) {
          const data = res.data;
          if (data.sys_notif_enabled && (data.sys_notif_title || data.sys_notif_content)) {
            // Check if dismissed in sessionStorage
            const dismissedKey = `dnf_sys_notif_dismissed_${data.sys_notif_title}`;
            const isDismissedStored = typeof window !== "undefined" && sessionStorage.getItem(dismissedKey) === "1";
            
            if (!isDismissedStored) {
              setNotification(data);
              setIsDismissed(false);
            }
          }
        }
      } catch (err) {
        console.warn("Notice system notification fetch error:", err);
      }
    };

    fetchNotification();
    return () => {
      isMounted = false;
    };
  }, []);

  if (!notification || isDismissed || !notification.sys_notif_enabled) {
    return null;
  }

  const handleDismiss = () => {
    setIsDismissed(true);
    if (typeof window !== "undefined" && notification.sys_notif_title) {
      sessionStorage.setItem(`dnf_sys_notif_dismissed_${notification.sys_notif_title}`, "1");
    }
  };

  const getTypeStyles = () => {
    switch (notification.sys_notif_type) {
      case "success":
        return {
          bg: "bg-emerald-700",
          border: "border-emerald-600",
          icon: <CheckCircle2 className="w-5 h-5 text-emerald-200 shrink-0" />,
          badgeBg: "bg-emerald-800 text-emerald-100",
        };
      case "warning":
        return {
          bg: "bg-amber-600",
          border: "border-amber-500",
          icon: <AlertTriangle className="w-5 h-5 text-amber-100 shrink-0" />,
          badgeBg: "bg-amber-700 text-amber-100",
        };
      case "danger":
        return {
          bg: "bg-red-700",
          border: "border-red-600",
          icon: <AlertCircle className="w-5 h-5 text-red-200 shrink-0" />,
          badgeBg: "bg-red-800 text-red-100",
        };
      case "info":
      default:
        return {
          bg: "bg-[#0562d2]",
          border: "border-blue-600",
          icon: <Info className="w-5 h-5 text-blue-100 shrink-0" />,
          badgeBg: "bg-blue-800 text-blue-100",
        };
    }
  };

  const styles = getTypeStyles();

  // 1. TOP ANNOUNCEMENT BANNER
  if (notification.sys_notif_display_style === "banner") {
    return (
      <div className={`w-full ${styles.bg} text-white py-2.5 px-4 relative z-40 border-b ${styles.border} transition-all duration-300 shadow-md`}>
        <div className="max-w-[1440px] mx-auto flex items-center justify-between gap-3 text-xs sm:text-sm font-medium">
          <div className="flex items-center gap-2.5 min-w-0 flex-1">
            {styles.icon}
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 min-w-0">
              {notification.sys_notif_title && (
                <span className="font-bold uppercase tracking-wide shrink-0">
                  {notification.sys_notif_title}:
                </span>
              )}
              <span className="truncate opacity-95">
                {notification.sys_notif_content}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {notification.sys_notif_link && (
              <Link
                href={notification.sys_notif_link}
                className="inline-flex items-center gap-1 bg-white/20 hover:bg-white/30 text-white font-bold px-3 py-1 rounded-full text-xs transition-colors whitespace-nowrap"
              >
                <span>{notification.sys_notif_link_text || "Xem chi tiết"}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            )}

            {notification.sys_notif_dismissible && (
              <button
                onClick={handleDismiss}
                className="p-1 hover:bg-white/20 rounded-full transition-colors text-white/80 hover:text-white cursor-pointer border-0 bg-transparent"
                aria-label="Tắt thông báo"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // 2. MODAL POPUP DIALOG
  if (notification.sys_notif_display_style === "modal") {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-gray-100 flex flex-col text-gray-800 animate-in zoom-in-95 duration-200">
          <div className={`p-4 ${styles.bg} text-white flex items-center justify-between`}>
            <div className="flex items-center gap-2 font-bold text-base uppercase tracking-wide">
              {styles.icon}
              <span>{notification.sys_notif_title || "Thông báo hệ thống"}</span>
            </div>
            {notification.sys_notif_dismissible && (
              <button
                onClick={handleDismiss}
                className="p-1 hover:bg-white/20 rounded-full transition-colors text-white cursor-pointer border-0 bg-transparent"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
          <div className="p-6 space-y-4">
            <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
              {notification.sys_notif_content}
            </p>

            <div className="flex items-center justify-end gap-3 pt-2 border-t border-gray-100">
              {notification.sys_notif_link && (
                <Link
                  href={notification.sys_notif_link}
                  onClick={handleDismiss}
                  className="bg-[#0562d2] hover:bg-[#044ea7] text-white font-bold px-5 py-2 rounded-full text-sm transition-colors"
                >
                  {notification.sys_notif_link_text || "Xem chi tiết"}
                </Link>
              )}
              {notification.sys_notif_dismissible && (
                <button
                  onClick={handleDismiss}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold px-4 py-2 rounded-full text-sm transition-colors cursor-pointer border-0"
                >
                  Đóng
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 3. TOAST FLOATING NOTIFICATION
  return (
    <div className="fixed bottom-20 left-4 z-40 max-w-sm w-full animate-in slide-in-from-bottom-5 duration-300">
      <div className={`bg-slate-900/95 backdrop-blur-md border-l-4 ${styles.border} text-white p-4 rounded-xl shadow-2xl flex gap-3 items-start`}>
        <div className="mt-0.5">{styles.icon}</div>
        <div className="flex-1 space-y-1 text-xs">
          {notification.sys_notif_title && (
            <h4 className="font-bold text-sm uppercase tracking-wide text-white">
              {notification.sys_notif_title}
            </h4>
          )}
          <p className="text-gray-200 leading-relaxed">
            {notification.sys_notif_content}
          </p>
          {notification.sys_notif_link && (
            <Link
              href={notification.sys_notif_link}
              onClick={handleDismiss}
              className="inline-flex items-center gap-1 text-[#0562d2] hover:underline font-bold mt-1"
            >
              <span>{notification.sys_notif_link_text || "Xem chi tiết"}</span>
              <ChevronRight className="w-3 h-3" />
            </Link>
          )}
        </div>
        {notification.sys_notif_dismissible && (
          <button
            onClick={handleDismiss}
            className="text-gray-400 hover:text-white transition-colors cursor-pointer border-0 bg-transparent p-0.5"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
