"use client";

import { motion } from "framer-motion";
import { Heart, Droplet, Star } from "lucide-react";
import Link from "next/link";

export default function LevelUpPage() {
  return (
    <div className="absolute inset-0 z-[100] bg-[#fffcf0] flex flex-col items-center justify-center p-6 overflow-hidden">
      
      {/* Confetti/Rays Background */}
      <motion.div 
        animate={{ rotate: 360 }}
        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150vw] h-[150vw] sm:w-[800px] sm:h-[800px] opacity-40 pointer-events-none"
        style={{
          background: 'repeating-conic-gradient(from 0deg, #fbbf24 0deg 15deg, transparent 15deg 30deg)'
        }}
      />
      
      {/* Center glowing spot */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-white/60 blur-3xl rounded-full pointer-events-none" />

      {/* Floating Stars */}
      <Star className="absolute top-32 left-16 text-yellow-400 fill-yellow-400 w-5 h-5 opacity-80 drop-shadow-md" />
      <Star className="absolute top-24 right-20 text-yellow-400 fill-yellow-400 w-8 h-8 opacity-90 drop-shadow-md" />
      <Star className="absolute top-64 left-10 text-yellow-400 fill-yellow-400 w-6 h-6 opacity-70 drop-shadow-md" />
      <Star className="absolute top-72 right-12 text-yellow-400 fill-yellow-400 w-5 h-5 opacity-80 drop-shadow-md" />

      <div className="relative z-10 w-full max-w-sm flex flex-col items-center mt-12">
        
        {/* Avatar */}
        <motion.div
          initial={{ scale: 0, y: 50 }}
          animate={{ scale: 1, y: 0 }}
          transition={{ type: "spring", bounce: 0.5, duration: 0.8 }}
          className="relative w-64 h-64 flex items-center justify-center mb-0 -mt-10"
        >
          <img 
            src="/avatar.jpg" 
            alt="Hero Avatar"
            className="w-56 h-56 object-cover"
            style={{
              clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)', // Hexagon shape or leave as simple rounded depending on the image. We'll use custom styling.
              borderRadius: '2rem'
            }}
          />
        </motion.div>

        {/* Text */}
        <motion.h1 
          initial={{ opacity: 0, y: 20, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.3, type: "spring" }}
          className="text-6xl font-black text-[#fbbf24] mb-2 uppercase tracking-tight relative z-20"
          style={{
            WebkitTextStroke: '2px #78350f',
            textShadow: '0px 6px 0px #b45309, 0px 10px 15px rgba(0,0,0,0.3)',
            marginTop: '-40px'
          }}
        >
          LEVEL UP!
        </motion.h1>

        <motion.div 
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, type: "spring" }}
          className="bg-gradient-to-b from-[#fde047] to-[#eab308] text-[#713f12] text-xl font-black px-8 py-2 rounded-full border-4 border-white shadow-md mb-8 relative z-20"
        >
          Lv. 13
        </motion.div>

        {/* Stats Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="w-full bg-[#f8fafc] rounded-[32px] p-6 shadow-xl space-y-4 mb-8 border-4 border-white"
        >
          <p className="text-center text-sm font-bold text-slate-500 mb-6">
            You're becoming a brighter you!
          </p>

          <StatRow icon={<Heart className="w-6 h-6 text-rose-500 fill-rose-500" />} label="Max HP" oldVal="100" newVal="110" color="text-rose-500" />
          <div className="w-full h-px bg-slate-100" />
          <StatRow icon={<Droplet className="w-6 h-6 text-blue-500 fill-blue-500" />} label="Max Mana" oldVal="100" newVal="110" color="text-emerald-500" />
          <div className="w-full h-px bg-slate-100" />
          <StatRow icon={<Star className="w-6 h-6 text-yellow-500 fill-yellow-500" />} label="XP Gain" oldVal="+0%" newVal="+10%" color="text-emerald-500" />
          
          <div className="pt-6 text-center">
            <div className="bg-white rounded-2xl py-3 px-4 shadow-sm border border-slate-50">
              <span className="text-sm font-bold text-slate-400">"Progress looks good on you."</span>
            </div>
          </div>
        </motion.div>

        {/* Action */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="w-full"
        >
          <Link href="/" className="flex items-center justify-center w-full py-5 bg-gradient-to-b from-[#fde047] to-[#eab308] hover:from-[#fef08a] hover:to-[#facc15] text-[#713f12] rounded-[24px] font-black text-xl shadow-[0_8px_0_#ca8a04,0_15px_20px_rgba(0,0,0,0.15)] active:translate-y-2 active:shadow-[0_0px_0_#ca8a04,0_0px_0px_rgba(0,0,0,0)] transition-all">
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
