"use client";

import { motion } from "framer-motion";
import { Heart, Droplet, Star, Sword, Sprout, HeartHandshake, Sun } from "lucide-react";
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col gap-6 p-4">
      
      {/* Hero Card */}
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white rounded-[32px] p-6 shadow-soft relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50/50 rounded-full blur-2xl -mr-10 -mt-10"></div>
        
        <div className="flex items-center gap-4 relative z-10">
          <div className="relative">
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-indigo-100 to-blue-50 border-2 border-white shadow-inner flex items-center justify-center overflow-hidden">
              <span className="text-4xl">🧑‍🚀</span>
            </div>
            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-yellow-400 text-yellow-900 text-xs font-black px-3 py-1 rounded-full border-2 border-white shadow-soft whitespace-nowrap">
              Lv. 12
            </div>
          </div>
          
          <div className="flex-1">
            <h2 className="text-lg font-bold text-slate-800">A Brighter You</h2>
            <p className="text-xs text-slate-500 italic mt-1 leading-snug">
              "Small steps today, legendary tomorrow."
            </p>
          </div>
        </div>
      </motion.div>

      {/* Progress Bars */}
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-[32px] p-6 shadow-soft space-y-5"
      >
        <ProgressBar icon={<Heart className="w-4 h-4 fill-current text-white" />} iconBg="bg-rose-400" label="HP" color="from-rose-400 to-rose-300" current={70} max={100} />
        <ProgressBar icon={<Droplet className="w-4 h-4 fill-current text-white" />} iconBg="bg-blue-400" label="Mana" color="from-blue-400 to-blue-300" current={60} max={100} />
        <ProgressBar icon={<Star className="w-4 h-4 fill-current text-white" />} iconBg="bg-yellow-400" label="Mastery XP" color="from-yellow-400 to-yellow-300" current={320} max={500} />
      </motion.div>

      {/* Attributes */}
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-[32px] p-6 shadow-soft grid grid-cols-3 gap-4"
      >
        <AttributeItem icon={<Sword className="w-6 h-6 text-indigo-500" />} label="Discipline" />
        <AttributeItem icon={<Sprout className="w-6 h-6 text-emerald-500" />} label="Growth" />
        <AttributeItem icon={<HeartHandshake className="w-6 h-6 text-rose-400" />} label="Kindness" />
      </motion.div>

      {/* Today's Focus */}
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-[32px] p-6 shadow-soft flex gap-4 items-center"
      >
        <div className="w-12 h-12 rounded-2xl bg-yellow-100 flex items-center justify-center shrink-0">
          <Sun className="w-6 h-6 text-yellow-500 fill-yellow-500" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-slate-800">Today's Focus</h3>
          <p className="text-xs text-slate-500 mt-1">Show up. You've got this.</p>
        </div>
      </motion.div>

    </div>
  );
}

function ProgressBar({ icon, iconBg, label, color, current, max }: any) {
  const percent = (current / max) * 100;
  return (
    <div className="flex items-center gap-3">
      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${iconBg} shadow-sm`}>
        {icon}
      </div>
      <span className="text-sm font-bold text-slate-700 w-16">{label}</span>
      <div className="flex-1 h-3.5 bg-slate-100 rounded-full overflow-hidden shadow-inner-soft relative">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className={`absolute top-0 left-0 h-full rounded-full bg-gradient-to-r ${color}`}
        />
      </div>
      <span className="text-xs font-bold text-slate-400 w-12 text-right">{current}/{max}</span>
    </div>
  );
}

function AttributeItem({ icon, label }: any) {
  return (
    <div className="flex flex-col items-center justify-center gap-2">
      <div className="w-12 h-12 rounded-2xl bg-slate-50 shadow-soft border border-slate-100 flex items-center justify-center">
        {icon}
      </div>
      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{label}</span>
    </div>
  );
}
