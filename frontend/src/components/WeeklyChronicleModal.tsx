"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, BookOpen, Scroll, Sparkles } from "lucide-react";
import { api } from "@/lib/api";

interface WeeklyChronicleModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function WeeklyChronicleModal({ isOpen, onClose }: WeeklyChronicleModalProps) {
  const [chronicleText, setChronicleText] = useState("");
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      api.get<any>("/api/ai/chronicle")
        .then((res) => {
          setChronicleText(res?.chronicle || "Thy deeds echo across the realm.");
          setStats(res?.summary || null);
        })
        .catch(() => {
          setChronicleText("The chronicles hold record of thy valiant perseverance. Thy journey continues.");
        })
        .finally(() => setIsLoading(false));
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="w-full max-w-sm bg-[#fdfbf7] border-2 border-amber-200/80 rounded-[32px] p-6 shadow-2xl relative overflow-hidden text-slate-800"
          >
            {/* Background Texture Detail */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-100/40 rounded-full blur-2xl pointer-events-none" />

            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center text-xl shadow-inner">
                  📜
                </div>
                <div>
                  <h3 className="text-[17px] font-black tracking-tight text-slate-800">Weekly Chronicle</h3>
                  <span className="text-[10px] font-extrabold uppercase tracking-wide text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full flex items-center gap-1 w-max">
                    <Sparkles className="w-3 h-3" /> In-Universe Lore
                  </span>
                </div>
              </div>
              <button onClick={onClose} className="p-1 rounded-full text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {isLoading ? (
              <div className="py-12 text-center text-slate-400 font-bold flex flex-col items-center gap-2">
                <Scroll className="w-8 h-8 text-amber-400 animate-bounce" />
                <span>Consulting the Grand Archivist...</span>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200/60 shadow-inner">
                  <p className="text-[13px] leading-relaxed font-serif italic text-slate-700">
                    "{chronicleText}"
                  </p>
                </div>

                {stats && (
                  <div className="bg-white rounded-2xl p-3.5 border border-slate-100 shadow-sm space-y-2">
                    <h4 className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">
                      Verified Campaign Records
                    </h4>
                    <div className="grid grid-cols-2 gap-2 text-xs font-bold text-slate-700">
                      <div className="bg-slate-50 p-2 rounded-xl">
                        <span className="text-slate-400 block text-[10px]">Quests Felled</span>
                        <span className="text-amber-600 font-black text-sm">{stats.questCount}</span>
                      </div>
                      <div className="bg-slate-50 p-2 rounded-xl">
                        <span className="text-slate-400 block text-[10px]">Streak Momentum</span>
                        <span className="text-amber-600 font-black text-sm">{stats.streakDays} Days</span>
                      </div>
                    </div>
                  </div>
                )}

                <button
                  onClick={onClose}
                  className="w-full py-3 rounded-2xl gel-bar-yellow text-yellow-900 font-extrabold text-[14px] shadow-md hover:scale-[1.01] active:scale-[0.99] transition-transform"
                >
                  Seal Chronicle
                </button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
