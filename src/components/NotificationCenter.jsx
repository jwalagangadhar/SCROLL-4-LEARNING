import React, { useState } from "react";
import {
  Bell,
  Flame,
  BookMarked,
  Sparkles,
  Clock,
  Play,
  ArrowRight,
  X,
  Settings,
  Trophy,
  Zap,
} from "lucide-react";

export const NotificationCenter = ({
  notifications = [],
  userProfile,
  seriesList = [],
  isOpen,
  onClose,
  onMarkAllRead,
  onNotificationClick,
  onTriggerTestNotification,
  onClaimDailyStreak,
}) => {
  const [filter, setFilter] = useState("all");
  const [dailyDigestEnabled, setDailyDigestEnabled] = useState(true);
  const [streakProtectorEnabled, setStreakProtectorEnabled] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [simulationToast, setSimulationToast] = useState(null);

  if (!isOpen) return null;

  const unreadCount = (notifications || []).filter((n) => !n.isRead).length;

  const filteredNotifications = (notifications || []).filter((n) => {
    if (filter === "streak") return n.type === "streak_reminder";
    if (filter === "series") return n.type === "series_reminder";
    return true;
  });

  const handleTestTrigger = (type) => {
    onTriggerTestNotification(type);
    setSimulationToast(
      type === "streak"
        ? "🔥 Simulated: Daily Learning Streak alert delivered!"
        : "📚 Simulated: Bookmarked Series Revision reminder delivered!"
    );
    setTimeout(() => setSimulationToast(null), 3500);
  };

  const getIcon = (notif) => {
    switch (notif.iconType) {
      case "flame":
        return <Flame className="w-5 h-5 text-orange-400 fill-orange-500" />;
      case "bookmark":
        return <BookMarked className="w-5 h-5 text-amber-400" />;
      case "trophy":
        return <Trophy className="w-5 h-5 text-amber-300" />;
      case "sparkles":
        return <Sparkles className="w-5 h-5 text-emerald-400" />;
      default:
        return <Bell className="w-5 h-5 text-amber-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
              <Bell className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-extrabold text-white">Daily Study Alerts</h2>
                {unreadCount > 0 && (
                  <span className="bg-amber-500 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-full">
                    {unreadCount} new
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400">
                Reminders for learning streak & bookmarked playlists
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setShowSettings(!showSettings)}
              className={`p-2 rounded-xl transition ${
                showSettings
                  ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                  : "text-slate-400 hover:text-white hover:bg-slate-800"
              }`}
              title="Notification schedule & preferences"
            >
              <Settings className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Simulation Toast */}
        {simulationToast && (
          <div className="bg-gradient-to-r from-amber-500/20 to-orange-500/20 border-b border-amber-500/30 px-4 py-2 text-xs font-bold text-amber-300 flex items-center justify-between animate-fade-in">
            <span className="flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              {simulationToast}
            </span>
            <span className="text-[10px] text-amber-400/80 font-mono">SIMULATION</span>
          </div>
        )}

        {/* Notification Schedule Preferences Accordion */}
        {showSettings && (
          <div className="bg-slate-950 p-4 border-b border-slate-800 text-xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
              <span className="font-bold text-slate-200">Daily Reminder Preferences</span>
              <span className="text-[10px] text-amber-400 font-mono">Simulated Schedule</span>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold text-white">Morning Revision Digest (8:00 AM)</div>
                <div className="text-[11px] text-slate-400">
                  Sends reminders for bookmarked series & daily concept reels
                </div>
              </div>
              <input
                type="checkbox"
                checked={dailyDigestEnabled}
                onChange={(e) => setDailyDigestEnabled(e.target.checked)}
                className="w-4 h-4 accent-amber-500 cursor-pointer rounded"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold text-white">Evening Streak Protection (8:00 PM)</div>
                <div className="text-[11px] text-slate-400">
                  Alerts if daily streak bonus is unclaimed before midnight
                </div>
              </div>
              <input
                type="checkbox"
                checked={streakProtectorEnabled}
                onChange={(e) => setStreakProtectorEnabled(e.target.checked)}
                className="w-4 h-4 accent-amber-500 cursor-pointer rounded"
              />
            </div>

            {/* Test Simulation Buttons */}
            <div className="pt-2 flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-bold text-slate-400 uppercase w-full">
                Test UI Notification System:
              </span>
              <button
                onClick={() => handleTestTrigger("streak")}
                className="flex items-center gap-1 bg-orange-950/80 hover:bg-orange-900 border border-orange-500/40 text-orange-300 px-2.5 py-1.5 rounded-xl font-bold text-[11px] transition"
              >
                <Flame className="w-3.5 h-3.5 fill-current" />
                <span>Test Streak Alert</span>
              </button>
              <button
                onClick={() => handleTestTrigger("series")}
                className="flex items-center gap-1 bg-amber-950/80 hover:bg-amber-900 border border-amber-500/40 text-amber-300 px-2.5 py-1.5 rounded-xl font-bold text-[11px] transition"
              >
                <BookMarked className="w-3.5 h-3.5" />
                <span>Test Series Reminder</span>
              </button>
            </div>
          </div>
        )}

        {/* Filter Pills & Actions */}
        <div className="px-4 py-2.5 bg-slate-950/40 border-b border-slate-800 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 text-xs">
            <button
              onClick={() => setFilter("all")}
              className={`px-2.5 py-1 rounded-xl font-bold transition ${
                filter === "all"
                  ? "bg-amber-500 text-slate-950"
                  : "text-slate-400 hover:text-white bg-slate-900"
              }`}
            >
              All ({notifications.length})
            </button>
            <button
              onClick={() => setFilter("streak")}
              className={`px-2.5 py-1 rounded-xl font-bold transition flex items-center gap-1 ${
                filter === "streak"
                  ? "bg-orange-500 text-slate-950"
                  : "text-slate-400 hover:text-white bg-slate-900"
              }`}
            >
              <Flame className="w-3 h-3 fill-current" />
              <span>Streaks</span>
            </button>
            <button
              onClick={() => setFilter("series")}
              className={`px-2.5 py-1 rounded-xl font-bold transition flex items-center gap-1 ${
                filter === "series"
                  ? "bg-amber-500 text-slate-950"
                  : "text-slate-400 hover:text-white bg-slate-900"
              }`}
            >
              <BookMarked className="w-3 h-3" />
              <span>Saved Series</span>
            </button>
          </div>

          {unreadCount > 0 && (
            <button
              onClick={onMarkAllRead}
              className="text-[11px] text-amber-400 hover:text-amber-300 font-bold transition"
            >
              Mark all read
            </button>
          )}
        </div>

        {/* Notification List Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 divide-y divide-slate-800/50">
          {filteredNotifications.length === 0 ? (
            <div className="text-center py-10">
              <div className="w-12 h-12 rounded-2xl bg-slate-800/60 border border-slate-700 flex items-center justify-center mx-auto mb-3 text-slate-400">
                <Bell className="w-6 h-6" />
              </div>
              <p className="text-sm font-bold text-slate-300">All caught up!</p>
              <p className="text-xs text-slate-500 mt-1">
                You have no pending daily study alerts in this filter.
              </p>
            </div>
          ) : (
            filteredNotifications.map((notif) => {
              return (
                <div
                  key={notif.id}
                  onClick={() => onNotificationClick(notif)}
                  className="pt-3 first:pt-0 cursor-pointer group transition"
                >
                  <div
                    className={`rounded-2xl p-3.5 border transition ${
                      notif.isRead
                        ? "bg-slate-950/50 border-slate-800/80 hover:border-slate-700"
                        : "bg-gradient-to-r from-amber-500/10 via-slate-900 to-slate-950 border-amber-500/30 hover:border-amber-500/60 shadow-md"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition">
                        {getIcon(notif)}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <h4
                              className={`text-xs sm:text-sm font-bold ${
                                notif.isRead ? "text-slate-200" : "text-white"
                              }`}
                            >
                              {notif.title}
                            </h4>
                            {notif.highlightBadge && (
                              <span className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
                                {notif.highlightBadge}
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-slate-400 whitespace-nowrap font-medium">
                            {notif.timestamp}
                          </span>
                        </div>

                        <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                          {notif.message}
                        </p>

                        <div className="mt-3 flex items-center justify-between gap-2">
                          {notif.actionType === "continue_streak" && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onClaimDailyStreak();
                                onNotificationClick(notif);
                              }}
                              className="flex items-center gap-1.5 bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 px-3 py-1 rounded-xl text-xs font-black shadow transition active:scale-95 cursor-pointer"
                            >
                              <Flame className="w-3.5 h-3.5 fill-current" />
                              <span>Claim +25 Coins & Continue Streak</span>
                            </button>
                          )}

                          {notif.actionType === "open_series" && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onNotificationClick(notif);
                              }}
                              className="flex items-center gap-1.5 bg-amber-500 text-slate-950 px-3 py-1 rounded-xl text-xs font-black shadow transition active:scale-95 cursor-pointer"
                            >
                              <Play className="w-3.5 h-3.5 fill-current" />
                              <span>Resume Bookmarked Series</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                          )}

                          {notif.actionType === "open_library" && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onNotificationClick(notif);
                              }}
                              className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-white px-3 py-1 rounded-xl text-xs font-bold transition cursor-pointer border border-slate-700"
                            >
                              <BookMarked className="w-3.5 h-3.5 text-amber-400" />
                              <span>Open Revision Library</span>
                            </button>
                          )}

                          {notif.actionType === "open_doubts" && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onNotificationClick(notif);
                              }}
                              className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-white px-3 py-1 rounded-xl text-xs font-bold transition cursor-pointer border border-slate-700"
                            >
                              <span>View Mentor Answer</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                          )}

                          {!notif.isRead && (
                            <div className="w-2 h-2 rounded-full bg-amber-400 ml-auto" />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer info */}
        <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-amber-400" /> Next scheduled alert: 8:00 PM Streak Check
          </span>
          <button
            onClick={() => handleTestTrigger("streak")}
            className="text-amber-400 hover:text-amber-300 font-bold transition flex items-center gap-1 cursor-pointer"
          >
            <Zap className="w-3 h-3 text-amber-400" />
            <span>Simulate Push Alert</span>
          </button>
        </div>
      </div>
    </div>
  );
};
