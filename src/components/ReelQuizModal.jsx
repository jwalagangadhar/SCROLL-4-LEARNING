import React, { useState } from "react";
import {
  HelpCircle,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import confetti from "canvas-confetti";

export const ReelQuizModal = ({
  reel,
  onQuizCompleted,
  onClose,
}) => {
  const quiz = reel.quiz;
  const [selectedIdx, setSelectedIdx] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!quiz) return null;

  const handleOptionSelect = (idx) => {
    if (isSubmitted) return;
    setSelectedIdx(idx);
  };

  const handleSubmit = () => {
    if (selectedIdx === null) return;
    setIsSubmitted(true);

    if (selectedIdx === quiz.correctIdx) {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 },
      });
      onQuizCompleted(reel.id, quiz.rewardCoins);
    }
  };

  const isCorrect = selectedIdx === quiz.correctIdx;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 select-none">
      <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-3xl overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="bg-slate-950 px-5 py-3.5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-amber-500/20 border border-amber-400/40 text-amber-400 flex items-center justify-center">
              <HelpCircle className="w-4 h-4" />
            </span>
            <div>
              <h4 className="text-xs font-bold text-white">In-Reel Concept Check</h4>
              <span className="text-[10px] text-amber-400 font-mono">
                Solve & Earn +{quiz.rewardCoins} VidyaCoins
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Question & Options */}
        <div className="p-5 flex flex-col gap-4">
          <div className="text-sm font-bold text-white leading-snug">
            {quiz.question}
          </div>

          <div className="flex flex-col gap-2.5">
            {quiz.options.map((opt, idx) => {
              const isSelected = selectedIdx === idx;
              let btnClass = "bg-slate-950 border-slate-800 text-slate-200 hover:border-slate-700";

              if (isSelected && !isSubmitted) {
                btnClass = "bg-amber-950/40 border-amber-400 text-amber-300 shadow-md";
              } else if (isSubmitted) {
                if (idx === quiz.correctIdx) {
                  btnClass = "bg-emerald-950/60 border-emerald-400 text-emerald-200 font-bold";
                } else if (isSelected) {
                  btnClass = "bg-rose-950/60 border-rose-500 text-rose-300 line-through";
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleOptionSelect(idx)}
                  className={`p-3 rounded-2xl border text-xs text-left transition flex items-center justify-between gap-2 cursor-pointer ${btnClass}`}
                >
                  <span>{opt}</span>
                  {isSubmitted && idx === quiz.correctIdx && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  )}
                  {isSubmitted && isSelected && idx !== quiz.correctIdx && (
                    <XCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Explanation after submission */}
          {isSubmitted && (
            <div
              className={`p-3.5 rounded-2xl border text-xs leading-relaxed flex flex-col gap-1 ${
                isCorrect
                  ? "bg-emerald-950/40 border-emerald-500/40 text-emerald-200"
                  : "bg-rose-950/30 border-rose-500/40 text-rose-200"
              }`}
            >
              <div className="font-bold flex items-center gap-1">
                {isCorrect ? "🎉 Correct Answer! (+15 Coins Earned)" : "❌ Incorrect, but great effort!"}
              </div>
              <p className="text-[11px] text-slate-300">{quiz.explanation}</p>
            </div>
          )}

          {/* Footer Action */}
          {!isSubmitted ? (
            <button
              onClick={handleSubmit}
              disabled={selectedIdx === null}
              className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 disabled:opacity-50 text-slate-950 font-bold text-xs rounded-xl shadow-lg transition cursor-pointer"
            >
              Submit Answer
            </button>
          ) : (
            <button
              onClick={onClose}
              className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs rounded-xl transition cursor-pointer"
            >
              Continue Watching Reel
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
