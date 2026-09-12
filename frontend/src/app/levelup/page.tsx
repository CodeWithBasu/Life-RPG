"use client";

import { motion } from "framer-motion";
import { Heart, Droplet, Star } from "lucide-react";
import Link from "next/link";

export default function LevelUpPage() {
  return (
    <div className="absolute inset-0 z-[100] bg-white flex flex-col items-center justify-center p-6 overflow-hidden">
      
      {/* Confetti/Rays Background */}
      <motion.div 
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[radial-gradient(ellipse_at_center,rgba(253,224,71,0.4)_0%,transparent_60%)] opacity-50 pointer-events-none"
      />

      <div className="relative z-10 w-full max-w-sm flex flex-col items-center">
        
        {/* Avatar */}
        <motion.div
          initial={{ scale: 0, y: 50 }}
          animate={{ scale: 1, y: 0 }}
          transition={{ type: "spring", bounce: 0.5, duration: 0.8 }}
          className="relative w-48 h-48 bg-gradient-to-br from-indigo-100 to-blue-50 rounded-full border-4 border-white shadow-[0_20px_50px_rgba(0,0,0,0.1)] flex items-center justify-center mb-8"
        >
          <span className="text-7xl">🧑‍🚀</span>
          
          {/* Sparkles */}
          <motion.div 
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className="absolute -top-4 -right-4 text-3xl"
          >✨</motion.div>
          <motion.div 
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.7 }}
            className="absolute top-1/2 -left-8 text-2xl"
          >⭐</motion.div>
        </motion.div>

        {/* Text */}
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-4xl font-black text-slate-800 drop-shadow-sm mb-2 uppercase tracking-wide text-transparent bg-clip-text bg-gradient-to-br from-yellow-500 to-yellow-600"
          style={{ textShadow: "0 4px 12px rgba(234,179,8,0.3)" }}
        >
          Level Up!
        </motion.h1>

        <motion.div 
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, type: "spring" }}
          className="bg-yellow-400 text-yellow-900 text-lg font-black px-6 py-2 rounded-full border-4 border-white shadow-soft mb-6"
        >
          Lv. 13
        </motion.div>

        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-sm font-bold text-slate-500 mb-8"
        >
          You're becoming a brighter you!
        </motion.p>

        {/* Stats */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="w-full bg-slate-50 rounded-[32px] p-6 shadow-soft space-y-4 mb-8"
        >
          <StatRow icon={<Heart className="w-5 h-5 text-rose-500 fill-rose-500" />} label="Max HP" oldVal="100" newVal="110" color="text-rose-500" />
          <StatRow icon={<Droplet className="w-5 h-5 text-blue-500 fill-blue-500" />} label="Max Mana" oldVal="100" newVal="110" color="text-blue-500" />
          <StatRow icon={<Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />} label="XP Gain" oldVal="+0%" newVal="+10%" color="text-yellow-500" />
          
          <div className="pt-4 border-t border-slate-200 text-center">
            <span className="text-xs font-bold text-slate-400 italic">"Progress looks good on you."</span>
          </div>
        </motion.div>

        {/* Action */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="w-full"
        >
          <Link href="/" className="flex items-center justify-center w-full py-4 bg-yellow-400 hover:bg-yellow-500 text-yellow-900 rounded-[24px] font-black text-lg shadow-[0_8px_0_#ca8a04] active:translate-y-2 active:shadow-none transition-all">
            Continue
          </Link>
        </motion.div>

      </div>
    </div>
  );
}

function StatRow({ icon, label, oldVal, newVal, color }: any) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        {icon}
        <span className="text-sm font-bold text-slate-700">{label}</span>
      </div>
      <div className="flex items-center gap-3 text-sm font-bold">
        <span className="text-slate-400">{oldVal}</span>
        <span className="text-slate-300">→</span>
        <span className={color}>{newVal}</span>
      </div>
    </div>
  );
}
