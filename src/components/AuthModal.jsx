import React, { useState } from "react";
import {
  GraduationCap,
  BookOpen,
  ShieldCheck,
  Sparkles,
  Lock,
  Mail,
  User,
  ArrowRight,
  CheckCircle2,
  X,
  Coins,
} from "lucide-react";
import { DEMO_STUDENT_USERS, DEMO_MENTOR_USERS } from "../data/mockAuthUsers";

export const AuthModal = ({
  isOpen,
  onClose,
  onLogin,
  allMentors = [],
  initialRole = "student",
}) => {
  const [selectedRole, setSelectedRole] = useState(initialRole);
  const [mode, setMode] = useState("quick_login");

  // Form State
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [targetExam, setTargetExam] = useState("JEE Advanced & Tech Skills");
  const [specialization, setSpecialization] = useState("JEE & NEET Physics");
  const [errorMsg, setErrorMsg] = useState("");

  if (!isOpen) return null;

  const handleQuickLogin = (demoUser) => {
    let mentorData = undefined;
    if (demoUser.role === "mentor" && demoUser.mentorId) {
      mentorData = (allMentors || []).find((m) => m.id === demoUser.mentorId);
    }

    const updatedProfile = {
      id: demoUser.id,
      name: demoUser.name,
      email: demoUser.email,
      avatar: demoUser.avatar,
      role: demoUser.role,
      vidyaCoins: demoUser.vidyaCoins,
      coinsEarnedLifetime: demoUser.coinsEarnedLifetime,
      streakDays: demoUser.streakDays,
      targetExam: demoUser.targetExam || "JEE Advanced & Tech Skills",
    };

    onLogin(updatedProfile, demoUser.role, mentorData);
    onClose();
  };

  const handleCustomSubmit = (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setErrorMsg("Please enter email and password");
      return;
    }
    if (mode === "register" && !name.trim()) {
      setErrorMsg("Please enter your name");
      return;
    }

    const displayName = mode === "register" ? name : email.split("@")[0];
    const userRole = selectedRole;

    const avatar =
      userRole === "mentor"
        ? "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
        : "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80";

    let matchedMentor = undefined;
    if (userRole === "mentor") {
      matchedMentor =
        (allMentors || []).find((m) => m.specialization.toLowerCase().includes(specialization.toLowerCase())) ||
        allMentors[0];
    }

    const customUser = {
      id: `user-${Date.now()}`,
      name: displayName,
      email: email,
      avatar: avatar,
      role: userRole,
      vidyaCoins: userRole === "mentor" ? 1500 : 100,
      coinsEarnedLifetime: userRole === "mentor" ? 1500 : 100,
      streakDays: 1,
      targetExam: userRole === "student" ? targetExam : undefined,
    };

    onLogin(customUser, userRole, matchedMentor);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-fadeIn">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-3xl p-5 sm:p-7 shadow-2xl flex flex-col gap-6 my-auto max-h-[95vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-500 via-orange-500 to-emerald-500 p-0.5 shadow-lg flex-shrink-0">
              <div className="w-full h-full bg-slate-950 rounded-2xl flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-amber-400" />
              </div>
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
                <span>Scroll 4 Learning Portal Access</span>
                <span className="text-[10px] bg-amber-500/20 text-amber-300 font-bold px-2 py-0.5 rounded-full border border-amber-500/40">
                  v2.5
                </span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Sign in to your personalized Student or Mentor portal to access reels, masterclasses, and doubts.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition cursor-pointer flex-shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 1. Portal Role Switcher Segment */}
        <div>
          <label className="text-xs font-bold text-slate-300 mb-2 block uppercase tracking-wider">
            Select Your Portal
          </label>
          <div className="grid grid-cols-2 gap-3 p-1.5 bg-slate-950 rounded-2xl border border-slate-800">
            {/* Student Portal Option */}
            <button
              type="button"
              onClick={() => setSelectedRole("student")}
              className={`flex items-center gap-3 p-3 rounded-xl transition cursor-pointer text-left ${
                selectedRole === "student"
                  ? "bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 shadow-md font-bold"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
              }`}
            >
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  selectedRole === "student" ? "bg-slate-950 text-amber-400" : "bg-slate-800 text-slate-400"
                }`}
              >
                <BookOpen className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-black leading-none">🎓 Student Portal</div>
                <div className={`text-[10px] truncate mt-1 ${selectedRole === "student" ? "text-slate-900" : "text-slate-500"}`}>
                  Reels, quizzes, live masterclasses
                </div>
              </div>
            </button>

            {/* Mentor Portal Option */}
            <button
              type="button"
              onClick={() => setSelectedRole("mentor")}
              className={`flex items-center gap-3 p-3 rounded-xl transition cursor-pointer text-left ${
                selectedRole === "mentor"
                  ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-md font-bold"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
              }`}
            >
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  selectedRole === "mentor" ? "bg-slate-950 text-emerald-400" : "bg-slate-800 text-slate-400"
                }`}
              >
                <GraduationCap className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-black leading-none">👨‍🏫 Mentor Portal</div>
                <div className={`text-[10px] truncate mt-1 ${selectedRole === "mentor" ? "text-slate-900" : "text-slate-500"}`}>
                  Studio, live streams, doubt resolver
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* 2. Login Mode Nav */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
          <button
            onClick={() => setMode("quick_login")}
            className={`text-xs font-bold pb-2 px-1 transition relative cursor-pointer ${
              mode === "quick_login"
                ? "text-amber-400 border-b-2 border-amber-400"
                : "text-slate-400 hover:text-slate-300"
            }`}
          >
            ⚡ 1-Click Instant Demo Login
          </button>
          <button
            onClick={() => setMode("custom_login")}
            className={`text-xs font-bold pb-2 px-1 transition relative cursor-pointer ${
              mode === "custom_login"
                ? "text-amber-400 border-b-2 border-amber-400"
                : "text-slate-400 hover:text-slate-300"
            }`}
          >
            🔐 Email & Password
          </button>
          <button
            onClick={() => setMode("register")}
            className={`text-xs font-bold pb-2 px-1 transition relative cursor-pointer ${
              mode === "register"
                ? "text-amber-400 border-b-2 border-amber-400"
                : "text-slate-400 hover:text-slate-300"
            }`}
          >
            ✨ Register New Account
          </button>
        </div>

        {/* Error message */}
        {errorMsg && (
          <div className="bg-rose-500/20 border border-rose-500/50 text-rose-300 text-xs px-3 py-2 rounded-xl flex items-center gap-2">
            <span>⚠️</span>
            <span>{errorMsg}</span>
          </div>
        )}

        {/* 3. Content Section: Quick Login */}
        {mode === "quick_login" && (
          <div className="space-y-3">
            <p className="text-xs text-slate-400">
              Select a pre-configured {selectedRole === "student" ? "student" : "verified mentor"} account to test the {selectedRole === "student" ? "learning ecosystem" : "mentor studio & monetization"}:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {(selectedRole === "student" ? DEMO_STUDENT_USERS : DEMO_MENTOR_USERS).map((user) => (
                <div
                  key={user.id}
                  onClick={() => handleQuickLogin(user)}
                  className="bg-slate-950 border border-slate-800 hover:border-amber-400/80 rounded-2xl p-4 transition-all hover:scale-[1.02] cursor-pointer flex flex-col justify-between group shadow-md"
                >
                  <div>
                    <div className="flex items-center gap-2.5 mb-2">
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-10 h-10 rounded-xl object-cover border-2 border-amber-400/60"
                      />
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold text-white group-hover:text-amber-400 transition truncate">
                          {user.name}
                        </h4>
                        <span className="text-[10px] text-slate-400 block truncate">
                          {user.role === "student" ? user.targetExam : user.specialization}
                        </span>
                      </div>
                    </div>

                    <p className="text-[10px] text-slate-400 line-clamp-2 leading-relaxed mb-3">
                      {user.bio}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-900 flex items-center justify-between">
                    <span className="text-[10px] font-mono text-amber-400 flex items-center gap-1 font-bold">
                      <Coins className="w-3 h-3" />
                      {user.vidyaCoins}
                    </span>
                    <span className="text-[10px] font-bold text-slate-300 bg-slate-850 px-2 py-0.5 rounded-lg group-hover:bg-amber-500 group-hover:text-slate-950 transition flex items-center gap-1">
                      <span>Log In</span>
                      <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. Content Section: Custom Login / Register Form */}
        {(mode === "custom_login" || mode === "register") && (
          <form onSubmit={handleCustomSubmit} className="space-y-4">
            {mode === "register" && (
              <div>
                <label className="text-xs font-bold text-slate-300 mb-1 block">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={selectedRole === "student" ? "e.g. Aryan Kumar" : "e.g. Dr. Ramesh Gupta"}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-amber-400 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder:text-slate-600 focus:outline-none"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="text-xs font-bold text-slate-300 mb-1 block">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@vidyaverse.in"
                  className="w-full bg-slate-950 border border-slate-800 focus:border-amber-400 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder:text-slate-600 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 mb-1 block">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-950 border border-slate-800 focus:border-amber-400 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder:text-slate-600 focus:outline-none"
                />
              </div>
            </div>

            {selectedRole === "student" ? (
              <div>
                <label className="text-xs font-bold text-slate-300 mb-1 block">Target Exam / Goal</label>
                <select
                  value={targetExam}
                  onChange={(e) => setTargetExam(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-amber-400 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                >
                  <option value="JEE Advanced & Tech Skills">JEE Main & Advanced 2026/2027</option>
                  <option value="NEET UG Medical">NEET UG Medical Entrance</option>
                  <option value="UPSC CSE & Civil Services">UPSC CSE (Civil Services)</option>
                  <option value="FAANG Tech & Coding">Tech, Coding & DSA Placements</option>
                  <option value="CBSE Class 11-12 Boards">CBSE / State Board Class 11-12</option>
                  <option value="Finance & Investing">Finance, Stock Market & Investing</option>
                </select>
              </div>
            ) : (
              <div>
                <label className="text-xs font-bold text-slate-300 mb-1 block">Teaching Specialization</label>
                <select
                  value={specialization}
                  onChange={(e) => setSpecialization(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-400 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                >
                  <option value="JEE & NEET Physics">JEE & NEET Physics</option>
                  <option value="Organic & Inorganic Chemistry">Organic & Inorganic Chemistry</option>
                  <option value="DSA, Java & Full Stack">DSA, Algorithms & Tech</option>
                  <option value="UPSC Polity & Constitution">UPSC Polity & Constitution</option>
                  <option value="Calculus & Coordinate Geometry">Higher Mathematics & Calculus</option>
                  <option value="Spoken English & Communication">Spoken English & Communication</option>
                </select>
              </div>
            )}

            <button
              type="submit"
              className={`w-full py-2.5 rounded-xl text-xs font-black transition flex items-center justify-center gap-2 cursor-pointer shadow-lg ${
                selectedRole === "student"
                  ? "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950"
                  : "bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950"
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>
                {mode === "register" ? "Create Account & Launch Portal" : `Sign In to ${selectedRole === "student" ? "Student" : "Mentor"} Portal`}
              </span>
            </button>
          </form>
        )}

        {/* Footer info */}
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-3.5 flex items-center justify-between text-xs text-slate-400">
          <span className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Encrypted Session • Instant switching between Student & Mentor</span>
          </span>
          <button
            type="button"
            onClick={onClose}
            className="text-amber-400 hover:text-amber-300 font-bold underline cursor-pointer"
          >
            Explore as Guest
          </button>
        </div>
      </div>
    </div>
  );
};
