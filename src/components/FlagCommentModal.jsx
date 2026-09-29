import React, { useState } from "react";
import { Flag, X, ShieldAlert, CheckCircle2 } from "lucide-react";

export const FLAG_REASONS = [
  {
    id: "profanity",
    label: "Profanity or Abusive Language",
    description: "Contains swearing, vulgarities, or offensive words",
    icon: "🤬",
  },
  {
    id: "harassment",
    label: "Harassment or Hate Speech",
    description: "Targeted attack, discrimination, or bullying against student/mentor",
    icon: "⚠️",
  },
  {
    id: "spam",
    label: "Spam, Ads or Self-Promotion",
    description: "Unrelated promotional links, repetitive messages, or scam content",
    icon: "📢",
  },
  {
    id: "misleading",
    label: "Misleading Educational Information",
    description: "Factually incorrect formulas, fake exam advice, or cheating content",
    icon: "❌",
  },
  {
    id: "offtopic",
    label: "Off-Topic or Inappropriate",
    description: "Does not belong in educational discussion or reel feedback",
    icon: "🔇",
  },
];

export const FlagCommentModal = ({
  isOpen,
  onClose,
  onSubmitReport,
  commentAuthor = "Anonymous Student",
  commentSnippet = "",
}) => {
  const [selectedReasonId, setSelectedReasonId] = useState("profanity");
  const [additionalDetails, setAdditionalDetails] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const reasonObj = FLAG_REASONS.find((r) => r.id === selectedReasonId);
    const reasonLabel = reasonObj ? `${reasonObj.icon} ${reasonObj.label}` : "Inappropriate Content";
    
    setIsSubmitted(true);
    setTimeout(() => {
      onSubmitReport(reasonLabel, additionalDetails);
      setIsSubmitted(false);
      setAdditionalDetails("");
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-3xl p-5 sm:p-6 shadow-2xl flex flex-col gap-4 relative max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-red-500/20 border border-red-500/40 flex items-center justify-center text-red-400 flex-shrink-0">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-white flex items-center gap-2">
                Flag Inappropriate Comment
              </h3>
              <p className="text-[11px] text-slate-400">
                Help keep Scroll 4 Learning a safe & respectful learning community
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

        {/* Comment snippet preview box */}
        {commentSnippet && (
          <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-3 flex flex-col gap-1 text-xs">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Reporting content by <strong className="text-amber-400">{commentAuthor}</strong>:
            </span>
            <p className="text-slate-300 italic line-clamp-2">
              &ldquo;{commentSnippet}&rdquo;
            </p>
          </div>
        )}

        {isSubmitted ? (
          <div className="py-8 text-center flex flex-col items-center gap-3 animate-fadeIn">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-white">Report Submitted to Safety Moderation</h4>
            <p className="text-xs text-slate-300 max-w-xs">
              Thank you. This item has been flagged and isolated for review by our moderation team.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Reason Selection Options */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-slate-300">
                Select Violation Category:
              </label>

              <div className="space-y-2">
                {FLAG_REASONS.map((reason) => {
                  const isSelected = selectedReasonId === reason.id;
                  return (
                    <button
                      key={reason.id}
                      type="button"
                      onClick={() => setSelectedReasonId(reason.id)}
                      className={`w-full text-left p-3 rounded-2xl border text-xs transition flex items-start gap-3 cursor-pointer ${
                        isSelected
                          ? "bg-red-950/40 border-red-500/60 shadow-[0_0_15px_rgba(239,68,68,0.15)]"
                          : "bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-950"
                      }`}
                    >
                      <span className="text-base leading-none pt-0.5">{reason.icon}</span>
                      <div className="flex-1">
                        <div className={`font-bold ${isSelected ? "text-red-300" : "text-white"}`}>
                          {reason.label}
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          {reason.description}
                        </div>
                      </div>
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center mt-0.5 ${
                        isSelected ? "border-red-400 bg-red-500" : "border-slate-600"
                      }`}>
                        {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Additional Details */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-300">
                Additional context (optional):
              </label>
              <textarea
                rows={2}
                placeholder="Describe why this comment is inappropriate or harmful..."
                value={additionalDetails}
                onChange={(e) => setAdditionalDetails(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl p-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-red-400"
              />
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-red-600/30 flex items-center gap-1.5 cursor-pointer transition"
              >
                <Flag className="w-3.5 h-3.5 fill-white" />
                <span>Submit Flag Report</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
