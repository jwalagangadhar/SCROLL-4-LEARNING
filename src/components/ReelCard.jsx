import React, { useState, useEffect } from "react";
import {
  Heart,
  Bookmark,
  Share2,
  HelpCircle,
  Sparkles,
  FileText,
  Lock,
  Tv,
  Coins,
  ArrowRight,
  UserCheck,
  UserPlus,
} from "lucide-react";
import { ReelVisualCanvas } from "./ReelVisualCanvas";
import { VerifiedMentorBadge } from "./VerifiedMentorBadge";

export const ReelCard = ({
  reel,
  isActive,
  userProfile,
  onLikeToggle,
  onBookmarkToggle,
  onFollowToggle,
  onOpenQuiz,
  onOpenDoubtModal,
  onOpenAiSummary,
  onOpenMaterialsModal,
  onOpenSponsorAd,
  onUnlockWithCoins,
  onSelectSeries,
  onShareReel,
}) => {
  const [isPlaying, setIsPlaying] = useState(isActive);
  const [currentTimeSeconds, setCurrentTimeSeconds] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);
  const [isDescExpanded, setIsDescExpanded] = useState(false);

  const isLiked = userProfile.likedReelIds.includes(reel.id);
  const isBookmarked = userProfile.bookmarkedReelIds.includes(reel.id);
  const isFollowing = userProfile.followingMentorIds.includes(reel.mentor.id);
  const isUnlocked = !reel.isPaywalled || userProfile.unlockedReelIds.includes(reel.id);
  const isQuizCompleted = userProfile.completedQuizIds.includes(reel.id);

  // Sync play state when this reel becomes active in feed
  useEffect(() => {
    setIsPlaying(isActive && isUnlocked);
  }, [isActive, isUnlocked]);

  // Simulation timer for video progress
  useEffect(() => {
    let interval = null;
    if (isPlaying && isUnlocked) {
      interval = setInterval(() => {
        setCurrentTimeSeconds((prev) => {
          const next = prev + 0.25 * playbackSpeed;
          if (next >= reel.durationSeconds) {
            return 0; // loop
          }
          return next;
        });
      }, 250);
    }
    return () => clearInterval(interval);
  }, [isPlaying, isUnlocked, playbackSpeed, reel.durationSeconds]);

  const progressPercent = (currentTimeSeconds / reel.durationSeconds) * 100;

  return (
    <div className="relative w-full aspect-[9/16] max-w-[360px] sm:max-w-[380px] mx-auto bg-black rounded-3xl overflow-hidden shadow-2xl border border-slate-800/80 flex flex-col justify-between select-none">
      {/* 1. Main Reel Interactive Canvas / Video Stream */}
      <div className="relative w-full h-full flex-1">
        <ReelVisualCanvas
          videoUrl={reel.videoUrl}
          type={reel.visualType}
          title={reel.title}
          topicTag={reel.topicTag}
          isPlaying={isPlaying}
          onTogglePlay={() => {
            if (isUnlocked) setIsPlaying(!isPlaying);
          }}
          progressPercent={progressPercent}
          onSeek={(pct) => {
            if (isUnlocked) {
              setCurrentTimeSeconds((pct / 100) * reel.durationSeconds);
            }
          }}
          playbackSpeed={playbackSpeed}
          onChangeSpeed={setPlaybackSpeed}
          currentTimeSeconds={currentTimeSeconds}
          durationSeconds={reel.durationSeconds}
        />

        {/* 2. Paywall Barrier Overlay (if locked) */}
        {!isUnlocked && (
          <div className="absolute inset-0 bg-slate-950/92 backdrop-blur-md z-40 flex flex-col items-center justify-center p-6 text-center">
            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-500 to-rose-600 p-0.5 mb-3 shadow-[0_0_30px_rgba(245,158,11,0.5)] animate-bounce">
              <div className="w-full h-full bg-slate-950 rounded-full flex items-center justify-center">
                <Lock className="w-8 h-8 text-amber-400" />
              </div>
            </div>

            <span className="text-[11px] font-mono tracking-widest text-amber-400 bg-amber-950/80 px-3 py-1 rounded-full border border-amber-500/40 uppercase font-semibold mb-2">
              Premium Concept Reel
            </span>

            <h3 className="text-lg font-bold text-white mb-2 leading-snug">
              {reel.title}
            </h3>

            <p className="text-xs text-slate-300 max-w-xs mb-6 leading-relaxed">
              {reel.mentor.name} has placed this episode behind a micro-paywall. Unlock it instantly by watching a 15-second sponsor ad or using your VidyaCoins!
            </p>

            <div className="w-full max-w-xs flex flex-col gap-3">
              {/* Option A: Watch Ad */}
              <button
                onClick={() => onOpenSponsorAd(reel)}
                className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-xs rounded-xl shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 border border-blue-400/30 transition transform active:scale-95 cursor-pointer"
              >
                <Tv className="w-4 h-4 text-cyan-300" />
                <span>Watch 15s Ad <strong className="text-cyan-200">(+25 Coins Free)</strong></span>
              </button>

              {/* Option B: Pay with VidyaCoins */}
              <button
                onClick={() => onUnlockWithCoins(reel)}
                className="w-full py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-amber-300 font-semibold text-xs rounded-xl border border-amber-500/40 flex items-center justify-center gap-2 transition active:scale-95 cursor-pointer"
              >
                <Coins className="w-4 h-4 text-amber-400" />
                <span>Unlock for {reel.unlockCostCoins} VidyaCoins (You have {userProfile.vidyaCoins})</span>
              </button>
            </div>

            {userProfile.vidyaCoins < reel.unlockCostCoins && (
              <div className="mt-3 text-[11px] text-slate-400 flex items-center gap-1">
                <span>Low on coins?</span>
                <span className="text-amber-400 font-medium">Watch the sponsor ad above to earn 25 coins free!</span>
              </div>
            )}
          </div>
        )}

        {/* 3. Left Bottom Information Overlay */}
        <div className="absolute left-3 bottom-8 right-16 z-30 pointer-events-none flex flex-col gap-2">
          {/* Series Tag / Badge */}
          {reel.seriesId && (
            <button
              onClick={() => onSelectSeries(reel.seriesId)}
              className="pointer-events-auto self-start flex items-center gap-1.5 bg-gradient-to-r from-amber-950/80 to-slate-900/90 border border-amber-500/40 text-amber-300 text-[11px] font-medium px-2.5 py-1 rounded-full backdrop-blur-md hover:border-amber-400 transition"
            >
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>Series Ep {reel.seriesEpisodeNumber}/{reel.seriesTotalEpisodes}: {reel.seriesTitle}</span>
              <ArrowRight className="w-3 h-3 ml-0.5" />
            </button>
          )}

          {/* Mentor Profile Bar */}
          <div className="flex items-center gap-2 pointer-events-auto">
            <img
              src={reel.mentor.avatar}
              alt={reel.mentor.name}
              className="w-9 h-9 rounded-full object-cover border border-amber-400/80 shadow-md"
            />
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-xs font-bold text-white drop-shadow-md">
                  {reel.mentor.name}
                </span>
                <VerifiedMentorBadge mentor={reel.mentor} size="xs" showScore={false} />
              </div>
              <span className="text-[10px] text-slate-300 drop-shadow">
                {reel.mentor.specialization} • {reel.language}
              </span>
            </div>

            {/* Follow / Following Button */}
            <button
              onClick={() => onFollowToggle(reel.mentor.id)}
              className={`ml-1 px-2 py-0.5 rounded-full text-[10px] font-semibold flex items-center gap-1 transition ${
                isFollowing
                  ? "bg-white/20 text-white border border-white/30"
                  : "bg-amber-500 text-slate-950 hover:bg-amber-400 font-bold"
              }`}
            >
              {isFollowing ? (
                <>
                  <UserCheck className="w-3 h-3" /> Following
                </>
              ) : (
                <>
                  <UserPlus className="w-3 h-3" /> Follow
                </>
              )}
            </button>
          </div>

          {/* Reel Title & Expandable Description */}
          <div className="pointer-events-auto">
            <h2 className="text-sm font-bold text-white drop-shadow-md leading-tight mb-1">
              {reel.title}
            </h2>
            <p className="text-[11px] text-slate-200/90 leading-relaxed drop-shadow line-clamp-2">
              {reel.description}
            </p>
          </div>
        </div>

        {/* 4. Right Side Vertical Action Icons Bar */}
        <div className="absolute right-2 bottom-8 z-30 flex flex-col items-center gap-3.5 pointer-events-auto">
          {/* Like Button */}
          <button
            onClick={() => onLikeToggle(reel.id)}
            className="flex flex-col items-center gap-0.5 group cursor-pointer"
            title="Like Reel"
          >
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md border transition transform active:scale-125 ${
                isLiked
                  ? "bg-rose-500/30 border-rose-500 text-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.5)]"
                  : "bg-black/50 border-white/20 text-white group-hover:border-rose-400/60"
              }`}
            >
              <Heart
                className={`w-5 h-5 ${isLiked ? "fill-current" : ""}`}
              />
            </div>
            <span className="text-[10px] font-mono text-white font-medium drop-shadow">
              {reel.likes + (isLiked ? 1 : 0)}
            </span>
          </button>

          {/* Bookmark Button */}
          <button
            onClick={() => onBookmarkToggle(reel.id)}
            className="flex flex-col items-center gap-0.5 group cursor-pointer"
            title="Save to Library"
          >
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md border transition transform active:scale-125 ${
                isBookmarked
                  ? "bg-amber-500/30 border-amber-500 text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.5)]"
                  : "bg-black/50 border-white/20 text-white group-hover:border-amber-400/60"
              }`}
            >
              <Bookmark
                className={`w-5 h-5 ${isBookmarked ? "fill-current" : ""}`}
              />
            </div>
            <span className="text-[10px] font-mono text-white font-medium drop-shadow">
              Save
            </span>
          </button>

          {/* In-Reel Concept Quiz (+15 Coins) */}
          {reel.quiz && (
            <button
              onClick={() => onOpenQuiz(reel)}
              className="flex flex-col items-center gap-0.5 group cursor-pointer relative"
              title="Solve Concept Quiz (+15 Coins)"
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md border transition transform active:scale-110 ${
                  isQuizCompleted
                    ? "bg-emerald-500/30 border-emerald-400 text-emerald-300"
                    : "bg-gradient-to-tr from-amber-600/80 to-yellow-500/80 border-amber-400 text-white animate-pulse"
                }`}
              >
                <HelpCircle className="w-5 h-5" />
              </div>
              <span className="text-[9px] font-bold text-amber-300 bg-amber-950/80 px-1.5 py-0.2 rounded-full border border-amber-400/50">
                {isQuizCompleted ? "Done" : "+15 🪙"}
              </span>
            </button>
          )}

          {/* Ask Mentor Doubt Button */}
          <button
            onClick={() => onOpenDoubtModal(reel, Math.floor(currentTimeSeconds))}
            className="flex flex-col items-center gap-0.5 group cursor-pointer"
            title="Ask Doubt on this Reel"
          >
            <div className="w-10 h-10 rounded-full bg-blue-600/60 hover:bg-blue-500/80 backdrop-blur-md border border-blue-400/60 text-white flex items-center justify-center transition transform active:scale-110 shadow-lg shadow-blue-500/30">
              <HelpCircle className="w-5 h-5 text-cyan-200" />
            </div>
            <span className="text-[10px] font-medium text-cyan-200 drop-shadow">
              Doubt
            </span>
          </button>

          {/* AI Cheat-Sheet Summary */}
          <button
            onClick={() => onOpenAiSummary(reel)}
            className="flex flex-col items-center gap-0.5 group cursor-pointer"
            title="AI 60s Summary & Cheat Sheet"
          >
            <div className="w-10 h-10 rounded-full bg-purple-600/50 hover:bg-purple-500/70 backdrop-blur-md border border-purple-400/50 text-white flex items-center justify-center transition transform active:scale-110 shadow-lg shadow-purple-500/30">
              <Sparkles className="w-5 h-5 text-purple-200" />
            </div>
            <span className="text-[10px] font-medium text-purple-200 drop-shadow">
              Notes
            </span>
          </button>

          {/* Study Materials / Downloadable Notes */}
          {reel.studyMaterials && reel.studyMaterials.length > 0 && (
            <button
              onClick={() => onOpenMaterialsModal(reel)}
              className="flex flex-col items-center gap-0.5 group cursor-pointer"
              title="Download Notes & Formula Sheets"
            >
              <div className="w-10 h-10 rounded-full bg-slate-800/80 hover:bg-slate-700 backdrop-blur-md border border-slate-600 text-amber-300 flex items-center justify-center transition">
                <FileText className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-medium text-slate-200 drop-shadow">
                PDF
              </span>
            </button>
          )}

          {/* Share Button (+5 Coins referral) */}
          <button
            onClick={() => onShareReel(reel)}
            className="flex flex-col items-center gap-0.5 group cursor-pointer"
            title="Share Reel (+5 Coins)"
          >
            <div className="w-10 h-10 rounded-full bg-black/50 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white flex items-center justify-center transition">
              <Share2 className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-medium text-white drop-shadow">
              Share
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
