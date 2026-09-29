import React from "react";
import {
  Bookmark,
  BookMarked,
  Play,
  Clock,
  Flame,
  Coins,
  CheckCircle2,
  Bell,
  Trash2,
  Target,
} from "lucide-react";

export const UserLibraryView = ({
  userProfile,
  allReels = [],
  allSeries = [],
  onSelectReel,
  onSelectSeries,
  onToggleBookmarkSeries,
  onOpenCoinStore,
  onOpenNotifications,
  onOpenWeeklyGoals,
}) => {
  const bookmarkedReels = (allReels || []).filter((r) =>
    (userProfile?.bookmarkedReelIds || []).includes(r.id)
  );

  const bookmarkedSeriesList = (allSeries || []).filter((s) =>
    (userProfile?.bookmarkedSeriesIds || []).includes(s.id)
  );

  const unlockedReels = (allReels || []).filter((r) =>
    (userProfile?.unlockedReelIds || []).includes(r.id)
  );

  const quizCount = (userProfile?.completedQuizIds || []).length;

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-4">
      {/* Profile Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 mb-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <img
            src={userProfile.avatar}
            alt={userProfile.name}
            className="w-16 h-16 rounded-full object-cover border-2 border-amber-400"
          />
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-white">{userProfile.name}</h2>
              <span className="text-xs bg-amber-500/20 text-amber-300 font-semibold px-2 py-0.5 rounded-full border border-amber-500/40">
                {userProfile.targetExam || "Active Aspirant"}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Learning in {userProfile.preferredLanguage} • {userProfile.followingMentorIds.length} Mentors Followed
            </p>
          </div>
        </div>

        {/* Stats Strip */}
        <div className="flex items-center gap-3">
          <div className="bg-slate-950 border border-orange-500/30 rounded-2xl px-4 py-3 text-center">
            <div className="text-xl font-black text-orange-400 flex items-center justify-center gap-1">
              <Flame className="w-4 h-4 fill-current animate-pulse" /> {userProfile.streakDays}d
            </div>
            <div className="text-[10px] text-slate-400 uppercase font-semibold">Streak</div>
          </div>

          <div
            onClick={onOpenCoinStore}
            className="bg-slate-950 border border-amber-500/30 hover:border-amber-400 rounded-2xl px-4 py-3 text-center cursor-pointer transition"
          >
            <div className="text-xl font-black text-amber-400 flex items-center justify-center gap-1">
              <Coins className="w-4 h-4 fill-current" /> {userProfile.vidyaCoins}
            </div>
            <div className="text-[10px] text-slate-400 uppercase font-semibold">Coins</div>
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-2xl px-4 py-3 text-center">
            <div className="text-xl font-black text-emerald-400">
              {quizCount}
            </div>
            <div className="text-[10px] text-slate-400 uppercase font-semibold">Quizzes</div>
          </div>
        </div>
      </div>

      {/* Weekly Learning Goals Card */}
      {userProfile.weeklyGoals && (
        <div className="bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-slate-900 border border-amber-500/40 rounded-2xl p-4.5 mb-6 shadow-lg">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start sm:items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center flex-shrink-0 text-amber-400">
                <Target className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-white">
                    Weekly Learning Goals Sprint
                  </h4>
                  <span className="text-[10px] bg-amber-500/20 text-amber-300 font-black px-2 py-0.5 rounded-full border border-amber-500/30 uppercase">
                    {userProfile.weeklyGoals.weekLabel}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Complete targets to unlock the{" "}
                  <strong className="text-amber-300 font-bold">
                    +{userProfile.weeklyGoals.bonusCoinsReward} VidyaCoins Bonus Package
                  </strong>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 self-stretch md:self-auto justify-between md:justify-end">
              <div className="flex flex-col items-end">
                <div className="text-xs font-mono font-bold text-amber-400">
                  {Math.round(
                    (userProfile.weeklyGoals.goals.reduce(
                      (acc, g) => acc + Math.min(g.currentCount, g.targetCount),
                      0
                    ) /
                      userProfile.weeklyGoals.goals.reduce((acc, g) => acc + g.targetCount, 0)) *
                      100
                  )}
                  % Completed
                </div>
                <div className="w-24 sm:w-32 h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800 mt-1">
                  <div
                    className="h-full bg-gradient-to-r from-amber-500 to-orange-400 rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.round(
                        (userProfile.weeklyGoals.goals.reduce(
                          (acc, g) => acc + Math.min(g.currentCount, g.targetCount),
                          0
                        ) /
                          userProfile.weeklyGoals.goals.reduce((acc, g) => acc + g.targetCount, 0)) *
                          100
                      )}%`,
                    }}
                  />
                </div>
              </div>

              <button
                onClick={onOpenWeeklyGoals}
                className="flex items-center gap-1.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-extrabold text-xs px-3.5 py-2 rounded-xl shadow transition cursor-pointer"
              >
                <Target className="w-3.5 h-3.5" />
                <span>Manage Goals</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Daily Notification & Streak Status Pill */}
      <div className="bg-gradient-to-r from-amber-500/10 via-slate-900 to-slate-950 border border-amber-500/30 rounded-2xl p-4 mb-6 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center flex-shrink-0">
            <Bell className="w-4.5 h-4.5 text-amber-400" />
          </div>
          <div>
            <div className="text-xs font-bold text-white flex items-center gap-2">
              <span>Daily Study Reminders Active</span>
              <span className="text-[9px] bg-emerald-950 border border-emerald-500/40 text-emerald-400 font-bold px-1.5 py-0.2 rounded">
                ON
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Daily 8:00 AM playlist digest & 8:00 PM streak shield alerts are protecting your rank.
            </p>
          </div>
        </div>

        <button
          onClick={onOpenNotifications}
          className="flex items-center gap-1.5 text-xs font-bold text-slate-950 bg-amber-500 hover:bg-amber-400 px-3 py-1.5 rounded-xl transition cursor-pointer self-stretch sm:self-auto justify-center"
        >
          <Bell className="w-3.5 h-3.5" />
          <span>View Alerts</span>
        </button>
      </div>

      {/* Bookmarked Series Section */}
      <div className="mb-8">
        <h3 className="text-base font-bold text-white mb-3 flex items-center gap-2">
          <BookMarked className="w-4 h-4 text-amber-400" /> Bookmarked Micro-Series ({bookmarkedSeriesList.length})
        </h3>

        {bookmarkedSeriesList.length === 0 ? (
          <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl text-center text-xs text-slate-400">
            No bookmarked series yet. Click the bookmark icon on any Micro-Series to receive daily revision reminders!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {bookmarkedSeriesList.map((series) => (
              <div
                key={series.id}
                className="bg-slate-900 border border-amber-500/30 hover:border-amber-400/60 rounded-2xl p-4 transition flex flex-col justify-between group"
              >
                <div className="flex gap-3.5">
                  <img
                    src={series.thumbnail}
                    alt={series.title}
                    className="w-20 h-20 rounded-xl object-cover border border-slate-800 flex-shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-[9px] font-bold text-amber-400 uppercase bg-amber-950/80 px-2 py-0.5 rounded border border-amber-500/30">
                        {series.category}
                      </span>
                      <button
                        onClick={() => onToggleBookmarkSeries?.(series.id)}
                        className="text-slate-400 hover:text-rose-400 transition text-[11px] p-1"
                        title="Remove bookmark"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <h4 className="text-xs sm:text-sm font-bold text-white mt-1 group-hover:text-amber-300 transition line-clamp-1">
                      {series.title}
                    </h4>
                    <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                      {series.subtitle}
                    </p>
                    <div className="text-[10px] text-slate-400 mt-1 flex items-center gap-2">
                      <span>By {series.mentor.name}</span>
                      <span>•</span>
                      <span>{series.totalEpisodes} Micro-Reels</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 mt-3 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                    <Clock className="w-3 h-3" /> Next Episode Ready
                  </span>
                  <button
                    onClick={() => onSelectSeries?.(series.id)}
                    className="flex items-center gap-1.5 bg-amber-500 text-slate-950 font-bold text-xs px-3 py-1 rounded-xl shadow hover:bg-amber-400 transition"
                  >
                    <Play className="w-3 h-3 fill-current" />
                    <span>Resume Playlist</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bookmarked Reels Section */}
      <div className="mb-8">
        <h3 className="text-base font-bold text-white mb-3 flex items-center gap-2">
          <Bookmark className="w-4 h-4 text-amber-400" /> Bookmarked Revision VidyaReels ({bookmarkedReels.length})
        </h3>

        {bookmarkedReels.length === 0 ? (
          <div className="p-8 bg-slate-900/60 border border-slate-800 rounded-2xl text-center text-xs text-slate-400">
            No bookmarked reels yet. Click the bookmark icon on any reel to save it for exam revision!
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {bookmarkedReels.map((reel) => (
              <div
                key={reel.id}
                onClick={() => onSelectReel(reel)}
                className="bg-slate-900 border border-slate-800 hover:border-amber-400/50 rounded-2xl p-4 cursor-pointer transition flex flex-col justify-between"
              >
                <div>
                  <span className="text-[10px] font-bold text-amber-400 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-500/30">
                    {reel.subject}
                  </span>
                  <h4 className="text-sm font-bold text-white mt-2 line-clamp-2">
                    {reel.title}
                  </h4>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                    {reel.description}
                  </p>
                </div>

                <div className="pt-3 mt-3 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-xs text-slate-300 font-medium">
                    {reel.mentor.name}
                  </span>
                  <span className="text-xs font-bold text-amber-400 flex items-center gap-1">
                    <Play className="w-3 h-3 fill-current" /> Watch
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Unlocked Paywalled Reels */}
      <div>
        <h3 className="text-base font-bold text-white mb-3 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Unlocked Premium Micro-Reels ({unlockedReels.length})
        </h3>

        {unlockedReels.length === 0 ? (
          <div className="p-8 bg-slate-900/60 border border-slate-800 rounded-2xl text-center text-xs text-slate-400">
            You haven&apos;t unlocked any paywalled reels yet. Watch a quick 15s ad or spend coins to unlock top episodes!
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {unlockedReels.map((reel) => (
              <div
                key={reel.id}
                onClick={() => onSelectReel(reel)}
                className="bg-slate-900 border border-emerald-500/30 hover:border-emerald-400 rounded-2xl p-4 cursor-pointer transition flex flex-col justify-between"
              >
                <div>
                  <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/30">
                    UNLOCKED
                  </span>
                  <h4 className="text-sm font-bold text-white mt-2 line-clamp-2">
                    {reel.title}
                  </h4>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                    {reel.description}
                  </p>
                </div>

                <div className="pt-3 mt-3 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-xs text-slate-300 font-medium">
                    {reel.mentor.name}
                  </span>
                  <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                    <Play className="w-3 h-3 fill-current" /> Watch
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
