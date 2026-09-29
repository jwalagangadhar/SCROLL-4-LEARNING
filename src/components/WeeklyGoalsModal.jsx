import React, { useState } from "react";
import {
  Target,
  Trophy,
  Coins,
  Sparkles,
  CheckCircle2,
  Plus,
  Minus,
  Edit3,
  Flame,
  Layers,
  Play,
  X,
  Clock,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import confetti from "canvas-confetti";

export const WeeklyGoalsModal = ({
  isOpen,
  onClose,
  weeklyGoals,
  userProfile,
  onUpdateGoals,
  onClaimWeeklyBonus,
  onNavigateToSeries,
  onNavigateToReels,
  onNavigateToDoubts,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [customGoals, setCustomGoals] = useState(weeklyGoals.goals);
  const [customBonusCoins, setCustomBonusCoins] = useState(weeklyGoals.bonusCoinsReward);

  if (!isOpen) return null;

  const totalTargetPoints = weeklyGoals.goals.reduce((acc, g) => acc + g.targetCount, 0);
  const totalCurrentPoints = weeklyGoals.goals.reduce(
    (acc, g) => acc + Math.min(g.currentCount, g.targetCount),
    0
  );
  const overallPercentage =
    totalTargetPoints > 0 ? Math.round((totalCurrentPoints / totalTargetPoints) * 100) : 0;
  const isAllCompleted = weeklyGoals.goals.every((g) => g.currentCount >= g.targetCount);

  const handleSaveCustomGoals = () => {
    onUpdateGoals({
      ...weeklyGoals,
      bonusCoinsReward: customBonusCoins,
      goals: customGoals,
    });
    setIsEditing(false);
  };

  const handleAdjustTarget = (id, delta) => {
    setCustomGoals((prev) =>
      prev.map((g) => {
        if (g.id === id) {
          const newTarget = Math.max(1, Math.min(50, g.targetCount + delta));
          return { ...g, targetCount: newTarget };
        }
        return g;
      })
    );
  };

  const handleClaim = () => {
    if (!isAllCompleted || weeklyGoals.isRewardClaimed) return;
    onClaimWeeklyBonus();
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch {
      // ignore
    }
  };

  const getGoalIcon = (iconName) => {
    switch (iconName) {
      case "play":
        return <Play className="w-4 h-4 text-sky-400 fill-sky-400/20" />;
      case "layers":
        return <Layers className="w-4 h-4 text-purple-400" />;
      case "flame":
        return <Flame className="w-4 h-4 text-orange-400 fill-orange-500" />;
      case "check-circle-2":
        return <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
      default:
        return <Target className="w-4 h-4 text-amber-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 select-none animate-fade-in">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-950/80 via-slate-950 to-orange-950/80 p-5 sm:p-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500/20 via-orange-500/20 to-amber-500/10 border border-amber-400/40 flex items-center justify-center text-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.25)]">
              <Target className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-extrabold text-white">Weekly Learning Goals</h3>
                <span className="bg-amber-500/20 border border-amber-500/40 text-amber-300 text-[10px] font-black px-2 py-0.5 rounded-full uppercase">
                  {weeklyGoals.weekLabel}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Hit all weekly milestones to unlock the{" "}
                <span className="text-amber-400 font-bold">
                  +{weeklyGoals.bonusCoinsReward} VidyaCoins
                </span>{" "}
                Mega Package
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex flex-col gap-5">
          {/* Progress Card */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4.5">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Trophy className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-bold text-slate-200">
                  Overall Completion Progress
                </span>
              </div>
              <div className="text-xs font-mono font-bold text-amber-400">
                {overallPercentage}% ({totalCurrentPoints}/{totalTargetPoints} targets)
              </div>
            </div>

            <div className="w-full h-3.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800/80 p-0.5">
              <div
                className={`h-full rounded-full transition-all duration-700 ${
                  isAllCompleted
                    ? "bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-300 shadow-[0_0_12px_rgba(52,211,153,0.5)]"
                    : "bg-gradient-to-r from-amber-500 via-orange-500 to-amber-400"
                }`}
                style={{ width: `${Math.min(100, Math.max(0, overallPercentage))}%` }}
              />
            </div>

            <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-slate-400" /> Resets in 5 days (Sunday Midnight)
              </span>
              <span className="font-semibold text-amber-300">
                {weeklyGoals.goals.filter((g) => g.currentCount >= g.targetCount).length} of{" "}
                {weeklyGoals.goals.length} Goals Completed
              </span>
            </div>
          </div>

          {/* Reward Completion Box */}
          <div
            className={`rounded-2xl p-4 border transition ${
              weeklyGoals.isRewardClaimed
                ? "bg-emerald-950/30 border-emerald-500/30"
                : isAllCompleted
                ? "bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-amber-500/10 border-amber-400/60 shadow-lg"
                : "bg-slate-950/60 border-slate-800"
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div
                  className={`w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 ${
                    isAllCompleted
                      ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20"
                      : "bg-slate-900 border border-slate-800 text-amber-400"
                  }`}
                >
                  <Coins className="w-6 h-6 fill-current" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-white">
                      Weekly Completion Bonus Package
                    </h4>
                    {weeklyGoals.isRewardClaimed && (
                      <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.2 rounded-full">
                        Claimed
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400">
                    <span className="text-amber-400 font-bold">
                      +{weeklyGoals.bonusCoinsReward} VidyaCoins
                    </span>{" "}
                    + {weeklyGoals.bonusXp} XP + Pro Learner Badge
                  </p>
                </div>
              </div>

              {weeklyGoals.isRewardClaimed ? (
                <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-bold bg-emerald-950/60 border border-emerald-500/40 px-3 py-1.5 rounded-xl">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Bonus Package Claimed!</span>
                </div>
              ) : isAllCompleted ? (
                <button
                  onClick={handleClaim}
                  className="flex items-center justify-center gap-2 bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 hover:from-amber-300 hover:to-orange-300 text-slate-950 font-black text-xs px-4 py-2.5 rounded-xl shadow-lg shadow-orange-500/20 cursor-pointer active:scale-95 transition"
                >
                  <Sparkles className="w-4 h-4 text-slate-950" />
                  <span>Claim +{weeklyGoals.bonusCoinsReward} Coins Package</span>
                </button>
              ) : (
                <div className="text-xs text-slate-400 font-semibold bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl text-center">
                  Complete {weeklyGoals.goals.filter((g) => g.currentCount < g.targetCount).length}{" "}
                  more goal(s) to unlock
                </div>
              )}
            </div>
          </div>

          {/* Goals List Header & Customization Button */}
          <div className="flex items-center justify-between pt-1">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <span>Weekly Goals Breakdown</span>
              <span className="text-[10px] text-slate-400 lowercase font-normal">
                (Tracked automatically)
              </span>
            </h4>

            {!isEditing ? (
              <button
                onClick={() => {
                  setCustomGoals(weeklyGoals.goals);
                  setCustomBonusCoins(weeklyGoals.bonusCoinsReward);
                  setIsEditing(true);
                }}
                className="flex items-center gap-1 text-xs font-bold text-amber-400 hover:text-amber-300 bg-slate-950 border border-slate-800 hover:border-amber-500/40 px-2.5 py-1 rounded-xl transition cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Customize Targets</span>
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsEditing(false)}
                  className="text-xs text-slate-400 hover:text-slate-200 px-2.5 py-1 rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveCustomGoals}
                  className="flex items-center gap-1 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 px-3 py-1 rounded-xl transition cursor-pointer shadow"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Save Targets</span>
                </button>
              </div>
            )}
          </div>

          {/* Goals Breakdown List */}
          <div className="space-y-3">
            {(isEditing ? customGoals : weeklyGoals.goals).map((goal) => {
              const isGoalCompleted = goal.currentCount >= goal.targetCount;
              const goalPercent = Math.min(100, Math.round((goal.currentCount / goal.targetCount) * 100));

              return (
                <div
                  key={goal.id}
                  className={`rounded-2xl p-3.5 border transition flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                    isGoalCompleted
                      ? "bg-slate-950/80 border-emerald-500/30"
                      : "bg-slate-950/40 border-slate-800/80 hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 border ${
                        isGoalCompleted
                          ? "bg-emerald-950/40 border-emerald-500/40 text-emerald-400"
                          : "bg-slate-900 border-slate-800 text-slate-300"
                      }`}
                    >
                      {getGoalIcon(goal.iconName)}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h5 className="text-xs sm:text-sm font-bold text-white truncate">
                          {goal.title}
                        </h5>
                        {isGoalCompleted && (
                          <span className="text-[9px] font-black uppercase tracking-wider px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
                            <CheckCircle2 className="w-2.5 h-2.5" /> Done
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 line-clamp-1">
                        {goal.description}
                      </p>

                      <div className="w-44 sm:w-56 h-1.5 bg-slate-900 rounded-full mt-2 overflow-hidden border border-slate-800">
                        <div
                          className={`h-full rounded-full transition-all ${
                            isGoalCompleted ? "bg-emerald-400" : "bg-amber-400"
                          }`}
                          style={{ width: `${goalPercent}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3 flex-shrink-0 pt-1 sm:pt-0 border-t sm:border-t-0 border-slate-800">
                    {isEditing ? (
                      <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 px-2 py-1 rounded-xl">
                        <button
                          onClick={() => handleAdjustTarget(goal.id, -1)}
                          className="w-6 h-6 rounded-lg bg-slate-800 hover:bg-slate-700 text-white flex items-center justify-center transition"
                          title="Decrease Target"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-mono font-bold text-amber-400 w-12 text-center">
                          {goal.targetCount} {goal.unit}
                        </span>
                        <button
                          onClick={() => handleAdjustTarget(goal.id, 1)}
                          className="w-6 h-6 rounded-lg bg-slate-800 hover:bg-slate-700 text-white flex items-center justify-center transition"
                          title="Increase Target"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2.5">
                        <div className="text-right">
                          <div className="text-xs font-mono font-bold text-slate-200">
                            {goal.currentCount} / {goal.targetCount}
                          </div>
                          <div className="text-[10px] text-slate-500 uppercase">{goal.unit}</div>
                        </div>

                        {goal.type === "watch_reels" && (
                          <button
                            onClick={() => {
                              onClose();
                              onNavigateToReels();
                            }}
                            className="p-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-slate-300 hover:text-white transition"
                            title="Go to Micro-Reels"
                          >
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        )}
                        {goal.type === "complete_series" && (
                          <button
                            onClick={() => {
                              onClose();
                              onNavigateToSeries();
                            }}
                            className="p-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-slate-300 hover:text-white transition"
                            title="Go to Micro-Series"
                          >
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        )}
                        {goal.type === "ask_doubts" && (
                          <button
                            onClick={() => {
                              onClose();
                              onNavigateToDoubts();
                            }}
                            className="p-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-slate-300 hover:text-white transition"
                            title="Go to Doubt Forum"
                          >
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="bg-slate-950/40 border border-slate-800/80 rounded-2xl p-3.5 flex items-center gap-3 text-xs text-slate-400">
            <ShieldCheck className="w-5 h-5 text-amber-400 flex-shrink-0" />
            <span>
              All goal progress updates seamlessly in real-time as you watch reels, finish series episodes, and solve checkpoint quizzes.
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span className="font-mono text-[11px]">
            Goal Target Level: <strong className="text-amber-400">Standard Syllabus Sprint</strong>
          </span>
          <button
            onClick={onClose}
            className="bg-slate-800 hover:bg-slate-700 text-white font-semibold px-4 py-1.5 rounded-xl transition cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
