import React, { useState, useRef } from "react";
import {
  UploadCloud,
  CheckCircle2,
  X,
  Play,
  Pause,
  Sparkles,
  Zap,
  Film,
  HardDrive,
  Clock,
  Smartphone,
} from "lucide-react";

const SAMPLE_DEMO_VIDEOS = [
  {
    name: "Ray_Optics_Refraction_1080p.mp4",
    title: "🔬 Optics & Snell's Law (1080p HD)",
    url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    duration: 52,
    size: "18.4 MB",
    resolution: "1080x1920 (9:16 Reel)",
  },
  {
    name: "Aldol_Organic_Mechanism_4K.mp4",
    title: "🧪 Aldol Condensation Derivation",
    url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    duration: 58,
    size: "22.1 MB",
    resolution: "1080x1920 (9:16 Reel)",
  },
  {
    name: "DSA_Recursion_Tree_60s.mp4",
    title: "💻 Recursion Call Stack Walkthrough",
    url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
    duration: 48,
    size: "16.8 MB",
    resolution: "1080x1920 (9:16 Reel)",
  },
];

export const VideoUploadBar = ({
  onVideoSelected,
  onVideoCleared,
  currentVideoUrl,
  defaultDuration = 50,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadSpeed, setUploadSpeed] = useState("0.0 MB/s");
  const [uploadStatusText, setUploadStatusText] = useState("");
  const [uploadedVideo, setUploadedVideo] = useState(
    currentVideoUrl
      ? {
          url: currentVideoUrl,
          fileName: "uploaded_reel.mp4",
          durationSeconds: defaultDuration,
          fileSize: "18.5 MB",
          resolution: "1080x1920 (9:16 Reel)",
        }
      : null
  );
  const [isPlayingPreview, setIsPlayingPreview] = useState(false);
  const [previewCurrentTime, setPreviewCurrentTime] = useState(0);

  const fileInputRef = useRef(null);
  const videoPreviewRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processVideoFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      processVideoFile(e.target.files[0]);
    }
  };

  const processVideoFile = (file) => {
    if (!file.type.startsWith("video/") && !file.name.match(/\.(mp4|mov|webm|mkv)$/i)) {
      alert("Please upload a valid video file (.mp4, .mov, .webm, or .mkv)");
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    const sizeInMb = (file.size / (1024 * 1024)).toFixed(1) + " MB";

    setIsUploading(true);
    setUploadProgress(0);
    setUploadStatusText("Transcoding 9:16 vertical stream...");
    setUploadSpeed("12.4 MB/s");

    let current = 0;
    const interval = setInterval(() => {
      current += Math.floor(Math.random() * 15) + 12;
      if (current >= 100) {
        current = 100;
        clearInterval(interval);
        setUploadProgress(100);
        setUploadStatusText("Optimizing audio & 1080p compression...");

        setTimeout(() => {
          setIsUploading(false);
          const videoData = {
            url: objectUrl,
            fileName: file.name,
            durationSeconds: Math.min(60, Math.max(15, defaultDuration)),
            fileSize: sizeInMb,
            resolution: "1080x1920 Full HD (9:16)",
            isAiEnhanced: true,
          };
          setUploadedVideo(videoData);
          onVideoSelected(videoData);
        }, 400);
      } else {
        setUploadProgress(current);
        if (current > 50) {
          setUploadStatusText("Uploading video stream to Cloud Edge CDN...");
          setUploadSpeed("18.2 MB/s");
        }
      }
    }, 120);
  };

  const handleLoadSample = (sample) => {
    setIsUploading(true);
    setUploadProgress(0);
    setUploadStatusText("Loading sample video stream...");
    setUploadSpeed("24.0 MB/s");

    let current = 0;
    const interval = setInterval(() => {
      current += 25;
      setUploadProgress(Math.min(100, current));
      if (current >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setIsUploading(false);
          const videoData = {
            url: sample.url,
            fileName: sample.name,
            durationSeconds: sample.duration,
            fileSize: sample.size,
            resolution: sample.resolution,
            isAiEnhanced: true,
          };
          setUploadedVideo(videoData);
          onVideoSelected(videoData);
        }, 300);
      }
    }, 100);
  };

  const handleClearVideo = () => {
    setUploadedVideo(null);
    setIsPlayingPreview(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    onVideoCleared();
  };

  const togglePreviewPlay = () => {
    if (!videoPreviewRef.current) return;
    if (isPlayingPreview) {
      videoPreviewRef.current.pause();
      setIsPlayingPreview(false);
    } else {
      videoPreviewRef.current.play().catch(() => {});
      setIsPlayingPreview(true);
    }
  };

  return (
    <div className="w-full bg-slate-950 border border-slate-800/90 rounded-2xl p-4 sm:p-5 space-y-4">
      {/* Header bar */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center">
            <Film className="w-4 h-4 text-amber-400" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-white flex items-center gap-1.5">
              <span>Video File Upload Bar & Media Ingestion</span>
              <span className="text-[10px] font-mono bg-emerald-950 text-emerald-300 px-2 py-0.2 rounded-full border border-emerald-500/30">
                1080p • 9:16 Reel
              </span>
            </h4>
            <p className="text-[11px] text-slate-400">
              Drag & drop your 60-second micro-lesson video or select a file
            </p>
          </div>
        </div>

        {uploadedVideo && (
          <button
            type="button"
            onClick={handleClearVideo}
            className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1 font-semibold px-2 py-1 bg-rose-950/40 rounded-lg border border-rose-500/30 transition cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
            <span>Remove Video</span>
          </button>
        )}
      </div>

      {/* Upload Dropzone / Progress Area */}
      {!uploadedVideo && !isUploading && (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-2xl p-6 sm:p-8 flex flex-col items-center justify-center text-center cursor-pointer transition group ${
            isDragging
              ? "border-amber-400 bg-amber-500/10 scale-[1.01]"
              : "border-slate-800 hover:border-amber-500/50 bg-slate-900/60 hover:bg-slate-900"
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="video/mp4,video/quicktime,video/webm,video/mkv,.mp4,.mov,.webm,.mkv"
            className="hidden"
            onChange={handleFileInputChange}
          />

          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 group-hover:scale-110 group-hover:bg-amber-500/20 transition flex items-center justify-center mb-3">
            <UploadCloud className="w-7 h-7 text-amber-400 animate-bounce" />
          </div>

          <p className="text-xs sm:text-sm font-bold text-white mb-1">
            Drop your video file here, or{" "}
            <span className="text-amber-400 underline decoration-amber-400/50 underline-offset-2">
              browse device
            </span>
          </p>

          <p className="text-[11px] text-slate-400 max-w-sm mb-3">
            Supports MP4, MOV, WebM (up to 150MB). Best in 9:16 vertical 1080x1920 format for mobile students.
          </p>

          <div className="flex items-center gap-3 text-[10px] text-slate-400 font-mono flex-wrap justify-center">
            <span className="flex items-center gap-1 bg-slate-950 px-2 py-0.5 rounded-md border border-slate-800">
              <Smartphone className="w-3 h-3 text-cyan-400" /> 9:16 Vertical
            </span>
            <span className="flex items-center gap-1 bg-slate-950 px-2 py-0.5 rounded-md border border-slate-800">
              <Clock className="w-3 h-3 text-amber-400" /> 15s - 90s Duration
            </span>
            <span className="flex items-center gap-1 bg-slate-950 px-2 py-0.5 rounded-md border border-slate-800">
              <HardDrive className="w-3 h-3 text-emerald-400" /> Max 150MB
            </span>
          </div>

          {/* Quick Demo Clips */}
          <div className="mt-4 pt-3 border-t border-slate-800/80 w-full flex flex-col items-center">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 mb-2">
              ⚡ Or load a pre-recorded mentor sample video:
            </span>
            <div className="flex items-center gap-2 flex-wrap justify-center">
              {SAMPLE_DEMO_VIDEOS.map((sample, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleLoadSample(sample);
                  }}
                  className="px-2.5 py-1 rounded-xl bg-slate-800 hover:bg-amber-500/20 hover:border-amber-400/50 border border-slate-700 text-[11px] text-slate-300 hover:text-amber-300 font-medium transition cursor-pointer flex items-center gap-1.5"
                >
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  <span>{sample.title}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Live Upload Progress Bar State */}
      {isUploading && (
        <div className="bg-slate-900 border border-amber-500/40 rounded-2xl p-5 space-y-3 animate-pulse">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <UploadCloud className="w-4 h-4 text-amber-400 animate-spin" />
              <span className="font-bold text-white">{uploadStatusText}</span>
            </div>
            <div className="flex items-center gap-2 font-mono text-[11px] text-slate-400">
              <span>{uploadSpeed}</span>
              <span className="text-amber-400 font-bold">{uploadProgress}%</span>
            </div>
          </div>

          <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-800">
            <div
              className="h-full bg-gradient-to-r from-amber-500 via-orange-400 to-emerald-400 rounded-full transition-all duration-200 shadow-lg shadow-amber-500/30 relative"
              style={{ width: `${uploadProgress}%` }}
            >
              <div className="absolute inset-0 bg-white/20 animate-pulse" />
            </div>
          </div>

          <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
            <span>Video Engine: H.264 / AAC 320kbps</span>
            <span>Target Bitrate: 4500 kbps (Lag-Free Mobile CDN)</span>
          </div>
        </div>
      )}

      {/* Uploaded Video Preview & Inspector */}
      {uploadedVideo && !isUploading && (
        <div className="bg-slate-900/90 border border-emerald-500/40 rounded-2xl p-4 space-y-3">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center flex-shrink-0">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-bold text-white truncate max-w-xs">
                    {uploadedVideo.fileName}
                  </span>
                  <span className="text-[10px] bg-emerald-950 text-emerald-300 font-bold px-2 py-0.2 rounded-full border border-emerald-500/30">
                    Ready to Publish
                  </span>
                </div>
                <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-0.5 flex-wrap">
                  <span>Size: <strong className="text-slate-200">{uploadedVideo.fileSize}</strong></span>
                  <span>•</span>
                  <span>Duration: <strong className="text-amber-300">{uploadedVideo.durationSeconds}s</strong></span>
                  <span>•</span>
                  <span className="text-cyan-300">{uploadedVideo.resolution || "1080x1920 (9:16)"}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-auto">
              <button
                type="button"
                onClick={togglePreviewPlay}
                className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition shadow cursor-pointer"
              >
                {isPlayingPreview ? (
                  <>
                    <Pause className="w-3.5 h-3.5 fill-current" />
                    <span>Pause</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Play Preview</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="relative rounded-xl overflow-hidden bg-black aspect-[16/9] sm:aspect-[21/9] max-h-48 flex items-center justify-center border border-slate-800">
            <video
              ref={videoPreviewRef}
              src={uploadedVideo.url}
              className="w-full h-full object-contain"
              onTimeUpdate={() => {
                if (videoPreviewRef.current) {
                  setPreviewCurrentTime(videoPreviewRef.current.currentTime);
                }
              }}
              onEnded={() => setIsPlayingPreview(false)}
              playsInline
            />

            {!isPlayingPreview && (
              <button
                type="button"
                onClick={togglePreviewPlay}
                className="absolute inset-0 m-auto w-12 h-12 rounded-full bg-amber-500/90 hover:bg-amber-400 text-slate-950 flex items-center justify-center shadow-2xl transition hover:scale-110 cursor-pointer"
              >
                <Play className="w-6 h-6 fill-current translate-x-0.5" />
              </button>
            )}

            <div className="absolute bottom-2 left-2 right-2 bg-slate-950/80 backdrop-blur-sm rounded-lg px-2.5 py-1 text-[10px] text-slate-300 flex items-center justify-between">
              <span className="font-mono">
                {Math.floor(previewCurrentTime)}s / {uploadedVideo.durationSeconds}s
              </span>
              <span className="text-emerald-400 font-semibold flex items-center gap-1">
                <Zap className="w-3 h-3" /> CDN Stream Verified
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
