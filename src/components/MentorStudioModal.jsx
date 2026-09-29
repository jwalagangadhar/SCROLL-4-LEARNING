import React, { useState } from "react";
import {
  UploadCloud,
  Sparkles,
  Video,
  FileText,
  HelpCircle,
  Lock,
  CheckCircle2,
  BarChart3,
  ShieldCheck,
  Award,
  Star,
  MessageSquare,
  Radio,
} from "lucide-react";
import {
  VerifiedMentorBadge,
  getMentorEngagementScore,
} from "./VerifiedMentorBadge";
import { ReelFeedbackSection } from "./ReelFeedbackSection";
import { MentorGoLiveStudio } from "./MentorGoLiveStudio";
import { VideoUploadBar } from "./VideoUploadBar";

export const MentorStudioModal = ({
  currentMentor,
  allMentors = [],
  allReels = [],
  onPublishReel,
  onStartLiveBroadcast,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState("live");
  const [selectedMentor, setSelectedMentor] = useState(currentMentor);

  // Form State
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [subject, setSubject] = useState("JEE / NEET Prep");
  const [topicTag, setTopicTag] = useState("");
  const [visualType, setVisualType] = useState("physics_optics");
  const [uploadedVideo, setUploadedVideo] = useState(null);
  const [durationSeconds, setDurationSeconds] = useState(50);
  const [paywallType, setPaywallType] = useState("ad_or_coins");
  const [coinCost, setCoinCost] = useState(20);
  const [seriesTitle, setSeriesTitle] = useState("");
  const [quizQuestion, setQuizQuestion] = useState("");
  const [quizOptions, setQuizOptions] = useState(["", "", "", ""]);
  const [correctOptionIdx, setCorrectOptionIdx] = useState(0);
  const [materialTitle, setMaterialTitle] = useState("");

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
      mentor: selectedMentor,
      visualType,
      videoUrl: uploadedVideo?.url || undefined,
      posterBg: "from-slate-900 via-indigo-950 to-black",
      durationSeconds: uploadedVideo?.durationSeconds || durationSeconds,
      language: "Hinglish",
      views: 120,
      likes: 18,
      shares: 4,
      saves: 12,
      seriesTitle: seriesTitle || undefined,
      isPaywalled: paywallType !== "free",
      unlockType: paywallType,
      unlockCostCoins: paywallType === "free" ? 0 : coinCost,
      keyMoments: [
        { timeSeconds: 5, label: "Core Concept Intuition" },
        { timeSeconds: 25, label: "Formula / Derivation" },
        { timeSeconds: 42, label: "Exam Shortcut Trick" },
      ],
      quiz: quizQuestion.trim()
        ? {
            question: quizQuestion,
            options: quizOptions.filter((o) => o.trim().length > 0),
            correctIdx: correctOptionIdx,
            explanation: "Review the key derivation presented in this reel.",
            rewardCoins: 15,
          }
        : undefined,
      studyMaterials: materialTitle.trim()
        ? [
            {
              id: `mat-${Date.now()}`,
              title: materialTitle,
              type: "cheat_sheet",
              fileSize: "1.8 MB",
              requiresUnlock: paywallType !== "free",
              unlockCostCoins: coinCost,
              downloadCount: 0,
              summary: "One-page visual summary notes prepared by the mentor.",
            },
          ]
        : [],
    };

    onPublishReel(newReel);
    alert("🎉 VidyaReel Published to India! Students can now watch and solve doubts.");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="w-full max-w-4xl bg-slate-900 border border-slate-700 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
        {/* Top Header */}
        <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src={selectedMentor.avatar}
                alt={selectedMentor.name}
                className="w-11 h-11 rounded-2xl object-cover border-2 border-amber-400 shadow-md"
              />
              {selectedMentor.verified && (
                <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-slate-950 flex items-center justify-center">
                  <ShieldCheck className="w-2.5 h-2.5 text-white" />
                </div>
              )}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-base font-bold text-white">
                  {selectedMentor.name}&apos;s Creator Studio
                </h3>
                <VerifiedMentorBadge mentor={selectedMentor} size="sm" showScore={true} />
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {selectedMentor.specialization} • {selectedMentor.qualification}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {(allMentors || []).length > 1 && (
              <select
                value={selectedMentor.id}
                onChange={(e) => {
                  const m = (allMentors || []).find((x) => x.id === e.target.value);
                  if (m) setSelectedMentor(m);
                }}
                className="hidden sm:block bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1 text-xs text-slate-300 focus:outline-none focus:border-amber-400"
              >
                {(allMentors || []).map((m) => (
                  <option key={m.id} value={m.id}>
                    Switch: {m.name}
                  </option>
                ))}
              </select>
            )}

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition cursor-pointer"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Tab Selector */}
        <div className="flex border-b border-slate-800 bg-slate-950/80 px-6 pt-2 overflow-x-auto gap-1">
          <button
            onClick={() => setActiveTab("live")}
            className={`pb-3 px-4 text-xs font-bold transition border-b-2 flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeTab === "live"
                ? "border-rose-500 text-rose-400"
                : "border-transparent text-slate-400 hover:text-white"
            }`}
          >
            <Radio className="w-4 h-4 text-rose-500 animate-pulse" />
            <span>Go Live & Host Teaching Class</span>
            <span className="ml-1 px-1.5 py-0.2 bg-rose-500/20 text-rose-300 text-[10px] font-black rounded-full border border-rose-500/30">
              🔴 LIVE
            </span>
          </button>

          <button
            onClick={() => setActiveTab("feedback")}
            className={`pb-3 px-4 text-xs font-bold transition border-b-2 flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeTab === "feedback"
                ? "border-amber-400 text-amber-400"
                : "border-transparent text-slate-400 hover:text-white"
            }`}
          >
            <MessageSquare className="w-4 h-4 text-amber-400" />
            <span>Reel Feedback & Anonymous Reviews</span>
            <span className="ml-1 px-1.5 py-0.2 bg-amber-500/20 text-amber-300 text-[10px] font-black rounded-full border border-amber-500/30">
              ⭐ {selectedMentor.rating}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("upload")}
            className={`pb-3 px-4 text-xs font-bold transition border-b-2 flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeTab === "upload"
                ? "border-amber-400 text-amber-400"
                : "border-transparent text-slate-400 hover:text-white"
            }`}
          >
            <Video className="w-4 h-4" /> Publish New VidyaReel
          </button>

          <button
            onClick={() => setActiveTab("analytics")}
            className={`pb-3 px-4 text-xs font-bold transition border-b-2 flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeTab === "analytics"
                ? "border-amber-400 text-amber-400"
                : "border-transparent text-slate-400 hover:text-white"
            }`}
          >
            <BarChart3 className="w-4 h-4" /> Mentor Analytics & Coin Revenue
          </button>
        </div>

        {/* Content Area */}
        <div className="p-6 overflow-y-auto flex-1">
          {activeTab === "live" ? (
            <MentorGoLiveStudio
              currentMentor={selectedMentor || currentMentor || allMentors[0]}
              onStartLiveBroadcast={(s) => {
                if (onStartLiveBroadcast) onStartLiveBroadcast(s);
              }}
            />
          ) : activeTab === "feedback" ? (
            <ReelFeedbackSection
              currentMentor={selectedMentor}
              allReels={allReels}
            />
          ) : activeTab === "upload" ? (
            <form onSubmit={handlePublish} className="flex flex-col gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300 block">
                  Reel Video File & Ingestion Bar:
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    Reel Title (Punchy Concept):
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Master Aldol Condensation in 50 Seconds"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    Subject Category:
                  </label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
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
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    Topic / Sub-Tag:
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Organic Chemistry, Ray Optics, DP Memoization"
                    value={topicTag}
                    onChange={(e) => setTopicTag(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    Interactive Visual Engine:
                  </label>
                  <select
                    value={visualType}
                    onChange={(e) => setVisualType(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                  >
                    <option value="physics_optics">3D Optics & Laser Physics</option>
                    <option value="dsa_recursion">Dynamic Programming & Tree Visualizer</option>
                    <option value="upsc_polity">Constitution & Polity Shield</option>
                    <option value="fintech_compounding">Wealth Compounding Growth Graph</option>
                    <option value="neural_attention">Transformer Attention Neural Map</option>
                    <option value="custom_video">Animated Presentation Stage</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  Key Takeaway & Exam Importance:
                </label>
                <textarea
                  rows={2}
                  placeholder="Explain why this concept is tested in JEE/NEET/UPSC or Coding interviews..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="bg-slate-950/80 border border-amber-500/30 rounded-2xl p-4 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                    <Lock className="w-4 h-4 text-amber-400" /> Mentor Paywall & Access Control
                  </span>
                  <span className="text-[10px] text-slate-400">
                    Earn 70% of VidyaCoins & Ad Revenue
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: "free", label: "Free (All Students)", desc: "Builds audience" },
                    { id: "ad_or_coins", label: "Ad or Coins (Recommended)", desc: "High completion" },
                    { id: "coins_only", label: "Coins Only (Exclusive)", desc: "Maximum earnings" },
                  ].map((p) => (
                    <div
                      key={p.id}
                      onClick={() => setPaywallType(p.id)}
                      className={`p-2.5 rounded-xl border cursor-pointer transition text-left ${
                        paywallType === p.id
                          ? "bg-amber-500/20 border-amber-400 text-white"
                          : "bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700"
                      }`}
                    >
                      <div className="text-xs font-bold">{p.label}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">{p.desc}</div>
                    </div>
                  ))}
                </div>

                {paywallType !== "free" && (
                  <div className="flex items-center gap-3 pt-2">
                    <label className="text-xs text-slate-300">Reel Unlock Cost:</label>
                    <input
                      type="number"
                      min={10}
                      max={100}
                      value={coinCost}
                      onChange={(e) => setCoinCost(Number(e.target.value))}
                      className="w-20 bg-slate-900 border border-slate-700 rounded-lg p-1.5 text-xs text-amber-300 font-mono text-center font-bold"
                    />
                    <span className="text-xs text-slate-400">VidyaCoins</span>
                  </div>
                )}
              </div>

              <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-4 flex flex-col gap-3">
                <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                  <HelpCircle className="w-4 h-4 text-cyan-400" /> Optional In-Reel Concept Quiz (+15 Coins for students)
                </span>
                <input
                  type="text"
                  placeholder="Quick 1-line check question (e.g. TIR occurs when angle of incidence > ...?)"
                  value={quizQuestion}
                  onChange={(e) => setQuizQuestion(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2 text-xs text-white"
                />
                {quizQuestion.trim() && (
                  <div className="grid grid-cols-2 gap-2">
                    {quizOptions.map((opt, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="correctOption"
                          checked={correctOptionIdx === i}
                          onChange={() => setCorrectOptionIdx(i)}
                          className="accent-amber-400 cursor-pointer"
                        />
                        <input
                          type="text"
                          placeholder={`Option ${i + 1} ${i === correctOptionIdx ? "(Correct)" : ""}`}
                          value={opt}
                          onChange={(e) => {
                            const copy = [...quizOptions];
                            copy[i] = e.target.value;
                            setQuizOptions(copy);
                          }}
                          className="flex-1 bg-slate-900 border border-slate-800 rounded-lg p-1.5 text-xs text-white"
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-3">
                <FileText className="w-4 h-4 text-emerald-400" />
                <input
                  type="text"
                  placeholder="Attach PDF / Formula Cheat-Sheet Title (Optional)"
                  value={materialTitle}
                  onChange={(e) => setMaterialTitle(e.target.value)}
                  className="flex-1 bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-extrabold text-sm rounded-xl shadow-lg transition cursor-pointer flex items-center justify-center gap-2 mt-2"
              >
                <UploadCloud className="w-5 h-5" /> Publish VidyaReel to India
              </button>
            </form>
          ) : (
            <div className="flex flex-col gap-6">
              <div className="bg-gradient-to-br from-amber-950/40 via-slate-950 to-emerald-950/40 border border-amber-500/40 rounded-3xl p-5 shadow-xl relative overflow-hidden">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-emerald-400 p-0.5 shadow-lg flex-shrink-0">
                      <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                        <ShieldCheck className="w-6 h-6 text-emerald-400" />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="text-sm font-black text-white">
                          Verified Mentor Program
                        </h4>
                        <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-extrabold px-2 py-0.5 rounded-full flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                          STATUS: ACTIVE
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 mt-0.5">
                        High Student Engagement & Verified Doubt Master
                      </p>
                    </div>
                  </div>

                  <div className="text-left sm:text-right bg-slate-900/90 border border-slate-800 px-4 py-2 rounded-2xl flex-shrink-0">
                    <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                      Engagement Index
                    </div>
                    <div className="text-xl font-black text-amber-400 font-mono flex items-center sm:justify-end gap-1">
                      <Sparkles className="w-4 h-4 text-amber-400" />
                      <span>{getMentorEngagementScore(selectedMentor)}</span>
                      <span className="text-xs text-slate-400 font-normal">/100</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 my-4">
                  <div className="bg-slate-900/80 border border-slate-800 p-3 rounded-2xl">
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="text-slate-400 font-medium">Reel Engagement</span>
                      <span className="font-mono font-bold text-amber-400">
                        {selectedMentor.reelEngagementRate ?? 95.4}%
                      </span>
                    </div>
                    <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                      <div
                        className="h-full bg-gradient-to-r from-amber-500 to-orange-400 rounded-full"
                        style={{ width: `${Math.min(100, selectedMentor.reelEngagementRate ?? 95.4)}%` }}
                      />
                    </div>
                    <div className="text-[10px] text-emerald-400 mt-1.5 flex items-center justify-between">
                      <span>✓ Benchmark (85%+) passed</span>
                      <span className="font-mono">{selectedMentor.totalReelViews.toLocaleString()} views</span>
                    </div>
                  </div>

                  <div className="bg-slate-900/80 border border-slate-800 p-3 rounded-2xl">
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="text-slate-400 font-medium">Student Feedback</span>
                      <span className="font-mono font-bold text-emerald-400 flex items-center gap-0.5">
                        <Star className="w-3 h-3 fill-emerald-400" />
                        <span>{selectedMentor.rating}</span>
                      </span>
                    </div>
                    <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                      <div
                        className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full"
                        style={{ width: `${Math.min(100, (selectedMentor.rating / 5) * 100)}%` }}
                      />
                    </div>
                    <div className="text-[10px] text-emerald-400 mt-1.5 flex items-center justify-between">
                      <span>✓ {selectedMentor.positiveFeedbackPercent}% positive reviews</span>
                      <span className="font-mono">{selectedMentor.studentReviewsCount.toLocaleString()}+</span>
                    </div>
                  </div>

                  <div className="bg-slate-900/80 border border-slate-800 p-3 rounded-2xl">
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="text-slate-400 font-medium">Doubt Turnaround</span>
                      <span className="font-mono font-bold text-cyan-400">
                        ~{selectedMentor.avgResolutionTimeMinutes} mins
                      </span>
                    </div>
                    <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                      <div
                        className="h-full bg-gradient-to-r from-cyan-500 to-blue-400 rounded-full"
                        style={{ width: `95%` }}
                      />
                    </div>
                    <div className="text-[10px] text-cyan-400 mt-1.5 flex items-center justify-between">
                      <span>✓ {selectedMentor.doubtAccuracyRate}% accuracy</span>
                      <span className="font-mono">{selectedMentor.doubtsResolved} solved</span>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-950/70 border border-slate-800/80 rounded-2xl p-3.5 mt-2">
                  <div className="text-xs font-bold text-slate-300 mb-2 flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-amber-400" />
                    <span>Active Verified Creator Privileges</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                      <span>Verified Badge on Leaderboard & Reels</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                      <span>Priority 1-on-1 Consultation Placement</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                      <span>Algorithmic feed boost for new reels</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                      <span>Reduced Platform Commission (15% vs 30%)</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 text-center">
                  <div className="text-2xl font-black text-white">{selectedMentor.totalStudents.toLocaleString()}+</div>
                  <div className="text-[10px] text-slate-400 uppercase font-semibold mt-1">
                    Active Students
                  </div>
                </div>
                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 text-center">
                  <div className="text-2xl font-black text-amber-400">{(selectedMentor.totalHoursTaught || 2400).toLocaleString()}+</div>
                  <div className="text-[10px] text-slate-400 uppercase font-semibold mt-1">
                    Hours Taught
                  </div>
                </div>
                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 text-center">
                  <div className="text-2xl font-black text-amber-400">{selectedMentor.totalReels}</div>
                  <div className="text-[10px] text-slate-400 uppercase font-semibold mt-1">
                    Total VidyaReels
                  </div>
                </div>
                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 text-center">
                  <div className="text-2xl font-black text-emerald-400">🪙 24,850</div>
                  <div className="text-[10px] text-slate-400 uppercase font-semibold mt-1">
                    Coins Earned
                  </div>
                </div>
                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 text-center">
                  <div className="text-2xl font-black text-cyan-400">{selectedMentor.doubtsResolved}</div>
                  <div className="text-[10px] text-slate-400 uppercase font-semibold mt-1">
                    Doubts Resolved
                  </div>
                </div>
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5">
                <h4 className="text-sm font-bold text-white mb-3">
                  Direct Consultation Settings
                </h4>
                <div className="flex items-center justify-between text-xs text-slate-300">
                  <span>1-on-1 Chat Rate:</span>
                  <span className="font-bold text-amber-400 font-mono">
                    {selectedMentor.privateChatFeeCoins} VidyaCoins / Session
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-300 mt-2">
                  <span>Monthly Creator Payout:</span>
                  <span className="font-bold text-emerald-400">
                    ₹48,200 (Estimated Bank Transfer)
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
