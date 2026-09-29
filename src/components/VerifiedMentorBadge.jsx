import React, { useState } from "react";
import { ShieldCheck, Sparkles } from "lucide-react";

export const getMentorEngagementScore = (mentor, ratingOverride) => {
  const engagementRate = mentor?.reelEngagementRate ?? 92.5;
  const feedbackRate = mentor?.positiveFeedbackPercent ?? 95.0;
  const ratingVal = ratingOverride ?? mentor?.rating ?? 4.8;

  const engagementPart = engagementRate * 0.4;
  const feedbackPart = feedbackRate * 0.35;
  const ratingPart = (ratingVal / 5) * 100 * 0.25;
  return Math.min(99.9, Math.round((engagementPart + feedbackPart + ratingPart) * 10) / 10);
};

export const isVerifiedHighEngagementMentor = (mentor, verifiedOverride) => {
  if (verifiedOverride !== undefined) return verifiedOverride;
  if (!mentor) return true;
  const score = getMentorEngagementScore(mentor);
  return Boolean(mentor.verified) || score >= 88;
};

export const VerifiedMentorBadge = ({
  mentor,
  verified,
  rating,
  size = "sm",
  showScore = false,
  showTooltipOnClick = true,
  className = "",
}) => {
  const [showInfo, setShowInfo] = useState(false);
  const isVerified = verified !== undefined ? verified : Boolean(mentor?.verified ?? true);
  const engagementScore = getMentorEngagementScore(mentor, rating);
  const isHighEngagement = isVerifiedHighEngagementMentor(mentor, verified);

  if (!isHighEngagement && !isVerified) {
    return null;
  }

  const isElite = engagementScore >= 94;
  const reelEngagementRate = mentor?.reelEngagementRate ?? 95.4;
  const positiveFeedbackPercent = mentor?.positiveFeedbackPercent ?? 97.2;

  if (size === "xs") {
    return (
      <span
        title={`Verified Mentor • ${engagementScore}% Student Engagement Score`}
        className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-gradient-to-r ${
          isElite
            ? "from-amber-500/20 via-emerald-500/20 to-amber-500/20 text-amber-300 border border-amber-500/40"
            : "from-emerald-500/20 to-teal-500/20 text-emerald-300 border border-emerald-500/40"
        } text-[10px] font-bold tracking-tight ${className}`}
      >
        <ShieldCheck className="w-3 h-3 text-emerald-400 flex-shrink-0" />
        <span>Verified</span>
        {showScore && <span className="font-mono text-[9px] text-amber-400">★{engagementScore}</span>}
      </span>
    );
  }

  if (size === "sm") {
    return (
      <div className="relative inline-block">
        <button
          type="button"
          onClick={(e) => {
            if (showTooltipOnClick) {
              e.stopPropagation();
              setShowInfo(!showInfo);
            }
          }}
          title={`Verified Mentor • ${engagementScore}% Student Engagement Score`}
          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold tracking-wide transition shadow-sm ${
            isElite
              ? "bg-gradient-to-r from-amber-500/25 via-emerald-500/20 to-yellow-500/25 text-amber-300 border border-amber-400/50 hover:border-amber-300 shadow-amber-500/10"
              : "bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 text-emerald-300 border border-emerald-400/40 hover:border-emerald-300"
          } ${className} ${showTooltipOnClick ? "cursor-pointer" : "cursor-default"}`}
        >
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400/20 flex-shrink-0" />
          <span className="bg-gradient-to-r from-amber-200 via-emerald-200 to-amber-100 bg-clip-text text-transparent">
            Verified Mentor
          </span>
          {showScore ? (
            <span className="ml-0.5 px-1.5 py-0.2 rounded-full bg-slate-950/80 text-[10px] font-mono text-emerald-300 border border-emerald-500/30">
              {engagementScore}%
            </span>
          ) : (
            <Sparkles className="w-3 h-3 text-amber-400 animate-pulse" />
          )}
        </button>

        {showInfo && (
          <div
            onClick={(e) => e.stopPropagation()}
            className="absolute left-0 top-full mt-2 z-50 w-64 bg-slate-900 border border-amber-500/40 rounded-2xl p-3.5 shadow-2xl text-left"
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-300">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Verified Mentor Seal</span>
              </div>
              <button
                onClick={() => setShowInfo(false)}
                className="text-[10px] text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            <p className="text-[11px] text-slate-300 mt-2 leading-relaxed">
              Awarded to educators with proven student engagement, high reel completion rates, and consistent positive feedback.
            </p>
            <div className="grid grid-cols-2 gap-1.5 mt-2.5 pt-2 border-t border-slate-800/80 text-[10px]">
              <div>
                <span className="text-slate-400">Engagement:</span>{" "}
                <span className="font-bold text-emerald-400">{reelEngagementRate}%</span>
              </div>
              <div>
                <span className="text-slate-400">Positive Rev:</span>{" "}
                <span className="font-bold text-amber-400">{positiveFeedbackPercent}%</span>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  if (size === "md") {
    return (
      <div className="relative inline-block">
        <button
          type="button"
          onClick={(e) => {
            if (showTooltipOnClick) {
              e.stopPropagation();
              setShowInfo(!showInfo);
            }
          }}
          className={`inline-flex items-center gap-2 px-3 py-1 rounded-xl text-xs font-bold transition shadow-md ${
            isElite
              ? "bg-gradient-to-r from-amber-950/60 via-slate-900 to-emerald-950/60 border border-amber-400/60 text-amber-300 hover:border-amber-300"
              : "bg-slate-900 border border-emerald-500/50 text-emerald-300 hover:border-emerald-400"
          } ${className} ${showTooltipOnClick ? "cursor-pointer" : "cursor-default"}`}
        >
          <div className="flex items-center justify-center w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-400/40">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="flex flex-col text-left leading-none">
            <span className="font-extrabold text-white text-[11px] flex items-center gap-1">
              Verified Mentor
              <Sparkles className="w-3 h-3 text-amber-400" />
            </span>
            <span className="text-[9px] text-emerald-400 font-medium mt-0.5">
              {isElite ? "Top 1% Student Engagement" : "High Engagement Score"}
            </span>
          </div>
          {showScore && (
            <span className="ml-1 px-1.5 py-0.5 rounded-lg bg-slate-950 text-[10px] font-mono font-bold text-amber-400 border border-amber-500/30">
              {engagementScore}%
            </span>
          )}
        </button>

        {showInfo && (
          <div
            onClick={(e) => e.stopPropagation()}
            className="absolute left-0 top-full mt-2 z-50 w-72 bg-slate-950 border border-amber-400/50 rounded-2xl p-4 shadow-2xl text-left"
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-1.5 text-xs font-black text-white">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Verified Mentor Status</span>
              </div>
              <button
                onClick={() => setShowInfo(false)}
                className="text-[10px] text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            <p className="text-xs text-slate-300 mt-2 leading-relaxed">
              This educator maintains exceptional student satisfaction and rapid doubt turnaround on MentVidya.
            </p>
            <div className="space-y-1.5 mt-3 pt-2 border-t border-slate-800 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Reel Engagement Rate:</span>
                <span className="font-bold text-emerald-400 font-mono">{reelEngagementRate}%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Student Satisfaction:</span>
                <span className="font-bold text-amber-400 font-mono">{positiveFeedbackPercent}%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Overall Engagement Index:</span>
                <span className="font-black text-cyan-400 font-mono">{engagementScore}/100</span>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      className={`bg-gradient-to-r from-amber-950/40 via-slate-900 to-emerald-950/40 border border-amber-400/50 rounded-2xl p-3.5 flex items-center justify-between gap-3 shadow-lg ${className}`}
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-400/20 to-emerald-400/20 border border-amber-400/40 flex items-center justify-center flex-shrink-0">
          <ShieldCheck className="w-6 h-6 text-emerald-400" />
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-black text-white">Verified Mentor</span>
            <span className="px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[9px] font-bold">
              TRUSTED
            </span>
          </div>
          <p className="text-[11px] text-slate-300 mt-0.5">
            Ranked in the highest tier of student engagement & verified doubt resolution.
          </p>
        </div>
      </div>

      <div className="text-right flex-shrink-0">
        <div className="text-[10px] text-slate-400 font-medium">Engagement Index</div>
        <div className="text-sm font-black text-amber-400 font-mono">
          {engagementScore}
          <span className="text-[10px] text-slate-400">/100</span>
        </div>
      </div>
    </div>
  );
};
