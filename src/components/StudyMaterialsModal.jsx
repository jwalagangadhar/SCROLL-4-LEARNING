import React from "react";
import { FileText, Download, Coins } from "lucide-react";

export const StudyMaterialsModal = ({
  reel,
  userProfile,
  onUnlockMaterial,
  onClose,
}) => {
  const materials = reel.studyMaterials || [];

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 select-none">
      <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-3xl overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="bg-slate-950 px-5 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-400/40 text-amber-400 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Mentor Study Materials</h3>
              <p className="text-[10px] text-slate-400">By {reel.mentor.name}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-5 flex flex-col gap-3 max-h-[70vh] overflow-y-auto">
          {materials.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400">
              No additional attachments for this reel.
            </div>
          ) : (
            materials.map((mat) => {
              const isUnlocked =
                !mat.requiresUnlock || userProfile.unlockedMaterialIds.includes(mat.id);

              return (
                <div
                  key={mat.id}
                  className="p-4 bg-slate-950 border border-slate-800 rounded-2xl flex flex-col gap-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-950 border border-blue-500/40 text-cyan-300 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-white">{mat.title}</h4>
                        <div className="text-[10px] text-slate-400 mt-0.5">
                          {mat.fileSize} • {mat.downloadCount} Downloads
                        </div>
                      </div>
                    </div>

                    {!mat.requiresUnlock && (
                      <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-500/30">
                        FREE
                      </span>
                    )}
                  </div>

                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    {mat.summary}
                  </p>

                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                    {isUnlocked ? (
                      <button
                        onClick={() => {
                          alert(`Downloading ${mat.title}!`);
                        }}
                        className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition cursor-pointer shadow"
                      >
                        <Download className="w-4 h-4" /> Download PDF Now
                      </button>
                    ) : (
                      <button
                        onClick={() => onUnlockMaterial(mat.id, mat.unlockCostCoins)}
                        className="w-full py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition cursor-pointer shadow"
                      >
                        <Coins className="w-4 h-4 fill-current" /> Unlock Notes for {mat.unlockCostCoins} Coins
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
