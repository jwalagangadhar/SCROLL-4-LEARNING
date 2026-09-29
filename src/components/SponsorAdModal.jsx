import React, { useState, useEffect } from "react";
import {
  Coins,
  Sparkles,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";
import confetti from "canvas-confetti";
import { INITIAL_SPONSOR_AD } from "../data/mockData";

export const SponsorAdModal = ({
  targetReel,
  onAdCompleted,
  onClose,
}) => {
  const [ad, setAd] = useState(INITIAL_SPONSOR_AD);
  const [secondsRemaining, setSecondsRemaining] = useState(15);
  const [canSkip, setCanSkip] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    fetch("/api/ads/sponsor")
      .then((res) => res.json())
      .then((data) => {
        if (data.ad) setAd(data.ad);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (isCompleted) return;

    const timer = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          triggerCompletion();
          return 0;
        }
        if (prev <= 10) {
          setCanSkip(true);
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isCompleted]);

  const triggerCompletion = () => {
    setIsCompleted(true);
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  const handleClaim = () => {
    onAdCompleted(ad.rewardCoins, targetReel?.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 select-none">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-3xl overflow-hidden shadow-2xl flex flex-col">
        <div className="bg-slate-950 px-5 py-3 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-400 bg-amber-950/80 px-2.5 py-0.5 rounded-full border border-amber-500/40">
              {ad.logoBadge}
            </span>
            <span className="text-xs font-semibold text-slate-300">
              Sponsored Interactive VidyaPartner
            </span>
          </div>

          <div className="flex items-center gap-2">
            {!isCompleted ? (
              <span className="text-xs font-mono font-bold text-cyan-300 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-500/30">
                ⏱ {secondsRemaining}s
              </span>
            ) : (
              <span className="text-xs font-mono font-bold text-emerald-300 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/30 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Ready
              </span>
            )}
          </div>
        </div>

        <div className="relative h-64 bg-gradient-to-br from-indigo-950 via-slate-900 to-blue-950 p-6 flex flex-col justify-between overflow-hidden">
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-blue-500/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-purple-500/20 rounded-full blur-3xl" />

          <div className="relative z-10">
            <h2 className="text-2xl font-black text-white tracking-tight mb-1">
              {ad.brandName}
            </h2>
            <p className="text-xs font-medium text-cyan-300">
              {ad.brandTagline}
            </p>
          </div>

          <div className="relative z-10 bg-slate-950/70 backdrop-blur-md border border-white/10 rounded-2xl p-4 my-2">
            <h3 className="text-sm font-bold text-amber-300 mb-1 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-400" />
              {ad.headline}
            </h3>
            <p className="text-xs text-slate-200 leading-relaxed">
              {ad.description}
            </p>
          </div>

          <div className="relative z-10 w-full h-1.5 bg-white/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-400 to-cyan-400 transition-all duration-1000 ease-linear"
              style={{ width: `${((15 - secondsRemaining) / 15) * 100}%` }}
            />
          </div>
        </div>

        <div className="p-5 bg-slate-950 flex flex-col gap-3">
          {isCompleted ? (
            <button
              onClick={handleClaim}
              className="w-full py-3.5 px-4 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-sm rounded-xl shadow-lg shadow-emerald-500/30 flex items-center justify-center gap-2 transform active:scale-95 transition cursor-pointer"
            >
              <Coins className="w-5 h-5 fill-current" /> Claim +{ad.rewardCoins} Coins & Unlock Reel!
            </button>
          ) : (
            <div className="flex items-center justify-between gap-3">
              {canSkip ? (
                <button
                  onClick={triggerCompletion}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl transition cursor-pointer"
                >
                  Skip Ad (Claim Reward)
                </button>
              ) : (
                <span className="text-[11px] text-slate-400">
                  Skip unlocks in {Math.max(0, secondsRemaining - 10)}s...
                </span>
              )}

              <a
                href={ad.ctaLink}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs rounded-xl flex items-center gap-1.5 transition"
              >
                <span>Visit Sponsor</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
