"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Heart, Droplet, Star } from "lucide-react";

interface StatChange {
  label: string;
  oldValue: number | string;
  newValue: number | string;
  icon: React.ReactNode;
  positive: boolean;
}

interface LevelUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  level: number;
  stats: StatChange[];
}

export default function LevelUpModal({ isOpen, onClose, level, stats }: LevelUpModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-0 bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="w-full max-w-[390px] max-h-[90vh] bg-white rounded-[40px] overflow-hidden relative shadow-2xl flex flex-col overflow-y-auto scrollbar-hide"
          >
            {/* Sunburst Background */}
            <div className="absolute inset-x-0 top-0 h-[350px] bg-[#fffcf0] overflow-hidden">
              <div 
                className="absolute inset-0 opacity-50"
                style={{
                  background: 'repeating-conic-gradient(from 0deg, #ffe066 0deg 10deg, transparent 10deg 20deg)'
                }}
              />
              {/* Stars decorations */}
              <Star className="absolute top-12 left-10 text-yellow-400 fill-yellow-400 w-4 h-4 opacity-80" />
              <Star className="absolute top-20 right-16 text-yellow-400 fill-yellow-400 w-6 h-6 opacity-90" />
              <Star className="absolute top-40 left-6 text-yellow-400 fill-yellow-400 w-5 h-5 opacity-70" />
              <Star className="absolute top-36 right-8 text-yellow-400 fill-yellow-400 w-4 h-4 opacity-80" />
            </div>

            {/* Content Container */}
            <div className="relative z-10 flex flex-col items-center pt-8 pb-6 px-6 flex-1">
              
              {/* Avatar Placeholder */}
              <div className="w-48 h-48 mb-2 relative z-20 -mt-16">
                <img 
                  src="/avatar.jpg" 
                  alt="Avatar" 
                  className="w-full h-full object-cover rounded-full border-4 border-white shadow-xl"
                  style={{ clipPath: 'circle(50% at 50% 50%)' }}
                />
              </div>

              {/* LEVEL UP Title */}
              <h1 className="text-5xl font-black text-amber-400 tracking-tight drop-shadow-md mb-2" style={{ textShadow: '0 4px 0 #d97706, 0 8px 10px rgba(0,0,0,0.1)' }}>
                LEVEL UP!
              </h1>
              
              {/* Level Pill */}
              <div className="bg-amber-100 border-2 border-amber-300 rounded-full px-6 py-1.5 mb-6 shadow-sm">
                <span className="text-amber-600 font-bold text-lg">Lv. {level}</span>
              </div>

              {/* Stats Card */}
              <div className="w-full bg-[#f8fafc] rounded-3xl p-5 shadow-sm border border-slate-100 mb-4">
                <p className="text-center text-slate-500 font-medium mb-5 text-sm">
                  You're becoming a brighter you!
                </p>

                <div className="space-y-4">
                  {stats.map((stat, i) => (
                    <div key={i} className="flex items-center justify-between pb-4 border-b border-slate-100 last:border-0 last:pb-0">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-8 h-8">
                          {stat.icon}
                        </div>
                        <span className="font-semibold text-slate-700 text-sm">{stat.label}</span>
                      </div>
                      <div className="flex items-center gap-2 font-bold text-sm">
                        <span className="text-slate-600">{stat.oldValue}</span>
                        <span className="text-slate-300">→</span>
                        <span className={stat.positive ? "text-emerald-500" : "text-red-500"}>
                          {stat.newValue}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quote */}
              <div className="w-full bg-[#f8fafc] rounded-2xl py-3 px-4 text-center mb-6 border border-slate-100">
                <p className="text-slate-500 font-medium text-sm italic">
                  "Progress looks good on you."
                </p>
              </div>

              {/* Continue Button */}
              <button 
                onClick={onClose}
                className="w-full bg-gradient-to-b from-amber-300 to-amber-400 text-amber-950 font-bold text-lg py-4 rounded-3xl shadow-[0_4px_0_#d97706] hover:translate-y-[2px] hover:shadow-[0_2px_0_#d97706] transition-all active:translate-y-[4px] active:shadow-none"
              >
                Continue
              </button>

            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
