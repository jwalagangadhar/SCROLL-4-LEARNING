import React, { useState, useEffect } from "react";
import {
  MOCK_REELS,
  MOCK_SERIES,
  MOCK_DOUBTS,
  MOCK_MENTORS,
  INITIAL_USER_PROFILE,
  INITIAL_NOTIFICATIONS,
} from "./data/mockData";
import { MOCK_LIVE_SESSIONS } from "./data/mockLiveSessions";
import { Navbar } from "./components/Navbar";
import { BottomNav } from "./components/BottomNav";
import { ReelFeed } from "./components/ReelFeed";
import { CourseSeriesView } from "./components/CourseSeriesView";
import { DoubtForum } from "./components/DoubtForum";
import { MentorLeaderboard } from "./components/MentorLeaderboard";
import { UserLibraryView } from "./components/UserLibraryView";
import { SponsorAdModal } from "./components/SponsorAdModal";
import { CoinStoreModal } from "./components/CoinStoreModal";
import { EarnCoinsModal } from "./components/EarnCoinsModal";
import { PrivateChatModal } from "./components/PrivateChatModal";
import { MentorStudioModal } from "./components/MentorStudioModal";
import { MentorPortalView } from "./components/MentorPortalView";
import { AuthModal } from "./components/AuthModal";
import { ReelQuizModal } from "./components/ReelQuizModal";
import { AISummaryModal } from "./components/AISummaryModal";
import { StudyMaterialsModal } from "./components/StudyMaterialsModal";
import { DailyStreakAlertBanner } from "./components/DailyStreakAlertBanner";
import { NotificationCenter } from "./components/NotificationCenter";
import { WeeklyGoalsModal } from "./components/WeeklyGoalsModal";
import { LiveBroadcastRoom } from "./components/LiveBroadcastRoom";
import { LiveSessionsFeedModal } from "./components/LiveSessionsFeedModal";
import { Bell, Flame, BookMarked, Sparkles, X, ArrowRight } from "lucide-react";

export function App() {
  // App-wide state
  const [reels, setReels] = useState(MOCK_REELS);
  const [seriesList, setSeriesList] = useState(MOCK_SERIES);
  const [doubts, setDoubts] = useState(MOCK_DOUBTS);
  const [mentors, setMentors] = useState(MOCK_MENTORS);
  const [liveSessions, setLiveSessions] = useState(MOCK_LIVE_SESSIONS);
  const [userProfile, setUserProfile] = useState(() => {
    const saved = localStorage.getItem("mentvidya_user_profile");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // fallback
      }
    }
    return INITIAL_USER_PROFILE;
  });
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);

  // Authentication & Portal State
  const [activePortal, setActivePortal] = useState(() => {
    const saved = localStorage.getItem("mentvidya_active_portal");
    return saved === "mentor" ? "mentor" : "student";
  });
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    const saved = localStorage.getItem("mentvidya_is_logged_in");
    return saved !== null ? saved === "true" : true;
  });
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authInitialRole, setAuthInitialRole] = useState("student");
  const [currentMentorProfile, setCurrentMentorProfile] = useState(MOCK_MENTORS[0]);

  // Navigation State
  const [activeView, setActiveView] = useState("reels");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  // Modal & Notification States
  const [showNotificationCenter, setShowNotificationCenter] = useState(false);
  const [showWeeklyGoalsModal, setShowWeeklyGoalsModal] = useState(false);
  const [showLiveSessionsModal, setShowLiveSessionsModal] = useState(false);
  const [activeLiveSession, setActiveLiveSession] = useState(null);
  const [isBroadcasterMode, setIsBroadcasterMode] = useState(false);
  const [activeToastAlert, setActiveToastAlert] = useState(null);
  const [activeAdReel, setActiveAdReel] = useState(null);
  const [showAdModal, setShowAdModal] = useState(false);
  const [showCoinStore, setShowCoinStore] = useState(false);
  const [showEarnModal, setShowEarnModal] = useState(false);
  const [showMentorStudio, setShowMentorStudio] = useState(false);
  const [privateChatMentor, setPrivateChatMentor] = useState(null);
  const [activeQuizReel, setActiveQuizReel] = useState(null);
  const [activeAiSummaryReel, setActiveAiSummaryReel] = useState(null);
  const [activeMaterialsReel, setActiveMaterialsReel] = useState(null);
  const [initialReelContext, setInitialReelContext] = useState(null);

  // Sync state to localStorage
  useEffect(() => {
    localStorage.setItem("mentvidya_user_profile", JSON.stringify(userProfile));
  }, [userProfile]);

  useEffect(() => {
    localStorage.setItem("mentvidya_active_portal", activePortal);
  }, [activePortal]);

  useEffect(() => {
    localStorage.setItem("mentvidya_is_logged_in", String(isLoggedIn));
  }, [isLoggedIn]);

  // Trigger brief alert toast banner
  const triggerToastAlert = (notif) => {
    setActiveToastAlert(notif);
    setTimeout(() => {
      setActiveToastAlert((current) => (current?.id === notif.id ? null : current));
    }, 5500);
  };

  // ==================== Authentication & Portal Handlers ====================
  const handleSelectPortal = (portal) => {
    setActivePortal(portal);
    const notif = {
      id: `notif-portal-${Date.now()}`,
      type: "mentor_update",
      title: portal === "mentor" ? "👨‍🏫 Switched to Mentor Portal" : "🎓 Switched to Student Portal",
      message:
        portal === "mentor"
          ? "Welcome to your Mentor Studio! Manage reels, live masterclasses, doubts, and track coin payouts."
          : "Welcome to Student Learning Feed! Watch concept reels, solve checkpoint quizzes, and join live streams.",
      timestamp: "Just now",
      isRead: false,
      actionType: "open_library",
      iconType: "sparkles",
      highlightBadge: "Portal Switch",
    };
    triggerToastAlert(notif);
  };

  const handleLogin = (user, role, mentorData) => {
    setIsLoggedIn(true);
    setUserProfile((prev) => ({
      ...prev,
      ...user,
      role: role,
    }));

    if (mentorData) {
      setCurrentMentorProfile(mentorData);
    } else if (role === "mentor") {
      const match = (mentors || []).find((m) => m.name.toLowerCase() === (user.name || "").toLowerCase());
      if (match) setCurrentMentorProfile(match);
    }

    setActivePortal(role);

    const notif = {
      id: `notif-login-${Date.now()}`,
      type: "coin_reward",
      title: `🎉 Logged In as ${user.name || "User"}`,
      message: `Successfully connected to Scroll 4 Learning ${role === "mentor" ? "Mentor Studio" : "Student Portal"}!`,
      timestamp: "Just now",
      isRead: false,
      actionType: "open_library",
      iconType: "trophy",
      highlightBadge: "Auth Success",
    };
    setNotifications((prev) => [notif, ...prev]);
    triggerToastAlert(notif);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setActivePortal("student");

    const notif = {
      id: `notif-logout-${Date.now()}`,
      type: "streak_reminder",
      title: "👋 Signed Out Successfully",
      message: "You have logged out. You can continue previewing as guest or sign back in anytime.",
      timestamp: "Just now",
      isRead: false,
      actionType: "continue_streak",
      iconType: "sparkles",
      highlightBadge: "Logged Out",
    };
    triggerToastAlert(notif);
    setShowAuthModal(true);
  };

  const handleOpenAuthModal = (initialRole = "student") => {
    setAuthInitialRole(initialRole);
    setShowAuthModal(true);
  };

  // ==================== Live Sessions ====================
  const handleStartLiveBroadcast = (session) => {
    const liveSession = {
      ...session,
      status: "live",
      scheduledStartTime: "LIVE NOW",
      currentLiveViewers: session.currentLiveViewers || 3240,
    };
    setLiveSessions((prev) => {
      const filtered = prev.filter((s) => s.id !== session.id);
      return [liveSession, ...filtered];
    });
    setActiveLiveSession(liveSession);
    setIsBroadcasterMode(true);
    setShowMentorStudio(false);
  };

  const handleSelectLiveSession = (session) => {
    setActiveLiveSession(session);
    setIsBroadcasterMode(false);
    setShowLiveSessionsModal(false);
  };

  const handleEndBroadcast = (sessionId, totalCoinsEarned) => {
    const notif = {
      id: `notif-stream-end-${Date.now()}`,
      type: "coin_reward",
      title: `🎉 Live Broadcast Completed!`,
      message: `You earned 🪙 ${totalCoinsEarned.toLocaleString()} VidyaCoins from student live tips and masterclass tickets!`,
      timestamp: "Just now",
      isRead: false,
      actionType: "open_earn",
      iconType: "trophy",
      highlightBadge: "Live Payout",
    };
    setNotifications((prev) => [notif, ...prev]);
    triggerToastAlert(notif);
  };

  // Filter reels by mentor from leaderboard
  const handleFilterReelsByMentor = (mentor) => {
    setSearchQuery(mentor.name);
    setActiveView("reels");
  };

  // ==================== Interactions ====================
  const handleLikeToggle = (reelId) => {
    setReels((prev) =>
      prev.map((r) => {
        if (r.id === reelId) {
          return { ...r, likes: r.likes + 1 };
        }
        return r;
      })
    );
  };

  const handleBookmarkToggle = (reelId) => {
    setUserProfile((prev) => {
      const isBookmarked = prev.bookmarkedReelIds.includes(reelId);
      const updated = isBookmarked
        ? prev.bookmarkedReelIds.filter((id) => id !== reelId)
        : [...prev.bookmarkedReelIds, reelId];

      if (!isBookmarked) {
        const targetReel = reels.find((r) => r.id === reelId);
        const newNotif = {
          id: `notif-saved-${Date.now()}`,
          type: "series_reminder",
          title: `🔖 Saved: ${targetReel ? targetReel.title : "Concept Reel"}`,
          message: "Added to your revision bookmarks. We will remind you to review this concept in your daily digest.",
          timestamp: "Just now",
          isRead: false,
          actionType: "open_library",
          iconType: "bookmark",
          highlightBadge: "Saved",
        };
        setNotifications((n) => [newNotif, ...n]);
        triggerToastAlert(newNotif);
      }

      return {
        ...prev,
        bookmarkedReelIds: updated,
      };
    });
  };

  const handleToggleBookmarkSeries = (seriesId) => {
    setUserProfile((prev) => {
      const currentList = prev.bookmarkedSeriesIds || [];
      const isBookmarked = currentList.includes(seriesId);
      const updated = isBookmarked
        ? currentList.filter((id) => id !== seriesId)
        : [...currentList, seriesId];

      const targetSeries = seriesList.find((s) => s.id === seriesId);

      if (!isBookmarked && targetSeries) {
        const newNotif = {
          id: `notif-series-saved-${Date.now()}`,
          type: "series_reminder",
          title: `📚 Bookmarked: ${targetSeries.title}`,
          message: `Scheduled daily micro-series alerts for ${targetSeries.totalEpisodes} episodes by ${targetSeries.mentor.name}. Keep your streak alive!`,
          timestamp: "Just now",
          isRead: false,
          actionType: "open_series",
          targetId: targetSeries.id,
          iconType: "bookmark",
          highlightBadge: "Daily Digest",
        };
        setNotifications((n) => [newNotif, ...n]);
        triggerToastAlert(newNotif);
      }

      return {
        ...prev,
        bookmarkedSeriesIds: updated,
      };
    });
  };

  const handleFollowToggle = (mentorId) => {
    setUserProfile((prev) => {
      const isFollowing = prev.followingMentorIds.includes(mentorId);
      return {
        ...prev,
        followingMentorIds: isFollowing
          ? prev.followingMentorIds.filter((id) => id !== mentorId)
          : [...prev.followingMentorIds, mentorId],
      };
    });
  };

  const handleUnlockWithCoins = (reel) => {
    if (userProfile.vidyaCoins < reel.unlockCostCoins) {
      alert(
        `You need ${reel.unlockCostCoins} VidyaCoins to unlock this reel. You have ${userProfile.vidyaCoins} coins. Watch a 15-second sponsor ad or grab coins from the store!`
      );
      setShowCoinStore(true);
      return;
    }

    setUserProfile((prev) => ({
      ...prev,
      vidyaCoins: prev.vidyaCoins - reel.unlockCostCoins,
      unlockedReelIds: [...prev.unlockedReelIds, reel.id],
    }));

    alert(`🎉 "${reel.title}" Unlocked for viewing! Enjoy learning.`);
  };

  const handleOpenSponsorAd = (reel) => {
    setActiveAdReel(reel);
    setShowAdModal(true);
  };

  const handleAdCompleted = (rewardCoins, reelId) => {
    setUserProfile((prev) => ({
      ...prev,
      vidyaCoins: prev.vidyaCoins + rewardCoins,
      unlockedReelIds: reelId && !prev.unlockedReelIds.includes(reelId)
        ? [...prev.unlockedReelIds, reelId]
        : prev.unlockedReelIds,
    }));
  };

  const handleAddCoins = (amount) => {
    setUserProfile((prev) => ({
      ...prev,
      vidyaCoins: prev.vidyaCoins + amount,
    }));
  };

  const handleDeductCoins = (amount) => {
    if (userProfile.vidyaCoins < amount) return false;
    setUserProfile((prev) => ({
      ...prev,
      vidyaCoins: prev.vidyaCoins - amount,
    }));
    return true;
  };

  const handleClaimDailyStreak = () => {
    const todayStr = "2026-08-16";
    setUserProfile((prev) => ({
      ...prev,
      streakDays: prev.streakDays + 1,
      vidyaCoins: prev.vidyaCoins + 25,
      lastStreakClaimDate: todayStr,
    }));

    const streakNotif = {
      id: `notif-streak-claimed-${Date.now()}`,
      type: "streak_reminder",
      title: "🔥 Daily Study Streak Maintained!",
      message: `Awesome! You earned +25 VidyaCoins. Your streak is now ${userProfile.streakDays + 1} days. Keep crushing your exam syllabus!`,
      timestamp: "Just now",
      isRead: false,
      actionType: "continue_streak",
      iconType: "flame",
      highlightBadge: "Active Streak",
    };
    setNotifications((n) => [streakNotif, ...n]);
    triggerToastAlert(streakNotif);

    handleIncrementWeeklyGoal("maintain_streak", 1);
  };

  const handleIncrementWeeklyGoal = (goalType, amount = 1) => {
    setUserProfile((prev) => {
      if (!prev.weeklyGoals) return prev;
      const updatedGoals = prev.weeklyGoals.goals.map((g) => {
        if (g.type === goalType) {
          return { ...g, currentCount: g.currentCount + amount };
        }
        return g;
      });

      const isAllNowCompleted = updatedGoals.every((g) => g.currentCount >= g.targetCount);
      const wasAllCompleted = prev.weeklyGoals.goals.every((g) => g.currentCount >= g.targetCount);

      if (isAllNowCompleted && !wasAllCompleted && !prev.weeklyGoals.isRewardClaimed) {
        const goalCompleteNotif = {
          id: `notif-goal-unlocked-${Date.now()}`,
          type: "weekly_goal",
          title: "🎯 Weekly Learning Goals Completed!",
          message: `Incredible job! You reached 100% across all milestones this week. Claim your +${prev.weeklyGoals.bonusCoinsReward} VidyaCoins bonus package now!`,
          timestamp: "Just now",
          isRead: false,
          actionType: "open_earn",
          iconType: "trophy",
          highlightBadge: "Bonus Ready",
        };
        setNotifications((n) => [goalCompleteNotif, ...n]);
        triggerToastAlert(goalCompleteNotif);
      }

      return {
        ...prev,
        weeklyGoals: {
          ...prev.weeklyGoals,
          goals: updatedGoals,
        },
      };
    });
  };

  const handleUpdateWeeklyGoals = (updatedState) => {
    setUserProfile((prev) => ({
      ...prev,
      weeklyGoals: updatedState,
    }));
  };

  const handleClaimWeeklyBonus = () => {
    if (!userProfile.weeklyGoals || userProfile.weeklyGoals.isRewardClaimed) return;
    const bonusCoins = userProfile.weeklyGoals.bonusCoinsReward || 150;

    setUserProfile((prev) => {
      if (!prev.weeklyGoals) return prev;
      return {
        ...prev,
        vidyaCoins: prev.vidyaCoins + bonusCoins,
        weeklyGoals: {
          ...prev.weeklyGoals,
          isRewardClaimed: true,
        },
      };
    });

    const claimedNotif = {
      id: `notif-claimed-goal-${Date.now()}`,
      type: "coin_reward",
      title: "🎉 +150 VidyaCoins Weekly Bonus Claimed!",
      message: `Your account was credited with ${bonusCoins} VidyaCoins. Great consistency this week!`,
      timestamp: "Just now",
      isRead: false,
      actionType: "open_library",
      iconType: "sparkles",
      highlightBadge: "+150 Coins",
    };
    setNotifications((n) => [claimedNotif, ...n]);
    triggerToastAlert(claimedNotif);
  };

  const handleQuizCompleted = (reelId, rewardCoins) => {
    setUserProfile((prev) => ({
      ...prev,
      vidyaCoins: prev.vidyaCoins + rewardCoins,
      completedQuizIds: [...(prev.completedQuizIds || []), reelId],
    }));
    handleIncrementWeeklyGoal("solve_quizzes", 1);
  };

  const handleUnlockMaterial = (materialId, costCoins) => {
    if (userProfile.vidyaCoins < costCoins) {
      alert(`You need ${costCoins} coins. Watch an ad or top-up coins!`);
      setShowCoinStore(true);
      return;
    }
    setUserProfile((prev) => ({
      ...prev,
      vidyaCoins: prev.vidyaCoins - costCoins,
      unlockedMaterialIds: [...prev.unlockedMaterialIds, materialId],
    }));
    alert("Cheat sheet notes unlocked for download!");
  };

  const handleSelectSeries = (seriesId) => {
    setActiveView("series");
  };

  const handleUnlockSeries = (series) => {
    setUserProfile((prev) => ({
      ...prev,
      unlockedSeriesIds: [...prev.unlockedSeriesIds, series.id],
      unlockedReelIds: [
        ...prev.unlockedReelIds,
        ...series.reels.map((r) => r.id),
      ],
    }));
    handleIncrementWeeklyGoal("complete_series", 1);
  };

  const handleAskNewDoubt = (newDoubtData) => {
    const hasAnswer = (newDoubtData.answers || []).length > 0;
    const hasMentorOrAiAnswer = (newDoubtData.answers || []).some(
      (a) => a.isMentor || a.authorRole === "mentor" || a.authorRole === "ai_assistant"
    );

    const fullDoubt = {
      id: `doubt-${Date.now()}`,
      title: newDoubtData.title || "Untitled Doubt",
      content: newDoubtData.content || "",
      subject: newDoubtData.subject || "JEE / NEET Prep",
      reelId: newDoubtData.reelId,
      reelTitle: newDoubtData.reelTitle,
      reelTimestamp: newDoubtData.reelTimestamp,
      authorName: newDoubtData.authorName || userProfile.name,
      authorAvatar: newDoubtData.authorAvatar || userProfile.avatar,
      authorRole: "student",
      timestamp: "Just now",
      upvotes: 1,
      status: hasMentorOrAiAnswer ? "answered_by_mentor" : hasAnswer ? "community_answered" : "open",
      isVoiceDoubt: newDoubtData.isVoiceDoubt,
      voiceAudioUrl: newDoubtData.voiceAudioUrl,
      voiceDurationSeconds: newDoubtData.voiceDurationSeconds,
      rawSpokenTranscript: newDoubtData.rawSpokenTranscript,
      answers: newDoubtData.answers || [],
    };
    setDoubts((prev) => [fullDoubt, ...prev]);
    handleIncrementWeeklyGoal("ask_doubts", 1);
  };

  const handleUpvoteDoubt = (doubtId) => {
    setDoubts((prev) =>
      prev.map((d) => (d.id === doubtId ? { ...d, upvotes: d.upvotes + 1 } : d))
    );
  };

  const handleAddAnswer = (doubtId, content) => {
    const isMentorUser = userProfile.role === "mentor" || activePortal === "mentor";
    const newAnswer = {
      id: `ans-${Date.now()}`,
      doubtId,
      authorName: userProfile.name,
      authorAvatar: userProfile.avatar,
      authorRole: isMentorUser ? "mentor" : "student",
      isMentor: isMentorUser,
      content,
      timestamp: "Just now",
      upvotes: 1,
      isAccepted: false,
    };

    setDoubts((prev) =>
      prev.map((d) => {
        if (d.id === doubtId) {
          const updatedAnswers = [...d.answers, newAnswer];
          const isAnsweredByMentor = updatedAnswers.some(
            (a) => a.isMentor || a.authorRole === "mentor" || a.authorRole === "ai_assistant"
          );
          return {
            ...d,
            answers: updatedAnswers,
            status: isAnsweredByMentor ? "answered_by_mentor" : "community_answered",
          };
        }
        return d;
      })
    );
  };

  const handlePublishReel = (newReelData) => {
    const fullReel = {
      id: `reel-user-${Date.now()}`,
      title: newReelData.title || "Concept Breakdown",
      description: newReelData.description || "",
      subject: newReelData.subject || "JEE / NEET Prep",
      topicTag: newReelData.topicTag || "Revision",
      mentor: newReelData.mentor || mentors[0],
      visualType: newReelData.visualType || "physics_optics",
      videoUrl: newReelData.videoUrl || undefined,
      posterBg: "from-slate-900 via-indigo-950 to-black",
      durationSeconds: newReelData.durationSeconds || 50,
      language: "Hinglish",
      views: 1,
      likes: 1,
      shares: 0,
      saves: 0,
      seriesTitle: newReelData.seriesTitle,
      isPaywalled: newReelData.isPaywalled || false,
      unlockType: newReelData.unlockType || "free",
      unlockCostCoins: newReelData.unlockCostCoins || 0,
      keyMoments: newReelData.keyMoments || [
        { timeSeconds: 5, label: "Core Concept Intuition" },
      ],
      quiz: newReelData.quiz,
      studyMaterials: newReelData.studyMaterials,
      createdAt: "Just now",
    };

    setReels((prev) => [fullReel, ...prev]);
    setActivePortal("student");
    setActiveView("reels");
    setSelectedCategory("All");
    setSearchQuery("");
  };

  const handleShareReel = (reel) => {
    navigator.clipboard.writeText(
      `Check out this high-yield 60s VidyaReel on "${reel.title}" by ${reel.mentor.name}! https://scroll4learning.in/reels/${reel.id}`
    );
    alert("🔗 Reel link copied to clipboard! Share with your classmates.");
    setUserProfile((prev) => ({ ...prev, vidyaCoins: prev.vidyaCoins + 5 }));
  };

  const handleMarkAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const handleNotificationClick = (notif) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notif.id ? { ...n, isRead: true } : n))
    );

    if (notif.actionType === "continue_streak") {
      setShowNotificationCenter(false);
      setShowEarnModal(true);
    } else if (notif.actionType === "open_series") {
      setShowNotificationCenter(false);
      setActiveView("series");
    } else if (notif.actionType === "open_library") {
      setShowNotificationCenter(false);
      setActiveView("library");
    } else if (notif.actionType === "open_doubts") {
      setShowNotificationCenter(false);
      setActiveView("doubts");
    } else if (notif.actionType === "open_earn") {
      setShowNotificationCenter(false);
      setShowEarnModal(true);
    }
  };

  const handleTriggerTestNotification = (type) => {
    const newNotif =
      type === "streak"
        ? {
            id: `test-streak-${Date.now()}`,
            type: "streak_reminder",
            title: `🔥 Daily 8:00 PM Streak Alert: Protect your ${userProfile.streakDays}-Day Run!`,
            message: "Only a few hours remain today. Solve 1 checkpoint quiz or review a 60s micro-reel to claim +25 coins.",
            timestamp: "Just now",
            isRead: false,
            actionType: "continue_streak",
            iconType: "flame",
            highlightBadge: "8:00 PM Push",
          }
        : {
            id: `test-series-${Date.now()}`,
            type: "series_reminder",
            title: "📚 Morning 8:00 AM Digest: Ray & Wave Optics 3D",
            message: "Your bookmarked series with Alakh Pandey Sir has 4 episodes waiting. Watch Episode 2 now to stay on track.",
            timestamp: "Just now",
            isRead: false,
            actionType: "open_series",
            targetId: "series-physics-optics",
            iconType: "bookmark",
            highlightBadge: "8:00 AM Push",
          };

    setNotifications((prev) => [newNotif, ...prev]);
    triggerToastAlert(newNotif);
  };

  const unreadNotificationCount = notifications.filter((n) => !n.isRead).length;

  const bookmarkedSeriesObjects = seriesList.filter((s) =>
    (userProfile.bookmarkedSeriesIds || []).includes(s.id)
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950">
      {/* Top Main Navigation */}
      <Navbar
        userProfile={userProfile}
        activePortal={activePortal}
        onSelectPortal={handleSelectPortal}
        activeView={activeView}
        onNavigate={(v) => setActiveView(v)}
        searchQuery={searchQuery}
        onSearchChange={(q) => setSearchQuery(q)}
        onOpenCoinStore={() => setShowCoinStore(true)}
        onOpenEarnModal={() => setShowEarnModal(true)}
        onOpenMentorStudio={() => {
          handleSelectPortal("mentor");
          setShowMentorStudio(true);
        }}
        onChangeLanguage={(lang) =>
          setUserProfile((prev) => ({ ...prev, preferredLanguage: lang }))
        }
        unreadNotificationCount={unreadNotificationCount}
        onOpenNotifications={() => setShowNotificationCenter(true)}
        onOpenWeeklyGoals={() => setShowWeeklyGoalsModal(true)}
        onOpenLiveSession={() => setShowLiveSessionsModal(true)}
        activeLiveCount={liveSessions.filter((s) => s.status === "live").length}
        isLoggedIn={isLoggedIn}
        onOpenAuthModal={handleOpenAuthModal}
        onLogout={handleLogout}
      />

      {/* Daily Learning Streak & Bookmarked Series Reminder Alert Banner (Student Portal) */}
      {activePortal === "student" && (
        <DailyStreakAlertBanner
          userProfile={userProfile}
          bookmarkedSeries={bookmarkedSeriesObjects}
          onClaimDailyStreak={handleClaimDailyStreak}
          onNavigateToSeries={(seriesId) => {
            setActiveView("series");
          }}
          onNavigateToLibrary={() => setActiveView("library")}
          onOpenNotifications={() => setShowNotificationCenter(true)}
        />
      )}

      {/* Main App Body Router: Dual Portal Architecture */}
      <main className="flex-1 flex flex-col pb-16 lg:pb-6">
        {activePortal === "mentor" ? (
          /* ================= 👨‍🏫 DEDICATED MENTOR PORTAL ================= */
          <MentorPortalView
            currentMentor={currentMentorProfile}
            allMentors={mentors}
            allReels={reels}
            allDoubts={doubts}
            liveSessions={liveSessions}
            userProfile={userProfile}
            onSwitchToStudentPortal={() => handleSelectPortal("student")}
            onSwitchToStudent={() => handleSelectPortal("student")}
            onStartLiveBroadcast={handleStartLiveBroadcast}
            onPublishReel={handlePublishReel}
            onAnswerDoubt={handleAddAnswer}
            onLogout={handleLogout}
            onOpenCoinStore={() => setShowCoinStore(true)}
          />
        ) : (
          /* ================= 🎓 DEDICATED STUDENT PORTAL ================= */
          <>
            {activeView === "reels" && (
              <ReelFeed
                reels={reels}
                userProfile={userProfile}
                selectedCategory={selectedCategory}
                onSelectCategory={(cat) => setSelectedCategory(cat)}
                searchQuery={searchQuery}
                onLikeToggle={handleLikeToggle}
                onBookmarkToggle={handleBookmarkToggle}
                onFollowToggle={handleFollowToggle}
                onOpenQuiz={(reel) => setActiveQuizReel(reel)}
                onOpenDoubtModal={(reel, timestamp) => {
                  setInitialReelContext({
                    reelId: reel.id,
                    reelTitle: reel.title,
                    reelTimestamp: timestamp,
                    subject: reel.subject,
                  });
                  setActiveView("doubts");
                }}
                onOpenAiSummary={(reel) => setActiveAiSummaryReel(reel)}
                onOpenMaterialsModal={(reel) => setActiveMaterialsReel(reel)}
                onOpenSponsorAd={handleOpenSponsorAd}
                onUnlockWithCoins={handleUnlockWithCoins}
                onSelectSeries={handleSelectSeries}
                onShareReel={handleShareReel}
              />
            )}

            {activeView === "series" && (
              <CourseSeriesView
                seriesList={seriesList}
                userProfile={userProfile}
                onSelectReel={(reel) => {
                  setActiveView("reels");
                }}
                onUnlockSeries={handleUnlockSeries}
                onUnlockWithCoins={handleUnlockWithCoins}
                onOpenSponsorAd={handleOpenSponsorAd}
                onToggleBookmarkSeries={handleToggleBookmarkSeries}
              />
            )}

            {activeView === "doubts" && (
              <DoubtForum
                doubts={doubts}
                mentors={mentors}
                userProfile={userProfile}
                onAskNewDoubt={handleAskNewDoubt}
                onUpvoteDoubt={handleUpvoteDoubt}
                onAddAnswer={handleAddAnswer}
                onOpenPrivateChat={(mentor) => setPrivateChatMentor(mentor)}
                onNavigateToLeaderboard={() => setActiveView("leaderboard")}
                initialReelContext={initialReelContext}
                onClearInitialReelContext={() => setInitialReelContext(null)}
              />
            )}

            {activeView === "leaderboard" && (
              <MentorLeaderboard
                mentors={mentors}
                userProfile={userProfile}
                onFollowToggle={handleFollowToggle}
                onOpenPrivateChat={(mentor) => setPrivateChatMentor(mentor)}
                onFilterReelsByMentor={handleFilterReelsByMentor}
                onOpenMentorStudio={() => {
                  if (userProfile.role === "mentor") {
                    handleSelectPortal("mentor");
                  } else {
                    setAuthInitialRole("mentor");
                    setShowAuthModal(true);
                  }
                }}
              />
            )}

            {activeView === "library" && (
              <UserLibraryView
                userProfile={userProfile}
                allReels={reels}
                allSeries={seriesList}
                onSelectReel={(reel) => {
                  setActiveView("reels");
                }}
                onSelectSeries={(seriesId) => {
                  setActiveView("series");
                }}
                onToggleBookmarkSeries={handleToggleBookmarkSeries}
                onOpenCoinStore={() => setShowCoinStore(true)}
                onOpenNotifications={() => setShowNotificationCenter(true)}
                onOpenWeeklyGoals={() => setShowWeeklyGoalsModal(true)}
              />
            )}
          </>
        )}
      </main>

      {/* Floating Animated Push Notification Toast Chime */}
      {activeToastAlert && (
        <div className="fixed top-16 right-4 z-50 max-w-sm w-full bg-slate-900/95 border border-amber-500/50 rounded-2xl p-4 shadow-2xl backdrop-blur-md animate-slide-in-right">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center flex-shrink-0">
              {activeToastAlert.iconType === "flame" ? (
                <Flame className="w-5 h-5 text-orange-400 fill-orange-500 animate-pulse" />
              ) : (
                <BookMarked className="w-5 h-5 text-amber-400" />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                  Daily Study Alert
                </span>
                <button
                  onClick={() => setActiveToastAlert(null)}
                  className="text-slate-400 hover:text-white p-0.5 rounded transition"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              <h4 className="text-xs font-bold text-white mt-0.5 line-clamp-1">
                {activeToastAlert.title}
              </h4>
              <p className="text-[11px] text-slate-300 line-clamp-2 mt-0.5">
                {activeToastAlert.message}
              </p>

              <div className="mt-2 flex items-center gap-2">
                <button
                  onClick={() => {
                    handleNotificationClick(activeToastAlert);
                    setActiveToastAlert(null);
                  }}
                  className="flex items-center gap-1 bg-amber-500 text-slate-950 font-black text-[11px] px-2.5 py-1 rounded-lg transition hover:bg-amber-400 cursor-pointer shadow"
                >
                  <span>View Details</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
                <button
                  onClick={() => setActiveToastAlert(null)}
                  className="text-[11px] text-slate-400 hover:text-slate-200 font-medium px-2 py-1"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Navigation for Mobile */}
      <BottomNav
        activePortal={activePortal}
        onSelectPortal={handleSelectPortal}
        activeView={activeView}
        onNavigate={(v) => setActiveView(v)}
        onOpenMentorStudio={() => handleSelectPortal("mentor")}
        onOpenLiveSession={() => setShowLiveSessionsModal(true)}
      />

      {/* ================= Modals ================= */}
      {/* 0a. Login & Register Dual Portal Authentication Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        initialRole={authInitialRole}
        onLogin={handleLogin}
        allMentors={mentors}
      />

      {/* 0. Weekly Learning Goals Modal */}
      {userProfile.weeklyGoals && (
        <WeeklyGoalsModal
          isOpen={showWeeklyGoalsModal}
          onClose={() => setShowWeeklyGoalsModal(false)}
          weeklyGoals={userProfile.weeklyGoals}
          userProfile={userProfile}
          onUpdateGoals={handleUpdateWeeklyGoals}
          onClaimWeeklyBonus={handleClaimWeeklyBonus}
          onNavigateToSeries={() => {
            setShowWeeklyGoalsModal(false);
            setActiveView("series");
          }}
          onNavigateToReels={() => {
            setShowWeeklyGoalsModal(false);
            setActiveView("reels");
          }}
          onNavigateToDoubts={() => {
            setShowWeeklyGoalsModal(false);
            setActiveView("doubts");
          }}
        />
      )}

      {/* 0b. Notification Center Modal */}
      <NotificationCenter
        notifications={notifications}
        userProfile={userProfile}
        seriesList={seriesList}
        isOpen={showNotificationCenter}
        onClose={() => setShowNotificationCenter(false)}
        onMarkAllRead={handleMarkAllNotificationsRead}
        onNotificationClick={handleNotificationClick}
        onTriggerTestNotification={handleTriggerTestNotification}
        onClaimDailyStreak={handleClaimDailyStreak}
      />

      {/* 1. Sponsor Ad Modal */}
      {showAdModal && (
        <SponsorAdModal
          targetReel={activeAdReel}
          onAdCompleted={handleAdCompleted}
          onClose={() => {
            setShowAdModal(false);
            setActiveAdReel(null);
          }}
        />
      )}

      {/* 2. Coin Store Top-Up Modal */}
      {showCoinStore && (
        <CoinStoreModal
          userProfile={userProfile}
          onAddCoins={handleAddCoins}
          onClose={() => setShowCoinStore(false)}
        />
      )}

      {/* 3. Earn Coins Hub Modal */}
      {showEarnModal && (
        <EarnCoinsModal
          userProfile={userProfile}
          onClaimDailyStreak={handleClaimDailyStreak}
          onOpenSponsorAd={() => {
            setActiveAdReel(null);
            setShowAdModal(true);
          }}
          onClose={() => setShowEarnModal(false)}
        />
      )}

      {/* 4. Private 1-on-1 Mentor Consultation Modal */}
      {privateChatMentor && (
        <PrivateChatModal
          mentor={privateChatMentor}
          userProfile={userProfile}
          onDeductCoins={handleDeductCoins}
          onClose={() => setPrivateChatMentor(null)}
        />
      )}

      {/* 5. Mentor Creator Studio */}
      {showMentorStudio && (
        <MentorStudioModal
          currentMentor={mentors[0]}
          allMentors={mentors}
          allReels={reels}
          onPublishReel={handlePublishReel}
          onStartLiveBroadcast={handleStartLiveBroadcast}
          onClose={() => setShowMentorStudio(false)}
        />
      )}

      {/* 6. Live Sessions Feed & Discovery Modal (For Learners) */}
      {showLiveSessionsModal && (
        <LiveSessionsFeedModal
          isOpen={showLiveSessionsModal}
          onClose={() => setShowLiveSessionsModal(false)}
          liveSessions={liveSessions}
          userProfile={userProfile}
          onSelectSession={handleSelectLiveSession}
          onOpenHostStudio={() => setShowMentorStudio(true)}
        />
      )}

      {/* 7. Live Broadcast & Masterclass Room (Mentor Studio / Student Stream) */}
      {activeLiveSession && (
        <LiveBroadcastRoom
          session={activeLiveSession}
          userProfile={userProfile}
          isMentorBroadcaster={isBroadcasterMode}
          onDeductCoins={handleDeductCoins}
          onAddCoins={(amount, reason) => {
            setUserProfile((prev) => ({
              ...prev,
              vidyaCoins: prev.vidyaCoins + amount,
              coinsEarnedLifetime: prev.coinsEarnedLifetime + amount,
            }));
          }}
          onClose={() => setActiveLiveSession(null)}
          onEndBroadcast={handleEndBroadcast}
        />
      )}

      {/* 8. In-Reel Concept Quiz */}
      {activeQuizReel && (
        <ReelQuizModal
          reel={activeQuizReel}
          onQuizCompleted={handleQuizCompleted}
          onClose={() => setActiveQuizReel(null)}
        />
      )}

      {/* 9. Gemini AI Reel Summary Flashcard */}
      {activeAiSummaryReel && (
        <AISummaryModal
          reel={activeAiSummaryReel}
          onClose={() => setActiveAiSummaryReel(null)}
        />
      )}

      {/* 10. Mentor Study Materials & Formula Sheet */}
      {activeMaterialsReel && (
        <StudyMaterialsModal
          reel={activeMaterialsReel}
          userProfile={userProfile}
          onUnlockMaterial={handleUnlockMaterial}
          onClose={() => setActiveMaterialsReel(null)}
        />
      )}
    </div>
  );
}

export default App;
