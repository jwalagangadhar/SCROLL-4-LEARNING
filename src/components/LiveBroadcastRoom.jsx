import React, { useState, useEffect, useRef } from "react";
import {
  Radio,
  Users,
  Coins,
  Send,
  Sparkles,
  Zap,
  Lock,
  Video,
  PenTool,
  Flag,
  ShieldAlert,
  HelpCircle,
  Monitor,
} from "lucide-react";
import { FlagCommentModal } from "./FlagCommentModal";
import {
  MOCK_LIVE_CHAT_SEEDS,
  LIVE_TIP_TIERS,
} from "../data/mockLiveSessions";

export const LiveBroadcastRoom = ({
  session,
  userProfile,
  isMentorBroadcaster = false,
  onDeductCoins,
  onAddCoins,
  onClose,
  onEndBroadcast,
}) => {
  // Session dynamic state
  const [viewersCount, setViewersCount] = useState(session.currentLiveViewers || 4200);
  const [totalTipsCoins, setTotalTipsCoins] = useState(session.totalLiveTipsCoins || 12400);
  const [likesCount, setLikesCount] = useState(session.likesCount || 8900);
  const [isUnlocked, setIsUnlocked] = useState(
    session.accessType !== "pay_per_view" || session.ppvCostCoins === 0 || isMentorBroadcaster
  );

  // Chat & Messages
  const [chatMessages, setChatMessages] = useState(MOCK_LIVE_CHAT_SEEDS);
  const [inputMessage, setInputMessage] = useState("");
  const chatScrollRef = useRef(null);

  // Tipping Modal & Flow
  const [showTipModal, setShowTipModal] = useState(false);
  const [selectedTipTier, setSelectedTipTier] = useState(LIVE_TIP_TIERS[0]);
  const [tipComment, setTipComment] = useState("");
  const [activeTipBanner, setActiveTipBanner] = useState(null);

  // Live Chat Inappropriate Message Flagging state
  const [flaggedChatMessageIds, setFlaggedChatMessageIds] = useState([]);
  const [flagModalConfig, setFlagModalConfig] = useState({ isOpen: false });
  const [toastMessage, setToastMessage] = useState(null);

  const handleFlagReportSubmit = (reasonLabel, details) => {
    if (flagModalConfig.messageId) {
      const msgId = flagModalConfig.messageId;
      setFlaggedChatMessageIds((prev) => (prev.includes(msgId) ? prev : [...prev, msgId]));
      setToastMessage(`Live message reported under "${reasonLabel}". Sent to moderators.`);
      setTimeout(() => setToastMessage(null), 4500);
    }
  };

  // Interactive Poll
  const [poll, setPoll] = useState(session.activePoll);
  const [userVotedOptionIdx, setUserVotedOptionIdx] = useState(null);
  const [pollEarnedNotification, setPollEarnedNotification] = useState(null);

  // Floating floating hearts / reactions
  const [floatingReactions, setFloatingReactions] = useState([]);

  // Stage Display Mode ("video" feed vs "whiteboard" math derivation)
  const [stageMode, setStageMode] = useState("video");
  const [isMuted, setIsMuted] = useState(false);
  const mainVideoRef = useRef(null);
  const studentVideoRef = useRef(null);
  const [studentVideoSrc, setStudentVideoSrc] = useState(
    session.videoUrl ||
    "https://assets.mixkit.co/videos/preview/mixkit-teacher-explaining-a-subject-on-a-whiteboard-42903-large.mp4"
  );

  useEffect(() => {
    if (studentVideoRef.current) {
      studentVideoRef.current.muted = isMuted;
      studentVideoRef.current.play().catch((err) => {
        console.warn("Autoplay unmuted blocked by browser, falling back to muted play:", err);
        if (studentVideoRef.current) {
          studentVideoRef.current.muted = true;
          studentVideoRef.current.play().catch(() => {});
        }
      });
    }
  }, [stageMode, isUnlocked, isMuted, studentVideoSrc]);

  // Broadcaster Controls (if mentor)
  const videoRef = useRef(null);
  const [isWebcamActive, setIsWebcamActive] = useState(false);
  const [webcamError, setWebcamError] = useState(null);

  // Screen Sharing State & Ref
  const [isScreenSharingActive, setIsScreenSharingActive] = useState(false);
  const [screenShareError, setScreenShareError] = useState(null);
  const screenStreamRef = useRef(null);

  // Ensure mainVideoRef receives stream Object whenever stage mounts or streams update
  useEffect(() => {
    if (mainVideoRef.current) {
      if (isScreenSharingActive && screenStreamRef.current) {
        mainVideoRef.current.srcObject = screenStreamRef.current;
        mainVideoRef.current.play().catch(() => {});
      } else if (isWebcamActive && videoRef.current && videoRef.current.srcObject) {
        mainVideoRef.current.srcObject = videoRef.current.srcObject;
        mainVideoRef.current.play().catch(() => {});
      } else {
        mainVideoRef.current.srcObject = null;
        mainVideoRef.current.src =
          "https://assets.mixkit.co/videos/preview/mixkit-teacher-explaining-a-subject-on-a-whiteboard-42903-large.mp4";
        mainVideoRef.current.play().catch(() => {});
      }
    }
  }, [isScreenSharingActive, isWebcamActive, stageMode]);

  const startScreenShareStream = async () => {
    try {
      setScreenShareError(null);
      if (!navigator.mediaDevices || !navigator.mediaDevices.getDisplayMedia) {
        alert("Screen sharing is not supported by your current browser environment.");
        return;
      }
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: { cursor: "always" },
        audio: true,
      });

      screenStreamRef.current = stream;

      // Handle browser native floating stop share bar
      stream.getVideoTracks()[0].onended = () => {
        stopScreenShareStream();
      };

      if (mainVideoRef.current) {
        mainVideoRef.current.srcObject = stream;
      }
      session.isScreenSharingActive = true;
      setIsScreenSharingActive(true);
      setStageMode("video");
    } catch (err) {
      console.warn("Screen share request cancelled or error:", err);
      if (err.name !== "NotAllowedError" && err.name !== "AbortError") {
        setScreenShareError("Screen sharing was cancelled or unavailable.");
      }
      session.isScreenSharingActive = false;
      setIsScreenSharingActive(false);
    }
  };

  const stopScreenShareStream = () => {
    if (screenStreamRef.current) {
      screenStreamRef.current.getTracks().forEach((track) => track.stop());
      screenStreamRef.current = null;
    }
    session.isScreenSharingActive = false;
    setIsScreenSharingActive(false);
    if (mainVideoRef.current) {
      mainVideoRef.current.srcObject = isWebcamActive && videoRef.current ? videoRef.current.srcObject : null;
    }
  };

  const startWebcamStream = async () => {
    try {
      setWebcamError(null);
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      if (mainVideoRef.current && !isScreenSharingActive) {
        mainVideoRef.current.srcObject = stream;
      }
      setIsWebcamActive(true);
      setIsCamOn(true);
    } catch (err) {
      console.warn("Camera access request failed:", err);
      setWebcamError("Camera access prompt closed or unavailable. Showing simulated avatar stream.");
      setIsWebcamActive(false);
    }
  };

  const stopWebcamStream = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    if (mainVideoRef.current && !isScreenSharingActive) {
      mainVideoRef.current.srcObject = null;
    }
    setIsWebcamActive(false);
    setIsCamOn(false);
  };

  const [isMicOn, setIsMicOn] = useState(true);
  const [isCamOn, setIsCamOn] = useState(true);
  const [activeWhiteboardTopic, setActiveWhiteboardTopic] = useState(
    session.whiteboardTopic || "Laser Refraction & Critical Angle Derivation"
  );
  const [showNewPollModal, setShowNewPollModal] = useState(false);
  const [newPollQuestion, setNewPollQuestion] = useState("");
  const [newPollOptions, setNewPollOptions] = useState(["", "", "", ""]);
  const [newPollCorrect, setNewPollCorrect] = useState(0);

  // Auto scroll chat
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [chatMessages]);

  // Periodic random live viewer fluctuation & incoming messages
  useEffect(() => {
    const viewerInterval = setInterval(() => {
      setViewersCount((prev) => prev + Math.floor(Math.random() * 9) - 4);
    }, 4000);

    const simulatedIncomingChats = [
      { name: "Tanmay Deshmukh", text: "Sir what happens if prism angle A is 90 degrees? 🤔" },
      { name: "Kavya Reddy", text: "Best live session ever! Notes are super crisp ✨" },
      { name: "Pooja Hegde", text: "Formula sin(i)/sin(r) = mu2/mu1 applies everywhere!" },
      { name: "Devansh Nair", text: "Tipped 20 coins for this amazing derivation 🪙" },
    ];

    const chatInterval = setInterval(() => {
      const pick = simulatedIncomingChats[Math.floor(Math.random() * simulatedIncomingChats.length)];
      const newMsg = {
        id: `chat-auto-${Date.now()}`,
        sessionId: session.id,
        senderName: pick.name,
        senderAvatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${pick.name}`,
        role: "student",
        text: pick.text,
        timestamp: "Just now",
      };
      setChatMessages((prev) => [...prev.slice(-30), newMsg]);
    }, 8000);

    return () => {
      clearInterval(viewerInterval);
      clearInterval(chatInterval);
    };
  }, [session.id]);

  // Handle Pay-Per-View Unlock
  const handleUnlockPPV = () => {
    if (userProfile.vidyaCoins < session.ppvCostCoins) {
      alert(`⚠️ You need ${session.ppvCostCoins} VidyaCoins to join this exclusive masterclass. Current balance: ${userProfile.vidyaCoins} Coins.`);
      return;
    }

    const success = onDeductCoins(
      session.ppvCostCoins,
      `Live Masterclass Ticket: ${session.title}`
    );

    if (success) {
      setIsUnlocked(true);
      setTotalTipsCoins((prev) => prev + session.ppvCostCoins);
      const welcomeMsg = {
        id: `ppv-unlocked-${Date.now()}`,
        sessionId: session.id,
        senderName: userProfile.name,
        senderAvatar: userProfile.avatar,
        role: "student",
        text: `🎟️ Purchased Live Masterclass Ticket (${session.ppvCostCoins} Coins)`,
        timestamp: "Just now",
        tipCoins: session.ppvCostCoins,
        tipTier: "doubt_boost",
      };
      setChatMessages((prev) => [...prev, welcomeMsg]);
    }
  };

  // Handle Send Chat Message
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const newMsg = {
      id: `chat-${Date.now()}`,
      sessionId: session.id,
      senderName: isMentorBroadcaster ? session.mentor.name : userProfile.name,
      senderAvatar: isMentorBroadcaster ? session.mentor.avatar : userProfile.avatar,
      role: isMentorBroadcaster ? "mentor" : "student",
      text: inputMessage.trim(),
      timestamp: "Just now",
    };

    setChatMessages((prev) => [...prev, newMsg]);
    setInputMessage("");
  };

  // Handle Send Tip (Super-Chat)
  const handleSendTip = (e) => {
    e.preventDefault();
    const amount = selectedTipTier.coins;

    if (userProfile.vidyaCoins < amount) {
      alert(`⚠️ Insufficient VidyaCoins! You have ${userProfile.vidyaCoins} coins, but need ${amount} coins. Visit the Coin Store or earn free coins via daily streaks!`);
      return;
    }

    const success = onDeductCoins(
      amount,
      `Live Tip to ${session.mentor.name}: ${selectedTipTier.name}`
    );

    if (success) {
      const tipTx = {
        id: `tip-${Date.now()}`,
        sessionId: session.id,
        studentName: userProfile.name,
        studentAvatar: userProfile.avatar,
        coinsAmount: amount,
        message: tipComment.trim() || `Tipped ${amount} VidyaCoins with ${selectedTipTier.name}! ${selectedTipTier.emoji}`,
        timestamp: "Just now",
        tier: selectedTipTier.id,
      };

      setTotalTipsCoins((prev) => prev + amount);

      setActiveTipBanner(tipTx);
      setTimeout(() => {
        setActiveTipBanner(null);
      }, 7000);

      const tipChatMsg = {
        id: `chat-tip-${Date.now()}`,
        sessionId: session.id,
        senderName: userProfile.name,
        senderAvatar: userProfile.avatar,
        role: "student",
        text: tipComment.trim() ? `🪙 ${tipComment.trim()}` : `🪙 Sent ${selectedTipTier.name} (${amount} Coins) ${selectedTipTier.emoji}`,
        timestamp: "Just now",
        tipCoins: amount,
        tipTier: selectedTipTier.id,
        isHighlightedDoubt: selectedTipTier.id === "doubt_boost" || selectedTipTier.id === "guru_dakshina",
      };

      setChatMessages((prev) => [...prev, tipChatMsg]);
      setShowTipModal(false);
      setTipComment("");

      triggerReaction("🪙");
      triggerReaction("👑");
    }
  };

  // Trigger floating burst reaction
  const triggerReaction = (icon) => {
    setLikesCount((prev) => prev + 1);
    const newReaction = {
      id: Date.now() + Math.random(),
      icon,
      left: 60 + Math.random() * 30,
    };
    setFloatingReactions((prev) => [...prev.slice(-15), newReaction]);
    setTimeout(() => {
      setFloatingReactions((prev) => prev.filter((r) => r.id !== newReaction.id));
    }, 2500);
  };

  // Handle Poll Vote
  const handleVotePoll = (optionIdx) => {
    if (userVotedOptionIdx !== null || !poll) return;

    setUserVotedOptionIdx(optionIdx);
    const updatedOptions = poll.options.map((opt, idx) =>
      idx === optionIdx ? { ...opt, votes: opt.votes + 1 } : opt
    );

    setPoll({
      ...poll,
      options: updatedOptions,
      totalVotes: poll.totalVotes + 1,
    });

    if (poll.correctIdx !== undefined && optionIdx === poll.correctIdx) {
      onAddCoins(poll.rewardCoins, `Correct Live Poll Answer: +${poll.rewardCoins} VidyaCoins`);
      setPollEarnedNotification(`🎉 Correct Answer! Earned +${poll.rewardCoins} VidyaCoins!`);
      setTimeout(() => setPollEarnedNotification(null), 4000);
    } else if (poll.correctIdx !== undefined) {
      setPollEarnedNotification(`Nice attempt! Correct answer is: ${poll.options[poll.correctIdx].text}`);
      setTimeout(() => setPollEarnedNotification(null), 4000);
    }
  };

  // Broadcaster: Create New Live Poll
  const handleCreateNewPoll = (e) => {
    e.preventDefault();
    if (!newPollQuestion.trim()) return;

    const validOptions = newPollOptions
      .filter((o) => o.trim().length > 0)
      .map((text) => ({ text, votes: 1 }));

    if (validOptions.length < 2) {
      alert("Please provide at least 2 options for the poll.");
      return;
    }

    setPoll({
      id: `poll-${Date.now()}`,
      question: newPollQuestion.trim(),
      options: validOptions,
      correctIdx: newPollCorrect,
      rewardCoins: 20,
      isClosed: false,
      totalVotes: validOptions.length,
    });

    setUserVotedOptionIdx(null);
    setShowNewPollModal(false);
    setNewPollQuestion("");

    const pollMsg = {
      id: `poll-ann-${Date.now()}`,
      sessionId: session.id,
      senderName: session.mentor.name,
      senderAvatar: session.mentor.avatar,
      role: "mentor",
      text: `📊 Launched new Live Concept Poll: "${newPollQuestion.trim()}" (+20 Coins)`,
      timestamp: "Just now",
      isPinned: true,
    };
    setChatMessages((prev) => [...prev, pollMsg]);
  };

  // End Broadcast Handler
  const handleEndStream = () => {
    if (window.confirm(`Are you sure you want to end this live broadcast? Total coins earned: 🪙 ${totalTipsCoins.toLocaleString()} VidyaCoins.`)) {
      if (onEndBroadcast) {
        onEndBroadcast(session.id, totalTipsCoins);
      }
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col overflow-hidden animate-fadeIn">
      {/* 1. Top Live Stream Header */}
      <header className="bg-slate-950/90 border-b border-slate-800 px-4 py-3 flex items-center justify-between z-20">
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex items-center gap-1.5 bg-rose-600/20 border border-rose-500/50 px-2.5 py-1 rounded-full text-rose-400 font-extrabold text-xs tracking-wider animate-pulse flex-shrink-0">
            <Radio className="w-3.5 h-3.5" />
            <span>LIVE</span>
          </div>

          <div className="flex items-center gap-2.5 min-w-0">
            <img
              src={session.mentor.avatar}
              alt={session.mentor.name}
              className="w-8 h-8 rounded-xl object-cover border border-amber-400 flex-shrink-0"
            />
            <div className="min-w-0">
              <h3 className="text-xs sm:text-sm font-bold text-white truncate max-w-xs sm:max-w-md md:max-w-xl">
                {session.title}
              </h3>
              <div className="flex items-center gap-2 text-[10px] text-slate-400">
                <span className="text-amber-400 font-semibold">{session.mentor.name}</span>
                <span>•</span>
                <span className="text-slate-300">{session.topicTag}</span>
                <span>•</span>
                <span className="text-cyan-400">{session.streamQuality}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 px-3 py-1 rounded-xl text-xs font-bold text-slate-200">
            <Users className="w-3.5 h-3.5 text-cyan-400" />
            <span className="font-mono">{viewersCount.toLocaleString()}</span>
          </div>

          <div className="flex items-center gap-1.5 bg-amber-500/15 border border-amber-500/30 px-3 py-1 rounded-xl text-xs font-bold text-amber-300">
            <Coins className="w-3.5 h-3.5 text-amber-400 animate-spin" style={{ animationDuration: "6s" }} />
            <span className="font-mono">{totalTipsCoins.toLocaleString()}</span>
            <span className="text-[10px] text-amber-400/80 font-normal hidden sm:inline">Tips</span>
          </div>

          {isMentorBroadcaster && (
            <button
              onClick={handleEndStream}
              className="bg-rose-600 hover:bg-rose-500 text-white font-black text-xs px-3 py-1.5 rounded-xl shadow cursor-pointer transition"
            >
              End Broadcast
            </button>
          )}

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition cursor-pointer"
          >
            ✕
          </button>
        </div>
      </header>

      {/* 2. Main Live Grid */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden relative">
        <div className="lg:col-span-8 bg-slate-950 flex flex-col justify-between relative overflow-hidden border-b lg:border-b-0 lg:border-r border-slate-800">
          {activeTipBanner && (
            <div className="absolute top-4 left-4 right-4 z-30 bg-gradient-to-r from-amber-500 via-orange-500 to-rose-600 p-0.5 rounded-2xl shadow-2xl animate-bounce">
              <div className="bg-slate-950/95 backdrop-blur-md rounded-[14px] p-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400 flex items-center justify-center text-xl flex-shrink-0">
                    🪙
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-amber-300">
                        {activeTipBanner.studentName}
                      </span>
                      <span className="text-[10px] bg-amber-500 text-slate-950 font-black px-2 py-0.2 rounded-full uppercase">
                        +{activeTipBanner.coinsAmount} Coins Tipped!
                      </span>
                    </div>
                    <p className="text-xs text-white font-medium mt-0.5">
                      &ldquo;{activeTipBanner.message}&rdquo;
                    </p>
                  </div>
                </div>
                <Sparkles className="w-5 h-5 text-amber-400 animate-spin" />
              </div>
            </div>
          )}

          {!isUnlocked ? (
            <div className="absolute inset-0 z-40 bg-slate-950/95 backdrop-blur-lg flex flex-col items-center justify-center p-6 text-center">
              <div className="w-16 h-16 rounded-3xl bg-amber-500/20 border border-amber-400 flex items-center justify-center text-amber-400 mb-4 shadow-xl">
                <Lock className="w-8 h-8" />
              </div>

              <span className="px-3 py-1 bg-amber-500/20 text-amber-300 text-[11px] font-black rounded-full border border-amber-500/40 mb-2">
                🔒 EXCLUSIVE MENTOR MASTERCLASS
              </span>

              <h2 className="text-lg sm:text-xl font-black text-white max-w-md">
                {session.title}
              </h2>
              <p className="text-xs text-slate-300 max-w-sm mt-2">
                Join {session.mentor.name} live with interactive whiteboard solving, live doubt answering, and downloadable cheat sheets.
              </p>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 my-5 flex items-center gap-6 text-left">
                <div>
                  <div className="text-[10px] text-slate-400 uppercase font-bold">Ticket Price</div>
                  <div className="text-xl font-black text-amber-400 font-mono flex items-center gap-1">
                    <Coins className="w-4 h-4" />
                    <span>{session.ppvCostCoins} VidyaCoins</span>
                  </div>
                </div>
                <div className="border-l border-slate-800 pl-6">
                  <div className="text-[10px] text-slate-400 uppercase font-bold">Your Balance</div>
                  <div className="text-xl font-black text-emerald-400 font-mono">
                    🪙 {userProfile.vidyaCoins} Coins
                  </div>
                </div>
              </div>

              <button
                onClick={handleUnlockPPV}
                className="px-8 py-3.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-sm rounded-2xl shadow-xl transition cursor-pointer flex items-center gap-2"
              >
                <Zap className="w-4 h-4 fill-slate-950" />
                <span>Unlock & Join Live Class ({session.ppvCostCoins} Coins)</span>
              </button>
            </div>
          ) : null}

          <div className="flex-1 w-full bg-slate-950 relative flex items-center justify-center overflow-hidden min-h-[380px]">
            <div className="absolute top-3 z-30 flex items-center gap-1.5 bg-slate-900/90 border border-slate-800 p-1.5 rounded-full shadow-2xl backdrop-blur-md">
              <button
                type="button"
                onClick={() => setStageMode("video")}
                className={`px-3.5 py-1 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  stageMode === "video"
                    ? "bg-gradient-to-r from-rose-600 to-red-600 text-white shadow-rose-glow font-black"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Video className="w-3.5 h-3.5" />
                <span>📹 Live Video Feed</span>
              </button>
              <button
                type="button"
                onClick={() => setStageMode("whiteboard")}
                className={`px-3.5 py-1 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  stageMode === "whiteboard"
                    ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-vidya-glow font-black"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <PenTool className="w-3.5 h-3.5" />
                <span>🎨 Interactive Whiteboard</span>
              </button>
            </div>

            {stageMode === "video" ? (
              <div className="relative w-full h-full min-h-[380px] bg-slate-950 flex items-center justify-center overflow-hidden">
                {isMentorBroadcaster ? (
                  <div className="relative w-full h-full flex items-center justify-center bg-black overflow-hidden">
                    <video
                      ref={mainVideoRef}
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="w-full h-full object-contain bg-black"
                    />
                  </div>
                ) : (
                  <div className="relative w-full h-full flex items-center justify-center bg-black overflow-hidden">
                    <video
                      ref={studentVideoRef}
                      src={studentVideoSrc}
                      autoPlay
                      loop
                      muted={isMuted}
                      playsInline
                      onError={() => {
                        console.warn("Primary live video stream URL failed, falling back to backup stream.");
                        setStudentVideoSrc(
                          "https://assets.mixkit.co/videos/preview/mixkit-teacher-explaining-a-subject-on-a-whiteboard-42903-large.mp4"
                        );
                      }}
                      className="w-full h-full object-contain"
                    />
                    {isMuted && (
                      <button
                        type="button"
                        onClick={() => setIsMuted(false)}
                        className="absolute bottom-16 right-4 z-30 bg-amber-500 hover:bg-amber-400 text-slate-950 px-3 py-1 rounded-full text-xs font-bold shadow-lg transition cursor-pointer flex items-center gap-1.5"
                      >
                        <span>🔊 Tap to Unmute Audio</span>
                      </button>
                    )}
                  </div>
                )}

                <div className="absolute top-14 left-4 z-20 flex items-center gap-2 flex-wrap">
                  {isScreenSharingActive || session.isScreenSharingActive ? (
                    <span className="bg-emerald-600/90 text-white text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider flex items-center gap-1.5 shadow-lg border border-emerald-400/50 animate-pulse">
                      <Monitor className="w-3.5 h-3.5" />
                      <span>SCREEN SHARE LIVE (1080P)</span>
                    </span>
                  ) : (
                    <span className="bg-rose-600/90 text-white text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider flex items-center gap-1.5 shadow-lg border border-rose-400/50 animate-pulse">
                      <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                      LIVE 1080p 60FPS
                    </span>
                  )}
                  <span className="bg-black/70 backdrop-blur-md text-amber-300 text-xs font-bold px-2.5 py-1 rounded-full border border-amber-500/30 flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-amber-400" />
                    <span>8,414 Viewers</span>
                  </span>
                </div>

                <div className="absolute bottom-4 left-4 right-4 z-20 bg-slate-900/85 backdrop-blur-md border border-slate-800 p-3 rounded-2xl flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-3">
                    <img
                      src={session.mentor.avatar}
                      alt={session.mentor.name}
                      className="w-10 h-10 rounded-full object-cover border-2 border-amber-400 shadow-md"
                    />
                    <div>
                      <div className="text-xs font-black text-white flex items-center gap-1.5">
                        <span>{session.mentor.name}</span>
                        <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[9px] px-1.5 py-0.2 rounded-full font-semibold">
                          ✓ Verified Mentor
                        </span>
                      </div>
                      <div className="text-[11px] text-amber-300 font-mono font-bold mt-0.5 truncate max-w-sm sm:max-w-md">
                        📌 {activeWhiteboardTopic}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {isMentorBroadcaster && (
                      <>
                        <button
                          type="button"
                          onClick={isScreenSharingActive ? stopScreenShareStream : startScreenShareStream}
                          className={`px-3 py-1.5 rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-1.5 shadow-lg border ${
                            isScreenSharingActive
                              ? "bg-emerald-600 hover:bg-emerald-500 text-white border-emerald-400/50 animate-pulse"
                              : "bg-indigo-600 hover:bg-indigo-500 text-white border-indigo-400/50"
                          }`}
                        >
                          <Monitor className="w-3.5 h-3.5" />
                          <span>{isScreenSharingActive ? "Stop Screen Share" : "🖥️ Share Screen"}</span>
                        </button>

                        <button
                          type="button"
                          onClick={isWebcamActive ? stopWebcamStream : startWebcamStream}
                          className="bg-rose-600 hover:bg-rose-500 text-white px-3 py-1.5 rounded-xl text-xs font-black transition cursor-pointer flex items-center gap-1.5 shadow-lg border border-rose-400/50"
                        >
                          <Video className="w-3.5 h-3.5" />
                          <span>{isWebcamActive ? "Stop Camera" : "📷 Start Real Camera"}</span>
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="w-full max-w-2xl bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-2xl relative my-12">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                    <span className="text-xs font-bold text-slate-300">
                      Live Mentor Whiteboard • Interactive Math & Visual Engine
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-cyan-400 font-bold bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-800">
                    ⚡ 60 FPS ULTRA-LOW LATENCY
                  </span>
                </div>

                <div className="py-6 text-center flex flex-col items-center">
                  <div className="text-[11px] font-mono font-bold text-amber-400 uppercase tracking-widest mb-1">
                    Active Numerical Derivation
                  </div>
                  <h4 className="text-base sm:text-lg font-black text-white font-mono">
                    {activeWhiteboardTopic}
                  </h4>

                  <div className="my-4 p-4 bg-slate-950 rounded-2xl border border-amber-500/30 text-amber-300 font-mono text-sm sm:text-base font-bold shadow-inner">
                    <div className="text-cyan-400 text-xs mb-1">Critical Angle Formula:</div>
                    sin(θ_c) = n₂ / n₁ &nbsp;➔&nbsp; θ_c = sin⁻¹(1.33 / 1.50) ≈ 62.5°
                  </div>

                  <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-slate-300">
                    <span className="bg-slate-800 px-2.5 py-1 rounded-xl">
                      ✅ Step 1: Snell&apos;s Law n₁·sin(θ₁) = n₂·sin(90°)
                    </span>
                    <span className="bg-slate-800 px-2.5 py-1 rounded-xl">
                      ✅ Step 2: Total Internal Reflection condition (i &gt; θ_c)
                    </span>
                  </div>
                </div>

                {isMentorBroadcaster && (
                  <div className="pt-3 border-t border-slate-800 flex items-center gap-2">
                    <PenTool className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                    <input
                      type="text"
                      value={activeWhiteboardTopic}
                      onChange={(e) => setActiveWhiteboardTopic(e.target.value)}
                      placeholder="Update whiteboard derivation topic live..."
                      className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-2.5 py-1 text-xs text-white"
                    />
                    <span className="text-[10px] text-slate-400">Updates live for all viewers</span>
                  </div>
                )}
              </div>
            )}

            <div className="absolute bottom-4 left-4 z-20 w-40 sm:w-52 bg-slate-900 border-2 border-amber-400 rounded-2xl overflow-hidden shadow-2xl flex flex-col">
              <div className="relative aspect-video bg-slate-950 flex items-center justify-center overflow-hidden">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className={`w-full h-full object-cover ${isWebcamActive ? "block" : "hidden"}`}
                />
                {!isWebcamActive && (
                  <img
                    src={session.mentor.avatar}
                    alt={session.mentor.name}
                    className="w-full h-full object-cover"
                  />
                )}
                
                <div className="absolute top-1.5 left-1.5 bg-black/70 px-1.5 py-0.5 rounded text-[9px] font-bold text-white flex items-center gap-1 z-10">
                  <span className={`w-1.5 h-1.5 rounded-full ${isScreenSharingActive || isWebcamActive ? "bg-emerald-400 animate-ping" : "bg-red-500 animate-pulse"}`} />
                  <span>
                    {isScreenSharingActive && isWebcamActive
                      ? "SCREEN + CAM LIVE"
                      : isScreenSharingActive
                      ? "SCREEN SHARE"
                      : isWebcamActive
                      ? "WEBCAM LIVE"
                      : "MIC LIVE"}
                  </span>
                </div>

                {isMentorBroadcaster && (
                  <button
                    type="button"
                    onClick={isWebcamActive ? stopWebcamStream : startWebcamStream}
                    className="absolute bottom-1.5 left-1.5 bg-black/80 hover:bg-black text-amber-300 hover:text-amber-200 border border-amber-500/50 px-2 py-0.5 rounded text-[9px] font-bold transition cursor-pointer flex items-center gap-1 z-10"
                    title="Request real webcam access to stream mentor face live"
                  >
                    <Video className="w-2.5 h-2.5" />
                    <span>{isWebcamActive ? "Stop Cam" : "Enable Cam"}</span>
                  </button>
                )}

                <div className="absolute bottom-1.5 right-1.5 flex gap-0.5 z-10">
                  <span className="w-1 h-3 bg-emerald-400 rounded-full animate-bounce" />
                  <span className="w-1 h-4 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: "0.15s" }} />
                  <span className="w-1 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: "0.3s" }} />
                </div>
              </div>
              <div className="px-2 py-1 bg-slate-950 text-[10px] font-bold text-white flex items-center justify-between">
                <span className="truncate">{session.mentor.name}</span>
                <span className="text-[9px] text-amber-400 font-mono">1080p 60fps</span>
              </div>
            </div>

            <div className="absolute inset-y-0 right-4 w-28 pointer-events-none overflow-hidden z-20">
              {floatingReactions.map((r) => (
                <div
                  key={r.id}
                  className="absolute bottom-12 text-2xl animate-float-up"
                  style={{ left: `${r.left}%` }}
                >
                  {r.icon}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-950 px-4 py-3 border-t border-slate-800 flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              {poll && !poll.isClosed ? (
                <div className="flex items-center gap-2 bg-slate-900 border border-slate-700 px-3 py-1.5 rounded-xl text-xs">
                  <HelpCircle className="w-4 h-4 text-cyan-400" />
                  <span className="font-bold text-white text-xs">Live Poll Active!</span>
                  <span className="text-[10px] bg-amber-500/20 text-amber-300 font-bold px-1.5 py-0.5 rounded">
                    +{poll.rewardCoins} Coins
                  </span>
                </div>
              ) : null}

              {pollEarnedNotification && (
                <div className="text-xs font-bold text-emerald-400 animate-fadeIn">
                  {pollEarnedNotification}
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              {!isMentorBroadcaster && (
                <button
                  onClick={() => setShowTipModal(true)}
                  className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs px-3.5 py-1.5 rounded-xl shadow-lg transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Coins className="w-4 h-4 fill-slate-950" />
                  <span>Tip Mentor</span>
                </button>
              )}

              {isMentorBroadcaster && (
                <button
                  onClick={() => setShowNewPollModal(true)}
                  className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs px-3 py-1.5 rounded-xl shadow cursor-pointer transition flex items-center gap-1"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>Launch New Poll</span>
                </button>
              )}

              <button
                onClick={() => triggerReaction("❤️")}
                className="w-8 h-8 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 flex items-center justify-center text-sm cursor-pointer transition"
                title="Send Heart"
              >
                ❤️
              </button>
              <button
                onClick={() => triggerReaction("🔥")}
                className="w-8 h-8 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 flex items-center justify-center text-sm cursor-pointer transition"
                title="Send Flame"
              >
                🔥
              </button>
              <button
                onClick={() => triggerReaction("⚡")}
                className="w-8 h-8 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 flex items-center justify-center text-sm cursor-pointer transition"
                title="Send Lightning"
              >
                ⚡
              </button>
            </div>
          </div>
        </div>

        {/* Right Live Stream Sidebar */}
        <div className="lg:col-span-4 bg-slate-950 flex flex-col h-full overflow-hidden">
          {poll && !poll.isClosed && (
            <div className="p-3 bg-slate-900 border-b border-slate-800 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-black text-amber-400 uppercase tracking-wider flex items-center gap-1">
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>Live Concept Quiz</span>
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  {poll.totalVotes} Votes
                </span>
              </div>

              <p className="text-xs font-bold text-white leading-snug">
                {poll.question}
              </p>

              <div className="space-y-1.5">
                {poll.options.map((opt, idx) => {
                  const votePct = poll.totalVotes > 0 ? Math.round((opt.votes / poll.totalVotes) * 100) : 0;
                  const isSelected = userVotedOptionIdx === idx;
                  const isCorrect = userVotedOptionIdx !== null && poll.correctIdx === idx;

                  return (
                    <button
                      key={idx}
                      onClick={() => handleVotePoll(idx)}
                      disabled={userVotedOptionIdx !== null}
                      className={`w-full text-left p-2 rounded-xl border text-xs transition relative overflow-hidden flex items-center justify-between cursor-pointer ${
                        isSelected
                          ? "bg-amber-500/20 border-amber-400 text-white font-bold"
                          : isCorrect
                          ? "bg-emerald-500/20 border-emerald-400 text-white font-bold"
                          : "bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700"
                      }`}
                    >
                      {userVotedOptionIdx !== null && (
                        <div
                          className={`absolute left-0 top-0 bottom-0 opacity-20 ${
                            isCorrect ? "bg-emerald-400" : "bg-amber-400"
                          }`}
                          style={{ width: `${votePct}%` }}
                        />
                      )}
                      <span className="relative z-10 truncate pr-2">
                        {String.fromCharCode(65 + idx)}. {opt.text}
                      </span>
                      {userVotedOptionIdx !== null && (
                        <span className="relative z-10 font-mono text-[10px] text-slate-400 font-bold">
                          {votePct}%
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <div
            ref={chatScrollRef}
            className="flex-1 p-3 overflow-y-auto space-y-2.5 text-xs"
          >
            {chatMessages.map((msg) => {
              const isTip = Boolean(msg.tipCoins);

              return (
                <div
                  key={msg.id}
                  className={`p-2.5 rounded-2xl border transition ${
                    flaggedChatMessageIds.includes(msg.id)
                      ? "bg-red-950/30 border-red-500/40 opacity-80"
                      : msg.isPinned
                      ? "bg-amber-500/10 border-amber-400/50"
                      : isTip
                      ? "bg-gradient-to-r from-amber-500/15 via-rose-500/10 to-slate-900 border-amber-500/40"
                      : "bg-slate-900/80 border-slate-800/80"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1 flex-wrap gap-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <img
                        src={msg.senderAvatar}
                        alt={msg.senderName}
                        className="w-4 h-4 rounded-full object-cover"
                      />
                      <span className="font-bold text-slate-200 text-[11px]">
                        {msg.senderName}
                      </span>
                      {msg.role === "mentor" && (
                        <span className="bg-amber-500 text-slate-950 font-black text-[9px] px-1.5 py-0.2 rounded-full uppercase">
                          Mentor
                        </span>
                      )}
                      {msg.role === "moderator" && (
                        <span className="bg-cyan-500 text-slate-950 font-black text-[9px] px-1.5 py-0.2 rounded-full uppercase">
                          Mod
                        </span>
                      )}
                      <span className="text-slate-700 font-bold select-none">|</span>
                      <span className="text-[10px] text-slate-500 font-mono">{msg.timestamp}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {isTip && (
                        <span className="bg-amber-500/20 text-amber-300 font-black text-[10px] px-2 py-0.5 rounded-full border border-amber-500/30 flex items-center gap-0.5">
                          <Coins className="w-2.5 h-2.5" />
                          <span>+{msg.tipCoins} Coins</span>
                        </span>
                      )}

                      <span className="text-slate-700 font-bold select-none">|</span>

                      <button
                        type="button"
                        onClick={() =>
                          setFlagModalConfig({
                            isOpen: true,
                            messageId: msg.id,
                            author: msg.senderName,
                            snippet: msg.text,
                          })
                        }
                        className={`hover:text-red-400 text-[10px] transition cursor-pointer flex items-center gap-0.5 ${
                          flaggedChatMessageIds.includes(msg.id)
                            ? "text-red-400 font-bold"
                            : "text-slate-500"
                        }`}
                        title="Report this live chat message"
                      >
                        <Flag className="w-2.5 h-2.5" />
                        <span>{flaggedChatMessageIds.includes(msg.id) ? "Flagged" : "Flag"}</span>
                      </button>
                    </div>
                  </div>

                  {flaggedChatMessageIds.includes(msg.id) ? (
                    <div className="text-[11px] text-red-300 italic flex items-center gap-1">
                      <ShieldAlert className="w-3 h-3 text-red-400" />
                      <span>Message flagged for inappropriate content</span>
                    </div>
                  ) : (
                    <p className="text-slate-300 text-xs leading-snug">
                      {msg.text}
                    </p>
                  )}
                </div>
              );
            })}
          </div>

          <form
            onSubmit={handleSendMessage}
            className="p-3 bg-slate-950 border-t border-slate-800 flex items-center gap-2"
          >
            <input
              type="text"
              placeholder={
                isMentorBroadcaster
                  ? "Speak to live students..."
                  : "Send a message or doubt to mentor..."
              }
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              className="flex-1 bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
            />
            <button
              type="submit"
              className="w-8 h-8 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 flex items-center justify-center flex-shrink-0 cursor-pointer shadow"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>

      {/* 3. Modal: Tip / Super-Chat Dialog */}
      {showTipModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3">
          <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-3xl p-5 shadow-2xl flex flex-col gap-4 animate-scaleUp">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                  <Coins className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">
                    Send Live Tip to {session.mentor.name}
                  </h4>
                  <p className="text-[10px] text-slate-400">
                    Your balance: 🪙 {userProfile.vidyaCoins} VidyaCoins
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowTipModal(false)}
                className="w-7 h-7 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center text-xs"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSendTip} className="flex flex-col gap-3">
              <div className="grid grid-cols-2 gap-2">
                {LIVE_TIP_TIERS.map((tier) => (
                  <div
                    key={tier.id}
                    onClick={() => setSelectedTipTier(tier)}
                    className={`p-3 rounded-2xl border cursor-pointer transition text-left ${
                      selectedTipTier.id === tier.id
                        ? "bg-amber-500/20 border-amber-400 text-white shadow"
                        : "bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-lg">{tier.emoji}</span>
                      <span className="font-mono font-black text-amber-400 text-xs">
                        {tier.coins} Coins
                      </span>
                    </div>
                    <div className="text-xs font-bold mt-1">{tier.name}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5 leading-tight">
                      {tier.description}
                    </div>
                  </div>
                ))}
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-300 block mb-1">
                  Attach Live Message / Question to Mentor:
                </label>
                <input
                  type="text"
                  placeholder="e.g. Sir please solve the JEE Advanced 2024 mirror problem next!"
                  value={tipComment}
                  onChange={(e) => setTipComment(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs rounded-xl shadow-lg transition flex items-center justify-center gap-2 mt-1 cursor-pointer"
              >
                <Coins className="w-4 h-4 fill-slate-950" />
                <span>Send {selectedTipTier.name} ({selectedTipTier.coins} VidyaCoins)</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 4. Modal: Broadcaster Launch New Poll */}
      {showNewPollModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3">
          <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-3xl p-5 shadow-2xl flex flex-col gap-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                <HelpCircle className="w-4 h-4 text-cyan-400" />
                <span>Create Live Concept Poll for Students</span>
              </h4>
              <button
                onClick={() => setShowNewPollModal(false)}
                className="w-7 h-7 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center text-xs"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateNewPoll} className="flex flex-col gap-3">
              <div>
                <label className="text-[11px] font-bold text-slate-300 block mb-1">
                  Question (Concept Check):
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. When light travels from denser to rarer medium, speed ...?"
                  value={newPollQuestion}
                  onChange={(e) => setNewPollQuestion(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-bold text-slate-300 block">
                  Options (Select correct answer):
                </label>
                {newPollOptions.map((opt, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="newPollCorrect"
                      checked={newPollCorrect === i}
                      onChange={() => setNewPollCorrect(i)}
                      className="accent-amber-400 cursor-pointer"
                    />
                    <input
                      type="text"
                      placeholder={`Option ${String.fromCharCode(65 + i)} ${i === newPollCorrect ? "(Correct +20 Coins)" : ""}`}
                      value={opt}
                      onChange={(e) => {
                        const copy = [...newPollOptions];
                        copy[i] = e.target.value;
                        setNewPollOptions(copy);
                      }}
                      className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white"
                    />
                  </div>
                ))}
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs rounded-xl shadow mt-2 cursor-pointer transition"
              >
                Broadcast Poll Live
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
