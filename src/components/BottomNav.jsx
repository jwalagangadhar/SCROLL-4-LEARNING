import React from "react";
import {
  PlaySquare,
  Layers,
  HelpCircle,
  Bookmark,
  GraduationCap,
  Trophy,
  BookOpen,
  Radio,
} from "lucide-react";

export const BottomNav = ({
  activePortal,
  onSelectPortal,
  activeView,
  onNavigate,
  onOpenMentorStudio,
  onOpenLiveSession,
}) => {
  if (activePortal === "mentor") {
    return (
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-md border-t border-slate-800 px-2 py-2 flex items-center justify-around">
        <button
          onClick={() => onSelectPortal("student")}
          className="flex flex-col items-center gap-0.5 text-[10px] font-semibold text-amber-400 hover:text-amber-300 transition cursor-pointer"
        >
          <BookOpen className="w-5 h-5" />
          <span>Student Feed</span>
        </button>

        <button
          onClick={() => onSelectPortal("mentor")}
          className="flex flex-col items-center gap-0.5 text-[10px] font-bold text-emerald-400 transition cursor-pointer"
        >
          <GraduationCap className="w-5 h-5" />
          <span>Mentor Studio</span>
        </button>

        <button
          onClick={() => onNavigate("doubts")}
          className={`flex flex-col items-center gap-0.5 text-[10px] font-semibold transition cursor-pointer ${
            activeView === "doubts" ? "text-emerald-400 font-bold" : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <HelpCircle className="w-5 h-5" />
          <span>Doubts Hub</span>
        </button>

        <button
          onClick={() => onNavigate("leaderboard")}
          className={`flex flex-col items-center gap-0.5 text-[10px] font-semibold transition cursor-pointer ${
            activeView === "leaderboard" ? "text-emerald-400 font-bold" : "text-slate-400 hover:text-slate-200"
          }`}
        >
          <Trophy className="w-5 h-5" />
          <span>Rankings</span>
        </button>
      </nav>
    );
  }

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-md border-t border-slate-800/80 px-2 py-2 flex items-center justify-around shadow-vidya-glow">
      <button
        onClick={() => onNavigate("reels")}
        className={`flex flex-col items-center gap-0.5 text-[10px] font-semibold transition cursor-pointer ${
          activeView === "reels" ? "text-indigo-400 font-bold drop-shadow-[0_0_8px_rgba(99,102,241,0.6)]" : "text-slate-400 hover:text-slate-200"
        }`}
      >
        <PlaySquare className="w-5 h-5" />
        <span>Reels</span>
      </button>

      {onOpenLiveSession && (
        <button
          onClick={onOpenLiveSession}
          className="flex flex-col items-center gap-0.5 text-[10px] font-extrabold text-rose-400 animate-pulse transition cursor-pointer"
        >
          <Radio className="w-5 h-5 text-rose-400" />
          <span>LIVE</span>
        </button>
      )}

      <button
        onClick={() => onNavigate("series")}
        className={`flex flex-col items-center gap-0.5 text-[10px] font-semibold transition cursor-pointer ${
          activeView === "series" ? "text-indigo-400 font-bold drop-shadow-[0_0_8px_rgba(99,102,241,0.6)]" : "text-slate-400 hover:text-slate-200"
        }`}
      >
        <Layers className="w-5 h-5" />
        <span>Series</span>
      </button>

      <button
        onClick={() => onNavigate("leaderboard")}
        className={`flex flex-col items-center gap-0.5 text-[10px] font-semibold transition cursor-pointer ${
          activeView === "leaderboard" ? "text-emerald-400 font-bold drop-shadow-[0_0_8px_rgba(16,185,129,0.6)]" : "text-emerald-400/80 hover:text-emerald-300"
        }`}
      >
        <Trophy className="w-5 h-5" />
        <span>Mentors</span>
      </button>

      <button
        onClick={() => onNavigate("doubts")}
        className={`flex flex-col items-center gap-0.5 text-[10px] font-semibold transition cursor-pointer ${
          activeView === "doubts" ? "text-amber-400 font-bold drop-shadow-[0_0_8px_rgba(245,158,11,0.6)]" : "text-slate-400 hover:text-slate-200"
        }`}
      >
        <HelpCircle className="w-5 h-5" />
        <span>Doubts</span>
      </button>
    </nav>
  );
};
