import React, { useState, useEffect, useRef } from "react";
import {
  Mic,
  Square,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Check,
  Volume2,
  Globe,
  Radio,
  Send,
  Zap,
} from "lucide-react";

// Language choices for Indian students
const LANGUAGE_OPTIONS = [
  { code: "en-IN", label: "English (India)", hint: "Standard Indian English" },
  { code: "hi-IN", label: "Hinglish / Hindi (हिन्दी)", hint: "Mix of Hindi & English terms" },
  { code: "en-US", label: "English (US/Global)", hint: "Global English accents" },
];

export const AudioDoubtRecorder = ({
  onTranscriptionComplete,
  onCancel,
  preferredSubject = "JEE / NEET Prep",
  targetExam = "JEE / NEET",
  isEmbedded = false,
}) => {
  const [recordingState, setRecordingState] = useState("idle");
  const [language, setLanguage] = useState("en-IN");
  const [duration, setDuration] = useState(0);
  const [liveTranscript, setLiveTranscript] = useState("");
  const [interimText, setInterimText] = useState("");
  const [audioUrl, setAudioUrl] = useState(null);
  const [audioBlob, setAudioBlob] = useState(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState(null);

  // AI Structured Result preview
  const [structuredTitle, setStructuredTitle] = useState("");
  const [structuredContent, setStructuredContent] = useState("");
  const [suggestedSubject, setSuggestedSubject] = useState(preferredSubject);

  // Audio Visualizer / Frequency state
  const [volumeLevels, setVolumeLevels] = useState([15, 25, 45, 30, 60, 40, 20, 35, 55, 30, 20, 10]);

  // Refs
  const recognitionRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const timerRef = useRef(null);
  const audioElementRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const animFrameRef = useRef(null);

  // Quick voice simulation presets for instant testing
  const sampleVoiceDoubts = [
    {
      label: "🧪 Organic Chemistry Sn1/Sn2",
      subject: "JEE / NEET Prep",
      text: "Sir, in organic chemistry, why does tertiary butyl bromide undergo Sn1 reaction so fast with polar protic solvents, but Sn2 completely fails due to steric hindrance? Can you please explain the carbocation stability step?",
    },
    {
      label: "💻 Dynamic Programming (Tech)",
      subject: "Tech & Coding",
      text: "Hello mentor, I am struggling with finding the recurrence relation for the 0/1 Knapsack problem. When do we include versus exclude the current item, and how does the space optimization to 1D array work?",
    },
    {
      label: "📜 UPSC Polity Article 200",
      subject: "UPSC & Govt Exams",
      text: "Respected mentor, regarding Governor's power under Article 200 of the Constitution to withhold assent or reserve a bill for the President: what are the recent Supreme Court guidelines on indefinite delays?",
    },
  ];

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopRecordingCleanup();
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [audioUrl]);

  const stopRecordingCleanup = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        // ignore
      }
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      try {
        mediaRecorderRef.current.stop();
      } catch (e) {
        // ignore
      }
    }
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    if (audioContextRef.current && audioContextRef.current.state !== "closed") {
      try {
        audioContextRef.current.close();
      } catch (e) {
        // ignore
      }
    }
  };

  // Start Voice Recording
  const startRecording = async () => {
    setErrorMessage(null);
    setLiveTranscript("");
    setInterimText("");
    setStructuredTitle("");
    setStructuredContent("");
    setDuration(0);
    audioChunksRef.current = [];

    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;
        
        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            audioChunksRef.current.push(event.data);
          }
        };

        mediaRecorder.onstop = () => {
          const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });
          setAudioBlob(blob);
          const url = URL.createObjectURL(blob);
          setAudioUrl(url);
          stream.getTracks().forEach((track) => track.stop());
        };

        mediaRecorder.start(100);

        try {
          const AudioContextClass = window.AudioContext || window.webkitAudioContext;
          if (AudioContextClass) {
            const audioCtx = new AudioContextClass();
            audioContextRef.current = audioCtx;
            const source = audioCtx.createMediaStreamSource(stream);
            const analyser = audioCtx.createAnalyser();
            analyser.fftSize = 64;
            source.connect(analyser);
            analyserRef.current = analyser;

            const bufferLength = analyser.frequencyBinCount;
            const dataArray = new Uint8Array(bufferLength);

            const updateBars = () => {
              if (analyserRef.current) {
                analyserRef.current.getByteFrequencyData(dataArray);
                const levels = [];
                for (let i = 0; i < 12; i++) {
                  const val = dataArray[i * 2] || 0;
                  levels.push(Math.max(12, Math.min(100, Math.round((val / 255) * 100))));
                }
                setVolumeLevels(levels);
              }
              animFrameRef.current = requestAnimationFrame(updateBars);
            };
            updateBars();
          }
        } catch (e) {
          console.warn("Audio visualizer not supported", e);
        }
      }
    } catch (err) {
      console.warn("MediaRecorder permission error:", err);
    }

    const SpeechRecognitionClass =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (SpeechRecognitionClass) {
      try {
        const recognition = new SpeechRecognitionClass();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = language;

        recognition.onstart = () => {
          setRecordingState("listening");
        };

        recognition.onresult = (event) => {
          let accumulatedFinal = "";
          let accumulatedInterim = "";

          for (let i = 0; i < event.results.length; i++) {
            const result = event.results[i];
            const transcript = result[0].transcript;
            if (result.isFinal) {
              accumulatedFinal += transcript + " ";
            } else {
              accumulatedInterim += transcript;
            }
          }

          setLiveTranscript(accumulatedFinal);
          setInterimText(accumulatedInterim);
        };

        recognition.onerror = (event) => {
          console.warn("Speech recognition notice:", event.error);
          if (event.error === "not-allowed") {
            setErrorMessage("Microphone access is blocked. Please enable mic permissions in your browser.");
          }
        };

        recognitionRef.current = recognition;
        recognition.start();
      } catch (err) {
        console.warn("Recognition start error:", err);
      }
    } else {
      setRecordingState("listening");
    }

    setRecordingState("listening");

    timerRef.current = setInterval(() => {
      setDuration((prev) => {
        if (prev >= 120) {
          stopRecording();
          return 120;
        }
        return prev + 1;
      });
    }, 1000);
  };

  const stopRecording = () => {
    stopRecordingCleanup();

    const fullTranscript = (liveTranscript + " " + interimText).trim();
    setInterimText("");
    setLiveTranscript(fullTranscript);

    if (!fullTranscript) {
      setRecordingState("completed");
      setStructuredTitle("Voice Doubt Question");
      setStructuredContent("Spoken question recorded on the go.");
      return;
    }

    processVoiceWithAI(fullTranscript);
  };

  const processVoiceWithAI = async (transcriptText) => {
    setRecordingState("transcribing_ai");
    try {
      const res = await fetch("/api/ai/transcribe-doubt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rawTranscript: transcriptText,
          targetExam,
          preferredSubject,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setStructuredTitle(data.title || "Voice Doubt");
        setStructuredContent(data.content || transcriptText);
        if (data.suggestedSubject) {
          setSuggestedSubject(data.suggestedSubject);
        }
      } else {
        fallbackFormat(transcriptText);
      }
    } catch (e) {
      console.warn("AI voice formatting failed, using local parser:", e);
      fallbackFormat(transcriptText);
    } finally {
      setRecordingState("completed");
    }
  };

  const fallbackFormat = (raw) => {
    const sentences = raw.split(/[.?!]/).filter((s) => s.trim().length > 0);
    const title = sentences[0]
      ? sentences[0].trim().slice(0, 80) + (sentences[0].length > 80 ? "..." : "")
      : "Voice Question from Student";
    const body = `**Spoken Question Summary:**\n${raw}\n\n*Recorded via MentVidya Voice Doubt Assistant.*`;

    setStructuredTitle(title);
    setStructuredContent(body);
  };

  const handleUseSampleVoice = (sample) => {
    stopRecordingCleanup();
    setLiveTranscript(sample.text);
    setInterimText("");
    setSuggestedSubject(sample.subject);
    setDuration(8);
    processVoiceWithAI(sample.text);
  };

  const handleTogglePlayAudio = () => {
    if (!audioUrl) return;

    if (!audioElementRef.current) {
      const audio = new Audio(audioUrl);
      audioElementRef.current = audio;
      audio.onended = () => {
        setIsPlayingAudio(false);
        setAudioProgress(0);
      };
      audio.ontimeupdate = () => {
        if (audio.duration) {
          setAudioProgress((audio.currentTime / audio.duration) * 100);
        }
      };
    }

    if (isPlayingAudio) {
      audioElementRef.current.pause();
      setIsPlayingAudio(false);
    } else {
      audioElementRef.current.play();
      setIsPlayingAudio(true);
    }
  };

  const handleApplyToDoubt = () => {
    const finalTranscript = liveTranscript.trim();
    onTranscriptionComplete({
      title: structuredTitle || (finalTranscript.slice(0, 70) + "..."),
      content: structuredContent || finalTranscript,
      subject: suggestedSubject,
      rawTranscript: finalTranscript,
      audioBlob,
      audioUrl,
      durationSeconds: duration || 5,
      language,
    });
  };

  const formatSeconds = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  return (
    <div
      className={`w-full bg-slate-950 border border-slate-800 rounded-3xl p-5 shadow-2xl ${
        isEmbedded ? "border-amber-500/30" : ""
      }`}
    >
      {/* Top Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/40 flex items-center justify-center">
            <Mic className="w-4 h-4 text-amber-400" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
              <span>Voice-to-Text Doubt Studio</span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30">
                🎙️ Fast On-The-Go
              </span>
            </h3>
            <p className="text-[11px] text-slate-400">
              Speak your problem freely in Hinglish/English — AI transcribes and structures your question
            </p>
          </div>
        </div>

        {/* Language Selection */}
        <div className="flex items-center gap-1 bg-slate-900 border border-slate-700/80 rounded-xl px-2 py-1">
          <Globe className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            disabled={recordingState === "listening"}
            className="bg-transparent text-[11px] text-slate-200 focus:outline-none cursor-pointer pr-1"
          >
            {LANGUAGE_OPTIONS.map((opt) => (
              <option key={opt.code} value={opt.code} className="bg-slate-900 text-white">
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Recording Center Stage */}
      <div className="flex flex-col items-center justify-center py-4 px-2">
        {/* Animated Microphone Radar Pulse */}
        <div className="relative mb-4">
          {recordingState === "listening" && (
            <>
              <div className="absolute inset-0 rounded-full bg-amber-500/20 animate-ping" />
              <div className="absolute -inset-3 rounded-full bg-orange-500/10 animate-pulse" />
            </>
          )}

          {recordingState === "idle" && (
            <button
              onClick={startRecording}
              className="relative w-20 h-20 rounded-full bg-gradient-to-tr from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 flex flex-col items-center justify-center shadow-lg shadow-amber-500/30 transition transform hover:scale-105 active:scale-95 cursor-pointer"
            >
              <Mic className="w-8 h-8" />
              <span className="text-[10px] font-black uppercase tracking-wider mt-0.5">Tap to Speak</span>
            </button>
          )}

          {recordingState === "listening" && (
            <button
              onClick={stopRecording}
              className="relative w-20 h-20 rounded-full bg-gradient-to-tr from-red-600 to-rose-500 text-white flex flex-col items-center justify-center shadow-lg shadow-red-500/30 transition transform hover:scale-105 active:scale-95 cursor-pointer"
            >
              <Square className="w-7 h-7 fill-white" />
              <span className="text-[10px] font-black uppercase tracking-wider mt-0.5">Stop</span>
            </button>
          )}

          {recordingState === "transcribing_ai" && (
            <div className="w-20 h-20 rounded-full bg-purple-900/60 border-2 border-purple-400 flex flex-col items-center justify-center animate-pulse">
              <Sparkles className="w-7 h-7 text-purple-300 animate-spin" />
              <span className="text-[9px] font-bold text-purple-200 mt-1">AI Styling</span>
            </div>
          )}

          {recordingState === "completed" && (
            <div className="w-20 h-20 rounded-full bg-emerald-950 border-2 border-emerald-400 flex flex-col items-center justify-center text-emerald-300">
              <Check className="w-8 h-8" />
              <span className="text-[10px] font-bold">Done!</span>
            </div>
          )}
        </div>

        {/* Timer & Status text */}
        <div className="flex items-center gap-2 mb-3">
          {recordingState === "listening" && (
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-red-950/80 border border-red-500/40 text-red-400 text-xs font-mono font-bold animate-pulse">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
              <span>RECORDING {formatSeconds(duration)}</span>
              <span className="text-[10px] text-slate-400">(Max 2:00)</span>
            </div>
          )}

          {recordingState === "idle" && (
            <span className="text-xs text-slate-400 flex items-center gap-1.5">
              <Radio className="w-3.5 h-3.5 text-amber-400" />
              Ready to record your question. Speak naturally!
            </span>
          )}

          {recordingState === "transcribing_ai" && (
            <span className="text-xs text-purple-300 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-purple-400 animate-bounce" />
              Gemini AI is generating crisp question structure & formulas...
            </span>
          )}

          {recordingState === "completed" && (
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold">
              <span>✓ Voice captured ({formatSeconds(duration)})</span>
              <button
                onClick={startRecording}
                className="text-slate-400 hover:text-amber-400 text-[11px] underline flex items-center gap-1 ml-2 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" /> Re-record
              </button>
            </div>
          )}
        </div>

        {/* Sound Equalizer Animated Bars */}
        <div className="w-full max-w-sm flex items-end justify-center gap-1 h-10 px-4 py-1 bg-slate-900/60 rounded-xl border border-slate-800 mb-3">
          {volumeLevels.map((lvl, idx) => (
            <div
              key={idx}
              className={`w-2 rounded-full transition-all duration-100 ${
                recordingState === "listening"
                  ? "bg-gradient-to-t from-amber-500 to-orange-400"
                  : "bg-slate-700"
              }`}
              style={{
                height: `${recordingState === "listening" ? Math.max(15, lvl) : 20}%`,
              }}
            />
          ))}
        </div>

        {/* Audio Playback bar if audio was captured */}
        {audioUrl && (
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-2.5 flex items-center justify-between gap-3 mb-3">
            <button
              onClick={handleTogglePlayAudio}
              className="w-8 h-8 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 flex items-center justify-center flex-shrink-0 transition cursor-pointer"
            >
              {isPlayingAudio ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-slate-950" />}
            </button>
            <div className="flex-1">
              <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                <span className="flex items-center gap-1">
                  <Volume2 className="w-3 h-3 text-amber-400" /> Spoken Voice Note
                </span>
                <span>{formatSeconds(duration)}</span>
              </div>
              <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-amber-400 h-full rounded-full transition-all duration-150"
                  style={{ width: `${audioProgress}%` }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Real-time Streaming Transcript Box */}
        {(liveTranscript || interimText || recordingState === "listening") && (
          <div className="w-full bg-slate-900/90 border border-amber-500/40 rounded-2xl p-3.5 mb-3 text-left relative">
            <div className="text-[10px] uppercase tracking-wider font-bold text-amber-400 flex items-center gap-1.5 mb-1.5">
              <Radio className="w-3 h-3 animate-pulse" /> Live Speech Transcription:
            </div>
            <p className="text-xs text-slate-200 leading-relaxed min-h-[44px]">
              {liveTranscript}
              <span className="text-amber-300 italic">{interimText}</span>
              {recordingState === "listening" && !liveTranscript && !interimText && (
                <span className="text-slate-500 animate-pulse">Listening to microphone... Start speaking your doubt now.</span>
              )}
            </p>
          </div>
        )}

        {/* AI Formatted Structured Output Preview */}
        {recordingState === "completed" && structuredTitle && (
          <div className="w-full bg-purple-950/30 border border-purple-500/40 rounded-2xl p-4 text-left mb-3 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-purple-500/20">
              <span className="text-xs font-bold text-purple-300 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-purple-400" /> AI Formatted Doubt Structure
              </span>
              <span className="px-2 py-0.5 rounded-lg bg-purple-900/80 text-purple-200 text-[10px] font-bold">
                {suggestedSubject}
              </span>
            </div>

            <div>
              <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                Extracted Title:
              </label>
              <input
                type="text"
                value={structuredTitle}
                onChange={(e) => setStructuredTitle(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-xs font-bold text-white mt-1 focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                Cleaned Question Body:
              </label>
              <textarea
                rows={3}
                value={structuredContent}
                onChange={(e) => setStructuredContent(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs text-slate-200 mt-1 focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>
        )}

        {/* Quick Demo Voice Question Chips */}
        {recordingState === "idle" && (
          <div className="w-full mt-1 pt-3 border-t border-slate-800 text-left">
            <div className="text-[11px] font-semibold text-slate-400 mb-2 flex items-center justify-between">
              <span>⚡ Or try a simulated voice question:</span>
              <span className="text-[10px] text-amber-400">Click to transcribe</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {sampleVoiceDoubts.map((sample, i) => (
                <button
                  key={i}
                  onClick={() => handleUseSampleVoice(sample)}
                  className="bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-amber-500/40 p-2.5 rounded-xl text-left transition cursor-pointer group"
                >
                  <div className="text-[11px] font-bold text-slate-200 group-hover:text-amber-300 flex items-center gap-1">
                    {sample.label}
                  </div>
                  <div className="text-[10px] text-slate-400 line-clamp-2 mt-1">
                    "{sample.text}"
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-800/80">
        <div>
          {onCancel && (
            <button
              onClick={onCancel}
              className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white text-xs font-semibold rounded-xl transition"
            >
              Cancel
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          {recordingState === "listening" && (
            <button
              onClick={stopRecording}
              className="px-4 py-2 bg-gradient-to-r from-red-600 to-rose-500 hover:from-red-500 hover:to-rose-400 text-white text-xs font-bold rounded-xl shadow-lg transition cursor-pointer flex items-center gap-1.5"
            >
              <Square className="w-3.5 h-3.5 fill-white" />
              <span>Done Speaking</span>
            </button>
          )}

          {recordingState === "completed" && (
            <button
              onClick={handleApplyToDoubt}
              className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 text-xs font-extrabold rounded-xl shadow-lg shadow-amber-500/20 transition cursor-pointer flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              <span>Insert Spoken Doubt into Forum</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
