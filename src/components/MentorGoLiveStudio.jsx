import React, { useState } from "react";
import {
  Radio,
  Calendar,
  Clock,
  Coins,
  Users,
  Lock,
  Play,
  Zap,
  PenTool,
} from "lucide-react";
import { MOCK_LIVE_SESSIONS } from "../data/mockLiveSessions";

export const MentorGoLiveStudio = ({
  currentMentor,
  onStartLiveBroadcast,
}) => {
  const [liveSessions, setLiveSessions] = useState(MOCK_LIVE_SESSIONS);
  const [showScheduleModal, setShowScheduleModal] = useState(false);

  // Form State for Scheduling
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [subject, setSubject] = useState(currentMentor.category || "JEE / NEET Prep");
  const [topicTag, setTopicTag] = useState("");
  const [scheduledTime, setScheduledTime] = useState("Tonight at 8:30 PM IST");
  const [accessType, setAccessType] = useState("pay_per_view");
  const [ppvCostCoins, setPpvCostCoins] = useState(50);
  const [whiteboardTopic, setWhiteboardTopic] = useState("");
  const [durationMinutes, setDurationMinutes] = useState(60);

  // Quick Instant Go Live
  const handleInstantGoLive = () => {
    const activeMentor = currentMentor || {
      id: "mentor-alakh",
      name: "Prof. Alakh Pandey",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      category: "JEE / NEET Prep",
      specialization: "Physics & Optics Lead",
    };

    const instantSession = {
      id: `live-instant-${Date.now()}`,
      title: `🔴 Live Masterclass with ${activeMentor.name || "Prof. Alakh Pandey"}: ${activeMentor.specialization || "Physics Lead"}`,
      description: "Interactive live problem solving, 3D derivations, and instant doubt clearing with VidyaCoins tipping.",
      mentor: activeMentor,
      subject: activeMentor.category || "JEE / NEET Prep",
      topicTag: "Exam Strategy & PYQs",
      scheduledStartTime: "LIVE NOW",
      status: "live",
      accessType: "free",
      ppvCostCoins: 0,
      currentLiveViewers: 3240,
      peakViewers: 4500,
      totalLiveTipsCoins: 6200,
      streamQuality: "1080p 60fps",
      likesCount: 5200,
      durationMinutes: 60,
      coverGradient: "from-amber-600 via-rose-600 to-indigo-950",
      tags: ["🔴 LIVE", "Instant Broadcast", "Tipping Enabled"],
      whiteboardTopic: "Rapid PYQ Derivations & Shortcut Tricks",
      activePoll: {
        id: `poll-${Date.now()}`,
        question: "Are you ready to tackle the JEE/NEET Advanced numerical?",
        options: [
          { text: "Yes, fully prepared!", votes: 184 },
          { text: "Need quick formula recap", votes: 92 },
        ],
        correctIdx: 0,
        rewardCoins: 20,
        isClosed: false,
        totalVotes: 276,
      },
    };

    if (onStartLiveBroadcast) {
      onStartLiveBroadcast(instantSession);
    }
  };

  // Submit Scheduled Session
  const handleScheduleSession = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      alert("Please enter a session title!");
      return;
    }

    const newSession = {
      id: `live-sched-${Date.now()}`,
      title: title.trim(),
      description: description.trim() || `Live deep dive session hosted by ${currentMentor.name}.`,
      mentor: currentMentor,
      subject,
      topicTag: topicTag.trim() || "Masterclass",
      scheduledStartTime: scheduledTime.trim() || "Upcoming",
      status: "scheduled",
      accessType,
      ppvCostCoins: accessType === "pay_per_view" ? ppvCostCoins : 0,
      currentLiveViewers: 0,
      totalLiveTipsCoins: 0,
      streamQuality: "1080p 60fps",
      likesCount: 0,
      durationMinutes,
      coverGradient: "from-indigo-600 via-purple-700 to-slate-950",
      tags: [
        accessType === "pay_per_view" ? "🔒 Pay-Per-View" : "Free + Tips",
        subject,
        topicTag,
      ].filter(Boolean),
      whiteboardTopic: whiteboardTopic.trim() || "Concept Derivation & Problem Solving",
    };

    setLiveSessions((prev) => [newSession, ...prev]);
    setShowScheduleModal(false);
    setTitle("");
    setDescription("");
    setTopicTag("");
    setWhiteboardTopic("");
    alert("🎉 Live Teaching Session Scheduled! Students can now RSVP and pre-book pay-per-view tickets with VidyaCoins.");
  };

  return (
    <div className="flex flex-col gap-6">
      {/* 1. Top Banner: Go Live Action Hub */}
      <div className="bg-gradient-to-br from-rose-950/40 via-slate-950 to-amber-950/40 border border-rose-500/40 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-rose-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 pb-5 border-b border-slate-800">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-rose-500 to-amber-400 p-0.5 shadow-lg flex-shrink-0">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                <Radio className="w-7 h-7 text-rose-400 animate-pulse" />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-base font-black text-white">
                  Live Teaching & Coin Tipping Hub
                </h3>
                <span className="bg-rose-500/20 text-rose-300 border border-rose-500/40 text-[10px] font-black px-2.5 py-0.5 rounded-full flex items-center gap-1 animate-pulse">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                  1080P ULTRA-LOW LATENCY
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1">
                Host live problem solving sessions, receive instant student VidyaCoin tips, and monetize via Pay-Per-View tickets.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-wrap sm:flex-nowrap">
            <button
              onClick={() => setShowScheduleModal(true)}
              className="bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 hover:border-amber-400 px-4 py-2.5 rounded-2xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow"
            >
              <Calendar className="w-4 h-4 text-amber-400" />
              <span>Schedule Live Session</span>
            </button>

            <button
              onClick={handleInstantGoLive}
              className="bg-gradient-to-r from-rose-600 to-amber-500 hover:from-rose-500 hover:to-amber-400 text-white font-black px-5 py-2.5 rounded-2xl text-xs shadow-xl transition flex items-center gap-2 cursor-pointer"
            >
              <Radio className="w-4 h-4 animate-ping" />
              <span>Start Instant Broadcast</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-5">
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-3.5">
            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              Total Live Tips Earned
            </div>
            <div className="text-xl font-black text-amber-400 font-mono flex items-center gap-1 mt-1">
              <Coins className="w-4 h-4" />
              <span>42,500</span>
            </div>
            <div className="text-[10px] text-emerald-400 mt-1 font-semibold">
              ≈ ₹42,500 Direct Payout
            </div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-3.5">
            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              Avg Live Viewers
            </div>
            <div className="text-xl font-black text-cyan-400 font-mono flex items-center gap-1 mt-1">
              <Users className="w-4 h-4" />
              <span>8,420</span>
            </div>
            <div className="text-[10px] text-slate-400 mt-1">
              Across 12 Live Classes
            </div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-3.5">
            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              Pay-Per-View Revenue
            </div>
            <div className="text-xl font-black text-fuchsia-400 font-mono flex items-center gap-1 mt-1">
              <Lock className="w-4 h-4" />
              <span>18,200</span>
            </div>
            <div className="text-[10px] text-fuchsia-300 mt-1">
              364 Ticket Sales
            </div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-3.5">
            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              Live Interaction Rate
            </div>
            <div className="text-xl font-black text-emerald-400 font-mono flex items-center gap-1 mt-1">
              <Zap className="w-4 h-4" />
              <span>96.4%</span>
            </div>
            <div className="text-[10px] text-emerald-300 mt-1">
              Top 1% Super-Chat Host
            </div>
          </div>
        </div>
      </div>

      {/* 2. Scheduled & Live Teaching Sessions List */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-amber-400" />
            <span>Active & Scheduled Live Teaching Sessions ({liveSessions.length})</span>
          </h4>
          <span className="text-[11px] text-slate-400">
            Students can RSVP and purchase entry tickets with coins
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {liveSessions.map((session) => {
            const isLive = session.status === "live";

            return (
              <div
                key={session.id}
                className="bg-slate-950 border border-slate-800 hover:border-amber-500/40 rounded-3xl p-5 shadow-xl transition flex flex-col justify-between gap-4"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2">
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
                    </div>

                    {session.accessType === "pay_per_view" ? (
                      <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 font-mono">
                        <Coins className="w-3 h-3" />
                        <span>{session.ppvCostCoins} Coins Ticket</span>
                      </span>
                    ) : (
                      <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold px-2 py-0.5 rounded-full">
                        Free + Tipping
                      </span>
                    )}
                  </div>

                  <h4 className="text-sm font-bold text-white leading-snug">
                    {session.title}
                  </h4>
                  <p className="text-xs text-slate-400 line-clamp-2 mt-1.5 leading-relaxed">
                    {session.description}
                  </p>

                  {session.whiteboardTopic && (
                    <div className="bg-slate-900/80 border border-slate-800/80 rounded-xl p-2.5 mt-3 text-xs text-slate-300 flex items-center gap-2">
                      <PenTool className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
                      <span className="truncate">
                        <strong className="text-white">Whiteboard:</strong> {session.whiteboardTopic}
                      </span>
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-slate-850 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <Users className="w-3.5 h-3.5 text-cyan-400" />
                    <span>
                      {isLive ? `${session.currentLiveViewers.toLocaleString()} watching` : "Pre-booked: 480 students"}
                    </span>
                  </div>

                  <button
                    onClick={() => onStartLiveBroadcast(session)}
                    className={`px-4 py-2 rounded-xl text-xs font-black transition flex items-center gap-1.5 cursor-pointer shadow ${
                      isLive
                        ? "bg-gradient-to-r from-rose-600 to-amber-500 text-white hover:from-rose-500 hover:to-amber-400"
                        : "bg-amber-500 hover:bg-amber-400 text-slate-950"
                    }`}
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>{isLive ? "Enter Live Studio" : "Start Live Broadcast"}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Modal: Schedule Live Teaching Session */}
      {showScheduleModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-3xl p-5 shadow-2xl flex flex-col gap-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400">
                  <Radio className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">
                    Schedule Live Teaching Masterclass
                  </h4>
                  <p className="text-[10px] text-slate-400">
                    Set date, pay-per-view price, and interactive whiteboard derivation
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowScheduleModal(false)}
                className="w-7 h-7 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center text-xs cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleScheduleSession} className="flex flex-col gap-3">
              <div>
                <label className="text-[11px] font-bold text-slate-300 block mb-1">
                  Masterclass Title:
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 🔴 Master Rotational Dynamics: Top 25 JEE Advanced Problems"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1">
                    Subject Category:
                  </label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-xs text-white focus:outline-none focus:border-amber-400"
                  >
                    <option value="JEE / NEET Prep">JEE / NEET Prep</option>
                    <option value="Tech & Coding">Tech & Coding</option>
                    <option value="UPSC & Govt Exams">UPSC & Govt Exams</option>
                    <option value="Class 9-12 CBSE/ICSE">Class 9-12 CBSE/ICSE</option>
                    <option value="Spoken English & Communication">Spoken English & Communication</option>
                    <option value="Finance & Stock Market">Finance & Stock Market</option>
                    <option value="AI & Data Science">AI & Data Science</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1">
                    Topic Tag:
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Moment of Inertia, YDSE"
                    value={topicTag}
                    onChange={(e) => setTopicTag(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1">
                    Scheduled Date & Time:
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Tonight at 8:30 PM IST"
                    value={scheduledTime}
                    onChange={(e) => setScheduledTime(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1">
                    Duration:
                  </label>
                  <select
                    value={durationMinutes}
                    onChange={(e) => setDurationMinutes(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-xs text-white focus:outline-none focus:border-amber-400"
                  >
                    <option value={45}>45 Minutes (Fast Track)</option>
                    <option value={60}>60 Minutes (Standard)</option>
                    <option value={90}>90 Minutes (Deep Dive)</option>
                    <option value={120}>120 Minutes (Mega Marathon)</option>
                  </select>
                </div>
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-3.5 flex flex-col gap-2">
                <label className="text-[11px] font-bold text-amber-300 block">
                  Access & Monetization Model:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: "free", label: "Free + Tips", desc: "Highest reach" },
                    { id: "pay_per_view", label: "Pay-Per-View", desc: "Ticket in Coins" },
                    { id: "ad_supported", label: "Ad Supported", desc: "Free for learners" },
                  ].map((m) => (
                    <div
                      key={m.id}
                      onClick={() => setAccessType(m.id)}
                      className={`p-2 rounded-xl border cursor-pointer transition text-left ${
                        accessType === m.id
                          ? "bg-amber-500/20 border-amber-400 text-white"
                          : "bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700"
                      }`}
                    >
                      <div className="text-xs font-bold">{m.label}</div>
                      <div className="text-[9px] text-slate-400">{m.desc}</div>
                    </div>
                  ))}
                </div>

                {accessType === "pay_per_view" && (
                  <div className="flex items-center gap-3 pt-2">
                    <label className="text-xs text-slate-300">Ticket Cost:</label>
                    <input
                      type="number"
                      min={10}
                      max={200}
                      value={ppvCostCoins}
                      onChange={(e) => setPpvCostCoins(Number(e.target.value))}
                      className="w-20 bg-slate-900 border border-slate-700 rounded-lg p-1.5 text-xs text-amber-300 font-mono text-center font-bold"
                    />
                    <span className="text-xs text-slate-400">VidyaCoins / Student</span>
                  </div>
                )}
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-300 block mb-1">
                  Live Whiteboard Derivation / Focus Problem:
                </label>
                <input
                  type="text"
                  placeholder="e.g. Rolling without slipping on inclined plane (a = g·sinθ / (1 + k²/R²))"
                  value={whiteboardTopic}
                  onChange={(e) => setWhiteboardTopic(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-300 block mb-1">
                  Session Description & What Students Will Master:
                </label>
                <textarea
                  rows={2}
                  placeholder="Summarize key shortcuts and derivations covered in this session..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2 text-xs text-white"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-rose-600 to-amber-500 hover:from-rose-500 hover:to-amber-400 text-white font-black text-xs rounded-xl shadow-lg transition mt-1 cursor-pointer"
              >
                Schedule & Open for Student RSVP
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
