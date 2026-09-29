import React from "react";
import {
  Radio,
  Clock,
  Users,
  Play,
  Sparkles,
  Lock,
} from "lucide-react";

export const LiveSessionsFeedModal = ({
  isOpen,
  onClose,
  liveSessions,
  userProfile,
  onSelectSession,
  onOpenHostStudio,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-fadeIn">
      <div className="w-full max-w-3xl bg-slate-900 border border-slate-700/80 rounded-3xl p-5 sm:p-6 shadow-2xl flex flex-col gap-5 my-auto max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400 flex-shrink-0">
              <Radio className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black text-white">
                  Live Teaching Masterclasses & Workshops
                </h3>
                <span className="bg-rose-500/20 text-rose-300 text-[10px] font-black px-2 py-0.5 rounded-full border border-rose-500/40 animate-pulse">
                  🔴 LIVE
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Join interactive live sessions with India&apos;s top verified mentors, participate in concept quizzes, and tip directly.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition cursor-pointer"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Live & Upcoming Session Cards */}
        <div className="space-y-4">
          {liveSessions.map((session) => {
            const isLive = session.status === "live";

            return (
              <div
                key={session.id}
                className={`bg-slate-950 border rounded-3xl p-5 transition flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
                  isLive
                    ? "border-rose-500/50 shadow-[0_0_20px_rgba(244,63,94,0.15)] hover:border-rose-400"
                    : "border-slate-800 hover:border-slate-700"
                }`}
              >
                {/* Left: Mentor Avatar & Details */}
                <div className="flex items-start gap-3.5 flex-1 min-w-0">
                  <div className="relative flex-shrink-0">
                    <img
                      src={session.mentor.avatar}
                      alt={session.mentor.name}
                      className="w-12 h-12 rounded-2xl object-cover border-2 border-amber-400"
                    />
                    {isLive && (
                      <span className="absolute -bottom-1 -right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-rose-500 ring-2 ring-slate-950">
                        <span className="h-1.5 w-1.5 rounded-full bg-white animate-ping" />
                      </span>
                    )}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      {isLive ? (
                        <span className="bg-rose-600 text-white font-black text-[10px] px-2.5 py-0.5 rounded-full flex items-center gap-1 animate-pulse">
                          <Radio className="w-3 h-3" />
                          <span>LIVE NOW</span>
                        </span>
                      ) : (
                        <span className="bg-slate-800 text-slate-300 font-bold text-[10px] px-2.5 py-0.5 rounded-full flex items-center gap-1">
                          <Clock className="w-3 h-3 text-amber-400" />
                          <span>{session.scheduledStartTime}</span>
                        </span>
                      )}

                      <span className="text-[10px] bg-slate-900 text-slate-400 px-2 py-0.5 rounded-lg border border-slate-800">
                        {session.subject}
                      </span>

                      {session.accessType === "pay_per_view" ? (
                        <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-bold px-2 py-0.5 rounded-full font-mono flex items-center gap-1">
                          <Lock className="w-2.5 h-2.5" />
                          <span>{session.ppvCostCoins} Coins Ticket</span>
                        </span>
                      ) : (
                        <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold px-2 py-0.5 rounded-full">
                          Free + Live Tips
                        </span>
                      )}
                    </div>

                    <h4 className="text-sm font-bold text-white leading-snug">
                      {session.title}
                    </h4>

                    <div className="flex items-center gap-3 text-xs text-slate-400 mt-1.5">
                      <span className="text-amber-400 font-semibold">{session.mentor.name}</span>
                      <span>•</span>
                      <span>{session.durationMinutes} Mins</span>
                      <span>•</span>
                      <span className="flex items-center gap-1 text-cyan-400 font-mono">
                        <Users className="w-3 h-3" />
                        {isLive ? `${session.currentLiveViewers.toLocaleString()} watching` : "Pre-booked"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right: Join Button */}
                <div className="flex items-center gap-3 w-full md:w-auto justify-end pt-2 md:pt-0 border-t md:border-t-0 border-slate-850">
                  <button
                    onClick={() => {
                      onClose();
                      onSelectSession(session);
                    }}
                    className={`w-full md:w-auto px-5 py-2.5 rounded-2xl text-xs font-black transition flex items-center justify-center gap-2 cursor-pointer shadow-lg ${
                      isLive
                        ? "bg-gradient-to-r from-rose-600 to-amber-500 hover:from-rose-500 hover:to-amber-400 text-white"
                        : "bg-amber-500 hover:bg-amber-400 text-slate-950"
                    }`}
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>{isLive ? "Join Live Stream" : "View Details & RSVP"}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer CTA: Mentor Go Live Studio */}
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 text-xs text-slate-300">
            <Sparkles className="w-4 h-4 text-amber-400 flex-shrink-0" />
            <span>Are you an educator or mentor? Host scheduled masterclasses with live coin tipping.</span>
          </div>

          <button
            onClick={() => {
              onClose();
              onOpenHostStudio();
            }}
            className="bg-slate-850 hover:bg-slate-800 text-amber-400 hover:text-amber-300 border border-amber-400/40 text-xs font-bold px-4 py-2 rounded-xl transition whitespace-nowrap cursor-pointer"
          >
            Open Mentor Studio
          </button>
        </div>
      </div>
    </div>
  );
};
