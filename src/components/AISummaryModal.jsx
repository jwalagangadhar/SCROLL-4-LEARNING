import React, { useState, useEffect } from "react";
import { Sparkles, Check, Copy } from "lucide-react";

export const AISummaryModal = ({ reel, onClose }) => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetch("/api/ai/reel-summary", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: reel.title,
        subject: reel.subject,
        mentorName: reel.mentor.name,
        description: reel.description,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setSummary(data.summary);
        setLoading(false);
      })
      .catch(() => {
        setSummary(
          `### ⚡ 60-Second High-Yield Summary: ${reel.title}\n**1. Core Idea:**\n${reel.description}\n\n**2. 🔑 Key Formula / Rule:**\nAlways verify critical boundary values and examine edge cases before finalizing your answer.\n\n**3. 🧠 Memory Trick:**\nRemember the graphical mental model alongside formula substitution!`
        );
        setLoading(false);
      });
  }, [reel]);

  const handleCopy = () => {
    if (summary) {
      navigator.clipboard.writeText(summary);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 select-none">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-950/70 via-slate-950 to-indigo-950/70 p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-purple-500/20 border border-purple-400/40 text-purple-300 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">
                AI 60-Second Flashcard Notes
              </h3>
              <p className="text-[11px] text-purple-300 font-mono">
                {reel.mentor.name} • #{reel.topicTag}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="p-5 overflow-y-auto flex-1">
          {loading ? (
            <div className="py-12 flex flex-col items-center justify-center gap-3 text-center">
              <div className="w-10 h-10 border-3 border-purple-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-xs text-purple-300 font-medium">
                Gemini AI is condensing reel takeaways into high-yield flashcard notes...
              </p>
            </div>
          ) : (
            <div className="bg-slate-950 border border-purple-500/30 rounded-2xl p-4 text-xs text-slate-200 leading-relaxed whitespace-pre-line shadow-inner">
              {summary}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          <button
            onClick={handleCopy}
            disabled={!summary}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? "Copied to Clipboard!" : "Copy Notes"}</span>
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl shadow transition cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
