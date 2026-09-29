import React, { useState } from "react";
import {
  Flame,
  Coins,
  Tv,
  HelpCircle,
  Share2,
} from "lucide-react";
import confetti from "canvas-confetti";

export const EarnCoinsModal = ({
  userProfile,
  onClaimDailyStreak,
  onOpenSponsorAd,
  onClose,
}) => {
  const [claimedToday, setClaimedToday] = useState(false);

  const streakDays = [
    { day: 1, reward: 10, label: "Day 1" },
    { day: 2, reward: 15, label: "Day 2" },
    { day: 3, reward: 20, label: "Day 3" },
    { day: 4, reward: 25, label: "Day 4" },
    { day: 5, reward: 30, label: "Day 5" },
    { day: 6, reward: 40, label: "Day 6" },
    { day: 7, reward: 100, label: "Day 7 (Mega)", special: true },
  ];

  const handleClaim = () => {
    setClaimedToday(true);
    onClaimDailyStreak();
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 select-none">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-3xl overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-950/70 via-slate-950 to-amber-950/70 p-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-orange-500/20 border border-orange-400/50 flex items-center justify-center text-orange-400 shadow-[0_0_20px_rgba(249,115,22,0.3)] animate-pulse">
              <Flame className="w-6 h-6 fill-current" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-white">
                Earn VidyaCoins Hub
              </h3>
              <p className="text-xs text-slate-300">
                Current Streak: <strong className="text-orange-400 font-bold">{userProfile.streakDays} Days Active 🔥</strong>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-6 flex flex-col gap-5 overflow-y-auto max-h-[75vh]">
          {/* Daily Streak Grid */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                7-Day Daily Study Streak
              </span>
              <span className="text-[11px] text-amber-400 font-medium">
                Day 7 yields 100 Bonus Coins!
              </span>
            </div>

            <div className="grid grid-cols-7 gap-1.5">
              {streakDays.map((s) => {
                const isPast = s.day <= userProfile.streakDays;

                return (
                  <div
                    key={s.day}
                    className={`p-2 rounded-xl border text-center flex flex-col items-center justify-between gap-1 transition ${
                      s.special
                        ? "bg-gradient-to-b from-amber-500/20 to-orange-950 border-amber-400 text-amber-300 font-bold shadow-md shadow-amber-500/20"
                        : isPast
                        ? "bg-emerald-950/40 border-emerald-500/40 text-emerald-300"
                        : "bg-slate-950 border-slate-800 text-slate-500"
                    }`}
                  >
                    <span className="text-[9px] font-mono">D{s.day}</span>
                    <Coins className="w-3.5 h-3.5 fill-current" />
                    <span className="text-[10px] font-bold">+{s.reward}</span>
                  </div>
                );
              })}
            </div>

            <button
              onClick={handleClaim}
              disabled={claimedToday}
              className="mt-3 w-full py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 disabled:opacity-50 text-slate-950 font-bold text-xs rounded-xl shadow transition cursor-pointer"
            >
              {claimedToday ? "✓ Streak Claimed for Today (+25 Coins)" : "Claim Today's Streak (+25 Coins)"}
            </button>
          </div>

          {/* Other Ways to Earn */}
          <div>
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-3">
              Daily Credit Missions
            </span>

            <div className="flex flex-col gap-2.5">
              {/* Watch Sponsor Ad */}
              <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-2xl flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-950 border border-blue-500/40 text-cyan-300 flex items-center justify-center">
                    <Tv className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">Watch a 15-second Sponsor Ad</div>
                    <div className="text-[10px] text-slate-400">Unlock any paywalled reel + earn bonus coins</div>
                  </div>
                </div>
                <button
                  onClick={() => {
                    onClose();
                    onOpenSponsorAd();
                  }}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow transition cursor-pointer"
                >
                  +25 🪙
                </button>
              </div>

              {/* Solve In-Reel Concept Quiz */}
              <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-2xl flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-purple-950 border border-purple-500/40 text-purple-300 flex items-center justify-center">
                    <HelpCircle className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">Solve In-Reel Concept Quizzes</div>
                    <div className="text-[10px] text-slate-400">Answer 1-question check correctly on any reel</div>
                  </div>
                </div>
                <span className="text-xs font-bold text-purple-300 bg-purple-950/80 px-2.5 py-1 rounded-xl border border-purple-500/40">
                  +15 🪙 / Quiz
                </span>
              </div>

              {/* Share Reel with Friends */}
              <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-2xl flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-950 border border-emerald-500/40 text-emerald-300 flex items-center justify-center">
                    <Share2 className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">Share a Reel with Classmates</div>
                    <div className="text-[10px] text-slate-400">Spread knowledge on WhatsApp or Telegram</div>
                  </div>
                </div>
                <span className="text-xs font-bold text-emerald-300 bg-emerald-950/80 px-2.5 py-1 rounded-xl border border-emerald-500/40">
                  +5 🪙 / Share
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
