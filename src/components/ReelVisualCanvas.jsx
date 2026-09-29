import React, { useState, useRef, useEffect } from "react";
import {
  Play,
  Volume2,
  VolumeX,
  Gauge,
  Sparkles,
  Layers,
  Code,
  Atom,
  Film,
} from "lucide-react";

export const ReelVisualCanvas = ({
  videoUrl,
  type,
  title,
  topicTag,
  isPlaying,
  onTogglePlay,
  progressPercent,
  onSeek,
  playbackSpeed,
  onChangeSpeed,
  currentTimeSeconds,
  durationSeconds,
}) => {
  const [isMuted, setIsMuted] = useState(false);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const [interactiveParam, setInteractiveParam] = useState(50);

  const videoRef = useRef(null);

  useEffect(() => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.play().catch(() => {});
    } else {
      videoRef.current.pause();
    }
  }, [isPlaying]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = playbackSpeed;
    }
  }, [playbackSpeed]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isMuted;
    }
  }, [isMuted]);

  useEffect(() => {
    if (videoRef.current) {
      const diff = Math.abs(videoRef.current.currentTime - currentTimeSeconds);
      if (diff > 1.5) {
        videoRef.current.currentTime = currentTimeSeconds;
      }
    }
  }, [currentTimeSeconds]);

  const renderVisualContent = () => {
    if (videoUrl) {
      return (
        <div className="relative w-full h-full bg-black flex items-center justify-center overflow-hidden">
          <video
            ref={videoRef}
            src={videoUrl}
            className="w-full h-full object-cover"
            playsInline
            loop
            muted={isMuted}
          />
          <div className="absolute top-12 left-3 z-20 flex items-center gap-1.5 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-full border border-amber-500/40 text-[10px] font-bold text-amber-300">
            <Film className="w-3 h-3 text-amber-400" />
            <span>Mentor Video Stream</span>
          </div>
        </div>
      );
    }

    switch (type) {
      case "physics_optics": {
        const incidentAngle = 30 + (interactiveParam / 100) * 45;
        const criticalAngle = 48.6;
        const isTIR = incidentAngle >= criticalAngle;

        return (
          <div className="relative w-full h-full flex flex-col items-center justify-center p-4 select-none">
            <div className="absolute inset-x-0 top-1/2 h-0.5 bg-cyan-400/80 shadow-[0_0_12px_rgba(34,211,238,0.8)] z-10 flex items-center justify-between px-3">
              <span className="text-[10px] font-mono tracking-wider text-cyan-200 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-500/30">
                Rarer Medium (Air, n₁=1.0)
              </span>
              <span className="text-[10px] font-mono tracking-wider text-blue-200 bg-blue-950/80 px-2 py-0.5 rounded border border-blue-500/30">
                Denser Medium (Glass, n₂=1.52)
              </span>
            </div>

            <div className="absolute inset-y-12 left-1/2 w-0.5 border-r border-dashed border-slate-400/50 z-0 flex flex-col justify-between py-2 text-[9px] text-slate-400 font-mono">
              <span className="self-center bg-slate-900/90 px-1 rounded">Normal</span>
            </div>

            <svg viewBox="0 0 400 320" className="w-full max-w-sm h-64 overflow-visible drop-shadow-2xl">
              <rect x="0" y="160" width="400" height="160" fill="url(#denseGrad)" opacity="0.45" />

              <defs>
                <linearGradient id="denseGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0284c7" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="#0c4a6e" stopOpacity="0.9" />
                </linearGradient>
                <linearGradient id="laserGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#22d3ee" />
                  <stop offset="100%" stopColor="#f43f5e" />
                </linearGradient>
              </defs>

              {(() => {
                const rad = ((90 - incidentAngle) * Math.PI) / 180;
                const startX = 200 - 150 * Math.cos(rad);
                const startY = 160 + 150 * Math.sin(rad);

                return (
                  <>
                    <line
                      x1={startX}
                      y1={startY}
                      x2={200}
                      y2={160}
                      stroke="#38bdf8"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      className="animate-pulse"
                    />
                    <circle cx={startX} cy={startY} r="5" fill="#38bdf8" />
                    <text x={startX - 10} y={startY + 16} fill="#7dd3fc" fontSize="10" fontFamily="monospace">
                      Incident θ={incidentAngle.toFixed(1)}°
                    </text>
                  </>
                );
              })()}

              {isTIR ? (
                (() => {
                  const rad = ((90 - incidentAngle) * Math.PI) / 180;
                  const endX = 200 + 150 * Math.cos(rad);
                  const endY = 160 + 150 * Math.sin(rad);
                  return (
                    <g>
                      <line
                        x1={200}
                        y1={160}
                        x2={endX}
                        y2={endY}
                        stroke="#f43f5e"
                        strokeWidth="4"
                        strokeLinecap="round"
                        filter="drop-shadow(0px 0px 8px #f43f5e)"
                      />
                      <circle cx={endX} cy={endY} r="5" fill="#f43f5e" />
                      <text x="210" y="220" fill="#fda4af" fontSize="11" fontWeight="bold" fontFamily="sans-serif">
                        ⚡ 100% TIR Bounced Back!
                      </text>
                    </g>
                  );
                })()
              ) : (
                (() => {
                  const sinR = (1.52 / 1.0) * Math.sin((incidentAngle * Math.PI) / 180);
                  const angleR = Math.asin(Math.min(0.999, sinR));
                  const endX = 200 + 140 * Math.sin(angleR);
                  const endY = 160 - 140 * Math.cos(angleR);
                  return (
                    <g>
                      <line
                        x1={200}
                        y1={160}
                        x2={endX}
                        y2={endY}
                        stroke="#fbbf24"
                        strokeWidth="3"
                        strokeDasharray="4 2"
                      />
                      <text x={endX + 8} y={endY} fill="#fde68a" fontSize="10" fontFamily="monospace">
                        Refracted into Air
                      </text>
                    </g>
                  );
                })()
              )}

              <circle cx="200" cy="160" r="6" fill="#ffffff" filter="drop-shadow(0 0 10px #ffffff)" />
            </svg>

            <div className="w-full max-w-xs bg-slate-900/90 backdrop-blur-md rounded-xl p-2.5 border border-cyan-500/30 flex flex-col gap-1.5 z-20 shadow-lg mt-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-300 font-medium flex items-center gap-1">
                  <Atom className="w-3.5 h-3.5 text-cyan-400" /> Adjust Incident Angle:
                </span>
                <span className={`font-mono font-bold px-1.5 py-0.5 rounded text-[11px] ${isTIR ? "bg-rose-500/20 text-rose-300 border border-rose-500/40" : "bg-cyan-500/20 text-cyan-300"}`}>
                  {incidentAngle.toFixed(1)}° {isTIR ? "(TIR Active)" : `(θc=${criticalAngle}°)`}
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={interactiveParam}
                onChange={(e) => setInteractiveParam(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
            </div>
          </div>
        );
      }

      case "dsa_recursion": {
        const step = Math.floor((progressPercent / 100) * 6);
        const fibTree = [
          { label: "fib(4)", val: "3", x: 200, y: 30, state: step >= 0 ? "active" : "pending" },
          { label: "fib(3)", val: "2", x: 120, y: 85, state: step >= 1 ? "cached" : "pending" },
          { label: "fib(2)", val: "1", x: 280, y: 85, state: step >= 3 ? "cached" : "pending" },
          { label: "fib(2)", val: "1", x: 70, y: 140, state: step >= 2 ? "cached" : "pending" },
          { label: "fib(1)", val: "1", x: 170, y: 140, state: step >= 2 ? "done" : "pending" },
        ];

        return (
          <div className="relative w-full h-full flex flex-col items-center justify-center p-3 select-none">
            <div className="w-full max-w-sm bg-slate-900/90 border border-emerald-500/30 rounded-xl p-3 mb-2 shadow-xl">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-semibold text-emerald-300 flex items-center gap-1.5">
                  <Code className="w-3.5 h-3.5 text-emerald-400" /> DP Cache Table [Memoization]
                </span>
                <span className="text-[10px] font-mono bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded">
                  O(2^N) ➔ O(N)
                </span>
              </div>
              <div className="grid grid-cols-5 gap-1.5 font-mono text-center text-xs">
                {[0, 1, 2, 3, 4].map((n) => (
                  <div
                    key={n}
                    className={`py-1 rounded border transition-all duration-300 ${
                      step >= n
                        ? "bg-emerald-500/20 border-emerald-400 text-emerald-200 font-bold shadow-[0_0_8px_rgba(16,185,129,0.3)]"
                        : "bg-slate-800/60 border-slate-700 text-slate-500"
                    }`}
                  >
                    <div className="text-[9px] text-slate-400">dp[{n}]</div>
                    <div>{[0, 1, 1, 2, 3][n]}</div>
                  </div>
                ))}
              </div>
            </div>

            <svg viewBox="0 0 360 180" className="w-full max-w-sm h-44 overflow-visible">
              <line x1="200" y1="30" x2="120" y2="85" stroke="#334155" strokeWidth="2" />
              <line x1="200" y1="30" x2="280" y2="85" stroke="#334155" strokeWidth="2" />
              <line x1="120" y1="85" x2="70" y2="140" stroke="#334155" strokeWidth="2" />
              <line x1="120" y1="85" x2="170" y2="140" stroke="#334155" strokeWidth="2" />

              {fibTree.map((node, i) => (
                <g key={i} className="transition-all duration-300">
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r="18"
                    fill={node.state === "cached" ? "#065f46" : node.state === "active" ? "#047857" : "#1e293b"}
                    stroke={node.state !== "pending" ? "#10b981" : "#475569"}
                    strokeWidth="2"
                    filter={node.state !== "pending" ? "drop-shadow(0 0 6px #10b981)" : undefined}
                  />
                  <text
                    x={node.x}
                    y={node.y + 4}
                    textAnchor="middle"
                    fill="#f8fafc"
                    fontSize="10"
                    fontWeight="bold"
                    fontFamily="monospace"
                  >
                    {node.label}
                  </text>
                </g>
              ))}
            </svg>
            <div className="text-center text-xs text-emerald-300 font-mono mt-1">
              {step >= 3 ? "⚡ Subtree fib(2) skipped using cache lookup in O(1)!" : "Computing recursive sub-states..."}
            </div>
          </div>
        );
      }

      case "upsc_polity":
        return (
          <div className="relative w-full h-full flex flex-col items-center justify-center p-4 select-none">
            <div className="relative w-44 h-52 bg-gradient-to-b from-amber-500/20 via-slate-900 to-amber-950/40 border-2 border-amber-400/60 rounded-3xl p-4 flex flex-col items-center justify-between shadow-[0_0_30px_rgba(251,191,36,0.25)] backdrop-blur-md">
              <div className="w-10 h-10 rounded-full bg-amber-500/20 border border-amber-400 flex items-center justify-center text-amber-300 font-serif font-bold text-lg">
                21
              </div>
              <div className="text-center">
                <div className="text-amber-200 font-serif text-sm font-bold tracking-wide">
                  ARTICLE 21
                </div>
                <div className="text-[10px] text-amber-300/80 font-sans mt-0.5">
                  Right to Life & Liberty
                </div>
              </div>

              <div className="w-full bg-slate-950/80 border border-amber-500/30 rounded-lg p-2 text-center text-[10px] text-slate-200">
                <span className="text-amber-400 font-bold">Maneka Gandhi (1978):</span>
                <br />
                Due Process of Law
              </div>
            </div>

            <div className="flex gap-2 mt-4 text-[11px] font-sans">
              <span className="bg-amber-950/60 text-amber-300 border border-amber-500/30 px-2.5 py-1 rounded-full">
                ⚖️ Puttaswamy: Privacy
              </span>
              <span className="bg-amber-950/60 text-amber-300 border border-amber-500/30 px-2.5 py-1 rounded-full">
                🛡️ Basic Structure
              </span>
            </div>
          </div>
        );

      case "fintech_compounding": {
        const monthlySip = 5000;
        const years = 15;
        const investedAmount = (monthlySip * 12 * years) / 100000;
        const totalValue = 25.2;

        return (
          <div className="relative w-full h-full flex flex-col items-center justify-center p-3 select-none">
            <div className="w-full max-w-xs bg-slate-900/90 border border-green-500/30 rounded-2xl p-3 shadow-xl backdrop-blur-md">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-bold text-green-300">₹5,000/mo S.I.P Snowball</span>
                <span className="text-[10px] bg-green-500/20 text-green-300 font-mono px-2 py-0.5 rounded">
                  12% CAGR
                </span>
              </div>

              <div className="h-32 flex items-end gap-3 justify-center py-2 px-3 bg-slate-950/60 rounded-xl border border-slate-800 my-2">
                <div className="flex flex-col items-center gap-1 w-1/3">
                  <span className="text-[10px] font-mono text-slate-300">₹{investedAmount.toFixed(1)}L</span>
                  <div className="w-full bg-slate-600 rounded-t-lg h-16 transition-all duration-500" />
                  <span className="text-[9px] text-slate-400 text-center">Invested</span>
                </div>

                <div className="flex flex-col items-center gap-1 w-1/3">
                  <span className="text-[10px] font-mono text-emerald-300 font-bold">₹{totalValue}L</span>
                  <div
                    className="w-full bg-gradient-to-t from-emerald-600 to-green-400 rounded-t-lg shadow-[0_0_12px_rgba(74,222,128,0.5)] transition-all duration-500"
                    style={{ height: `${Math.min(100, (totalValue / 26) * 90)}px` }}
                  />
                  <span className="text-[9px] text-emerald-300 font-bold text-center">Final Value</span>
                </div>
              </div>

              <div className="text-[11px] text-center text-slate-300">
                Wealth Gain: <span className="text-emerald-400 font-bold">+₹{(totalValue - investedAmount).toFixed(1)} Lakhs</span> purely from Compounding!
              </div>
            </div>
          </div>
        );
      }

      case "neural_attention":
        return (
          <div className="relative w-full h-full flex flex-col items-center justify-center p-3 select-none">
            <div className="w-full max-w-xs bg-slate-950/90 border border-violet-500/40 rounded-2xl p-3 shadow-xl backdrop-blur-md">
              <div className="text-xs font-mono font-bold text-violet-300 mb-2 flex items-center justify-between">
                <span>Attention Matrix</span>
                <span className="text-[10px] text-fuchsia-300 bg-fuchsia-500/20 px-2 py-0.5 rounded">
                  Q · Kᵀ / √dₖ
                </span>
              </div>

              <div className="space-y-2 font-mono text-xs">
                <div className="p-2 bg-violet-950/40 border border-violet-500/30 rounded-lg text-slate-200">
                  Sentence: <span className="text-violet-300 font-bold">&quot;The river bank was muddy&quot;</span>
                </div>
                <div className="text-[11px] text-slate-300 p-2 bg-slate-900 rounded-lg border border-slate-800">
                  Token <span className="text-fuchsia-400 font-bold">&apos;bank&apos;</span> attends heavily to:
                  <div className="flex gap-2 mt-1.5">
                    <span className="bg-violet-600/30 text-violet-300 px-2 py-0.5 rounded border border-violet-500/40">
                      &apos;river&apos; (0.84)
                    </span>
                    <span className="bg-slate-800 text-slate-400 px-2 py-0.5 rounded">
                      &apos;the&apos; (0.05)
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="relative w-full h-full flex flex-col items-center justify-center p-6 text-center select-none">
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-amber-500 to-rose-500 p-0.5 mb-4 shadow-[0_0_25px_rgba(244,63,94,0.4)] animate-spin-slow">
              <div className="w-full h-full bg-slate-950 rounded-full flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-amber-400" />
              </div>
            </div>
            <h3 className="text-lg font-bold text-white mb-1">{title}</h3>
            <span className="text-xs font-medium text-amber-300 bg-amber-500/20 px-3 py-1 rounded-full border border-amber-500/30">
              #{topicTag}
            </span>
          </div>
        );
    }
  };

  return (
    <div
      className="relative w-full h-full bg-gradient-to-b from-slate-950 via-slate-900 to-black overflow-hidden flex flex-col justify-between"
      onClick={onTogglePlay}
    >
      {/* Top Floating Control Bar */}
      <div
        className="absolute top-3 left-3 right-3 flex items-center justify-between z-30 pointer-events-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1 bg-black/60 backdrop-blur-md border border-white/10 text-white text-[11px] font-medium px-2.5 py-1 rounded-full">
            <Layers className="w-3 h-3 text-amber-400" />
            {topicTag}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <div className="relative">
            <button
              onClick={() => setShowSpeedMenu(!showSpeedMenu)}
              className="flex items-center gap-1 bg-black/60 backdrop-blur-md border border-white/15 hover:border-amber-400/50 text-white text-[11px] font-mono px-2 py-1 rounded-full transition"
              title="Playback Speed"
            >
              <Gauge className="w-3 h-3 text-amber-400" />
              {playbackSpeed}x
            </button>
            {showSpeedMenu && (
              <div className="absolute right-0 top-full mt-1 bg-slate-900/95 border border-white/15 rounded-xl shadow-2xl py-1 z-40 w-20 text-xs font-mono">
                {[0.75, 1.0, 1.25, 1.5].map((s) => (
                  <button
                    key={s}
                    onClick={() => {
                      onChangeSpeed(s);
                      setShowSpeedMenu(false);
                    }}
                    className={`w-full text-left px-3 py-1 hover:bg-white/10 ${
                      playbackSpeed === s ? "text-amber-400 font-bold" : "text-slate-300"
                    }`}
                  >
                    {s}x
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={() => setIsMuted(!isMuted)}
            className="p-1.5 bg-black/60 backdrop-blur-md border border-white/15 text-white hover:text-amber-400 rounded-full transition"
            title={isMuted ? "Unmute Audio" : "Mute Audio"}
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      <div className="flex-1 w-full h-full flex items-center justify-center">
        {renderVisualContent()}
      </div>

      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[2px] z-20 pointer-events-none">
          <div className="w-16 h-16 rounded-full bg-amber-500/90 text-slate-950 flex items-center justify-center shadow-[0_0_25px_rgba(245,158,11,0.6)] transform scale-110 transition">
            <Play className="w-8 h-8 fill-current ml-1" />
          </div>
        </div>
      )}

      <div
        className="relative w-full px-4 pb-3 pt-1 z-30 pointer-events-auto bg-gradient-to-t from-black/90 via-black/40 to-transparent"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between text-[10px] font-mono text-slate-300 mb-1">
          <span>{Math.floor(currentTimeSeconds)}s</span>
          <span className="text-amber-400 font-semibold">{Math.round(progressPercent)}% completed</span>
          <span>{durationSeconds}s</span>
        </div>

        <div
          className="w-full h-2 bg-white/20 hover:h-2.5 rounded-full overflow-hidden cursor-pointer transition-all duration-150 relative"
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            const percent = (clickX / rect.width) * 100;
            onSeek(Math.max(0, Math.min(100, percent)));
          }}
        >
          <div
            className="h-full bg-gradient-to-r from-amber-400 via-orange-500 to-rose-500 rounded-full transition-all duration-100"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>
    </div>
  );
};
