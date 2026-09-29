import React, { useState, useEffect, useRef } from "react";
import {
  HelpCircle,
  MessageSquare,
  Sparkles,
  ThumbsUp,
  CheckCircle2,
  Send,
  Search,
  UserCheck,
  Bot,
  Plus,
  BookOpen,
  Bookmark,
  Mic,
  Play,
  Pause,
  Radio,
  FileText,
  Flag,
  ShieldAlert,
  Trophy,
} from "lucide-react";
import { VerifiedMentorBadge } from "./VerifiedMentorBadge";
import { AudioDoubtRecorder } from "./AudioDoubtRecorder";
import { FlagCommentModal } from "./FlagCommentModal";

export const DoubtForum = ({
  doubts = [],
  mentors = [],
  userProfile,
  onAskNewDoubt,
  onUpvoteDoubt,
  onAddAnswer,
  onOpenPrivateChat,
  onNavigateToLeaderboard,
  initialReelContext,
  onClearInitialReelContext,
}) => {
  const [activeTab, setActiveTab] = useState("all");
  const [selectedSubject, setSelectedSubject] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [showAskModal, setShowAskModal] = useState(false);
  const [askModalMode, setAskModalMode] = useState("voice");

  // New doubt form state
  const [doubtTitle, setDoubtTitle] = useState("");
  const [doubtContent, setDoubtContent] = useState("");
  const [doubtSubject, setDoubtSubject] = useState("JEE / NEET Prep");
  const [attachedReelId, setAttachedReelId] = useState(undefined);
  const [attachedReelTitle, setAttachedReelTitle] = useState(undefined);
  const [attachedReelTimestamp, setAttachedReelTimestamp] = useState(undefined);
  const [isAiAnswering, setIsAiAnswering] = useState(false);
  const [aiPreviewAnswer, setAiPreviewAnswer] = useState(null);
  const [voiceAudioUrl, setVoiceAudioUrl] = useState(null);
  const [voiceDurationSeconds, setVoiceDurationSeconds] = useState(undefined);
  const [rawSpokenTranscript, setRawSpokenTranscript] = useState("");

  // Answer input states per doubt
  const [answeringDoubtId, setAnsweringDoubtId] = useState(null);
  const [answerContent, setAnswerContent] = useState("");

  // Inappropriate comment/answer flagging state
  const [flaggedAnswerIds, setFlaggedAnswerIds] = useState([]);
  const [flaggedDoubtIds, setFlaggedDoubtIds] = useState([]);
  const [flagModalConfig, setFlagModalConfig] = useState({ isOpen: false });

  const [toastMessage, setToastMessage] = useState(null);

  // Saved Doubt & Answer Bookmarks State
  const [savedDoubtIds, setSavedDoubtIds] = useState([]);
  const [savedAnswerIds, setSavedAnswerIds] = useState([]);

  const handleToggleSaveDoubt = (doubtId) => {
    setSavedDoubtIds((prev) => {
      const isSaved = prev.includes(doubtId);
      const next = isSaved ? prev.filter((id) => id !== doubtId) : [...prev, doubtId];
      setToastMessage(isSaved ? "Doubt removed from saved revision list." : "📌 Doubt & discussion saved to your Library!");
      setTimeout(() => setToastMessage(null), 4500);
      return next;
    });
  };

  const handleToggleSaveAnswer = (answerId) => {
    setSavedAnswerIds((prev) => {
      const isSaved = prev.includes(answerId);
      const next = isSaved ? prev.filter((id) => id !== answerId) : [...prev, answerId];
      setToastMessage(isSaved ? "Answer removed from saved notes." : "🔖 Mentor solution saved to your Library!");
      setTimeout(() => setToastMessage(null), 4500);
      return next;
    });
  };

  const handleFlagReportSubmit = (reasonLabel, details) => {
    if (flagModalConfig.itemId) {
      const id = flagModalConfig.itemId;
      if (flagModalConfig.itemType === "doubt") {
        setFlaggedDoubtIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
      } else {
        setFlaggedAnswerIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
      }
      setToastMessage(`Item flagged under "${reasonLabel}". Sent to moderation team.`);
      setTimeout(() => setToastMessage(null), 4500);
    }
  };

  // Audio Playback state for voice doubts
  const [playingAudioId, setPlayingAudioId] = useState(null);
  const activeAudioRef = useRef(null);

  // Auto-fill context if opened from a specific Reel
  useEffect(() => {
    if (initialReelContext) {
      if (initialReelContext.subject) {
        setDoubtSubject(initialReelContext.subject);
      }
      setAttachedReelId(initialReelContext.reelId);
      setAttachedReelTitle(initialReelContext.reelTitle);
      setAttachedReelTimestamp(initialReelContext.reelTimestamp);
      setDoubtTitle(`Doubt on "${initialReelContext.reelTitle || "Concept Reel"}" @${initialReelContext.reelTimestamp || 0}s`);
      setDoubtContent(`Hi mentor, while watching "${initialReelContext.reelTitle || "this reel"}" at timestamp ${initialReelContext.reelTimestamp || 0}s, I had a doubt regarding the step...`);
      setAskModalMode("type");
      setShowAskModal(true);
      if (onClearInitialReelContext) {
        onClearInitialReelContext();
      }
    }
  }, [initialReelContext]);

  const filteredDoubts = (doubts || []).filter((d) => {
    const matchesTab =
      activeTab === "all"
        ? true
        : activeTab === "mentor_answered"
        ? d.status === "answered_by_mentor"
        : d.status === "open";

    const matchesSubject = selectedSubject === "All" || d.subject === selectedSubject;
    const matchesSearch =
      !searchQuery ||
      d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (d.reelTitle && d.reelTitle.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesTab && matchesSubject && matchesSearch;
  });

  const handleOpenVoiceDoubtModal = () => {
    setAskModalMode("voice");
    setShowAskModal(true);
  };

  const handleOpenTypeDoubtModal = () => {
    setAskModalMode("type");
    setShowAskModal(true);
  };

  const handleTranscriptionComplete = (result) => {
    setDoubtTitle(result.title);
    setDoubtContent(result.content);
    if (result.subject) {
      setDoubtSubject(result.subject);
    }
    if (result.audioUrl) {
      setVoiceAudioUrl(result.audioUrl);
    }
    setVoiceDurationSeconds(result.durationSeconds);
    setRawSpokenTranscript(result.rawTranscript);
    setAskModalMode("type");
  };

  const handlePlayVoiceDoubt = (doubtId, url) => {
    if (playingAudioId === doubtId) {
      if (activeAudioRef.current) {
        activeAudioRef.current.pause();
      }
      setPlayingAudioId(null);
      return;
    }

    if (activeAudioRef.current) {
      activeAudioRef.current.pause();
    }

    if (url) {
      const audio = new Audio(url);
      activeAudioRef.current = audio;
      audio.onended = () => setPlayingAudioId(null);
      audio.onerror = () => setPlayingAudioId(null);
      audio.play().catch(() => setPlayingAudioId(null));
      setPlayingAudioId(doubtId);
    } else {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        const doubt = doubts.find((d) => d.id === doubtId);
        if (doubt) {
          window.speechSynthesis.cancel();
          const utterance = new SpeechSynthesisUtterance(doubt.content || doubt.title);
          utterance.rate = 1.0;
          utterance.onend = () => setPlayingAudioId(null);
          utterance.onerror = () => setPlayingAudioId(null);
          window.speechSynthesis.speak(utterance);
          setPlayingAudioId(doubtId);
        }
      }
    }
  };

  const handleAskWithAiSolver = async () => {
    if (!doubtTitle.trim() || !doubtContent.trim()) return;

    setIsAiAnswering(true);
    setAiPreviewAnswer(null);

    try {
      const res = await fetch("/api/ai/doubt-solver", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: `${doubtTitle}\n\nDetails: ${doubtContent}`,
          subject: doubtSubject,
          language: userProfile.preferredLanguage,
        }),
      });
      const data = await res.json();
      setAiPreviewAnswer(data.answer);
    } catch (e) {
      console.error(e);
    } finally {
      setIsAiAnswering(false);
    }
  };

  const handlePostDoubt = () => {
    if (!doubtTitle.trim() || !doubtContent.trim()) return;

    const isVoice = Boolean(voiceDurationSeconds || voiceAudioUrl || rawSpokenTranscript);

    const newDoubt = {
      title: doubtTitle,
      content: doubtContent,
      subject: doubtSubject,
      reelId: attachedReelId,
      reelTitle: attachedReelTitle,
      reelTimestamp: attachedReelTimestamp,
      authorName: `${userProfile.name} (${userProfile.targetExam || "Student"})`,
      authorAvatar: userProfile.avatar,
      authorRole: "student",
      timestamp: "Just now",
      upvotes: 1,
      status: "open",
      isVoiceDoubt: isVoice,
      voiceAudioUrl: voiceAudioUrl || undefined,
      voiceDurationSeconds: voiceDurationSeconds || (isVoice ? 8 : undefined),
      rawSpokenTranscript: rawSpokenTranscript || undefined,
      answers: aiPreviewAnswer
        ? [
            {
              id: `ans-ai-${Date.now()}`,
              doubtId: "",
              authorName: "VidyaAI Instant Co-Pilot",
              authorAvatar: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80",
              authorRole: "ai_assistant",
              isMentor: false,
              content: aiPreviewAnswer,
              timestamp: "Instant",
              upvotes: 5,
              isAccepted: false,
            },
          ]
        : [],
    };

    onAskNewDoubt(newDoubt);
    setShowAskModal(false);
    setDoubtTitle("");
    setDoubtContent("");
    setAttachedReelId(undefined);
    setAttachedReelTitle(undefined);
    setAttachedReelTimestamp(undefined);
    setVoiceAudioUrl(null);
    setVoiceDurationSeconds(undefined);
    setRawSpokenTranscript("");
    setAiPreviewAnswer(null);
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-4">
      {/* 1. Top Hero */}
      <div className="bg-gradient-to-r from-blue-950/70 via-indigo-950/60 to-slate-900 border border-blue-500/30 rounded-3xl p-6 mb-6 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden shadow-2xl">
        <div className="max-w-xl z-10">
          <div className="flex items-center gap-2 flex-wrap mb-2">
            <span className="inline-flex items-center gap-1 text-xs font-bold text-cyan-300 bg-cyan-950/80 px-3 py-1 rounded-full border border-cyan-500/40 uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" /> India-Wide Doubt & Mentorship Hub
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-300 bg-amber-950/80 px-2.5 py-0.5 rounded-full border border-amber-500/40">
              <Mic className="w-3 h-3 text-amber-400" /> Audio-to-Text Enabled
            </span>
          </div>

          <h2 className="text-2xl font-extrabold text-white mb-2">
            Never Stay Stuck. Ask with Voice on the Go!
          </h2>
          <p className="text-xs text-slate-300 leading-relaxed mb-4">
            Voice your doubts naturally in Hinglish or English while traveling or revising. Our AI instantly transcribes formulas and routes your question to top 1% mentors.
          </p>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={handleOpenVoiceDoubtModal}
              className="px-4 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-amber-500/25 flex items-center gap-2 transition cursor-pointer transform hover:scale-105 active:scale-95"
            >
              <div className="w-4 h-4 rounded-full bg-slate-950/20 flex items-center justify-center animate-pulse">
                <Mic className="w-3 h-3 text-slate-950" />
              </div>
              <span>🎙️ Voice Record Doubt</span>
            </button>

            <button
              onClick={handleOpenTypeDoubtModal}
              className="px-3.5 py-2.5 bg-slate-800/90 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl border border-slate-700 hover:border-slate-600 flex items-center gap-1.5 transition cursor-pointer"
            >
              <Plus className="w-4 h-4 text-amber-400" /> Type Doubt
            </button>
          </div>
        </div>

        {/* Top Mentors Carousel for 1-on-1 Private Chats */}
        <div className="w-full md:w-auto bg-slate-900/90 border border-slate-700/80 rounded-2xl p-4 flex flex-col gap-3 min-w-[280px]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
              <UserCheck className="w-4 h-4 text-emerald-400" /> Online Mentors (1-on-1)
            </span>
            {onNavigateToLeaderboard && (
              <button
                onClick={onNavigateToLeaderboard}
                className="text-[10px] text-amber-400 hover:text-amber-300 font-bold flex items-center gap-0.5 cursor-pointer"
              >
                <Trophy className="w-3 h-3" />
                <span>Leaderboard</span>
              </button>
            )}
          </div>

          <div className="flex flex-col gap-2">
            {mentors.slice(0, 3).map((mentor) => (
              <div
                key={mentor.id}
                onClick={() => onOpenPrivateChat(mentor)}
                className="p-2 bg-slate-800/80 hover:bg-slate-750 hover:border-amber-500/50 border border-slate-700 rounded-xl flex items-center justify-between gap-2 cursor-pointer transition"
              >
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <img
                      src={mentor.avatar}
                      alt={mentor.name}
                      className="w-8 h-8 rounded-full object-cover border border-amber-400"
                    />
                    {mentor.isOnline && (
                      <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-slate-900" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-1">
                      <span className="text-xs font-bold text-white">{mentor.name}</span>
                      <VerifiedMentorBadge mentor={mentor} size="xs" showScore={false} />
                    </div>
                    <div className="text-[10px] text-slate-400">{mentor.specialization}</div>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[11px] font-bold text-amber-300 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-500/30">
                    🪙 {mentor.privateChatFeeCoins}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 2. Search & Filter Bar */}
      <div className="flex flex-col gap-3 mb-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search doubts or concepts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-400 transition"
            />
          </div>

          <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 self-start md:self-auto overflow-x-auto max-w-full">
            {[
              { id: "all", label: "All Doubts" },
              { id: "mentor_answered", label: "⭐ Answered by Mentors" },
              { id: "open", label: "Open (Unresolved)" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                  activeTab === tab.id
                    ? "bg-amber-500 text-slate-950 font-bold"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {[
            "All",
            "JEE / NEET Prep",
            "Tech & Coding",
            "UPSC & Govt Exams",
            "Class 9-12 CBSE/ICSE",
            "Spoken English & Communication",
            "Finance & Stock Market",
            "AI & Data Science",
          ].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedSubject(cat)}
              className={`px-2.5 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap transition cursor-pointer border ${
                selectedSubject === cat
                  ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/50 font-bold"
                  : "bg-slate-900/80 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-slate-300"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Doubt Threads List */}
      <div className="flex flex-col gap-4">
        {filteredDoubts.map((doubt) => (
          <div
            key={doubt.id}
            className="bg-slate-900/90 border border-slate-800/90 hover:border-slate-700 rounded-2xl p-5 shadow-lg flex flex-col gap-4"
          >
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-amber-950/80 px-2.5 py-0.5 rounded-full border border-amber-500/30">
                  {doubt.subject}
                </span>

                {doubt.isVoiceDoubt && (
                  <button
                    onClick={() => handlePlayVoiceDoubt(doubt.id, doubt.voiceAudioUrl)}
                    className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border transition cursor-pointer ${
                      playingAudioId === doubt.id
                        ? "bg-amber-500 text-slate-950 border-amber-400 animate-pulse"
                        : "bg-amber-500/15 text-amber-300 border-amber-500/40 hover:bg-amber-500/25"
                    }`}
                    title="Play recorded voice question"
                  >
                    {playingAudioId === doubt.id ? (
                      <Pause className="w-3 h-3 fill-current" />
                    ) : (
                      <Play className="w-3 h-3 fill-current" />
                    )}
                    <span>🎙️ Voice Doubt</span>
                    {doubt.voiceDurationSeconds && (
                      <span className="font-mono text-[9px] opacity-80">
                        ({doubt.voiceDurationSeconds}s)
                      </span>
                    )}
                  </button>
                )}

                {doubt.reelTitle && (
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <BookOpen className="w-3.5 h-3.5 text-blue-400" />
                    Reel: <strong className="text-slate-200">{doubt.reelTitle}</strong>
                    {doubt.reelTimestamp && ` (@${doubt.reelTimestamp}s)`}
                  </span>
                )}
              </div>

              <span className="text-[11px] text-slate-500 font-mono">
                {doubt.timestamp}
              </span>
            </div>

            <div>
              <h3 className="text-base font-bold text-white mb-1.5 leading-snug">
                {doubt.title}
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line">
                {doubt.content}
              </p>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-800 flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <img
                  src={doubt.authorAvatar}
                  alt={doubt.authorName}
                  className="w-6 h-6 rounded-full object-cover border border-slate-700"
                />
                <span className="text-xs text-slate-300 font-medium">
                  {doubt.authorName}
                </span>
                <span className="text-slate-700 font-bold select-none">|</span>
                <span className="text-[11px] text-slate-500 font-mono">
                  {doubt.timestamp}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleToggleSaveDoubt(doubt.id)}
                  className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-lg border transition cursor-pointer ${
                    savedDoubtIds.includes(doubt.id)
                      ? "bg-amber-500/20 border-amber-500/50 text-amber-300 font-bold"
                      : "bg-slate-800/80 border-slate-700 text-slate-300 hover:text-amber-300 hover:border-amber-500/40"
                  }`}
                  title="Save doubt & discussion to your Library"
                >
                  <Bookmark className={`w-3.5 h-3.5 ${savedDoubtIds.includes(doubt.id) ? "fill-amber-400 text-amber-400" : ""}`} />
                  <span>{savedDoubtIds.includes(doubt.id) ? "Saved" : "Save"}</span>
                </button>

                <span className="text-slate-700 font-bold select-none">|</span>

                <button
                  onClick={() => onUpvoteDoubt(doubt.id)}
                  className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-amber-400 bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-700 hover:border-amber-400/50 transition cursor-pointer"
                >
                  <ThumbsUp className="w-3.5 h-3.5" />
                  <span>{doubt.upvotes}</span>
                </button>

                <span className="text-slate-700 font-bold select-none">|</span>

                <button
                  onClick={() =>
                    setAnsweringDoubtId(answeringDoubtId === doubt.id ? null : doubt.id)
                  }
                  className="flex items-center gap-1.5 text-xs text-blue-300 hover:text-blue-200 bg-blue-950/60 px-2.5 py-1 rounded-lg border border-blue-500/30 transition cursor-pointer"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Reply ({doubt.answers.length})</span>
                </button>

                <span className="text-slate-700 font-bold select-none">|</span>

                <button
                  onClick={() =>
                    setFlagModalConfig({
                      isOpen: true,
                      itemId: doubt.id,
                      itemType: "doubt",
                      author: doubt.authorName,
                      snippet: doubt.title,
                    })
                  }
                  className={`flex items-center gap-1 text-xs px-2 py-1 rounded-lg border transition cursor-pointer ${
                    flaggedDoubtIds.includes(doubt.id)
                      ? "bg-red-500/20 border-red-500/50 text-red-300 font-bold"
                      : "bg-slate-900 border-slate-800 text-slate-400 hover:text-red-400 hover:border-red-500/40"
                  }`}
                  title="Flag this doubt for inappropriate content"
                >
                  <Flag className={`w-3 h-3 ${flaggedDoubtIds.includes(doubt.id) ? "fill-red-400 text-red-400" : ""}`} />
                  <span>{flaggedDoubtIds.includes(doubt.id) ? "Flagged" : "Flag"}</span>
                </button>
              </div>
            </div>

            {/* Answers Section */}
            {doubt.answers && doubt.answers.length > 0 && (
              <div className="flex flex-col gap-3 mt-1 bg-slate-950/70 border border-slate-800 rounded-xl p-4">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                  Answers & Explanations ({doubt.answers.length})
                </div>

                {doubt.answers.map((ans) => (
                  <div
                    key={ans.id}
                    className={`p-3.5 rounded-xl border flex flex-col gap-2 ${
                      flaggedAnswerIds.includes(ans.id)
                        ? "bg-red-950/30 border-red-500/40 opacity-90"
                        : ans.isMentor
                        ? "bg-amber-950/20 border-amber-500/40 shadow-[0_0_15px_rgba(245,158,11,0.1)]"
                        : ans.authorRole === "ai_assistant"
                        ? "bg-purple-950/20 border-purple-500/40"
                        : "bg-slate-900 border-slate-800"
                    }`}
                  >
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center gap-2">
                        <img
                          src={ans.authorAvatar}
                          alt={ans.authorName}
                          className="w-7 h-7 rounded-full object-cover border border-amber-400/60"
                        />
                        <div>
                          <div className="flex items-center gap-1.5 text-xs font-bold text-white flex-wrap">
                            <span>{ans.authorName}</span>
                            {ans.isMentor && (
                              <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[9px] px-1.5 py-0.2 rounded-full font-semibold">
                                ✓ Verified Mentor
                              </span>
                            )}
                            {ans.authorRole === "ai_assistant" && (
                              <span className="bg-purple-500/20 text-purple-300 border border-purple-500/40 text-[9px] px-1.5 py-0.2 rounded-full font-semibold flex items-center gap-0.5">
                                <Bot className="w-2.5 h-2.5" /> AI Mentor
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-1.5 text-[10px] text-slate-500 mt-0.5">
                            <span>{ans.timestamp}</span>
                            <span className="text-slate-700 font-bold select-none">|</span>
                            <button
                              onClick={() => handleToggleSaveAnswer(ans.id)}
                              className={`hover:text-amber-300 flex items-center gap-0.5 transition cursor-pointer ${
                                savedAnswerIds.includes(ans.id) ? "text-amber-400 font-bold" : ""
                              }`}
                              title="Save this answer to Library"
                            >
                              <Bookmark className={`w-2.5 h-2.5 ${savedAnswerIds.includes(ans.id) ? "fill-amber-400 text-amber-400" : ""}`} />
                              <span>{savedAnswerIds.includes(ans.id) ? "Saved" : "Save Answer"}</span>
                            </button>
                            <span className="text-slate-700 font-bold select-none">|</span>
                            <button
                              onClick={() =>
                                setFlagModalConfig({
                                  isOpen: true,
                                  itemId: ans.id,
                                  itemType: "answer",
                                  author: ans.authorName,
                                  snippet: ans.content,
                                })
                              }
                              className={`hover:text-red-400 flex items-center gap-0.5 transition cursor-pointer ${
                                flaggedAnswerIds.includes(ans.id) ? "text-red-400 font-bold" : ""
                              }`}
                              title="Flag this answer as inappropriate"
                            >
                              <Flag className="w-2.5 h-2.5" />
                              <span>{flaggedAnswerIds.includes(ans.id) ? "Flagged" : "Flag"}</span>
                            </button>
                          </div>
                        </div>
                      </div>

                      {flaggedAnswerIds.includes(ans.id) ? (
                        <span className="text-[10px] bg-red-500/20 text-red-300 border border-red-500/40 px-2 py-0.5 rounded font-bold flex items-center gap-1">
                          <ShieldAlert className="w-3 h-3 text-red-400" /> Flagged for Review
                        </span>
                      ) : ans.isAccepted ? (
                        <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4 fill-emerald-500/20" /> Best Solution
                        </span>
                      ) : null}
                    </div>

                    <div className="text-xs text-slate-200 leading-relaxed whitespace-pre-line pl-1">
                      {ans.content}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Answer Composer Input */}
            {answeringDoubtId === doubt.id && (
              <div className="flex items-center gap-2 pt-2">
                <input
                  type="text"
                  placeholder="Write an explanation or peer guidance..."
                  value={answerContent}
                  onChange={(e) => setAnswerContent(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && answerContent.trim()) {
                      onAddAnswer(doubt.id, answerContent);
                      setAnswerContent("");
                      setAnsweringDoubtId(null);
                    }
                  }}
                  className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-400"
                />
                <button
                  onClick={() => {
                    if (answerContent.trim()) {
                      onAddAnswer(doubt.id, answerContent);
                      setAnswerContent("");
                      setAnsweringDoubtId(null);
                    }
                  }}
                  className="p-2 bg-amber-500 text-slate-950 hover:bg-amber-400 rounded-xl font-bold cursor-pointer transition"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Ask New Doubt Modal */}
      {showAskModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-xl bg-slate-900 border border-slate-700 rounded-3xl p-6 shadow-2xl flex flex-col gap-4 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center">
                  <HelpCircle className="w-4 h-4 text-amber-400" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Ask a Doubt to Mentors</h3>
                  <p className="text-[11px] text-slate-400">Speak or type your question</p>
                </div>
              </div>

              <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
                <button
                  type="button"
                  onClick={() => setAskModalMode("voice")}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                    askModalMode === "voice"
                      ? "bg-amber-500 text-slate-950 shadow"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  <Mic className="w-3.5 h-3.5" />
                  <span>🎙️ Voice Record</span>
                </button>

                <button
                  type="button"
                  onClick={() => setAskModalMode("type")}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                    askModalMode === "type"
                      ? "bg-slate-700 text-white shadow"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>⌨️ Type</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowAskModal(false)}
                  className="w-7 h-7 rounded-lg bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition ml-1 cursor-pointer"
                >
                  ✕
                </button>
              </div>
            </div>

            {askModalMode === "voice" && (
              <AudioDoubtRecorder
                preferredSubject={doubtSubject}
                targetExam={userProfile.targetExam || "JEE / NEET"}
                onTranscriptionComplete={handleTranscriptionComplete}
                onCancel={() => setAskModalMode("type")}
                isEmbedded={true}
              />
            )}

            {askModalMode === "type" && (
              <>
                {rawSpokenTranscript && (
                  <div className="bg-amber-950/40 border border-amber-500/40 rounded-2xl p-3 flex items-center justify-between text-xs text-amber-200">
                    <div className="flex items-center gap-2">
                      <Mic className="w-4 h-4 text-amber-400 flex-shrink-0 animate-pulse" />
                      <div>
                        <span className="font-bold text-amber-300">Voice Transcription Applied:</span>{" "}
                        <span className="text-slate-300 text-[11px] line-clamp-1 italic">
                          "{rawSpokenTranscript}"
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setAskModalMode("voice")}
                      className="text-[10px] text-amber-400 hover:underline font-bold whitespace-nowrap ml-2 cursor-pointer"
                    >
                      Re-record
                    </button>
                  </div>
                )}

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Subject Category:
                  </label>
                  <select
                    value={doubtSubject}
                    onChange={(e) => setDoubtSubject(e.target.value)}
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

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-semibold text-slate-300">
                      Doubt Headline / Core Question:
                    </label>
                    <button
                      type="button"
                      onClick={() => setAskModalMode("voice")}
                      className="text-[10px] text-amber-400 hover:text-amber-300 flex items-center gap-1 font-bold cursor-pointer"
                    >
                      <Mic className="w-3 h-3" /> Voice Dictate
                    </button>
                  </div>
                  <input
                    type="text"
                    placeholder="e.g. Why does Sn1 reaction lead to racemization in stereochemistry?"
                    value={doubtTitle}
                    onChange={(e) => setDoubtTitle(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    Detailed Context / Where did you get stuck?
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Explain the step where you had confusion. You can paste code or formula notes..."
                    value={doubtContent}
                    onChange={(e) => setDoubtContent(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="bg-purple-950/40 border border-purple-500/30 rounded-2xl p-4 flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-purple-300 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-purple-400" /> Instant Gemini AI Mentor Preview
                    </span>
                    <button
                      type="button"
                      onClick={handleAskWithAiSolver}
                      disabled={isAiAnswering || !doubtTitle.trim()}
                      className="px-3 py-1 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white font-semibold text-[11px] rounded-lg transition cursor-pointer"
                    >
                      {isAiAnswering ? "Thinking..." : "Generate AI Answer"}
                    </button>
                  </div>

                  {aiPreviewAnswer && (
                    <div className="p-3 bg-slate-950/80 rounded-xl border border-purple-500/30 text-xs text-slate-200 max-h-44 overflow-y-auto whitespace-pre-line">
                      {aiPreviewAnswer}
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAskModal(false)}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handlePostDoubt}
                    disabled={!doubtTitle.trim() || !doubtContent.trim()}
                    className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 disabled:opacity-50 text-slate-950 font-bold text-xs rounded-xl shadow-lg transition cursor-pointer flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Post Doubt to Community</span>
                  </button>
                </div>
              </>
            )}
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
