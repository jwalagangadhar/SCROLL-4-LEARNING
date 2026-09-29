import React, { useState } from "react";
import {
  Play,
  Sparkles,
  Users,
  FileText,
  Layers,
  ArrowRight,
  Bookmark,
  Clock,
  Download,
} from "lucide-react";

export const CourseSeriesView = ({
  seriesList,
  userProfile,
  onSelectReel,
  onUnlockSeries,
  onUnlockWithCoins,
  onOpenSponsorAd,
  onToggleBookmarkSeries,
}) => {
  const [selectedSeries, setSelectedSeries] = useState(null);

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-4">
      {/* Header Banner */}
      <div className="mb-6 bg-gradient-to-r from-amber-950/40 via-slate-900 to-indigo-950/40 border border-amber-500/20 rounded-3xl p-6 relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-amber-400 bg-amber-950/80 px-3 py-1 rounded-full border border-amber-500/30 mb-3">
            <Sparkles className="w-3.5 h-3.5" /> Structured VidyaSeries
          </span>
          <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-2">
            Master Entire Subjects, 60 Seconds at a Time.
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            Curated micro-course playlists by India&apos;s finest mentors. Watch in sequence, practice key checkpoints, unlock latest episodes with ads or coins, and download study notes!
          </p>
        </div>
      </div>

      {/* Series Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {seriesList.map((series) => {
          return (
            <div
              key={series.id}
              onClick={() => setSelectedSeries(series)}
              className="bg-slate-900/90 border border-slate-800 hover:border-amber-500/50 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-amber-500/10 cursor-pointer flex flex-col justify-between group"
            >
              {/* Thumbnail Container */}
              <div className="relative h-44 w-full overflow-hidden">
                <img
                  src={series.thumbnail}
                  alt={series.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />

                {/* Badges & Bookmark */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                  <div className="flex gap-2">
                    <span className="bg-black/70 backdrop-blur-md text-amber-400 text-[10px] font-bold px-2.5 py-1 rounded-full border border-amber-400/30">
                      {series.category}
                    </span>
                    <span className="bg-blue-950/80 backdrop-blur-md text-blue-300 text-[10px] font-semibold px-2 py-1 rounded-full border border-blue-500/30">
                      {series.difficulty}
                    </span>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleBookmarkSeries?.(series.id);
                    }}
                    className={`pointer-events-auto p-1.5 rounded-full backdrop-blur-md transition ${
                      userProfile.bookmarkedSeriesIds?.includes(series.id)
                        ? "bg-amber-500 text-slate-950 shadow-md scale-105"
                        : "bg-black/60 text-slate-300 hover:text-white hover:bg-black/80"
                    }`}
                    title={
                      userProfile.bookmarkedSeriesIds?.includes(series.id)
                        ? "Remove from Bookmarked Series"
                        : "Bookmark this Series for Daily Revision"
                    }
                  >
                    <Bookmark className={`w-3.5 h-3.5 ${userProfile.bookmarkedSeriesIds?.includes(series.id) ? "fill-current" : ""}`} />
                  </button>
                </div>

                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs font-medium">
                  <div className="flex items-center gap-1">
                    <Layers className="w-3.5 h-3.5 text-amber-400" />
                    <span>{series.totalEpisodes} Micro-Reels</span>
                  </div>
                  <div className="flex items-center gap-1 text-emerald-400">
                    <Users className="w-3.5 h-3.5" />
                    <span>{(series.enrolledLearners / 1000).toFixed(0)}k Learners</span>
                  </div>
                </div>
              </div>

              {/* Body */}
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-base font-bold text-white mb-1 group-hover:text-amber-300 transition line-clamp-1">
                    {series.title}
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-2 mb-3">
                    {series.subtitle}
                  </p>
                </div>

                {/* Mentor row */}
                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <img
                      src={series.mentor.avatar}
                      alt={series.mentor.name}
                      className="w-7 h-7 rounded-full object-cover border border-amber-400/50"
                    />
                    <div className="flex flex-col">
                      <span className="text-xs font-semibold text-slate-200">
                        {series.mentor.name}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        ★ {series.rating} Rating
                      </span>
                    </div>
                  </div>

                  <span className="text-xs font-bold text-amber-400 flex items-center gap-1">
                    Explore <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Series Detail Modal */}
      {selectedSeries && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="relative h-44 p-6 flex flex-col justify-end bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent">
              <img
                src={selectedSeries.thumbnail}
                alt={selectedSeries.title}
                className="absolute inset-0 w-full h-full object-cover -z-10 opacity-40"
              />
              <div className="absolute top-4 right-4 flex items-center gap-2">
                <button
                  onClick={() => onToggleBookmarkSeries?.(selectedSeries.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 backdrop-blur-md transition ${
                    userProfile.bookmarkedSeriesIds?.includes(selectedSeries.id)
                      ? "bg-amber-500 text-slate-950 shadow"
                      : "bg-black/60 text-white hover:bg-black/80 border border-slate-700"
                  }`}
                >
                  <Bookmark className={`w-3.5 h-3.5 ${userProfile.bookmarkedSeriesIds?.includes(selectedSeries.id) ? "fill-current" : ""}`} />
                  <span>{userProfile.bookmarkedSeriesIds?.includes(selectedSeries.id) ? "Saved in Daily Alerts" : "Bookmark Series"}</span>
                </button>
                <button
                  onClick={() => setSelectedSeries(null)}
                  className="w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-white/20 transition cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest bg-amber-950/80 px-2.5 py-0.5 rounded-full border border-amber-500/30 self-start mb-2">
                {selectedSeries.category} • {selectedSeries.difficulty}
              </span>
              <h2 className="text-xl font-extrabold text-white mb-1">
                {selectedSeries.title}
              </h2>
              <div className="flex items-center gap-3 text-xs text-slate-300">
                <span>By {selectedSeries.mentor.name}</span>
                <span>•</span>
                <span>{selectedSeries.totalEpisodes} Total Episodes</span>
                <span>•</span>
                <span>★ {selectedSeries.rating} ({selectedSeries.enrolledLearners} students)</span>
              </div>
            </div>

            {/* Modal Content / Playlist */}
            <div className="p-6 overflow-y-auto flex-1 flex flex-col gap-5">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Series Overview
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {selectedSeries.description}
                </p>
              </div>

              {/* Playlist Episodes */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                    <Layers className="w-4 h-4" /> Episode Reel Track
                  </h4>
                  <span className="text-[11px] text-slate-400">
                    Episodes 1-{selectedSeries.freeEpisodesCount} are 100% Free
                  </span>
                </div>

                <div className="flex flex-col gap-2.5">
                  {selectedSeries.reels.map((reel, idx) => {
                    const isReelUnlocked =
                      !reel.isPaywalled || userProfile.unlockedReelIds.includes(reel.id);

                    return (
                      <div
                        key={reel.id}
                        className={`p-3 rounded-2xl border flex items-center justify-between gap-3 transition ${
                          isReelUnlocked
                            ? "bg-slate-800/80 border-slate-700 hover:border-amber-400 cursor-pointer"
                            : "bg-slate-950/80 border-slate-800/80"
                        }`}
                      >
                        <div
                          className="flex items-center gap-3 flex-1"
                          onClick={() => {
                            if (isReelUnlocked) {
                              onSelectReel(reel);
                              setSelectedSeries(null);
                            }
                          }}
                        >
                          <div
                            className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs ${
                              isReelUnlocked
                                ? "bg-amber-500 text-slate-950 shadow-md"
                                : "bg-slate-800 text-slate-400"
                            }`}
                          >
                            {idx + 1}
                          </div>
                          <div>
                            <div className="text-xs font-bold text-white line-clamp-1">
                              {reel.title}
                            </div>
                            <div className="text-[10px] text-slate-400 flex items-center gap-2 mt-0.5">
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" /> {reel.durationSeconds}s
                              </span>
                              <span>•</span>
                              <span>#{reel.topicTag}</span>
                            </div>
                          </div>
                        </div>

                        {/* Status / Play Button */}
                        <div>
                          {isReelUnlocked ? (
                            <button
                              onClick={() => {
                                onSelectReel(reel);
                                setSelectedSeries(null);
                              }}
                              className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl flex items-center gap-1 transition cursor-pointer"
                            >
                              <Play className="w-3.5 h-3.5 fill-current" /> Watch Reel
                            </button>
                          ) : (
                            <div className="flex items-center gap-1.5">
                              <button
                                onClick={() => onOpenSponsorAd(reel)}
                                className="px-2.5 py-1 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-[11px] rounded-lg transition"
                                title="Unlock by watching a 15s sponsor ad"
                              >
                                🎬 15s Ad
                              </button>
                              <button
                                onClick={() => onUnlockWithCoins(reel)}
                                className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-amber-300 font-semibold text-[11px] rounded-lg border border-amber-500/30 transition"
                                title="Unlock with VidyaCoins"
                              >
                                🪙 {reel.unlockCostCoins}
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Study Materials & Cheat Sheets */}
              {selectedSeries.studyMaterials && selectedSeries.studyMaterials.length > 0 && (
                <div className="pt-2 border-t border-slate-800">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-2 flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-cyan-400" /> Attached Formula Sheets & Notes
                  </h4>
                  <div className="grid grid-cols-1 gap-2">
                    {selectedSeries.studyMaterials.map((mat) => {
                      return (
                        <div
                          key={mat.id}
                          className="p-3 bg-slate-800/60 border border-slate-700/80 rounded-xl flex items-center justify-between gap-3"
                        >
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-lg bg-cyan-950 border border-cyan-500/40 text-cyan-400 flex items-center justify-center">
                              <FileText className="w-4 h-4" />
                            </div>
                            <div>
                              <div className="text-xs font-bold text-white">{mat.title}</div>
                              <div className="text-[10px] text-slate-400">
                                {mat.fileSize} • {mat.downloadCount} Downloads
                              </div>
                            </div>
                          </div>

                          <button
                            className="px-3 py-1.5 bg-cyan-600/80 hover:bg-cyan-500 text-white font-semibold text-xs rounded-lg flex items-center gap-1 transition"
                            onClick={() => {
                              alert(`Downloading ${mat.title} (${mat.fileSize})!`);
                            }}
                          >
                            <Download className="w-3.5 h-3.5" /> Download PDF
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
