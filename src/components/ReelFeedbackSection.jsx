import React, { useState } from "react";
import {
  Star,
  Sparkles,
  Shield,
  ThumbsUp,
  Heart,
  Search,
  MessageSquare,
  Send,
  CheckCircle2,
  Lightbulb,
  Award,
  Zap,
  Clock,
  ChevronDown,
  Flag,
  ShieldAlert,
} from "lucide-react";
import {
  MOCK_ANONYMOUS_REEL_REVIEWS,
  getMentorFeedbackSummary,
} from "../data/mockFeedbackData";
import { FlagCommentModal } from "./FlagCommentModal";

export const ReelFeedbackSection = ({
  currentMentor,
  allReels = [],
}) => {
  const mentorId = currentMentor?.id || "mentor-1";
  const feedbackSummary = getMentorFeedbackSummary(mentorId);

  const initialReviews = (MOCK_ANONYMOUS_REEL_REVIEWS || []).filter(
    (r) => r.mentorId === mentorId || r.mentorId === "mentor-1"
  );
  const [reviews, setReviews] = useState(initialReviews);

  const [selectedReelFilter, setSelectedReelFilter] = useState("all");
  const [selectedRatingFilter, setSelectedRatingFilter] = useState("all");
  const [selectedTagFilter, setSelectedTagFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("helpful");
  const [showFlaggedOnly, setShowFlaggedOnly] = useState(false);

  const [flaggedReviewIds, setFlaggedReviewIds] = useState([]);
  const [flagModalConfig, setFlagModalConfig] = useState({ isOpen: false });
  const [toastMessage, setToastMessage] = useState(null);

  const handleFlagReportSubmit = (reasonLabel, details) => {
    if (flagModalConfig.reviewId) {
      const revId = flagModalConfig.reviewId;
      setFlaggedReviewIds((prev) => (prev.includes(revId) ? prev : [...prev, revId]));
      setToastMessage(`Comment flagged under "${reasonLabel}". Sent for moderation review.`);
      setTimeout(() => setToastMessage(null), 4500);
    }
  };

  const [replyingReviewId, setReplyingReviewId] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [showSimulateModal, setShowSimulateModal] = useState(false);

  const [simAlias, setSimAlias] = useState("Anonymous Aspirant #552");
  const [simReelTitle, setSimReelTitle] = useState(
    "Total Internal Reflection: Why Diamonds Sparkle & Jio Fiber Works!"
  );
  const [simRating, setSimRating] = useState(5);
  const [simComment, setSimComment] = useState("");
  const [simTag, setSimTag] = useState("⚡ Crystal Clear Intuition");

  const handleToggleHeart = (reviewId) => {
    setReviews((prev) =>
      prev.map((rev) => {
        if (rev.id === reviewId) {
          const newState = !rev.isHeartedByMentor;
          return {
            ...rev,
            isHeartedByMentor: newState,
            helpfulCount: newState ? rev.helpfulCount + 1 : rev.helpfulCount,
          };
        }
        return rev;
      })
    );
  };

  const handleSubmitReply = (reviewId) => {
    if (!replyText.trim()) return;
    setReviews((prev) =>
      prev.map((rev) => (rev.id === reviewId ? { ...rev, mentorReply: replyText.trim() } : rev))
    );
    setReplyingReviewId(null);
    setReplyText("");
  };

  const handleAddSimulatedReview = (e) => {
    e.preventDefault();
    if (!simComment.trim()) return;

    const newRev = {
      id: `fb-sim-${Date.now()}`,
      mentorId: currentMentor.id,
      reelTitle: simReelTitle,
      subject: currentMentor.category || "JEE / NEET Prep",
      anonymousStudentAlias: simAlias.trim() || "Anonymous Student #104",
      avatarGradient: "from-amber-500 via-rose-500 to-purple-600",
      rating: simRating,
      clarityScore: simRating,
      visualsScore: simRating,
      examRelevanceScore: 5,
      pacingScore: 5,
      comment: simComment.trim(),
      tags: [simTag, "🎯 High Yield Exam Trick"],
      timeAgo: "Just now",
      helpfulCount: 1,
      isHeartedByMentor: false,
    };

    setReviews((prev) => [newRev, ...prev]);
    setShowSimulateModal(false);
    setSimComment("");
  };

  const availableReelTitles = Array.from(
    new Set([
      ...reviews.map((r) => r.reelTitle),
      ...(currentMentor.topReelTitle ? [currentMentor.topReelTitle] : []),
      ...allReels.map((r) => r.title),
    ])
  ).filter(Boolean);

  const filteredReviews = reviews
    .filter((rev) => {
      if (showFlaggedOnly && !flaggedReviewIds.includes(rev.id)) {
        return false;
      }
      if (selectedReelFilter !== "all" && rev.reelTitle !== selectedReelFilter) {
        return false;
      }
      if (selectedRatingFilter !== "all" && Math.floor(rev.rating) !== selectedRatingFilter) {
        return false;
      }
      if (selectedTagFilter !== "all" && !rev.tags.includes(selectedTagFilter)) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesComment = rev.comment.toLowerCase().includes(q);
        const matchesAlias = rev.anonymousStudentAlias.toLowerCase().includes(q);
        const matchesReel = rev.reelTitle.toLowerCase().includes(q);
        const matchesTag = rev.tags.some((t) => t.toLowerCase().includes(q));
        if (!matchesComment && !matchesAlias && !matchesReel && !matchesTag) {
          return false;
        }
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "helpful") return b.helpfulCount - a.helpfulCount;
      if (sortBy === "highest") return b.rating - a.rating;
      if (sortBy === "lowest") return a.rating - b.rating;
      return 0;
    });

  return (
    <div className="flex flex-col gap-6">
      {/* 1. Top Aggregated Feedback Scores Header Card */}
      <div className="bg-gradient-to-br from-amber-950/40 via-slate-950 to-indigo-950/40 border border-amber-500/40 rounded-3xl p-5 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 pb-5 border-b border-slate-800/80">
          <div className="flex items-start sm:items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-400 p-0.5 shadow-lg flex-shrink-0">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex flex-col items-center justify-center text-center p-1">
                <span className="text-xl font-black text-amber-400 font-mono leading-none">
                  {feedbackSummary.averageRating}
                </span>
                <div className="flex items-center gap-0.5 mt-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-2.5 h-2.5 fill-amber-400 text-amber-400"
                    />
                  ))}
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-base font-black text-white">
                  Aggregated Student Feedback Score
                </h3>
                <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  99.2% POSITIVE RATING
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1 flex items-center gap-1.5 flex-wrap">
                <span>Based on</span>
                <strong className="text-amber-300 font-mono font-bold">
                  {feedbackSummary.totalReviews.toLocaleString()}+ verified student evaluations
                </strong>
                <span>across {currentMentor.totalReels} VidyaReels</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap">
            <div className="bg-slate-900/90 border border-slate-800 px-3.5 py-2 rounded-2xl flex items-center gap-2 text-xs">
              <Shield className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <div>
                <div className="font-bold text-slate-200 text-[11px]">
                  100% Anonymous & Shielded
                </div>
                <div className="text-[10px] text-slate-400">
                  Unbiased student feedback
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowSimulateModal(true)}
              className="bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 hover:border-amber-400 px-3.5 py-2 rounded-2xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-sm"
              title="Simulate how an incoming anonymous review appears in real time"
            >
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>Test Review Stream</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mt-5">
          <div className="lg:col-span-5 bg-slate-900/70 border border-slate-800/80 rounded-2xl p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                <span>Rating Breakdown</span>
              </span>
              <span className="text-[10px] text-slate-400 font-mono">
                Click bar to filter
              </span>
            </div>

            <div className="space-y-2 text-xs">
              {[
                { stars: 5, pct: feedbackSummary.starDistribution[5] },
                { stars: 4, pct: feedbackSummary.starDistribution[4] },
                { stars: 3, pct: feedbackSummary.starDistribution[3] },
                { stars: 2, pct: feedbackSummary.starDistribution[2] },
                { stars: 1, pct: feedbackSummary.starDistribution[1] },
              ].map(({ stars, pct }) => (
                <button
                  key={stars}
                  onClick={() =>
                    setSelectedRatingFilter(
                      selectedRatingFilter === stars ? "all" : stars
                    )
                  }
                  className={`w-full flex items-center gap-2 text-left group p-1 rounded-lg transition ${
                    selectedRatingFilter === stars
                      ? "bg-amber-500/20 border border-amber-400/50"
                      : "hover:bg-slate-800/60"
                  }`}
                >
                  <span className="w-7 text-[11px] font-bold text-slate-300 flex items-center gap-0.5">
                    {stars} <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                  </span>
                  <div className="flex-1 bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-800">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        stars >= 4
                          ? "bg-gradient-to-r from-amber-400 to-orange-400"
                          : stars === 3
                          ? "bg-amber-500/80"
                          : "bg-slate-600"
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="w-10 text-right text-[11px] font-mono text-slate-400 font-bold group-hover:text-amber-300">
                    {pct}%
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="lg:col-span-7 bg-slate-900/70 border border-slate-800/80 rounded-2xl p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Pedagogy & 60s Reel Dimension Scores</span>
              </span>
              <span className="text-[10px] text-emerald-400 font-bold">
                ✓ Top 1% Educator Benchmark
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="bg-slate-950/80 border border-slate-800 p-2.5 rounded-xl">
                <div className="flex items-center justify-between text-slate-300 mb-1">
                  <span className="text-[11px] font-medium text-slate-400">
                    Concept Clarity & Intuition
                  </span>
                  <span className="font-mono font-bold text-amber-400">
                    {feedbackSummary.dimensionScores.conceptClarity} / 5.0
                  </span>
                </div>
                <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-400 to-orange-400 rounded-full"
                    style={{
                      width: `${(feedbackSummary.dimensionScores.conceptClarity / 5) * 100}%`,
                    }}
                  />
                </div>
              </div>

              <div className="bg-slate-950/80 border border-slate-800 p-2.5 rounded-xl">
                <div className="flex items-center justify-between text-slate-300 mb-1">
                  <span className="text-[11px] font-medium text-slate-400">
                    3D Animation & Visual Quality
                  </span>
                  <span className="font-mono font-bold text-cyan-400">
                    {feedbackSummary.dimensionScores.visualQuality} / 5.0
                  </span>
                </div>
                <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full"
                    style={{
                      width: `${(feedbackSummary.dimensionScores.visualQuality / 5) * 100}%`,
                    }}
                  />
                </div>
              </div>

              <div className="bg-slate-950/80 border border-slate-800 p-2.5 rounded-xl">
                <div className="flex items-center justify-between text-slate-300 mb-1">
                  <span className="text-[11px] font-medium text-slate-400">
                    Exam & PYQ High-Yield Fit
                  </span>
                  <span className="font-mono font-bold text-emerald-400">
                    {feedbackSummary.dimensionScores.examRelevance} / 5.0
                  </span>
                </div>
                <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full"
                    style={{
                      width: `${(feedbackSummary.dimensionScores.examRelevance / 5) * 100}%`,
                    }}
                  />
                </div>
              </div>

              <div className="bg-slate-950/80 border border-slate-800 p-2.5 rounded-xl">
                <div className="flex items-center justify-between text-slate-300 mb-1">
                  <span className="text-[11px] font-medium text-slate-400">
                    60-Second Micro Pacing
                  </span>
                  <span className="font-mono font-bold text-fuchsia-400">
                    {feedbackSummary.dimensionScores.pacingEfficiency} / 5.0
                  </span>
                </div>
                <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-fuchsia-400 to-pink-400 rounded-full"
                    style={{
                      width: `${(feedbackSummary.dimensionScores.pacingEfficiency / 5) * 100}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-4 border-t border-slate-800/80">
          <div className="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-3.5">
            <div className="text-xs font-bold text-slate-300 mb-2 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Award className="w-4 h-4 text-amber-400" />
                <span>Top Student Compliments</span>
              </span>
              <span className="text-[10px] text-slate-400">Filter reviews</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {feedbackSummary.topCompliments.map((comp) => (
                <button
                  key={comp.tag}
                  onClick={() =>
                    setSelectedTagFilter(
                      selectedTagFilter === comp.tag ? "all" : comp.tag
                    )
                  }
                  className={`text-[11px] px-2.5 py-1 rounded-xl border transition flex items-center gap-1 cursor-pointer ${
                    selectedTagFilter === comp.tag
                      ? "bg-amber-500 text-slate-950 font-black border-amber-400 shadow-md"
                      : "bg-slate-900 text-slate-300 hover:text-white border-slate-700 hover:border-amber-400/50"
                  }`}
                >
                  <span>{comp.tag}</span>
                  <span className="font-mono text-[10px] opacity-75">
                    ({(comp.count / 1000).toFixed(1)}k)
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-3.5">
            <div className="text-xs font-bold text-slate-300 mb-2 flex items-center gap-1.5">
              <Lightbulb className="w-4 h-4 text-cyan-400" />
              <span>Student Improvement Requests for Next Reels</span>
            </div>
            <div className="space-y-1.5 text-xs text-slate-300">
              {feedbackSummary.improvementRequests.map((req, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2 bg-slate-900/60 p-2 rounded-xl border border-slate-800/80"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 flex-shrink-0" />
                  <span className="text-[11px] text-slate-300 flex-1 leading-snug">
                    {req.text}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono font-bold bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800">
                    +{req.count}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 2. Filter, Search & Sorting Controls Bar */}
      <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 flex flex-col gap-3 shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex-1">
            <label className="text-[11px] font-bold text-slate-400 block mb-1">
              Filter by VidyaReel:
            </label>
            <div className="relative">
              <select
                value={selectedReelFilter}
                onChange={(e) => setSelectedReelFilter(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400 pr-8 appearance-none cursor-pointer"
              >
                <option value="all">
                  All Published VidyaReels ({reviews.length} reviews shown)
                </option>
                {availableReelTitles.map((title) => (
                  <option key={title} value={title}>
                    🎬 {title}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-2.5 pointer-events-none" />
            </div>
          </div>

          <div className="w-full md:w-44">
            <label className="text-[11px] font-bold text-slate-400 block mb-1">
              Rating Score:
            </label>
            <div className="relative">
              <select
                value={selectedRatingFilter}
                onChange={(e) =>
                  setSelectedRatingFilter(
                    e.target.value === "all" ? "all" : Number(e.target.value)
                  )
                }
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400 pr-8 appearance-none cursor-pointer"
              >
                <option value="all">All Stars (1 - 5 ★)</option>
                <option value={5}>5 Stars Only (⭐⭐⭐⭐⭐)</option>
                <option value={4}>4 Stars Only (⭐⭐⭐⭐)</option>
                <option value={3}>3 Stars & Constructive</option>
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-2.5 pointer-events-none" />
            </div>
          </div>

          <div className="w-full md:w-44">
            <label className="text-[11px] font-bold text-slate-400 block mb-1">
              Sort Reviews:
            </label>
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400 pr-8 appearance-none cursor-pointer"
              >
                <option value="helpful">Most Helpful (Votes)</option>
                <option value="newest">Newest First</option>
                <option value="highest">Highest Rating</option>
                <option value="lowest">Lowest Rating</option>
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-2.5 pointer-events-none" />
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-2 pt-2 border-t border-slate-800/80">
          <div className="relative flex-1 w-full">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search anonymous student reviews, tags, or concepts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700/80 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-400"
            />
          </div>

          {(selectedReelFilter !== "all" ||
            selectedRatingFilter !== "all" ||
            selectedTagFilter !== "all" ||
            searchQuery.trim().length > 0) && (
            <button
              onClick={() => {
                setSelectedReelFilter("all");
                setSelectedRatingFilter("all");
                setSelectedTagFilter("all");
                setSearchQuery("");
              }}
              className="text-xs text-amber-400 hover:underline px-2 py-1 font-bold whitespace-nowrap cursor-pointer"
            >
              Reset Filters ({filteredReviews.length} results)
            </button>
          )}
        </div>
      </div>

      {/* 3. Anonymous Reviews Stream List */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between px-1">
          <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <MessageSquare className="w-3.5 h-3.5 text-amber-400" />
            <span>Anonymous Student Reviews ({filteredReviews.length})</span>
          </h4>
          <span className="text-[11px] text-slate-400">
            Student identity is encrypted & privacy protected
          </span>
        </div>

        {filteredReviews.length === 0 ? (
          <div className="bg-slate-950 border border-slate-800 rounded-3xl p-10 text-center flex flex-col items-center justify-center">
            <div className="w-12 h-12 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 mb-3">
              <Search className="w-6 h-6" />
            </div>
            <h5 className="text-sm font-bold text-white mb-1">
              No matching student reviews found
            </h5>
            <p className="text-xs text-slate-400 max-w-sm">
              Try resetting your search query or selecting a different reel filter above.
            </p>
            <button
              onClick={() => {
                setSelectedReelFilter("all");
                setSelectedRatingFilter("all");
                setSelectedTagFilter("all");
                setSearchQuery("");
              }}
              className="mt-4 px-4 py-2 bg-amber-500 text-slate-950 font-bold text-xs rounded-xl shadow cursor-pointer hover:bg-amber-400 transition"
            >
              Show All Reviews
            </button>
          </div>
        ) : (
          filteredReviews.map((review) => (
            <div
              key={review.id}
              className="bg-slate-950 border border-slate-800/90 hover:border-amber-500/40 rounded-3xl p-5 shadow-lg transition duration-200 flex flex-col gap-3.5"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-850">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-2xl bg-gradient-to-tr ${
                      review.avatarGradient || "from-amber-500 to-orange-500"
                    } p-0.5 shadow-md flex-shrink-0`}
                  >
                    <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                      <Shield className="w-4 h-4 text-white" />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-bold text-white font-mono">
                        {review.anonymousStudentAlias}
                      </span>
                      <span className="text-[9px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full border border-slate-700">
                        Shielded Learner
                      </span>
                      {review.isHeartedByMentor && (
                        <span className="text-[9px] bg-rose-500/20 text-rose-300 font-extrabold px-2 py-0.5 rounded-full border border-rose-500/30 flex items-center gap-1">
                          <Heart className="w-2.5 h-2.5 fill-rose-400 text-rose-400" />
                          Hearted by {currentMentor.name}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5 flex-wrap">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        <span>{review.timeAgo}</span>
                      </div>
                      <span className="text-slate-600 font-bold select-none">|</span>
                      <span className="text-amber-400/90 font-medium">
                        {review.subject}
                      </span>
                      <span className="text-slate-600 font-bold select-none">|</span>
                      <span className="text-slate-500 font-mono">
                        Ref: #{review.id.slice(-4)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <div className="flex items-center gap-1 bg-amber-500/15 border border-amber-500/30 px-2.5 py-1 rounded-xl">
                    <div className="flex items-center gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3 h-3 ${
                            i < Math.floor(review.rating)
                              ? "fill-amber-400 text-amber-400"
                              : "text-slate-600"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-xs font-mono font-bold text-amber-300 ml-1">
                      {review.rating}.0
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-slate-900/90 border border-slate-800 px-3.5 py-2 rounded-xl flex items-center justify-between text-xs text-slate-300">
                <div className="flex items-center gap-2 overflow-hidden">
                  <span className="text-amber-400 font-bold flex-shrink-0">
                    🎬 Reel:
                  </span>
                  <span className="font-semibold text-white truncate">
                    {review.reelTitle}
                  </span>
                </div>
              </div>

              {flaggedReviewIds.includes(review.id) && (
                <div className="bg-red-950/40 border border-red-500/40 rounded-xl px-3.5 py-2 flex items-center justify-between text-xs text-red-300 animate-fadeIn">
                  <div className="flex items-center gap-2 font-bold">
                    <ShieldAlert className="w-4 h-4 text-red-400 flex-shrink-0" />
                    <span>Flagged for Inappropriate Content</span>
                  </div>
                  <span className="text-[10px] font-mono bg-red-500/20 px-2 py-0.5 rounded border border-red-500/30 text-red-200 uppercase font-bold">
                    Under Review
                  </span>
                </div>
              )}

              <p className="text-xs text-slate-200 leading-relaxed font-normal bg-slate-900/40 p-3.5 rounded-2xl border border-slate-800/60">
                &ldquo;{review.comment}&rdquo;
              </p>

              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-[10px] bg-slate-900 text-slate-300 border border-slate-800 px-2 py-0.5 rounded-lg">
                  Clarity: <strong className="text-amber-400">{review.clarityScore}/5</strong>
                </span>
                <span className="text-[10px] bg-slate-900 text-slate-300 border border-slate-800 px-2 py-0.5 rounded-lg">
                  Visuals: <strong className="text-cyan-400">{review.visualsScore}/5</strong>
                </span>
                <span className="text-[10px] bg-slate-900 text-slate-300 border border-slate-800 px-2 py-0.5 rounded-lg">
                  Exam Fit: <strong className="text-emerald-400">{review.examRelevanceScore}/5</strong>
                </span>

                {review.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] bg-amber-500/10 text-amber-300 border border-amber-500/20 px-2 py-0.5 rounded-lg font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {review.mentorReply && (
                <div className="bg-gradient-to-r from-amber-500/10 via-slate-900 to-slate-950 border border-amber-500/30 rounded-2xl p-3 flex items-start gap-3 mt-1">
                  <img
                    src={currentMentor.avatar}
                    alt={currentMentor.name}
                    className="w-7 h-7 rounded-xl object-cover border border-amber-400 flex-shrink-0"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white">
                        {currentMentor.name}
                      </span>
                      <span className="text-[9px] bg-amber-500/20 text-amber-300 font-extrabold px-1.5 py-0.2 rounded-full uppercase">
                        Mentor Response
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 mt-1 leading-snug">
                      {review.mentorReply}
                    </p>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between pt-2.5 border-t border-slate-850 text-xs flex-wrap gap-2">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <button
                    onClick={() => handleToggleHeart(review.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition cursor-pointer ${
                      review.isHeartedByMentor
                        ? "bg-rose-500/20 border-rose-400 text-rose-300 shadow-sm"
                        : "bg-slate-900 hover:bg-slate-800 border-slate-800 text-slate-400 hover:text-white"
                    }`}
                    title="Send an encouraging creator heart to this student"
                  >
                    <Heart
                      className={`w-3.5 h-3.5 ${
                        review.isHeartedByMentor
                          ? "fill-rose-400 text-rose-400"
                          : "text-slate-400"
                      }`}
                    />
                    <span>
                      {review.isHeartedByMentor ? "Hearted by You" : "Heart Feedback"}
                    </span>
                  </button>

                  <span className="text-slate-700 font-bold select-none">|</span>

                  <span className="text-[11px] text-slate-400 flex items-center gap-1">
                    <ThumbsUp className="w-3 h-3 text-slate-400" />
                    <span>{review.helpfulCount} helpful</span>
                  </span>

                  <span className="text-slate-700 font-bold select-none">|</span>

                  <button
                    onClick={() =>
                      setFlagModalConfig({
                        isOpen: true,
                        reviewId: review.id,
                        author: review.anonymousStudentAlias,
                        snippet: review.comment,
                      })
                    }
                    className={`flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-xl border transition cursor-pointer font-medium ${
                      flaggedReviewIds.includes(review.id)
                        ? "bg-red-500/20 border-red-500/50 text-red-300 font-bold shadow-sm"
                        : "bg-slate-900 hover:bg-slate-800 border-slate-800 text-slate-400 hover:text-red-400 hover:border-red-500/40"
                    }`}
                    title="Report/Flag this comment for inappropriate content"
                  >
                    <Flag
                      className={`w-3.5 h-3.5 ${
                        flaggedReviewIds.includes(review.id)
                          ? "fill-red-400 text-red-400"
                          : "text-slate-400"
                      }`}
                    />
                    <span>{flaggedReviewIds.includes(review.id) ? "Flagged" : "Flag Comment"}</span>
                  </button>
                </div>

                {!review.mentorReply && (
                  <div className="flex items-center gap-2">
                    <span className="text-slate-700 font-bold select-none hidden sm:inline">|</span>
                    <button
                      onClick={() => {
                        if (replyingReviewId === review.id) {
                          setReplyingReviewId(null);
                        } else {
                          setReplyingReviewId(review.id);
                          setReplyText("");
                        }
                      }}
                      className="text-xs text-slate-400 hover:text-amber-300 flex items-center gap-1 transition cursor-pointer font-semibold"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>{replyingReviewId === review.id ? "Cancel" : "Post Mentor Note"}</span>
                    </button>
                  </div>
                )}
              </div>

              {replyingReviewId === review.id && (
                <div className="bg-slate-900 border border-slate-700 rounded-2xl p-3 flex flex-col gap-2 animate-fadeIn">
                  <label className="text-[11px] font-bold text-slate-300 flex items-center gap-1.5">
                    <MessageSquare className="w-3 h-3 text-amber-400" />
                    <span>Post public note to this anonymous student:</span>
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="e.g. Thanks for the feedback! Adding 3 more wave optics numerical reels tomorrow..."
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleSubmitReply(review.id);
                      }}
                      className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-400"
                    />
                    <button
                      onClick={() => handleSubmitReply(review.id)}
                      className="px-3 py-1.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs rounded-xl shadow cursor-pointer flex items-center gap-1"
                    >
                      <Send className="w-3 h-3" />
                      <span>Post</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* 4. Modal: Simulate Incoming Anonymous Review */}
      {showSimulateModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3">
          <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-3xl p-5 shadow-2xl flex flex-col gap-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                  <Shield className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">
                    Simulate Student Anonymous Review
                  </h4>
                  <p className="text-[10px] text-slate-400">
                    Test live feedback streaming for creator reels
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowSimulateModal(false)}
                className="w-7 h-7 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center text-xs"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddSimulatedReview} className="flex flex-col gap-3">
              <div>
                <label className="text-[11px] font-bold text-slate-300 block mb-1">
                  Anonymous Handle:
                </label>
                <input
                  type="text"
                  value={simAlias}
                  onChange={(e) => setSimAlias(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-300 block mb-1">
                  Target Reel:
                </label>
                <select
                  value={simReelTitle}
                  onChange={(e) => setSimReelTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-xs text-white"
                >
                  {availableReelTitles.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1">
                    Rating (Stars):
                  </label>
                  <select
                    value={simRating}
                    onChange={(e) => setSimRating(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-xs text-white"
                  >
                    <option value={5}>⭐⭐⭐⭐⭐ (5 Stars)</option>
                    <option value={4}>⭐⭐⭐⭐ (4 Stars)</option>
                    <option value={3}>⭐⭐⭐ (3 Stars)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1">
                    Highlight Tag:
                  </label>
                  <select
                    value={simTag}
                    onChange={(e) => setSimTag(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-xs text-white"
                  >
                    <option value="⚡ Crystal Clear Intuition">⚡ Crystal Clear Intuition</option>
                    <option value="🎯 High Yield JEE Shortcut">🎯 High Yield JEE Shortcut</option>
                    <option value="🔬 3D Laser Visuals">🔬 3D Laser Visuals</option>
                    <option value="⏱️ Solved 2-Hour Block">⏱️ Solved 2-Hour Block</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-300 block mb-1">
                  Student Review Feedback:
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="e.g. Mastered the 3D derivation in 50 seconds! Key moments helped jump right before my exam..."
                  value={simComment}
                  onChange={(e) => setSimComment(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-xs text-white"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-extrabold text-xs rounded-xl shadow-lg transition mt-1"
              >
                Submit Test Anonymous Review
              </button>
            </form>
          </div>
        </div>
      )}

      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 border border-red-500/50 text-white text-xs px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 animate-fadeIn">
          <ShieldAlert className="w-4 h-4 text-red-400 flex-shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      <FlagCommentModal
        isOpen={flagModalConfig.isOpen}
        onClose={() => setFlagModalConfig({ isOpen: false })}
        onSubmitReport={handleFlagReportSubmit}
        commentAuthor={flagModalConfig.author}
        commentSnippet={flagModalConfig.snippet}
      />
    </div>
  );
};
