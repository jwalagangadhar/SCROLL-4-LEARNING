import React, { useState, useEffect } from "react";
import {
  ChevronUp,
  ChevronDown,
  Search,
} from "lucide-react";
import { ReelCard } from "./ReelCard";

const CATEGORIES = [
  "All",
  "JEE / NEET Prep",
  "Tech & Coding",
  "UPSC & Govt Exams",
  "Class 9-12 CBSE/ICSE",
  "Spoken English & Communication",
  "Finance & Stock Market",
  "AI & Data Science",
];

export const ReelFeed = ({
  reels = [],
  userProfile,
  selectedCategory,
  onSelectCategory,
  searchQuery,
  onLikeToggle,
  onBookmarkToggle,
  onFollowToggle,
  onOpenQuiz,
  onOpenDoubtModal,
  onOpenAiSummary,
  onOpenMaterialsModal,
  onOpenSponsorAd,
  onUnlockWithCoins,
  onSelectSeries,
  onShareReel,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);

  // Reset index to 0 when reels list or category updates
  useEffect(() => {
    setActiveIndex(0);
  }, [reels?.length, selectedCategory]);

  // Filter reels based on category and search query
  const filteredReels = (reels || []).filter((r) => {
    const matchesCat = selectedCategory === "All" || r.subject === selectedCategory;
    const matchesSearch =
      !searchQuery ||
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.topicTag.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.mentor.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  // Keyboard navigation (Arrow Up/Down)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (["INPUT", "TEXTAREA"].includes(e.target.tagName)) return;

      if (e.key === "ArrowDown" || e.key === "j") {
        e.preventDefault();
        handleNext();
      } else if (e.key === "ArrowUp" || e.key === "k") {
        e.preventDefault();
        handlePrev();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeIndex, filteredReels.length]);

  const handleNext = () => {
    if (activeIndex < filteredReels.length - 1) {
      setActiveIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (activeIndex > 0) {
      setActiveIndex((prev) => prev - 1);
    }
  };

  const currentReel = filteredReels[activeIndex];

  return (
    <div className="w-full flex-1 flex flex-col items-center justify-between relative px-2 py-1 max-w-5xl mx-auto overflow-hidden">
      {/* Category Pills Scroller */}
      <div className="w-full max-w-md flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1.5 px-1 mb-1 select-none z-10">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => {
              onSelectCategory(cat);
              setActiveIndex(0);
            }}
            className={`whitespace-nowrap px-3 py-1 rounded-full text-xs font-semibold transition cursor-pointer border ${
              selectedCategory === cat
                ? "bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 border-amber-400 font-bold shadow-md shadow-amber-500/20"
                : "bg-slate-900/80 text-slate-300 border-slate-800 hover:border-slate-700 hover:text-white"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Main Reels Viewport */}
      <div className="relative w-full max-w-md flex-1 flex items-center justify-center py-1 my-auto">
        {filteredReels.length > 0 && currentReel ? (
          <ReelCard
            key={currentReel.id}
            reel={currentReel}
            isActive={true}
            userProfile={userProfile}
            onLikeToggle={onLikeToggle}
            onBookmarkToggle={onBookmarkToggle}
            onFollowToggle={onFollowToggle}
            onOpenQuiz={onOpenQuiz}
            onOpenDoubtModal={onOpenDoubtModal}
            onOpenAiSummary={onOpenAiSummary}
            onOpenMaterialsModal={onOpenMaterialsModal}
            onOpenSponsorAd={onOpenSponsorAd}
            onUnlockWithCoins={onUnlockWithCoins}
            onSelectSeries={onSelectSeries}
            onShareReel={onShareReel}
          />
        ) : (
          <div className="w-full h-full max-w-md bg-slate-900/60 border border-slate-800 rounded-3xl flex flex-col items-center justify-center p-8 text-center text-slate-400">
            <Search className="w-12 h-12 text-slate-600 mb-3" />
            <h4 className="text-base font-bold text-white mb-1">No VidyaReels found</h4>
            <p className="text-xs text-slate-400 max-w-xs mb-4">
              Try choosing another subject category or clearing your search filter.
            </p>
            <button
              onClick={() => onSelectCategory("All")}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow transition"
            >
              Reset to All Subjects
            </button>
          </div>
        )}

        {/* Desktop Up/Down Floating Controls */}
        <div className="hidden md:flex flex-col items-center gap-3 absolute -right-16 top-1/2 -translate-y-1/2 z-20">
          <button
            onClick={handlePrev}
            disabled={activeIndex === 0}
            className={`w-11 h-11 rounded-full flex items-center justify-center border transition backdrop-blur-md cursor-pointer ${
              activeIndex === 0
                ? "bg-slate-900/40 border-slate-800 text-slate-600 cursor-not-allowed"
                : "bg-slate-900/90 border-slate-700 hover:border-amber-400 text-white hover:text-amber-400 shadow-lg"
            }`}
            title="Previous Reel (Key: ↑)"
          >
            <ChevronUp className="w-6 h-6" />
          </button>

          <div className="text-center font-mono text-xs text-slate-400 font-bold">
            {filteredReels.length > 0 ? `${activeIndex + 1}/${filteredReels.length}` : "0"}
          </div>

          <button
            onClick={handleNext}
            disabled={activeIndex >= filteredReels.length - 1}
            className={`w-11 h-11 rounded-full flex items-center justify-center border transition backdrop-blur-md cursor-pointer ${
              activeIndex >= filteredReels.length - 1
                ? "bg-slate-900/40 border-slate-800 text-slate-600 cursor-not-allowed"
                : "bg-slate-900/90 border-slate-700 hover:border-amber-400 text-white hover:text-amber-400 shadow-lg"
            }`}
            title="Next Reel (Key: ↓)"
          >
            <ChevronDown className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Mobile Bottom Quick Reel Switcher Bar */}
      <div className="flex md:hidden items-center justify-between w-full max-w-md px-4 py-2 mt-1 bg-slate-950/80 border border-slate-800/80 rounded-2xl">
        <button
          onClick={handlePrev}
          disabled={activeIndex === 0}
          className="flex items-center gap-1 text-xs font-semibold text-slate-300 disabled:opacity-30"
        >
          <ChevronUp className="w-4 h-4" /> Previous
        </button>

        <span className="text-[11px] font-mono text-amber-400">
          Reel {filteredReels.length > 0 ? activeIndex + 1 : 0} of {filteredReels.length}
        </span>

        <button
          onClick={handleNext}
          disabled={activeIndex >= filteredReels.length - 1}
          className="flex items-center gap-1 text-xs font-semibold text-slate-300 disabled:opacity-30"
        >
          Next <ChevronDown className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
