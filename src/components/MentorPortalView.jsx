import React, { useState } from "react";
import {
  GraduationCap,
  Sparkles,
  DollarSign,
  TrendingUp,
  Video,
  HelpCircle,
  Lock,
  CheckCircle2,
  Coins,
  BarChart3,
  Layers,
  Star,
  Users,
  Radio,
  Clock,
  Send,
  LogOut,
  BookOpen,
  CreditCard,
  UploadCloud,
  Trash2,
  Edit3,
  Search,
  Film,
} from "lucide-react";
import { VerifiedMentorBadge } from "./VerifiedMentorBadge";
import { ReelFeedbackSection } from "./ReelFeedbackSection";
import { MentorGoLiveStudio } from "./MentorGoLiveStudio";
import { VideoUploadBar } from "./VideoUploadBar";

export const MentorPortalView = ({
  currentMentor,
  allMentors = [],
  allReels = [],
  allDoubts = [],
  liveSessions = [],
  userProfile,
  onPublishReel,
  onStartLiveBroadcast,
  onSwitchToStudentPortal,
  onSwitchToStudent,
  onLogout = () => {},
  onAnswerDoubt,
  onOpenCoinStore,
}) => {
  const handleSwitchToStudent = onSwitchToStudentPortal || onSwitchToStudent || (() => {});
  const [activeTab, setActiveTab] = useState("live");
  const [isOnline, setIsOnline] = useState(currentMentor?.isOnline ?? true);
  const [selectedMentor, setSelectedMentor] = useState(currentMentor);

  // New Reel Form State
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [subject, setSubject] = useState(currentMentor.category || "JEE / NEET Prep");
  const [topicTag, setTopicTag] = useState("");
  const [visualType, setVisualType] = useState("physics_optics");
  const [mediaSourceType, setMediaSourceType] = useState("video_file");
  const [uploadedVideo, setUploadedVideo] = useState(null);
  const [durationSeconds, setDurationSeconds] = useState(50);
  const [paywallType, setPaywallType] = useState("ad_or_coins");
  const [coinCost, setCoinCost] = useState(20);
  const [seriesTitle, setSeriesTitle] = useState("");
  const [quizQuestion, setQuizQuestion] = useState("");
  const [quizOptions, setQuizOptions] = useState(["", "", "", ""]);
  const [correctOptionIdx, setCorrectOptionIdx] = useState(0);
  const [materialTitle, setMaterialTitle] = useState("");
  const [publishSuccessMsg, setPublishSuccessMsg] = useState("");

  // Manage Reels Filter & Actions State
  const [manageSearch, setManageSearch] = useState("");
  const [manageSubject, setManageSubject] = useState("All");
  const [editingReel, setEditingReel] = useState(null);
  const [deletedReelIds, setDeletedReelIds] = useState([]);
  const [overrideMonetization, setOverrideMonetization] = useState({});

  // Payout Request State
  const [upiId, setUpiId] = useState("alakh.physics@okhdfcbank");
  const [withdrawCoins, setWithdrawCoins] = useState(1000);
  const [withdrawStatus, setWithdrawStatus] = useState(null);

  // Doubt Reply State
  const [answeringDoubtId, setAnsweringDoubtId] = useState(null);
  const [answerContent, setAnswerContent] = useState("");
  const [repliedDoubts, setRepliedDoubts] = useState([]);

  // Filter mentor's own reels with fallback to at least 2 reels
  const rawMentorReels = allReels.filter(
    (r) => r.mentor.id === selectedMentor.id || r.mentor.name === selectedMentor.name
  );
  
  const activeMentorReels = rawMentorReels.filter((r) => !deletedReelIds.includes(r.id));
  const mentorReels = activeMentorReels.length > 0 ? activeMentorReels : allReels.slice(0, 2);

  const filteredManageReels = mentorReels.filter((r) => {
    const matchesSearch =
      manageSearch.trim() === "" ||
      r.title.toLowerCase().includes(manageSearch.toLowerCase()) ||
      r.topicTag.toLowerCase().includes(manageSearch.toLowerCase());
    const matchesSubject = manageSubject === "All" || r.subject === manageSubject;
    return matchesSearch && matchesSubject;
  });

  const handlePublish = (e) => {
    e.preventDefault();
    if (!title.trim() || !topicTag.trim()) {
      alert("Please fill in the reel title and topic tag!");
      return;
    }

    const newReel = {
      title,
      description: description || "Master this key exam concept in 60 seconds with step-by-step visual clarity.",
      subject,
      topicTag,
      visualType: mediaSourceType === "video_file" ? "physics_optics" : visualType,
      videoUrl: uploadedVideo?.url || undefined,
      durationSeconds: uploadedVideo?.durationSeconds || durationSeconds,
      language: "Hinglish",
      mentor: selectedMentor,
      isPaywalled: paywallType !== "free",
      unlockType: paywallType,
      unlockCostCoins: paywallType === "free" ? 0 : coinCost,
      seriesTitle: seriesTitle.trim() || undefined,
      quiz: quizQuestion.trim()
        ? {
            question: quizQuestion,
            options: quizOptions.filter((o) => o.trim().length > 0),
            correctIdx: correctOptionIdx,
            explanation: "Review the formula and visualization shown in the reel for full conceptual clarity.",
            rewardCoins: 15,
          }
        : undefined,
      studyMaterials: materialTitle.trim()
        ? [
            {
              id: `mat-${Date.now()}`,
              title: materialTitle,
              type: "cheat_sheet",
              fileSize: "1.4 MB",
              requiresUnlock: paywallType !== "free",
              unlockCostCoins: 10,
              downloadCount: 0,
              summary: "Verified formula sheet, derivation diagrams, and key revision highlights.",
            },
          ]
        : undefined,
    };

    onPublishReel(newReel);
    setPublishSuccessMsg(`🎉 Success! "${title}" has been published with video upload to VidyaReels.`);
    setTimeout(() => setPublishSuccessMsg(""), 4500);

    setTitle("");
    setDescription("");
    setTopicTag("");
    setSeriesTitle("");
    setQuizQuestion("");
    setQuizOptions(["", "", "", ""]);
    setMaterialTitle("");
    setUploadedVideo(null);
  };

  const handleToggleReelMonetization = (reelId, currentStatus) => {
    setOverrideMonetization((prev) => ({
      ...prev,
      [reelId]: !currentStatus,
    }));
  };

  const handleDeleteReel = (reelId, reelTitle) => {
    if (confirm(`Are you sure you want to unpublish "${reelTitle}"?`)) {
      setDeletedReelIds((prev) => [...prev, reelId]);
    }
  };

  const handleSaveEditedReel = (e) => {
    e.preventDefault();
    if (!editingReel) return;
    setPublishSuccessMsg(`✅ Updated details for "${editingReel.title}"`);
    setTimeout(() => setPublishSuccessMsg(""), 3500);
    setEditingReel(null);
  };

  const handleSendDoubtAnswer = (doubtId) => {
    if (!answerContent.trim()) return;
    if (onAnswerDoubt) {
      onAnswerDoubt(doubtId, answerContent);
    }
    setRepliedDoubts((prev) => [...prev, doubtId]);
    setAnsweringDoubtId(null);
    setAnswerContent("");
  };

  const handleWithdrawalRequest = (e) => {
    e.preventDefault();
    if (!upiId.trim() || withdrawCoins < 500) {
      alert("Minimum withdrawal is 500 VidyaCoins (₹250 INR).");
      return;
    }
    const inrAmount = (withdrawCoins * 0.5).toLocaleString();
    setWithdrawStatus(`✅ Withdrawal of 🪙 ${withdrawCoins.toLocaleString()} (₹${inrAmount} INR) initiated to ${upiId}. Bank transfer expected in 24 hours.`);
    setTimeout(() => setWithdrawStatus(null), 6000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white pb-20 pt-2 animate-fadeIn">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 space-y-6">
        {/* Mentor Header Profile Card */}
        <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-5 sm:p-7 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
            <div className="flex items-start gap-4 sm:gap-5">
              <div className="relative">
                <img
                  src={selectedMentor.avatar}
                  alt={selectedMentor.name}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl object-cover border-2 border-emerald-400 shadow-xl"
                />
                <span
                  className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-slate-900 flex items-center justify-center ${
                    isOnline ? "bg-emerald-500" : "bg-slate-600"
                  }`}
                  title={isOnline ? "Online for doubts" : "Offline"}
                >
                  <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                </span>
              </div>

              <div>
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className="bg-emerald-500/20 text-emerald-300 text-xs font-black px-3 py-0.5 rounded-full border border-emerald-500/40 flex items-center gap-1.5">
                    <GraduationCap className="w-3.5 h-3.5" />
                    <span>👨‍🏫 VERIFIED MENTOR PORTAL</span>
                  </span>
                  <VerifiedMentorBadge mentor={selectedMentor} verified={selectedMentor.verified} rating={selectedMentor.rating} />
                  <span className="text-xs text-slate-400 font-mono">{selectedMentor.handle}</span>
                </div>

                <h1 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
                  <span>{selectedMentor.name}</span>
                </h1>

                <p className="text-xs text-slate-300 max-w-2xl mt-1 leading-relaxed">
                  {selectedMentor.bio}
                </p>

                <div className="flex items-center gap-4 text-xs text-slate-400 mt-2.5 flex-wrap">
                  <span className="text-amber-400 font-semibold">{selectedMentor.qualification}</span>
                  <span>•</span>
                  <span>{selectedMentor.location}</span>
                  <span>•</span>
                  <span className="text-emerald-400 font-medium">Fee: {selectedMentor.privateChatFeeCoins} Coins/chat</span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto justify-start lg:justify-end">
              <button
                onClick={() => setIsOnline(!isOnline)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border cursor-pointer ${
                  isOnline
                    ? "bg-emerald-950/80 text-emerald-300 border-emerald-500/50"
                    : "bg-slate-800 text-slate-400 border-slate-700"
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${isOnline ? "bg-emerald-400" : "bg-slate-500"}`} />
                <span>{isOnline ? "Status: Online" : "Status: Away"}</span>
              </button>

              <button
                onClick={handleSwitchToStudent}
                className="px-4 py-2 rounded-xl text-xs font-black bg-amber-500 hover:bg-amber-400 text-slate-950 transition flex items-center gap-1.5 shadow-md cursor-pointer"
                title="Switch to student feed to watch reels & solve quizzes"
              >
                <BookOpen className="w-4 h-4" />
                <span>🎓 Switch to Student Portal</span>
              </button>

              <button
                onClick={onLogout}
                className="p-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-rose-950/80 text-slate-300 hover:text-rose-300 border border-slate-700 hover:border-rose-500/50 transition flex items-center gap-1.5 cursor-pointer"
                title="Sign out of Mentor Portal"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mt-6 pt-6 border-t border-slate-800/80">
            <div className="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-3.5">
              <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
                <Users className="w-4 h-4 text-cyan-400" />
                <span>Students Taught</span>
              </div>
              <div className="text-base sm:text-lg font-black text-white">
                {selectedMentor.totalStudents.toLocaleString()}+
              </div>
            </div>

            <div className="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-3.5">
              <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
                <Video className="w-4 h-4 text-purple-400" />
                <span>Total Reel Views</span>
              </div>
              <div className="text-base sm:text-lg font-black text-white">
                {(selectedMentor.totalReelViews / 1000000).toFixed(2)}M
              </div>
            </div>

            <div className="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-3.5">
              <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
                <HelpCircle className="w-4 h-4 text-emerald-400" />
                <span>Doubts Solved</span>
              </div>
              <div className="text-base sm:text-lg font-black text-white">
                {selectedMentor.doubtsResolved.toLocaleString()}
                <span className="text-[10px] text-emerald-400 font-bold ml-1">({selectedMentor.doubtAccuracyRate}%)</span>
              </div>
            </div>

            <div className="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-3.5">
              <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
                <Coins className="w-4 h-4 text-amber-400" />
                <span>VidyaCoins Balance</span>
              </div>
              <div className="text-base sm:text-lg font-black text-amber-400 font-mono">
                🪙 {userProfile.vidyaCoins.toLocaleString()}
              </div>
            </div>

            <div className="bg-slate-950/70 border border-emerald-500/30 rounded-2xl p-3.5 col-span-2 sm:col-span-1">
              <div className="flex items-center gap-2 text-emerald-400 text-xs mb-1">
                <TrendingUp className="w-4 h-4" />
                <span>Est. INR Earnings</span>
              </div>
              <div className="text-base sm:text-lg font-black text-emerald-300 font-mono">
                ₹{(userProfile.coinsEarnedLifetime * 0.5).toLocaleString()}
              </div>
            </div>
          </div>
        </div>

        {/* Mentor Navigation Subtabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-800">
          <button
            onClick={() => setActiveTab("live")}
            className={`px-4 py-2 rounded-2xl text-xs font-black transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === "live"
                ? "bg-gradient-to-r from-rose-600 to-amber-500 text-white shadow-lg shadow-rose-600/20"
                : "bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-850"
            }`}
          >
            <Radio className="w-4 h-4 text-rose-300 animate-pulse" />
            <span>🔴 Live Broadcast & Masterclasses</span>
          </button>

          <button
            onClick={() => setActiveTab("reels")}
            className={`px-4 py-2 rounded-2xl text-xs font-black transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === "reels"
                ? "bg-amber-500 text-slate-950 shadow-lg"
                : "bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-850"
            }`}
          >
            <Video className="w-4 h-4" />
            <span>🎬 Publish & Manage Reels ({mentorReels.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("doubts")}
            className={`px-4 py-2 rounded-2xl text-xs font-black transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === "doubts"
                ? "bg-emerald-500 text-slate-950 shadow-lg"
                : "bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-850"
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span>❓ Student Doubts Queue ({allDoubts.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("feedback")}
            className={`px-4 py-2 rounded-2xl text-xs font-black transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === "feedback"
                ? "bg-purple-600 text-white shadow-lg"
                : "bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-850"
            }`}
          >
            <Star className="w-4 h-4 text-amber-400" />
            <span>⭐ Student Reviews & Feedback</span>
          </button>

          <button
            onClick={() => setActiveTab("payouts")}
            className={`px-4 py-2 rounded-2xl text-xs font-black transition flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === "payouts"
                ? "bg-teal-500 text-slate-950 shadow-lg"
                : "bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-850"
            }`}
          >
            <DollarSign className="w-4 h-4" />
            <span>💰 Earnings & Bank Payouts</span>
          </button>
        </div>

        {/* Tab 1: Live Broadcast Studio */}
        {activeTab === "live" && (
          <div className="space-y-6">
            <MentorGoLiveStudio
              currentMentor={selectedMentor || currentMentor || allMentors[0]}
              onStartLiveBroadcast={onStartLiveBroadcast}
            />
          </div>
        )}

        {/* Tab 2: Publish & Manage Reels */}
        {activeTab === "reels" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-400" />
                  <h3 className="text-base font-bold text-white">Publish New 60s Micro-Reel</h3>
                </div>
                
                <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
                  <button
                    type="button"
                    onClick={() => setMediaSourceType("video_file")}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                      mediaSourceType === "video_file"
                        ? "bg-amber-500 text-slate-950 shadow"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    <Film className="w-3.5 h-3.5" />
                    <span>Video File Upload</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setMediaSourceType("ai_simulation")}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                      mediaSourceType === "ai_simulation"
                        ? "bg-purple-600 text-white shadow"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>AI Canvas Simulation</span>
                  </button>
                </div>
              </div>

              {publishSuccessMsg && (
                <div className="bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 text-xs px-3.5 py-2.5 rounded-2xl flex items-center gap-2 animate-fadeIn">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>{publishSuccessMsg}</span>
                </div>
              )}

              {mediaSourceType === "video_file" ? (
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <Film className="w-3.5 h-3.5 text-amber-400" />
                    <span>Reel Video File & Ingestion Bar</span>
                  </label>
                  <VideoUploadBar
                    onVideoSelected={(data) => {
                      setUploadedVideo(data);
                      setDurationSeconds(data.durationSeconds);
                    }}
                    onVideoCleared={() => setUploadedVideo(null)}
                    currentVideoUrl={uploadedVideo?.url}
                    defaultDuration={durationSeconds}
                  />
                </div>
              ) : (
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                  <label className="text-xs font-bold text-purple-300 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                    <span>Select Interactive AI Visual Animation Canvas</span>
                  </label>
                  <select
                    value={visualType}
                    onChange={(e) => setVisualType(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 focus:border-amber-400 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                  >
                    <option value="physics_optics">🔬 Ray Optics & Refraction Canvas</option>
                    <option value="chemistry_aldol">🧪 Aldol Condensation Reaction Mechanism</option>
                    <option value="dsa_recursion">💻 Recursion Tree & Call Stack</option>
                    <option value="upsc_polity">🏛️ Constitution & Fundamental Rights</option>
                    <option value="calculus_limits">📈 Calculus Limits & Derivatives</option>
                    <option value="spoken_english">🗣️ Spoken English Conversational Drill</option>
                    <option value="fintech_compounding">💰 S.I.P Compound Interest Growth</option>
                  </select>
                </div>
              )}

              <form onSubmit={handlePublish} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-300 mb-1 block">Reel Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Lensmaker's Equation in 50 Seconds 💡"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-amber-400 rounded-xl px-3 py-2 text-xs text-white placeholder:text-slate-600 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-300 mb-1 block">Subject Category</label>
                    <select
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 focus:border-amber-400 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                    >
                      <option value="JEE / NEET Prep">JEE / NEET Prep</option>
                      <option value="Tech & Coding">Tech & Coding</option>
                      <option value="UPSC & Govt Exams">UPSC & Govt Exams</option>
                      <option value="Class 9-12 CBSE/ICSE">Class 9-12 CBSE/ICSE</option>
                      <option value="Finance & Stock Market">Finance & Stock Market</option>
                      <option value="Spoken English & Communication">Spoken English & Communication</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-300 mb-1 block">Topic Tag</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ray Optics, Dynamic Programming"
                      value={topicTag}
                      onChange={(e) => setTopicTag(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 focus:border-amber-400 rounded-xl px-3 py-2 text-xs text-white placeholder:text-slate-600 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 bg-slate-950 rounded-2xl border border-slate-800">
                  <div>
                    <label className="text-xs font-bold text-slate-300 mb-1 block">Monetization Model</label>
                    <select
                      value={paywallType}
                      onChange={(e) => setPaywallType(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 focus:border-amber-400 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none"
                    >
                      <option value="ad_or_coins">Free with Sponsor Ad (+25c) or 20 Coins</option>
                      <option value="coins_only">Coins Only (Premium Micro-Lesson)</option>
                      <option value="free">100% Free Public Access</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-300 mb-1 block">Coin Unlock Cost</label>
                    <input
                      type="number"
                      min={5}
                      max={100}
                      value={coinCost}
                      onChange={(e) => setCoinCost(Number(e.target.value))}
                      disabled={paywallType === "free"}
                      className="w-full bg-slate-900 border border-slate-800 focus:border-amber-400 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none disabled:opacity-50 font-mono"
                    />
                  </div>
                </div>

                <div className="space-y-3 pt-2 border-t border-slate-800">
                  <h4 className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>In-Reel Checkpoint Quiz (Optional)</span>
                  </h4>

                  <input
                    type="text"
                    placeholder="Quiz Question: e.g. What happens to focal length in water?"
                    value={quizQuestion}
                    onChange={(e) => setQuizQuestion(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white placeholder:text-slate-600 focus:outline-none"
                  />

                  {quizQuestion && (
                    <div className="grid grid-cols-2 gap-2">
                      {quizOptions.map((opt, idx) => (
                        <div key={idx} className="flex items-center gap-2 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
                          <input
                            type="radio"
                            name="correctOpt"
                            checked={correctOptionIdx === idx}
                            onChange={() => setCorrectOptionIdx(idx)}
                            className="accent-amber-400"
                          />
                          <input
                            type="text"
                            placeholder={`Option ${idx + 1}`}
                            value={opt}
                            onChange={(e) => {
                              const newOpts = [...quizOptions];
                              newOpts[idx] = e.target.value;
                              setQuizOptions(newOpts);
                            }}
                            className="w-full bg-transparent text-xs text-white focus:outline-none"
                          />
                        </div>
                      ))}
                    </div>
                  )}

                  <div>
                    <label className="text-xs font-bold text-slate-300 mb-1 block">Attach Study Material / Cheat Sheet PDF</label>
                    <input
                      type="text"
                      placeholder="e.g. Ray Optics 1-Page Formula Summary PDF"
                      value={materialTitle}
                      onChange={(e) => setMaterialTitle(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white placeholder:text-slate-600 focus:outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-2xl text-xs font-black bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 transition flex items-center justify-center gap-2 shadow-lg cursor-pointer"
                >
                  <UploadCloud className="w-4 h-4" />
                  <span>Publish Micro-Reel to Feed</span>
                </button>
              </form>
            </div>

            <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Layers className="w-5 h-5 text-purple-400" />
                  <h3 className="text-base font-bold text-white">Manage Published Reels</h3>
                </div>
                <span className="text-xs text-amber-400 font-bold px-2 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30">
                  {mentorReels.length} Active
                </span>
              </div>

              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Search reels..."
                    value={manageSearch}
                    onChange={(e) => setManageSearch(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-amber-400 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder:text-slate-600 focus:outline-none"
                  />
                </div>
                <select
                  value={manageSubject}
                  onChange={(e) => setManageSubject(e.target.value)}
                  className="bg-slate-950 border border-slate-800 text-slate-300 text-xs rounded-xl px-2 py-1.5 focus:outline-none focus:border-amber-400"
                >
                  <option value="All">All Subjects</option>
                  <option value="JEE / NEET Prep">JEE / NEET</option>
                  <option value="Tech & Coding">Tech</option>
                  <option value="UPSC & Govt Exams">UPSC</option>
                </select>
              </div>

              <div className="space-y-3 max-h-[620px] overflow-y-auto pr-1">
                {filteredManageReels.map((reel) => {
                  const isCurrentPaywalled =
                    overrideMonetization[reel.id] !== undefined
                      ? overrideMonetization[reel.id]
                      : reel.isPaywalled;

                  return (
                    <div
                      key={reel.id}
                      className="bg-slate-950 border border-slate-800 rounded-2xl p-4 hover:border-slate-700 transition flex flex-col gap-3 group"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap mb-1">
                            <span className="text-[10px] bg-slate-850 text-amber-400 px-2 py-0.5 rounded-md font-medium border border-amber-500/20">
                              {reel.topicTag}
                            </span>
                            {reel.videoUrl && (
                              <span className="text-[9px] bg-emerald-950 text-emerald-300 px-1.5 py-0.2 rounded font-mono border border-emerald-500/30">
                                📹 MP4 Video
                              </span>
                            )}
                            <span className={`text-[9px] px-1.5 py-0.2 rounded font-semibold ${
                              isCurrentPaywalled
                                ? "bg-amber-950 text-amber-300 border border-amber-500/30"
                                : "bg-cyan-950 text-cyan-300 border border-cyan-500/30"
                            }`}>
                              {isCurrentPaywalled ? "🪙 Coins" : "🆓 Free"}
                            </span>
                          </div>
                          <h4 className="text-xs font-bold text-white line-clamp-2 leading-snug">
                            {reel.title}
                          </h4>
                        </div>
                        <span className="text-[10px] text-slate-400 whitespace-nowrap font-mono">
                          {reel.durationSeconds}s
                        </span>
                      </div>

                      <div className="grid grid-cols-3 gap-1 bg-slate-900/60 p-2 rounded-xl text-[10px] text-slate-300 text-center border border-slate-800/80">
                        <div>
                          <div className="text-cyan-400 font-bold">{reel.views.toLocaleString()}</div>
                          <div className="text-slate-500 text-[9px]">Views</div>
                        </div>
                        <div>
                          <div className="text-rose-400 font-bold">{reel.likes.toLocaleString()}</div>
                          <div className="text-slate-500 text-[9px]">Likes</div>
                        </div>
                        <div>
                          <div className="text-emerald-400 font-bold">🪙 {(reel.views * 0.05).toFixed(0)}</div>
                          <div className="text-slate-500 text-[9px]">Earned</div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-1 border-t border-slate-900 text-xs">
                        <button
                          type="button"
                          onClick={() => handleToggleReelMonetization(reel.id, isCurrentPaywalled)}
                          className={`text-[10px] font-bold px-2 py-1 rounded-lg border transition cursor-pointer flex items-center gap-1 ${
                            isCurrentPaywalled
                              ? "bg-slate-900 text-amber-300 border-amber-500/40 hover:bg-amber-500/20"
                              : "bg-slate-900 text-cyan-300 border-cyan-500/40 hover:bg-cyan-500/20"
                          }`}
                          title="Toggle between Free and Coins-only"
                        >
                          <Coins className="w-3 h-3" />
                          <span>{isCurrentPaywalled ? "Set Free" : "Set Coins"}</span>
                        </button>

                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => setEditingReel(reel)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer"
                            title="Edit Reel Details"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteReel(reel.id, reel.title)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-950 text-slate-400 hover:text-rose-400 hover:border-rose-500/50 transition cursor-pointer"
                            title="Delete Reel"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {filteredManageReels.length === 0 && (
                  <div className="text-center py-8 text-slate-500 text-xs">
                    No reels match your filter criteria.
                  </div>
                )}
              </div>
            </div>

            {editingReel && (
              <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
                <div className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-3xl p-6 shadow-2xl space-y-4 animate-scaleUp">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <Edit3 className="w-4 h-4 text-amber-400" />
                      <span>Edit Reel: {editingReel.topicTag}</span>
                    </h3>
                    <button
                      type="button"
                      onClick={() => setEditingReel(null)}
                      className="w-7 h-7 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center cursor-pointer"
                    >
                      ✕
                    </button>
                  </div>

                  <form onSubmit={handleSaveEditedReel} className="space-y-3">
                    <div>
                      <label className="text-xs font-bold text-slate-300 block mb-1">Title</label>
                      <input
                        type="text"
                        value={editingReel.title}
                        onChange={(e) => setEditingReel({ ...editingReel, title: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-xs font-bold text-slate-300 block mb-1">Topic Tag</label>
                        <input
                          type="text"
                          value={editingReel.topicTag}
                          onChange={(e) => setEditingReel({ ...editingReel, topicTag: e.target.value })}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-300 block mb-1">Unlock Cost (Coins)</label>
                        <input
                          type="number"
                          value={editingReel.unlockCostCoins || 20}
                          onChange={(e) => setEditingReel({ ...editingReel, unlockCostCoins: Number(e.target.value) })}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400 font-mono"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                      <button
                        type="button"
                        onClick={() => setEditingReel(null)}
                        className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700 cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold shadow cursor-pointer"
                      >
                        Save Changes
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Student Doubts Queue */}
        {activeTab === "doubts" && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <span>Student Doubt Resolution Queue</span>
                  <span className="bg-emerald-500/20 text-emerald-300 text-xs font-black px-2 py-0.5 rounded-full">
                    Active Feed
                  </span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Answer questions from students preparing for {selectedMentor.specialization}. Earn VidyaCoins per verified resolution.
                </p>
              </div>

              <span className="text-xs text-amber-400 font-mono bg-amber-500/10 border border-amber-500/30 px-3 py-1 rounded-xl">
                Reward: +20 to +50 Coins / solution
              </span>
            </div>

            <div className="space-y-4">
              {allDoubts.map((doubt) => {
                const isReplied = repliedDoubts.includes(doubt.id);

                return (
                  <div
                    key={doubt.id}
                    className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={doubt.authorAvatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80"}
                          alt={doubt.authorName}
                          className="w-9 h-9 rounded-full object-cover border border-amber-400"
                        />
                        <div>
                          <div className="text-xs font-bold text-white flex items-center gap-2">
                            <span>{doubt.authorName}</span>
                            {doubt.isVoiceDoubt && (
                              <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.2 rounded-full font-bold flex items-center gap-1">
                                <Radio className="w-2.5 h-2.5 animate-pulse" /> Voice Question
                              </span>
                            )}
                          </div>
                          <div className="text-[10px] text-slate-400">
                            {doubt.subject} • {doubt.timestamp}
                            {doubt.reelTitle && ` • From: ${doubt.reelTitle}`}
                          </div>
                        </div>
                      </div>

                      <span className="text-xs font-mono text-amber-400 bg-amber-950/60 border border-amber-500/40 px-2 py-0.5 rounded-lg whitespace-nowrap">
                        🪙 +35 Coins Bounty
                      </span>
                    </div>

                    <div className="space-y-1">
                      <h4 className="text-xs font-bold text-white leading-snug">
                        {doubt.title}
                      </h4>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        {doubt.content}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-slate-900 flex items-center justify-between flex-wrap gap-2">
                      <span className="text-xs text-slate-400">
                        {doubt.answers.length} Existing Answers • {doubt.upvotes} Upvotes
                      </span>

                      {isReplied ? (
                        <span className="bg-emerald-500/20 text-emerald-300 text-xs font-bold px-3 py-1 rounded-xl flex items-center gap-1.5 border border-emerald-500/40">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Answer Submitted (+35c)</span>
                        </span>
                      ) : answeringDoubtId === doubt.id ? (
                        <div className="w-full space-y-2 mt-2">
                          <textarea
                            rows={3}
                            placeholder="Write your step-by-step verified conceptual solution..."
                            value={answerContent}
                            onChange={(e) => setAnswerContent(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-emerald-400"
                          />
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => {
                                setAnsweringDoubtId(null);
                                setAnswerContent("");
                              }}
                              className="px-3 py-1 rounded-xl text-xs text-slate-400 hover:text-white"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={() => handleSendDoubtAnswer(doubt.id)}
                              className="px-4 py-1.5 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 flex items-center gap-1.5 cursor-pointer shadow"
                            >
                              <Send className="w-3.5 h-3.5" />
                              <span>Submit Verified Answer</span>
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={() => setAnsweringDoubtId(doubt.id)}
                          className="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-850 hover:bg-emerald-600 hover:text-white text-emerald-400 border border-emerald-500/40 transition flex items-center gap-1.5 cursor-pointer"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>Answer This Doubt</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 4: Feedback & Student Reviews */}
        {activeTab === "feedback" && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl space-y-6">
            <ReelFeedbackSection
              currentMentor={selectedMentor}
              isCreatorStudioView={true}
            />
          </div>
        )}

        {/* Tab 5: Earnings & Payouts */}
        {activeTab === "payouts" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-teal-400" />
                  <h3 className="text-base font-bold text-white">Instant UPI / Bank Withdrawal</h3>
                </div>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded-full">
                  1 Coin = ₹0.50 INR
                </span>
              </div>

              {withdrawStatus && (
                <div className="bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 text-xs px-3.5 py-2.5 rounded-2xl">
                  {withdrawStatus}
                </div>
              )}

              <form onSubmit={handleWithdrawalRequest} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-300 mb-1 block">UPI ID / VPA</label>
                  <input
                    type="text"
                    required
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    placeholder="yourname@okhdfcbank"
                    className="w-full bg-slate-950 border border-slate-800 focus:border-teal-400 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 mb-1 block">
                    Withdrawal Amount (VidyaCoins)
                  </label>
                  <input
                    type="number"
                    min={500}
                    step={100}
                    value={withdrawCoins}
                    onChange={(e) => setWithdrawCoins(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-teal-400 rounded-xl px-3 py-2 text-xs text-white focus:outline-none font-mono"
                  />
                  <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1">
                    <span>Equivalent Cash Payout:</span>
                    <span className="text-emerald-400 font-bold font-mono">
                      ₹{(withdrawCoins * 0.5).toLocaleString()} INR
                    </span>
                  </div>
                </div>

                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-3 text-xs text-slate-400 space-y-1">
                  <div className="flex justify-between">
                    <span>Available Balance:</span>
                    <span className="font-mono text-amber-400 font-bold">🪙 {userProfile.vidyaCoins.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Processing Fee (0% for Verified Mentors):</span>
                    <span className="text-emerald-400">FREE</span>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-2xl text-xs font-black bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-slate-950 transition flex items-center justify-center gap-2 shadow-lg cursor-pointer"
                >
                  <DollarSign className="w-4 h-4" />
                  <span>Request Instant Bank Transfer</span>
                </button>
              </form>
            </div>

            <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-amber-400" />
                  <h3 className="text-base font-bold text-white">Income Sources Breakdown</h3>
                </div>
              </div>

              <div className="space-y-3">
                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-3.5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center">
                      <Radio className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white">Live Stream Tips & Superchats</div>
                      <div className="text-[10px] text-slate-400">Student live coin boosts during masterclasses</div>
                    </div>
                  </div>
                  <span className="text-xs font-mono text-amber-400 font-bold">🪙 42,800</span>
                </div>

                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-3.5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                      <Lock className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white">Micro-Reel Coin Unlocks</div>
                      <div className="text-[10px] text-slate-400">Direct student unlocks for premium 60s reels</div>
                    </div>
                  </div>
                  <span className="text-xs font-mono text-amber-400 font-bold">🪙 26,400</span>
                </div>

                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-3.5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                      <MessageSquare className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white">1-on-1 Student Consultations</div>
                      <div className="text-[10px] text-slate-400">Private doubt chat fees (40 coins/session)</div>
                    </div>
                  </div>
                  <span className="text-xs font-mono text-amber-400 font-bold">🪙 15,300</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
