import React, { useState, useMemo } from "react";
import {
  Trophy,
  Star,
  Zap,
  PlaySquare,
  MessageSquare,
  Crown,
  Search,
  Filter,
  UserCheck,
  UserPlus,
  Flame,
  Clock,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  GraduationCap,
  X,
  Award,
  ArrowUpRight,
} from "lucide-react";
import {
  VerifiedMentorBadge,
  getMentorEngagementScore,
  isVerifiedHighEngagementMentor,
} from "./VerifiedMentorBadge";

export const MentorLeaderboard = ({
  mentors = [],
  userProfile,
  onFollowToggle,
  onOpenPrivateChat,
  onFilterReelsByMentor,
  onOpenMentorStudio,
}) => {
  const [sortMetric, setSortMetric] = useState("overall");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [timeframe, setTimeframe] = useState("month");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMentorDetail, setSelectedMentorDetail] = useState(null);

  const categories = [
    "All",
    "JEE / NEET Prep",
    "Tech & Coding",
    "UPSC & Govt Exams",
    "Finance & Stock Market",
    "AI & Data Science",
    "Spoken English & Communication",
  ];

  // Helper to compute a balanced composite score (0 - 100)
  const computeOverallScore = (mentor) => {
    const engagementScore = Math.min(40, (mentor.totalReelViews / 5000000) * 40);
    const feedbackScore = Math.max(0, (mentor.rating - 4.5) / 0.5) * 35;
    const doubtScore = Math.min(25, (mentor.doubtsResolved / 3200) * 25);
    return Math.round((engagementScore + feedbackScore + doubtScore) * 10) / 10;
  };

  // Filtered & Sorted Mentors
  const rankedMentors = useMemo(() => {
    let list = [...mentors];

    if (selectedCategory !== "All") {
      list = list.filter(
        (m) =>
          m.category === selectedCategory ||
          m.specialization.toLowerCase().includes(selectedCategory.toLowerCase())
      );
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (m) =>
          m.name.toLowerCase().includes(q) ||
          m.handle.toLowerCase().includes(q) ||
          m.specialization.toLowerCase().includes(q) ||
          m.qualification.toLowerCase().includes(q)
      );
    }

    list.sort((a, b) => {
      if (sortMetric === "overall") {
        return computeOverallScore(b) - computeOverallScore(a);
      }
      if (sortMetric === "engagement") {
        return b.totalReelViews - a.totalReelViews;
      }
      if (sortMetric === "feedback") {
        if (b.rating === a.rating) {
          return b.positiveFeedbackPercent - a.positiveFeedbackPercent;
        }
        return b.rating - a.rating;
      }
      if (sortMetric === "doubts") {
        return b.doubtsResolved - a.doubtsResolved;
      }
      return 0;
    });

    return list;
  }, [mentors, selectedCategory, searchQuery, sortMetric]);

  const top3 = rankedMentors.slice(0, 3);

  const formatCompactNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M";
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K";
    }
    return num.toString();
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-6">
      {/* Header & Ranking Criteria Overview */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-amber-950/40 border border-slate-800 rounded-3xl p-6 md:p-8 mb-8 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider mb-3">
                <Trophy className="w-3.5 h-3.5" />
                MentVidya Leaderboard
              </div>
              <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                Top Mentors & Educators 🌟
              </h1>
              <p className="text-slate-300 text-sm sm:text-base mt-2 max-w-2xl leading-relaxed">
                Celebrating India&apos;s top educators ranked dynamically across{" "}
                <span className="text-amber-400 font-semibold">Reel Engagement</span>,{" "}
                <span className="text-emerald-400 font-semibold">Student Feedback</span>, and{" "}
                <span className="text-cyan-400 font-semibold">Doubts Resolved</span>.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <button
                onClick={onOpenMentorStudio}
                className="flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-bold px-5 py-3 rounded-2xl shadow-lg hover:shadow-amber-500/25 transition cursor-pointer text-sm"
              >
                <GraduationCap className="w-4 h-4" />
                <span>Mentor Creator Studio</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6 pt-6 border-t border-slate-800/80">
            <div className="flex items-center gap-3 bg-slate-950/60 border border-slate-800 p-3 rounded-2xl">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center flex-shrink-0">
                <PlaySquare className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-white">Reel Engagement</span>
                  <span className="text-[10px] font-extrabold text-amber-400 bg-amber-950/80 border border-amber-500/30 px-1.5 py-0.2 rounded">
                    40% Weight
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Total views, completion rate, likes & save count
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-slate-950/60 border border-slate-800 p-3 rounded-2xl">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center flex-shrink-0">
                <Star className="w-5 h-5 text-emerald-400 fill-emerald-400/20" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-white">Student Feedback</span>
                  <span className="text-[10px] font-extrabold text-emerald-400 bg-emerald-950/80 border border-emerald-500/30 px-1.5 py-0.2 rounded">
                    35% Weight
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">
                  5-star ratings, reviews & positive feedback %
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-slate-950/60 border border-slate-800 p-3 rounded-2xl">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center flex-shrink-0">
                <Zap className="w-5 h-5 text-cyan-400" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-white">Doubts Resolved</span>
                  <span className="text-[10px] font-extrabold text-cyan-400 bg-cyan-950/80 border border-cyan-500/30 px-1.5 py-0.2 rounded">
                    25% Weight
                  </span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Solved queries, accuracy & fast turnaround speed
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between gap-2 flex-wrap text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>
                <strong className="text-white">Verified Mentor Badge:</strong> Granted to educators with ≥88% composite student engagement & certified subject credentials.
              </span>
            </div>
            <div className="flex items-center gap-1 text-[11px] text-amber-400 font-medium">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Priority 1-on-1 Consultation Access</span>
            </div>
          </div>
        </div>
      </div>

      {/* Leaderboard Controls */}
      <div className="space-y-4 mb-8">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 bg-slate-900/90 border border-slate-800 p-2.5 rounded-2xl">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs font-bold text-slate-400 px-2 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" /> Rank By:
            </span>
            <button
              onClick={() => setSortMetric("overall")}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                sortMetric === "overall"
                  ? "bg-amber-500 text-slate-950 shadow-md"
                  : "bg-slate-950 text-slate-300 hover:text-white border border-slate-800"
              }`}
            >
              <Crown className="w-3.5 h-3.5" />
              <span>Overall Score</span>
            </button>
            <button
              onClick={() => setSortMetric("engagement")}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                sortMetric === "engagement"
                  ? "bg-amber-500 text-slate-950 shadow-md"
                  : "bg-slate-950 text-slate-300 hover:text-white border border-slate-800"
              }`}
            >
              <PlaySquare className="w-3.5 h-3.5" />
              <span>Reel Engagement</span>
            </button>
            <button
              onClick={() => setSortMetric("feedback")}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                sortMetric === "feedback"
                  ? "bg-amber-500 text-slate-950 shadow-md"
                  : "bg-slate-950 text-slate-300 hover:text-white border border-slate-800"
              }`}
            >
              <Star className="w-3.5 h-3.5" />
              <span>Student Feedback</span>
            </button>
            <button
              onClick={() => setSortMetric("doubts")}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                sortMetric === "doubts"
                  ? "bg-amber-500 text-slate-950 shadow-md"
                  : "bg-slate-950 text-slate-300 hover:text-white border border-slate-800"
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Doubts Resolved</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center bg-slate-950 border border-slate-800 rounded-xl p-0.5 text-xs font-bold text-slate-400">
              <button
                onClick={() => setTimeframe("month")}
                className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${
                  timeframe === "month" ? "bg-slate-800 text-amber-400" : "hover:text-slate-200"
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setTimeframe("all_time")}
                className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${
                  timeframe === "all_time" ? "bg-slate-800 text-amber-400" : "hover:text-slate-200"
                }`}
              >
                All-Time
              </button>
              <button
                onClick={() => setTimeframe("trending")}
                className={`px-2.5 py-1 rounded-lg transition cursor-pointer ${
                  timeframe === "trending" ? "bg-slate-800 text-amber-400" : "hover:text-slate-200"
                }`}
              >
                🔥 Trending
              </button>
            </div>

            <div className="relative flex-1 sm:w-48">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search mentor..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 focus:border-amber-400 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder:text-slate-500 focus:outline-none transition"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                selectedCategory === cat
                  ? "bg-slate-800 text-amber-400 border border-amber-400/40 shadow-sm"
                  : "bg-slate-900/80 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800/80"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Top 3 Podium Cards */}
      {top3.length > 0 && !searchQuery && selectedCategory === "All" && (
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <Award className="w-5 h-5 text-amber-400" />
            <h2 className="text-lg font-black text-white tracking-tight">
              The Podium: Top 3 Hall of Fame
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-end">
            {/* Rank 2 (Silver) */}
            {top3[1] && (
              <div className="order-2 md:order-1 bg-slate-900/90 border border-slate-700/60 hover:border-slate-500 rounded-3xl p-5 relative group transition duration-300 hover:-translate-y-1 shadow-xl">
                <div className="absolute -top-3.5 left-6 bg-gradient-to-r from-slate-300 to-slate-400 text-slate-950 font-black text-xs px-3 py-1 rounded-full shadow-lg flex items-center gap-1.5">
                  <span>🥈 Rank #2</span>
                  <span className="text-[10px] opacity-80">Silver</span>
                </div>

                <div className="pt-2">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="relative">
                      <img
                        src={top3[1].avatar}
                        alt={top3[1].name}
                        className="w-16 h-16 rounded-2xl object-cover border-2 border-slate-300 shadow-md"
                      />
                      {top3[1].isOnline && (
                        <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-slate-900 rounded-full" title="Online Now" />
                      )}
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-slate-400">Vidya Score</div>
                      <div className="text-2xl font-black text-slate-200">
                        {computeOverallScore(top3[1])}
                        <span className="text-xs text-slate-400">/100</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 flex-wrap">
                    <h3 className="text-base font-bold text-white truncate">{top3[1].name}</h3>
                    <VerifiedMentorBadge mentor={top3[1]} size="sm" showScore={true} />
                  </div>
                  <p className="text-xs text-slate-400 font-medium mb-3">{top3[1].specialization}</p>

                  <div className="grid grid-cols-3 gap-1.5 bg-slate-950 p-2.5 rounded-2xl border border-slate-800/80 mb-2.5 text-center">
                    <div>
                      <div className="text-[10px] text-slate-400">Views</div>
                      <div className="text-xs font-black text-amber-400 font-mono">
                        {formatCompactNumber(top3[1].totalReelViews)}
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-400">Rating</div>
                      <div className="text-xs font-black text-emerald-400 flex items-center justify-center gap-0.5">
                        <Star className="w-3 h-3 fill-emerald-400 text-emerald-400" />
                        <span>{top3[1].rating}</span>
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-400">Doubts</div>
                      <div className="text-xs font-black text-cyan-400 font-mono">
                        {top3[1].doubtsResolved}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 bg-slate-950/90 p-2 rounded-2xl border border-slate-800 mb-4 text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center flex-shrink-0">
                        <Clock className="w-3.5 h-3.5 text-cyan-400" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-[9px] text-slate-400 font-medium uppercase tracking-tight">Avg Response</div>
                        <div className="text-xs font-bold text-cyan-300 font-mono">~{top3[1].avgResolutionTimeMinutes} mins</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 border-l border-slate-800 pl-2">
                      <div className="w-6 h-6 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center flex-shrink-0">
                        <GraduationCap className="w-3.5 h-3.5 text-amber-400" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-[9px] text-slate-400 font-medium uppercase tracking-tight">Hours Taught</div>
                        <div className="text-xs font-bold text-amber-300 font-mono">{(top3[1].totalHoursTaught || 2000).toLocaleString()}+ hrs</div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => onFollowToggle(top3[1].id)}
                      className={`flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                        userProfile.followingMentorIds.includes(top3[1].id)
                          ? "bg-slate-800 text-emerald-400 border border-emerald-500/30"
                          : "bg-slate-800 hover:bg-slate-700 text-white"
                      }`}
                    >
                      {userProfile.followingMentorIds.includes(top3[1].id) ? (
                        <>
                          <UserCheck className="w-3.5 h-3.5" />
                          <span>Following</span>
                        </>
                      ) : (
                        <>
                          <UserPlus className="w-3.5 h-3.5" />
                          <span>Follow</span>
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => setSelectedMentorDetail(top3[1])}
                      className="flex items-center justify-center gap-1 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 py-2 rounded-xl text-xs font-bold transition cursor-pointer"
                    >
                      <span>Profile</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Rank 1 (Gold) */}
            {top3[0] && (
              <div className="order-1 md:order-2 bg-gradient-to-b from-amber-950/50 via-slate-900 to-slate-900 border-2 border-amber-400 rounded-3xl p-6 relative group transition duration-300 hover:-translate-y-1.5 shadow-[0_0_30px_rgba(245,158,11,0.25)]">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 text-slate-950 font-black text-xs px-4 py-1 rounded-full shadow-xl flex items-center gap-1.5">
                  <Crown className="w-4 h-4 fill-slate-950" />
                  <span>🥇 Champion #1</span>
                </div>

                <div className="pt-2">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="relative">
                      <div className="p-0.5 rounded-2xl bg-gradient-to-tr from-amber-400 to-yellow-200">
                        <img
                          src={top3[0].avatar}
                          alt={top3[0].name}
                          className="w-20 h-20 rounded-2xl object-cover shadow-lg"
                        />
                      </div>
                      {top3[0].isOnline && (
                        <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-slate-900 rounded-full" title="Online Now" />
                      )}
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-amber-400 font-bold flex items-center justify-end gap-1">
                        <Flame className="w-3.5 h-3.5 fill-amber-400" /> Leader Score
                      </div>
                      <div className="text-3xl font-black text-amber-400">
                        {computeOverallScore(top3[0])}
                        <span className="text-xs text-slate-400 font-normal">/100</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 flex-wrap">
                    <h3 className="text-lg font-black text-white truncate">{top3[0].name}</h3>
                    <VerifiedMentorBadge mentor={top3[0]} size="sm" showScore={true} />
                  </div>
                  <p className="text-xs text-amber-300/90 font-medium mb-3">{top3[0].specialization}</p>

                  <div className="grid grid-cols-3 gap-2 bg-slate-950/90 p-3 rounded-2xl border border-amber-500/30 mb-2.5 text-center">
                    <div>
                      <div className="text-[10px] text-slate-400">Reel Views</div>
                      <div className="text-sm font-black text-amber-400 font-mono">
                        {formatCompactNumber(top3[0].totalReelViews)}
                      </div>
                      <div className="text-[9px] text-emerald-400">
                        {top3[0]?.reelEngagementRate ?? 95.4}% eng.
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-400">Feedback</div>
                      <div className="text-sm font-black text-emerald-400 flex items-center justify-center gap-0.5">
                        <Star className="w-3.5 h-3.5 fill-emerald-400 text-emerald-400" />
                        <span>{top3[0]?.rating ?? 4.9}</span>
                      </div>
                      <div className="text-[9px] text-slate-400">
                        {top3[0]?.positiveFeedbackPercent ?? 97}% pos.
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-400">Doubts Solved</div>
                      <div className="text-sm font-black text-cyan-400 font-mono">
                        {top3[0]?.doubtsResolved ?? 1200}
                      </div>
                      <div className="text-[9px] text-cyan-400">
                        ~{top3[0]?.avgResolutionTimeMinutes ?? 15}m avg
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 bg-slate-950/90 p-2.5 rounded-2xl border border-amber-500/30 mb-3 text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center flex-shrink-0">
                        <Clock className="w-4 h-4 text-cyan-400" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-[9px] text-slate-400 font-medium uppercase tracking-tight">Avg Response</div>
                        <div className="text-xs font-black text-cyan-300 font-mono">~{top3[0].avgResolutionTimeMinutes} mins</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 border-l border-slate-800 pl-2">
                      <div className="w-7 h-7 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center flex-shrink-0">
                        <GraduationCap className="w-4 h-4 text-amber-400" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-[9px] text-slate-400 font-medium uppercase tracking-tight">Hours Taught</div>
                        <div className="text-xs font-black text-amber-300 font-mono">{(top3[0].totalHoursTaught || 3420).toLocaleString()}+ hrs</div>
                      </div>
                    </div>
                  </div>

                  {top3[0].topReelTitle && (
                    <div
                      onClick={() => onFilterReelsByMentor(top3[0])}
                      className="bg-slate-950/80 border border-slate-800 hover:border-amber-500/40 p-2.5 rounded-xl mb-4 cursor-pointer group/reel transition flex items-center justify-between gap-2"
                    >
                      <div className="truncate">
                        <div className="text-[10px] text-amber-400 font-bold flex items-center gap-1">
                          <Flame className="w-3 h-3" /> Top Viral Reel
                        </div>
                        <div className="text-xs text-slate-300 truncate group-hover/reel:text-white">
                          {top3[0].topReelTitle}
                        </div>
                      </div>
                      <ArrowUpRight className="w-4 h-4 text-amber-400 flex-shrink-0" />
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => onOpenPrivateChat(top3[0])}
                      className="flex items-center justify-center gap-1.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold py-2.5 rounded-xl text-xs transition cursor-pointer shadow-md"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>1-on-1 Chat ({top3[0].privateChatFeeCoins}c)</span>
                    </button>
                    <button
                      onClick={() => setSelectedMentorDetail(top3[0])}
                      className="flex items-center justify-center gap-1 bg-slate-800 hover:bg-slate-700 text-white font-bold py-2.5 rounded-xl text-xs transition cursor-pointer"
                    >
                      <span>Full Stats & Reviews</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Rank 3 (Bronze) */}
            {top3[2] && (
              <div className="order-3 md:order-3 bg-slate-900/90 border border-amber-900/40 hover:border-amber-700/60 rounded-3xl p-5 relative group transition duration-300 hover:-translate-y-1 shadow-xl">
                <div className="absolute -top-3.5 left-6 bg-gradient-to-r from-amber-700 to-amber-800 text-amber-100 font-black text-xs px-3 py-1 rounded-full shadow-lg flex items-center gap-1.5">
                  <span>🥉 Rank #3</span>
                  <span className="text-[10px] opacity-80">Bronze</span>
                </div>

                <div className="pt-2">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="relative">
                      <img
                        src={top3[2].avatar}
                        alt={top3[2].name}
                        className="w-16 h-16 rounded-2xl object-cover border-2 border-amber-700 shadow-md"
                      />
                      {top3[2].isOnline && (
                        <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-slate-900 rounded-full" title="Online Now" />
                      )}
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-slate-400">Vidya Score</div>
                      <div className="text-2xl font-black text-slate-200">
                        {computeOverallScore(top3[2])}
                        <span className="text-xs text-slate-400">/100</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 flex-wrap">
                    <h3 className="text-base font-bold text-white truncate">{top3[2].name}</h3>
                    <VerifiedMentorBadge mentor={top3[2]} size="sm" showScore={true} />
                  </div>
                  <p className="text-xs text-slate-400 font-medium mb-3">{top3[2].specialization}</p>

                  <div className="grid grid-cols-3 gap-1.5 bg-slate-950 p-2.5 rounded-2xl border border-slate-800/80 mb-2.5 text-center">
                    <div>
                      <div className="text-[10px] text-slate-400">Views</div>
                      <div className="text-xs font-black text-amber-400 font-mono">
                        {formatCompactNumber(top3[2].totalReelViews)}
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-400">Rating</div>
                      <div className="text-xs font-black text-emerald-400 flex items-center justify-center gap-0.5">
                        <Star className="w-3 h-3 fill-emerald-400 text-emerald-400" />
                        <span>{top3[2].rating}</span>
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-400">Doubts</div>
                      <div className="text-xs font-black text-cyan-400 font-mono">
                        {top3[2].doubtsResolved}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 bg-slate-950/90 p-2 rounded-2xl border border-slate-800 mb-4 text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center flex-shrink-0">
                        <Clock className="w-3.5 h-3.5 text-cyan-400" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-[9px] text-slate-400 font-medium uppercase tracking-tight">Avg Response</div>
                        <div className="text-xs font-bold text-cyan-300 font-mono">~{top3[2].avgResolutionTimeMinutes} mins</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 border-l border-slate-800 pl-2">
                      <div className="w-6 h-6 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center flex-shrink-0">
                        <GraduationCap className="w-3.5 h-3.5 text-amber-400" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-[9px] text-slate-400 font-medium uppercase tracking-tight">Hours Taught</div>
                        <div className="text-xs font-bold text-amber-300 font-mono">{(top3[2].totalHoursTaught || 2180).toLocaleString()}+ hrs</div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => onFollowToggle(top3[2].id)}
                      className={`flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                        userProfile.followingMentorIds.includes(top3[2].id)
                          ? "bg-slate-800 text-emerald-400 border border-emerald-500/30"
                          : "bg-slate-800 hover:bg-slate-700 text-white"
                      }`}
                    >
                      {userProfile.followingMentorIds.includes(top3[2].id) ? (
                        <>
                          <UserCheck className="w-3.5 h-3.5" />
                          <span>Following</span>
                        </>
                      ) : (
                        <>
                          <UserPlus className="w-3.5 h-3.5" />
                          <span>Follow</span>
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => setSelectedMentorDetail(top3[2])}
                      className="flex items-center justify-center gap-1 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 py-2 rounded-xl text-xs font-bold transition cursor-pointer"
                    >
                      <span>Profile</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Complete Ranked Mentors Roster */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-5 md:p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-800">
          <div>
            <h2 className="text-lg font-black text-white tracking-tight flex items-center gap-2">
              <span>All Ranked Mentors</span>
              <span className="text-xs font-bold text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full">
                {rankedMentors.length} Verified Educators
              </span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Live sorted by {sortMetric === "overall" ? "Overall Score" : sortMetric === "engagement" ? "Reel Engagement" : sortMetric === "feedback" ? "Student Feedback" : "Doubts Solved"}
            </p>
          </div>
        </div>

        {/* Mentors Table / List */}
        <div className="space-y-3">
          {rankedMentors.map((mentor, index) => {
            const rank = index + 1;
            const isFollowing = userProfile.followingMentorIds.includes(mentor.id);
            const score = computeOverallScore(mentor);

            return (
              <div
                key={mentor.id}
                className={`bg-slate-950/80 hover:bg-slate-900 border ${
                  rank === 1
                    ? "border-amber-500/40 bg-amber-950/10"
                    : rank === 2
                    ? "border-slate-600/40"
                    : rank === 3
                    ? "border-amber-800/40"
                    : "border-slate-800/80"
                } rounded-2xl p-4 transition duration-200 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4`}
              >
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div
                    className={`w-9 h-9 rounded-2xl flex items-center justify-center font-black text-xs flex-shrink-0 ${
                      rank === 1
                        ? "bg-amber-400 text-slate-950 shadow-md"
                        : rank === 2
                        ? "bg-slate-300 text-slate-950"
                        : rank === 3
                        ? "bg-amber-700 text-amber-100"
                        : "bg-slate-900 border border-slate-800 text-slate-400"
                    }`}
                  >
                    #{rank}
                  </div>

                  <div className="relative flex-shrink-0 cursor-pointer" onClick={() => setSelectedMentorDetail(mentor)}>
                    <img
                      src={mentor.avatar}
                      alt={mentor.name}
                      className="w-12 h-12 rounded-2xl object-cover border border-slate-700"
                    />
                    {mentor.isOnline && (
                      <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-slate-950 rounded-full" />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3
                        onClick={() => setSelectedMentorDetail(mentor)}
                        className="text-sm font-bold text-white hover:text-amber-400 transition cursor-pointer truncate"
                      >
                        {mentor.name}
                      </h3>
                      <VerifiedMentorBadge mentor={mentor} size="xs" showScore={true} />
                      <span className="text-[11px] text-slate-400 font-mono">
                        {mentor.handle}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5 flex-wrap">
                      <span className="text-slate-300 font-medium">{mentor.specialization}</span>
                      <span>•</span>
                      <span className="text-slate-400">{mentor.qualification}</span>
                    </div>

                    <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                      <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-lg bg-cyan-950/60 border border-cyan-500/30 text-cyan-300">
                        <Clock className="w-2.5 h-2.5 text-cyan-400" />
                        <span>~{mentor.avgResolutionTimeMinutes}m response</span>
                      </span>
                      <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-lg bg-amber-950/60 border border-amber-500/30 text-amber-300">
                        <GraduationCap className="w-2.5 h-2.5 text-amber-400" />
                        <span>{(mentor.totalHoursTaught || 2000).toLocaleString()}+ hrs taught</span>
                      </span>
                      {mentor.badges.slice(0, 2).map((badge, bIdx) => (
                        <span
                          key={bIdx}
                          className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hidden sm:inline-block"
                        >
                          {badge}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 bg-slate-900/90 p-2.5 rounded-2xl border border-slate-800/80 w-full lg:w-auto text-center flex-shrink-0">
                  <div className="px-2">
                    <div className="text-[10px] text-slate-400 font-medium">Reel Views</div>
                    <div className="text-xs font-black text-amber-400 font-mono flex items-center justify-center gap-1">
                      <PlaySquare className="w-3 h-3" />
                      <span>{formatCompactNumber(mentor.totalReelViews)}</span>
                    </div>
                    <div className="text-[9px] text-slate-500">{mentor.totalReels} reels</div>
                  </div>

                  <div className="px-2 border-l border-slate-800">
                    <div className="text-[10px] text-slate-400 font-medium">Rating</div>
                    <div className="text-xs font-black text-emerald-400 flex items-center justify-center gap-1">
                      <Star className="w-3 h-3 fill-emerald-400" />
                      <span>{mentor.rating}</span>
                    </div>
                    <div className="text-[9px] text-slate-500">
                      {formatCompactNumber(mentor.studentReviewsCount)} reviews
                    </div>
                  </div>

                  <div className="px-2 border-l border-slate-800">
                    <div className="text-[10px] text-slate-400 font-medium">Doubts Solved</div>
                    <div className="text-xs font-black text-cyan-400 font-mono flex items-center justify-center gap-1">
                      <Zap className="w-3 h-3" />
                      <span>{mentor.doubtsResolved}</span>
                    </div>
                    <div className="text-[9px] text-slate-500">~{mentor.avgResolutionTimeMinutes}m speed</div>
                  </div>

                  <div className="hidden sm:block px-2 border-l border-slate-800">
                    <div className="text-[10px] text-amber-400 font-bold">Vidya Index</div>
                    <div className="text-sm font-black text-white">
                      {score}
                    </div>
                    <div className="text-[9px] text-slate-500">Score</div>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full lg:w-auto justify-end flex-shrink-0">
                  <button
                    onClick={() => onFollowToggle(mentor.id)}
                    className={`px-3 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                      isFollowing
                        ? "bg-slate-800 text-emerald-400 border border-emerald-500/30"
                        : "bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800"
                    }`}
                    title={isFollowing ? "Unfollow" : "Follow mentor"}
                  >
                    {isFollowing ? "Following" : "Follow"}
                  </button>

                  <button
                    onClick={() => onFilterReelsByMentor(mentor)}
                    className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition cursor-pointer"
                    title="Watch Reels by this Mentor"
                  >
                    <PlaySquare className="w-4 h-4 text-amber-400" />
                  </button>

                  <button
                    onClick={() => onOpenPrivateChat(mentor)}
                    className="flex items-center gap-1.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-xs px-3.5 py-2 rounded-xl shadow transition cursor-pointer"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Ask 1-on-1</span>
                  </button>

                  <button
                    onClick={() => setSelectedMentorDetail(mentor)}
                    className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition cursor-pointer"
                    title="View Full Profile & Reviews"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}

          {rankedMentors.length === 0 && (
            <div className="text-center py-12 text-slate-400">
              <p className="text-sm">No mentors found matching your filters.</p>
              <button
                onClick={() => {
                  setSelectedCategory("All");
                  setSearchQuery("");
                }}
                className="mt-3 text-xs text-amber-400 hover:underline font-bold"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mentor Detailed Inspect Modal */}
      {selectedMentorDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 relative shadow-2xl">
            <button
              onClick={() => setSelectedMentorDetail(null)}
              className="absolute top-5 right-5 p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-start gap-4 mb-6">
              <img
                src={selectedMentorDetail.avatar}
                alt={selectedMentorDetail.name}
                className="w-20 h-20 rounded-2xl object-cover border-2 border-amber-400/60 shadow-lg"
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h3 className="text-xl font-black text-white">{selectedMentorDetail.name}</h3>
                  <VerifiedMentorBadge mentor={selectedMentorDetail} size="md" showScore={true} />
                </div>
                <p className="text-xs text-amber-400 font-mono mt-0.5">{selectedMentorDetail.handle}</p>
                <p className="text-xs text-slate-300 mt-1 font-medium">
                  {selectedMentorDetail.qualification} • {selectedMentorDetail.location}
                </p>
                <p className="text-xs text-slate-400 mt-1">{selectedMentorDetail.bio}</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 bg-slate-950 p-4 rounded-2xl border border-slate-800 mb-4">
              <div className="text-center">
                <div className="text-xs text-slate-400">Reel Engagement</div>
                <div className="text-lg font-black text-amber-400 font-mono mt-0.5">
                  {formatCompactNumber(selectedMentorDetail.totalReelViews)}
                </div>
                <div className="text-[10px] text-emerald-400">
                  {selectedMentorDetail.reelEngagementRate ?? 95.4}% engagement rate
                </div>
              </div>

              <div className="text-center border-x border-slate-800">
                <div className="text-xs text-slate-400">Student Feedback</div>
                <div className="text-lg font-black text-emerald-400 flex items-center justify-center gap-1 mt-0.5">
                  <Star className="w-4 h-4 fill-emerald-400" />
                  <span>{selectedMentorDetail.rating ?? 4.9} / 5.0</span>
                </div>
                <div className="text-[10px] text-slate-400">
                  {selectedMentorDetail.positiveFeedbackPercent ?? 97}% positive rating
                </div>
              </div>

              <div className="text-center">
                <div className="text-xs text-slate-400">Doubts Solved</div>
                <div className="text-lg font-black text-cyan-400 font-mono mt-0.5">
                  {selectedMentorDetail.doubtsResolved}
                </div>
                <div className="text-[10px] text-cyan-400">
                  ~{selectedMentorDetail.avgResolutionTimeMinutes} min resolution
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 border border-slate-800 rounded-2xl p-4 mb-6 shadow-xl relative overflow-hidden">
              <div className="flex items-center justify-between gap-2 mb-3.5 pb-2.5 border-b border-slate-800/80">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-100 uppercase tracking-wider">
                      Teaching & Doubts Performance Summary
                    </h4>
                    <p className="text-[10px] text-slate-400">
                      Audited response latency benchmark & verified instruction history
                    </p>
                  </div>
                </div>
                <span className="text-[10px] bg-slate-800 text-slate-300 font-mono px-2.5 py-1 rounded-full border border-slate-700 font-semibold">
                  Audited Stats
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-slate-900/90 border border-cyan-500/30 rounded-xl p-3.5 flex flex-col justify-between hover:border-cyan-500/60 transition shadow-inner">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center flex-shrink-0">
                        <Clock className="w-4.5 h-4.5 text-cyan-400" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-200">Average Response Time</div>
                        <div className="text-[10px] text-slate-400">1-on-1 Doubt & Forum Turnaround</div>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-cyan-300 bg-cyan-500/10 px-2 py-0.5 rounded-full border border-cyan-500/30 flex items-center gap-1">
                      <Zap className="w-2.5 h-2.5 text-cyan-400" />
                      {selectedMentorDetail.avgResolutionTimeMinutes <= 12 ? "Ultra Fast" : "Fast Speed"}
                    </span>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-baseline justify-between">
                    <div>
                      <div className="text-2xl font-black text-cyan-300 font-mono flex items-baseline gap-1">
                        <span>~{selectedMentorDetail.avgResolutionTimeMinutes}</span>
                        <span className="text-xs font-normal text-slate-400">minutes</span>
                      </div>
                      <div className="text-[10px] text-cyan-400/90 mt-0.5 font-medium">
                        {selectedMentorDetail.doubtAccuracyRate}% accuracy SLA guaranteed
                      </div>
                    </div>
                    <div className="text-right text-[10px] text-slate-400 font-mono">
                      {selectedMentorDetail.doubtsResolved} doubts resolved
                    </div>
                  </div>
                </div>

                <div className="bg-slate-900/90 border border-amber-500/30 rounded-xl p-3.5 flex flex-col justify-between hover:border-amber-500/60 transition shadow-inner">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center flex-shrink-0">
                        <GraduationCap className="w-4.5 h-4.5 text-amber-400" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-200">Total Hours Taught</div>
                        <div className="text-[10px] text-slate-400">Masterclasses & Mentorship</div>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/30">
                      🎓 {selectedMentorDetail.totalStudents.toLocaleString()} Students
                    </span>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-baseline justify-between">
                    <div>
                      <div className="text-2xl font-black text-amber-400 font-mono flex items-baseline gap-1">
                        <span>{(selectedMentorDetail.totalHoursTaught || 2400).toLocaleString()}</span>
                        <span className="text-xs font-normal text-slate-400">hours</span>
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        {selectedMentorDetail.totalReels} micro-reels • {selectedMentorDetail.studentReviewsCount.toLocaleString()} reviews
                      </div>
                    </div>
                    <div className="text-right text-[10px] text-emerald-400 font-bold">
                      ⭐ {selectedMentorDetail.rating} / 5.0
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {isVerifiedHighEngagementMentor(selectedMentorDetail) && (
              <div className="bg-gradient-to-r from-amber-500/10 via-emerald-500/10 to-transparent border border-emerald-500/30 rounded-2xl p-4 mb-6 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center flex-shrink-0">
                    <ShieldCheck className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-white">
                        MentVidya Verified Educator
                      </span>
                      <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full">
                        TOP TIER
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-300 mt-0.5">
                      Earned for maintaining a {getMentorEngagementScore(selectedMentorDetail)}% student engagement score, &gt;95% doubt resolution accuracy, and verified subject credentials.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="mb-6">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Honors & Badges
              </h4>
              <div className="flex flex-wrap gap-2">
                {selectedMentorDetail.badges.map((badge, bIdx) => (
                  <span
                    key={bIdx}
                    className="text-xs font-bold px-3 py-1 rounded-xl bg-slate-800 border border-slate-700 text-amber-300"
                  >
                    {badge}
                  </span>
                ))}
              </div>
            </div>

            {selectedMentorDetail.recentReviews && selectedMentorDetail.recentReviews.length > 0 && (
              <div className="mb-6">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                  Verified Student Reviews ({selectedMentorDetail.studentReviewsCount.toLocaleString()}+)
                </h4>
                <div className="space-y-2.5">
                  {selectedMentorDetail.recentReviews.map((rev) => (
                    <div
                      key={rev.id}
                      className="bg-slate-950/70 border border-slate-800/80 p-3 rounded-2xl"
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <img
                            src={rev.studentAvatar}
                            alt={rev.studentName}
                            className="w-6 h-6 rounded-full object-cover"
                          />
                          <span className="text-xs font-bold text-white">{rev.studentName}</span>
                          <span className="text-[10px] text-amber-400 bg-amber-950/60 px-1.5 py-0.2 rounded border border-amber-500/20">
                            {rev.examOrSubject}
                          </span>
                        </div>
                        <div className="flex items-center gap-0.5 text-amber-400 text-xs">
                          {Array.from({ length: rev.rating }).map((_, i) => (
                            <Star key={i} className="w-3 h-3 fill-amber-400" />
                          ))}
                        </div>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed italic">
                        &ldquo;{rev.comment}&rdquo;
                      </p>
                      <div className="text-[10px] text-slate-500 mt-1">{rev.date}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
              <button
                onClick={() => {
                  onFilterReelsByMentor(selectedMentorDetail);
                  setSelectedMentorDetail(null);
                }}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition cursor-pointer"
              >
                <PlaySquare className="w-4 h-4 text-amber-400" />
                <span>Watch Reels ({selectedMentorDetail.totalReels})</span>
              </button>

              <button
                onClick={() => {
                  onOpenPrivateChat(selectedMentorDetail);
                  setSelectedMentorDetail(null);
                }}
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 text-xs font-bold shadow-lg transition cursor-pointer"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Start 1-on-1 Consultation ({selectedMentorDetail.privateChatFeeCoins}c)</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
