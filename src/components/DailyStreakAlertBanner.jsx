import React, { useState } from "react";
import {
  Flame,
  BookMarked,
  Sparkles,
  X,
  ArrowRight,
  Clock,
  CheckCircle2,
  Bell,
  Coins,
  Play,
} from "lucide-react";

export const DailyStreakAlertBanner = ({
  userProfile,
  bookmarkedSeries,
  onClaimDailyStreak,
  onNavigateToSeries,
  onNavigateToLibrary,
  onOpenNotifications,
}) => {
  const [isDismissed, setIsDismissed] = useState(false);
  const [activeTab, setActiveTab] = useState("streak");
  const [streakClaimedFeedback, setStreakClaimedFeedback] = useState(false);

  const todayStr = "2026-08-16";
  const hasClaimedToday = userProfile.lastStreakClaimDate === todayStr && userProfile.streakDays > 0;

  const topBookmarkedSeries = bookmarkedSeries[0];

  const handleClaim = () => {
    onClaimDailyStreak();
    setStreakClaimedFeedback(true);
    setTimeout(() => {
      setStreakClaimedFeedback(false);
    }, 4000);
  };

  if (isDismissed) {
    return (
      <div className="max-w-7xl mx-auto px-4 pt-2">
        <button
          onClick={() => setIsDismissed(false)}
          className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-amber-400/80 hover:text-amber-300 bg-slate-900/60 hover:bg-slate-900 border border-slate-800 rounded-full px-3 py-1 transition cursor-pointer"
        >
          <Bell className="w-3 h-3 text-amber-400 animate-pulse" />
          <span>Show Daily Learning Reminder</span>
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 pt-2.5">
      <div className="relative overflow-hidden rounded-2xl border border-amber-500/30 bg-gradient-to-r from-slate-950 via-slate-900 to-amber-950/40 p-3 sm:p-4 shadow-xl">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 -mb-10 w-40 h-40 bg-orange-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4">
          <div className="flex items-start sm:items-center gap-3">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-br from-amber-500/20 via-orange-500/20 to-amber-500/10 border border-amber-500/40 flex items-center justify-center flex-shrink-0 shadow-inner">
              {activeTab === "streak" ? (
                <Flame className="w-5 h-5 text-orange-400 fill-orange-500 animate-pulse" />
              ) : (
                <BookMarked className="w-5 h-5 text-amber-400" />
              )}
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] uppercase font-black tracking-wider px-2 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300">
                  Daily Study Alert
                </span>
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-slate-400" /> Reset in 6h 34m
                </span>
              </div>

              {activeTab === "streak" ? (
                <div className="mt-1">
                  <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-1.5">
                    <span>{userProfile.streakDays}-Day Learning Streak Active!</span>
                    <span className="text-amber-400 text-xs font-mono font-normal">
                      (+25 VidyaCoins bonus waiting)
                    </span>
                  </h3>
                  <p className="text-xs text-slate-300 line-clamp-1 sm:line-clamp-none">
                    Watch at least 1 micro-reel or solve today&apos;s checkpoint to maintain your rank among India&apos;s top learners.
                  </p>
                </div>
              ) : (
                <div className="mt-1">
                  <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-1.5">
                    <span>Resume Bookmarked Series:</span>
                    <span className="text-amber-300 text-xs font-semibold truncate max-w-[200px] sm:max-w-none">
                      {topBookmarkedSeries ? topBookmarkedSeries.title : "Your Saved Playlists"}
                    </span>
                  </h3>
                  <p className="text-xs text-slate-300 line-clamp-1">
                    {topBookmarkedSeries
                      ? `Continue with ${topBookmarkedSeries.mentor.name} • ${topBookmarkedSeries.totalEpisodes} Micro-Reels revision sprint`
                      : "You have bookmarked revision reels ready in your library."}
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap justify-between md:justify-end flex-shrink-0 pt-1 md:pt-0 border-t md:border-t-0 border-slate-800">
            <div className="flex items-center bg-slate-950/80 p-0.5 rounded-xl border border-slate-800 text-[11px]">
              <button
                onClick={() => setActiveTab("streak")}
                className={`px-2.5 py-1 rounded-lg font-bold transition flex items-center gap-1 ${
                  activeTab === "streak"
                    ? "bg-orange-500/20 text-orange-300 border border-orange-500/40"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <Flame className="w-3 h-3 fill-current" />
                <span>Streak</span>
              </button>
              <button
                onClick={() => setActiveTab("bookmarks")}
                className={`px-2.5 py-1 rounded-lg font-bold transition flex items-center gap-1 ${
                  activeTab === "bookmarks"
                    ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                <BookMarked className="w-3 h-3" />
                <span>Series ({bookmarkedSeries.length})</span>
              </button>
            </div>

            {activeTab === "streak" ? (
              hasClaimedToday && !streakClaimedFeedback ? (
                <button
                  onClick={onOpenNotifications}
                  className="flex items-center gap-1.5 bg-emerald-950/80 hover:bg-emerald-900/80 border border-emerald-500/40 text-emerald-300 px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer shadow"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Streak Secured (+25 claimed)</span>
                </button>
              ) : (
                <button
                  onClick={handleClaim}
                  className="flex items-center gap-1.5 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 px-3.5 py-1.5 rounded-xl text-xs font-black transition cursor-pointer shadow-lg shadow-orange-500/20 active:scale-95"
                >
                  <Coins className="w-3.5 h-3.5 fill-current" />
                  <span>Claim Daily +25 Coins</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-0.5" />
                </button>
              )
            ) : topBookmarkedSeries ? (
              <button
                onClick={() => onNavigateToSeries(topBookmarkedSeries.id)}
                className="flex items-center gap-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 px-3.5 py-1.5 rounded-xl text-xs font-black transition cursor-pointer shadow-lg shadow-amber-500/20"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Resume Series</span>
                <ArrowRight className="w-3.5 h-3.5 ml-0.5" />
              </button>
            ) : (
              <button
                onClick={onNavigateToLibrary}
                className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-white px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer border border-slate-700"
              >
                <BookMarked className="w-3.5 h-3.5 text-amber-400" />
                <span>View Library</span>
              </button>
            )}

            <button
              onClick={() => setIsDismissed(true)}
              className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800/80 transition"
              title="Dismiss daily reminder"
              aria-label="Dismiss alert"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {streakClaimedFeedback && (
          <div className="mt-2.5 pt-2.5 border-t border-emerald-500/30 flex items-center justify-between text-xs text-emerald-300 bg-emerald-950/40 px-3 py-1.5 rounded-xl animate-fade-in">
            <span className="flex items-center gap-1.5 font-bold">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              +25 VidyaCoins added to your wallet! Streak increased to {userProfile.streakDays} days.
            </span>
            <span className="text-[10px] text-emerald-400/90 font-mono">Next milestone: 5-Day Badge</span>
          </div>
        )}
      </div>
    </div>
  );
};
