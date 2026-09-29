import React, { useState } from "react";
import {
  Coins,
  CheckCircle2,
  ShieldCheck,
} from "lucide-react";
import confetti from "canvas-confetti";
import { MOCK_COIN_PACKAGES } from "../data/mockData";

export const CoinStoreModal = ({
  userProfile,
  onAddCoins,
  onClose,
}) => {
  const [selectedPack, setSelectedPack] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const handleCheckout = (pack) => {
    setSelectedPack(pack);
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      setPaymentSuccess(true);
      const totalCoins = pack.coins + pack.bonusCoins;
      onAddCoins(totalCoins);
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 },
      });
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 select-none">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-3xl overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-950/60 via-slate-950 to-indigo-950/60 p-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-400/50 flex items-center justify-center text-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.3)]">
              <Coins className="w-6 h-6 fill-current" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-white">
                VidyaCoin Wallet & Store
              </h3>
              <p className="text-xs text-slate-300">
                Current Balance: <strong className="text-amber-400 font-mono text-sm">{userProfile.vidyaCoins} Coins</strong>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 flex flex-col gap-4">
          {paymentSuccess && selectedPack ? (
            <div className="p-6 bg-slate-950 rounded-2xl border border-emerald-500/40 text-center flex flex-col items-center gap-3">
              <div className="w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-400 text-emerald-400 flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="text-lg font-bold text-white">Payment Successful!</h4>
              <p className="text-xs text-slate-300">
                Added <strong className="text-amber-400 font-mono">+{selectedPack.coins + selectedPack.bonusCoins} VidyaCoins</strong> to your account.
              </p>
              <button
                onClick={onClose}
                className="mt-2 px-6 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl shadow transition"
              >
                Back to Learning
              </button>
            </div>
          ) : (
            <>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Select Coin Top-up Bundle (Instant UPI / Cards)
              </div>

              <div className="grid grid-cols-2 gap-3">
                {MOCK_COIN_PACKAGES.map((pack) => (
                  <div
                    key={pack.id}
                    onClick={() => !isProcessing && handleCheckout(pack)}
                    className={`p-4 rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col justify-between relative ${
                      pack.popular
                        ? "bg-gradient-to-b from-amber-950/40 to-slate-950 border-amber-400/80 shadow-lg shadow-amber-500/10"
                        : "bg-slate-950 border-slate-800 hover:border-slate-700"
                    }`}
                  >
                    {pack.tag && (
                      <span className="absolute -top-2.5 right-3 bg-amber-500 text-slate-950 text-[9px] font-black uppercase px-2 py-0.5 rounded-full shadow">
                        {pack.tag}
                      </span>
                    )}

                    <div>
                      <div className="flex items-center gap-1.5 text-amber-400 font-black text-lg mb-0.5">
                        <Coins className="w-4 h-4 fill-current" />
                        <span>{pack.coins}</span>
                        {pack.bonusCoins > 0 && (
                          <span className="text-[11px] text-emerald-400 font-mono font-bold">
                            +{pack.bonusCoins} Bonus
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        Total {pack.coins + pack.bonusCoins} Coins
                      </div>
                    </div>

                    <button className="mt-3 w-full py-2 bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-white font-bold text-xs rounded-xl transition border border-slate-700">
                      Pay ₹{pack.priceInr}
                    </button>
                  </div>
                ))}
              </div>

              {/* Secure Trust Notice */}
              <div className="mt-2 pt-4 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> 100% Secure UPI / RuPay / Cards
                </span>
                <span className="text-amber-400 font-semibold">
                  70% goes to Indian Mentors
                </span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
