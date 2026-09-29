import React, { useState } from "react";
import {
  Coins,
  Flame,
  Search,
  Sparkles,
  GraduationCap,
  Bell,
  Target,
  Radio,
  LogOut,
  ChevronDown,
  BookOpen,
  LogIn,
  Layers,
  HelpCircle,
  Video,
  Trophy,
} from "lucide-react";

export const Navbar = ({
  userProfile,
  activePortal,
  onSelectPortal,
  activeView,
  onNavigate,
  searchQuery,
  onSearchChange,
  onOpenCoinStore,
  onOpenEarnModal,
  onOpenMentorStudio,
  onChangeLanguage,
  unreadNotificationCount = 0,
  onOpenNotifications,
  onOpenWeeklyGoals,
  onOpenLiveSession,
  activeLiveCount = 1,
  isLoggedIn,
  onOpenAuthModal,
  onLogout,
}) => {
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  // Compute weekly goal metrics
  const weeklyGoals = userProfile.weeklyGoals;
  const totalTarget = weeklyGoals
    ? weeklyGoals.goals.reduce((acc, g) => acc + g.targetCount, 0)
    : 0;
  const totalCurrent = weeklyGoals
    ? weeklyGoals.goals.reduce((acc, g) => acc + Math.min(g.currentCount, g.targetCount), 0)
    : 0;
  const goalPercentage =
    totalTarget > 0 ? Math.min(100, Math.round((totalCurrent / totalTarget) * 100)) : 0;
  const isGoalAllCompleted =
    weeklyGoals?.goals.every((g) => g.currentCount >= g.targetCount) ?? false;

  const languages = [
    "Hinglish",
    "English",
    "Hindi",
    "Tamil",
    "Telugu",
    "Marathi",
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-slate-950/90 backdrop-blur-md border-b border-slate-800 px-3 sm:px-4 py-2">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2.5">
        {/* Left: Brand Logo & Portal Switcher Toggle */}
        <div className="flex items-center gap-3">
          <div
            onClick={() => {
              if (activePortal === "mentor") {
                onSelectPortal("student");
              }
              onNavigate("reels");
            }}
            className="flex items-center gap-2 cursor-pointer select-none group flex-shrink-0"
          >
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-amber-500 via-orange-500 to-emerald-500 p-0.5 shadow-[0_0_15px_rgba(245,158,11,0.4)]">
              <div className="w-full h-full bg-slate-950 rounded-2xl flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-amber-400 group-hover:rotate-12 transition-transform duration-300" />
              </div>
            </div>

            <div className="flex flex-col">
              <div className="flex items-center gap-1">
                <span className="text-base font-black tracking-tight text-white group-hover:text-amber-400 transition">
                  Scroll <span className="text-amber-400">4</span> Learning
                </span>
                <span className="hidden sm:inline-block text-[9px] font-bold text-emerald-400 bg-emerald-950/80 px-1.5 py-0.2 rounded border border-emerald-500/30">
                  INDIA
                </span>
              </div>
              <span className="text-[10px] text-slate-400 -mt-0.5 hidden sm:block">
                Concept Reels & Live Hub
              </span>
            </div>
          </div>

          {/* Direct Segmented Portal Selector (Student vs Mentor) - Rendered ONLY for verified Mentors */}
          {userProfile.role === "mentor" && (
            <div className="hidden sm:flex items-center p-1 bg-slate-900/90 rounded-2xl border border-slate-800">
              <button
                onClick={() => onSelectPortal("student")}
                className={`px-3 py-1 rounded-xl text-xs font-black transition flex items-center gap-1.5 cursor-pointer ${
                  activePortal === "student"
                    ? "bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 shadow-md"
                    : "text-slate-400 hover:text-slate-200"
                }`}
                title="Student Portal: Watch concept reels, micro-series, and ask doubts"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>🎓 Student</span>
              </button>

              <button
                onClick={() => onSelectPortal("mentor")}
                className={`px-3 py-1 rounded-xl text-xs font-black transition flex items-center gap-1.5 cursor-pointer ${
                  activePortal === "mentor"
                    ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-md"
                    : "text-slate-400 hover:text-slate-200"
                }`}
                title="Mentor Portal: Broadcast masterclasses, publish reels, solve doubts, and earn"
              >
                <GraduationCap className="w-3.5 h-3.5" />
                <span>👨‍🏫 Mentor</span>
              </button>
            </div>
          )}
        </div>

        {/* Center: Search Bar (Student Portal) */}
        {activePortal === "student" && (
          <div className="hidden md:flex items-center flex-1 max-w-xs relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search reels, mentors, exams..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 focus:border-amber-400 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder:text-slate-500 focus:outline-none transition"
            />
          </div>
        )}

        {/* Center Navigation Links */}
        {activePortal === "student" && (
          <nav className="hidden lg:flex flex-row items-center gap-1 bg-slate-900/90 p-1.5 rounded-full border border-slate-800/80 shadow-inner">
            <button
              type="button"
              onClick={() => onNavigate("reels")}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer flex flex-row items-center gap-2 whitespace-nowrap leading-none ${
                activeView === "reels"
                  ? "bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 text-white shadow-vidya-glow font-extrabold"
                  : "text-slate-300 hover:text-white hover:bg-slate-800/70"
              }`}
            >
              <Video className={`w-3.5 h-3.5 ${activeView === "reels" ? "text-white" : "text-indigo-400"}`} />
              <span>Reels</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigate("series")}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer flex flex-row items-center gap-2 whitespace-nowrap leading-none ${
                activeView === "series"
                  ? "bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 text-white shadow-vidya-glow font-extrabold"
                  : "text-slate-300 hover:text-white hover:bg-slate-800/70"
              }`}
            >
              <Layers className={`w-3.5 h-3.5 ${activeView === "series" ? "text-white" : "text-purple-400"}`} />
              <span>Series</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigate("doubts")}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer flex flex-row items-center gap-2 whitespace-nowrap leading-none ${
                activeView === "doubts"
                  ? "bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 text-white shadow-vidya-glow font-extrabold"
                  : "text-slate-300 hover:text-white hover:bg-slate-800/70"
              }`}
            >
              <HelpCircle className={`w-3.5 h-3.5 ${activeView === "doubts" ? "text-white" : "text-amber-400"}`} />
              <span>Doubts</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigate("leaderboard")}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer flex flex-row items-center gap-2 whitespace-nowrap leading-none ${
                activeView === "leaderboard"
                  ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-emerald-glow font-extrabold"
                  : "text-emerald-400 hover:text-emerald-300 hover:bg-slate-800/70"
              }`}
            >
              <Trophy className="w-3.5 h-3.5 text-emerald-400" />
              <span>Mentors</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigate("library")}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer flex flex-row items-center gap-2 whitespace-nowrap leading-none ${
                activeView === "library"
                  ? "bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 text-white shadow-vidya-glow font-extrabold"
                  : "text-slate-300 hover:text-white hover:bg-slate-800/70"
              }`}
            >
              <BookOpen className={`w-3.5 h-3.5 ${activeView === "library" ? "text-white" : "text-sky-400"}`} />
              <span>Library</span>
            </button>

            {onOpenLiveSession && (
              <button
                type="button"
                onClick={onOpenLiveSession}
                className="px-4 py-2 rounded-full text-xs font-black transition-all duration-200 cursor-pointer flex flex-row items-center gap-2 whitespace-nowrap leading-none bg-rose-600/20 hover:bg-rose-600/35 text-rose-300 border border-rose-500/40 shadow-sm animate-pulse ml-0.5"
                title="Join active Live Teaching Masterclass"
              >
                <Radio className="w-3.5 h-3.5 text-rose-400" />
                <span>Live ({activeLiveCount})</span>
              </button>
            )}
          </nav>
        )}

        {/* Right Action Icons & User Dropdown */}
        <div className="flex items-center gap-2">
          {activePortal === "student" && onOpenLiveSession && (
            <button
              onClick={onOpenLiveSession}
              className="flex items-center gap-1.5 bg-rose-600/20 hover:bg-rose-600/35 border border-rose-500/50 text-rose-300 px-2.5 py-1 rounded-xl text-xs font-extrabold animate-pulse cursor-pointer shadow-sm"
              title="Live Masterclasses"
            >
              <Radio className="w-3.5 h-3.5 text-rose-400" />
              <span>LIVE ({activeLiveCount})</span>
            </button>
          )}

          {activePortal === "student" && weeklyGoals && (
            <button
              onClick={onOpenWeeklyGoals}
              className={`hidden md:flex items-center gap-2 px-2.5 py-1 rounded-xl text-xs font-bold transition cursor-pointer border shadow-sm ${
                weeklyGoals.isRewardClaimed
                  ? "bg-emerald-950/60 hover:bg-emerald-900/60 border-emerald-500/40 text-emerald-300"
                  : isGoalAllCompleted
                  ? "bg-gradient-to-r from-amber-500/30 via-orange-500/30 to-amber-500/20 hover:border-amber-400 border-amber-400/60 text-amber-300 animate-pulse"
                  : "bg-slate-900/90 hover:bg-slate-800/90 border-slate-700/80 hover:border-amber-400/50 text-slate-200"
              }`}
              title={`Weekly Goals: ${goalPercentage}% complete`}
            >
              <Target className="w-3.5 h-3.5 text-amber-400" />
              <span className="font-mono text-[10px] text-amber-400 font-bold">{goalPercentage}%</span>
            </button>
          )}

          <button
            onClick={onOpenNotifications}
            className="relative p-2 bg-slate-900 hover:bg-slate-800 border border-slate-700/80 hover:border-amber-500/50 text-slate-200 hover:text-amber-400 rounded-xl transition cursor-pointer"
            title="Daily Notifications & Reminders"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadNotificationCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-amber-500 text-[9px] font-black text-slate-950 ring-2 ring-slate-950 animate-bounce">
                {unreadNotificationCount > 9 ? "9+" : unreadNotificationCount}
              </span>
            )}
          </button>

          <button
            onClick={onOpenEarnModal}
            className="flex items-center gap-1 bg-orange-950/60 hover:bg-orange-900/60 border border-orange-500/40 text-orange-300 px-2 py-1 rounded-xl text-xs font-bold transition cursor-pointer"
            title="Daily Study Streak"
          >
            <Flame className="w-3.5 h-3.5 fill-orange-500 text-orange-400 animate-pulse" />
            <span>{userProfile.streakDays}d</span>
          </button>

          <button
            onClick={onOpenCoinStore}
            className="flex items-center gap-1.5 bg-amber-950/60 hover:bg-amber-900/60 border border-amber-400/50 text-amber-300 px-2.5 py-1 rounded-xl text-xs font-black transition cursor-pointer shadow-sm"
            title="VidyaCoin Wallet"
          >
            <Coins className="w-3.5 h-3.5 fill-amber-400 text-amber-300" />
            <span className="font-mono text-xs">{userProfile.vidyaCoins}</span>
          </button>

          <div className="relative">
            {isLoggedIn ? (
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-amber-400/60 rounded-xl p-1 pr-2 transition cursor-pointer"
                title="Account Menu & Portal Switch"
              >
                <img
                  src={userProfile.avatar}
                  alt={userProfile.name}
                  className="w-6 h-6 rounded-lg object-cover border border-amber-400/80"
                />
                <span className="text-xs font-bold text-slate-200 hidden sm:inline max-w-[80px] truncate">
                  {userProfile.name.split(" ")[0]}
                </span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>
            ) : (
              <button
                onClick={() => onOpenAuthModal("student")}
                className="flex items-center gap-1.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs px-3 py-1.5 rounded-xl shadow transition cursor-pointer"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Log In</span>
              </button>
            )}

            {showUserMenu && isLoggedIn && (
              <div className="absolute right-0 top-full mt-1.5 w-64 bg-slate-900 border border-slate-700/90 rounded-2xl shadow-2xl py-2 z-50 animate-fadeIn">
                <div className="px-3.5 py-2.5 border-b border-slate-800">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={userProfile.avatar}
                      alt={userProfile.name}
                      className="w-10 h-10 rounded-xl object-cover border-2 border-amber-400"
                    />
                    <div className="min-w-0">
                      <div className="text-xs font-black text-white truncate">{userProfile.name}</div>
                      <div className="text-[10px] text-slate-400 truncate">{userProfile.email}</div>
                      <span className={`inline-block text-[9px] font-bold px-1.5 py-0.2 rounded-full mt-0.5 ${
                        userProfile.role === "mentor"
                          ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                          : "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                      }`}>
                        {userProfile.role === "mentor" ? "👨‍🏫 Verified Mentor" : "🎓 Student Aspirant"}
                      </span>
                    </div>
                  </div>
                </div>

                {userProfile.role === "mentor" ? (
                  <div className="p-2 border-b border-slate-800">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 mb-1.5">
                      Active Portal
                    </div>
                    <div className="grid grid-cols-2 gap-1.5 bg-slate-950 p-1 rounded-xl">
                      <button
                        onClick={() => {
                          onSelectPortal("student");
                          setShowUserMenu(false);
                        }}
                        className={`px-2 py-1.5 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1 cursor-pointer ${
                          activePortal === "student"
                            ? "bg-amber-500 text-slate-950"
                            : "text-slate-400 hover:text-white"
                        }`}
                      >
                        <BookOpen className="w-3 h-3" />
                        <span>Student</span>
                      </button>
                      <button
                        onClick={() => {
                          onSelectPortal("mentor");
                          setShowUserMenu(false);
                        }}
                        className={`px-2 py-1.5 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1 cursor-pointer ${
                          activePortal === "mentor"
                            ? "bg-emerald-500 text-slate-950"
                            : "text-slate-400 hover:text-white"
                        }`}
                      >
                        <GraduationCap className="w-3 h-3" />
                        <span>Mentor</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="p-2 border-b border-slate-800">
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        onOpenAuthModal("mentor");
                      }}
                      className="w-full text-left px-2.5 py-1.5 text-xs font-bold text-amber-400 hover:bg-slate-800/80 rounded-xl flex items-center gap-1.5 transition cursor-pointer"
                    >
                      <GraduationCap className="w-4 h-4 text-emerald-400" />
                      <span>Log In / Apply as Mentor</span>
                    </button>
                  </div>
                )}

                <div className="py-1">
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      onOpenAuthModal(activePortal === "student" ? "mentor" : "student");
                    }}
                    className="w-full text-left px-3.5 py-2 text-xs text-slate-300 hover:bg-slate-800 hover:text-amber-400 flex items-center gap-2 transition cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>Switch Profile / Demo User</span>
                  </button>

                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      onLogout();
                    }}
                    className="w-full text-left px-3.5 py-2 text-xs text-rose-400 hover:bg-rose-950/40 hover:text-rose-300 flex items-center gap-2 transition cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Log Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
