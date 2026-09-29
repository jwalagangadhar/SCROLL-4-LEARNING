import React, { useState } from "react";
import {
  Send,
  Coins,
  ShieldCheck,
} from "lucide-react";
import { VerifiedMentorBadge } from "./VerifiedMentorBadge";

export const PrivateChatModal = ({
  mentor,
  userProfile,
  onClose,
  onDeductCoins,
}) => {
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: "msg-init",
      sender: "mentor",
      text: `Namaste ${userProfile.name}! I am ${mentor.name}. You can ask any specific concept doubt, send question images, or request personal strategy guidance for ${mentor.specialization}.`,
      timestamp: "Just now",
      type: "text",
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const startConsultation = () => {
    if (userProfile.vidyaCoins < mentor.privateChatFeeCoins) {
      alert(
        `You need ${mentor.privateChatFeeCoins} VidyaCoins for this consultation session. You currently have ${userProfile.vidyaCoins} coins. Watch a sponsor ad or grab coins from the store!`
      );
      return;
    }

    const success = onDeductCoins(mentor.privateChatFeeCoins);
    if (success) {
      setIsSessionActive(true);
      setMessages((prev) => [
        ...prev,
        {
          id: `msg-sys-${Date.now()}`,
          sender: "system",
          text: `🎉 Consultation Session Unlocked! ${mentor.privateChatFeeCoins} VidyaCoins transferred to ${mentor.name}. Direct line active.`,
          timestamp: "Just now",
          type: "text",
        },
      ]);
    }
  };

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMsg = {
      id: `msg-user-${Date.now()}`,
      sender: "user",
      text: inputText,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      type: "text",
    };

    setMessages((prev) => [...prev, userMsg]);
    const currentInput = inputText;
    setInputText("");
    setIsTyping(true);

    try {
      const res = await fetch("/api/ai/doubt-solver", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: currentInput,
          mentorName: mentor.name,
          subject: mentor.specialization,
          language: userProfile.preferredLanguage,
        }),
      });
      const data = await res.json();

      setTimeout(() => {
        setIsTyping(false);
        setMessages((prev) => [
          ...prev,
          {
            id: `msg-mentor-${Date.now()}`,
            sender: "mentor",
            text: data.answer,
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            type: "text",
          },
        ]);
      }, 1200);
    } catch (e) {
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        {
          id: `msg-mentor-fb-${Date.now()}`,
          sender: "mentor",
          text: `Great point! Here is how to approach it: Focus on the fundamental derivation and verify boundary limits. Let me know if you want a deeper numerical walkthrough!`,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          type: "text",
        },
      ]);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-3xl overflow-hidden shadow-2xl flex flex-col h-[85vh]">
        {/* Header */}
        <div className="bg-slate-950 px-5 py-3.5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src={mentor.avatar}
                alt={mentor.name}
                className="w-10 h-10 rounded-full object-cover border-2 border-amber-400"
              />
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 rounded-full border-2 border-slate-950" />
            </div>

            <div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-sm font-bold text-white">{mentor.name}</span>
                <VerifiedMentorBadge mentor={mentor} size="xs" showScore={true} />
              </div>
              <div className="text-[11px] text-slate-400 flex items-center gap-2">
                <span>{mentor.specialization}</span>
                <span>•</span>
                <span className="text-amber-400 font-medium">★ {mentor.rating}</span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Lock Overlay if session not unlocked */}
        {!isSessionActive ? (
          <div className="flex-1 p-6 flex flex-col items-center justify-center text-center bg-gradient-to-b from-slate-900 to-slate-950">
            <div className="w-16 h-16 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-400 flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(245,158,11,0.3)]">
              <ShieldCheck className="w-8 h-8" />
            </div>

            <h3 className="text-lg font-bold text-white mb-1">
              1-on-1 Direct Consultation with {mentor.name}
            </h3>
            <p className="text-xs text-slate-300 max-w-sm mb-6 leading-relaxed">
              Get personalized doubt resolution, study roadmap reviews, and voice/code breakdown from one of India&apos;s highest-rated educators.
            </p>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 w-full max-w-xs mb-6 text-left flex flex-col gap-2">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Consultation Rate:</span>
                <span className="text-amber-400 font-bold font-mono">
                  {mentor.privateChatFeeCoins} VidyaCoins
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Your Coin Balance:</span>
                <span className="text-emerald-400 font-bold font-mono">
                  {userProfile.vidyaCoins} Coins
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">Response Speed:</span>
                <span className="text-blue-300 font-medium">Instant / &lt;15 mins</span>
              </div>
            </div>

            <button
              onClick={startConsultation}
              className="w-full max-w-xs py-3 px-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-extrabold text-sm rounded-xl shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 transition cursor-pointer"
            >
              <Coins className="w-4 h-4 fill-current" /> Unlock Direct Chat ({mentor.privateChatFeeCoins} Coins)
            </button>
          </div>
        ) : (
          <>
            <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-3">
              {messages.map((msg) => {
                if (msg.sender === "system") {
                  return (
                    <div
                      key={msg.id}
                      className="self-center bg-amber-950/40 border border-amber-500/30 text-amber-300 text-[11px] font-medium px-3 py-1 rounded-full my-1 text-center"
                    >
                      {msg.text}
                    </div>
                  );
                }

                const isUser = msg.sender === "user";

                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col max-w-[85%] ${
                      isUser ? "self-end items-end" : "self-start items-start"
                    }`}
                  >
                    <div
                      className={`p-3.5 rounded-2xl text-xs leading-relaxed ${
                        isUser
                          ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-br-none shadow-md"
                          : "bg-slate-800 border border-slate-700 text-slate-100 rounded-bl-none shadow-md whitespace-pre-line"
                      }`}
                    >
                      {msg.text}
                    </div>
                    <span className="text-[9px] text-slate-500 mt-1 px-1">
                      {msg.timestamp}
                    </span>
                  </div>
                );
              })}

              {isTyping && (
                <div className="self-start flex items-center gap-1.5 bg-slate-800 border border-slate-700 px-3 py-2 rounded-2xl text-xs text-slate-300">
                  <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-pulse" />
                  <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-pulse delay-100" />
                  <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-pulse delay-200" />
                  <span className="text-[11px] text-slate-400 ml-1">{mentor.name} is writing...</span>
                </div>
              )}
            </div>

            <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center gap-2">
              <input
                type="text"
                placeholder={`Ask ${mentor.name} anything...`}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSendMessage();
                }}
                className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-400"
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputText.trim()}
                className="p-2.5 bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-slate-950 font-bold rounded-xl shadow transition cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
