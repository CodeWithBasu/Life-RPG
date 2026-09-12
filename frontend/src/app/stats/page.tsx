"use client";

import { motion } from "framer-motion";
import { Flame, Target, Award, Swords, Leaf, Heart } from "lucide-react";

export default function StatsPage() {
  return (
    <div className="flex flex-col gap-6 p-5 max-w-md mx-auto pb-24">
      
      {/* Header */}
      <div className="px-2 mt-2">
        <h1 className="text-[24px] font-extrabold text-slate-800">Your Stats</h1>
        <p className="text-[13px] text-slate-500 font-medium">Tracking your legendary journey.</p>
      </div>

      {/* Hero Stat: Level Circle */}
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-[32px] p-6 shadow-soft flex flex-col items-center justify-center relative overflow-hidden"
      >
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-yellow-100 rounded-full blur-2xl opacity-50"></div>
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-blue-100 rounded-full blur-2xl opacity-50"></div>

        <div className="relative w-40 h-40 mb-4">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="45" fill="none" stroke="#f1f5f9" strokeWidth="10" />
            <circle 
              cx="50" 
              cy="50" 
              r="45" 
              fill="none" 
              stroke="#eab308" 
              strokeWidth="10" 
              strokeLinecap="round" 
              strokeDasharray="282.7" 
              strokeDashoffset="100" 
              className="drop-shadow-sm"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-[40px] font-black text-slate-800 leading-none">12</span>
            <span className="text-[12px] font-bold text-slate-400 mt-1 uppercase tracking-wider">Level</span>
          </div>
        </div>

        <div className="flex flex-col items-center">
          <h2 className="text-[15px] font-extrabold text-slate-700">Novice Adventurer</h2>
          <div className="bg-slate-100 px-4 py-1.5 rounded-full mt-2">
             <span className="text-[12px] font-bold text-slate-500">320 / 500 XP to Level 13</span>
          </div>
        </div>
      </motion.div>

      {/* Streak Cards */}
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 gap-4"
      >
        <div className="bg-white rounded-[24px] p-4 shadow-soft flex flex-col items-center text-center">
          <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center mb-3">
            <Flame className="w-6 h-6 text-orange-500 fill-orange-500" />
          </div>
          <span className="text-[22px] font-black text-slate-800">5 Days</span>
          <span className="text-[11px] font-bold text-slate-400 mt-0.5">Current Streak</span>
        </div>

        <div className="bg-white rounded-[24px] p-4 shadow-soft flex flex-col items-center text-center">
          <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center mb-3">
            <Award className="w-6 h-6 text-indigo-500 fill-indigo-500" />
          </div>
          <span className="text-[22px] font-black text-slate-800">42</span>
          <span className="text-[11px] font-bold text-slate-400 mt-0.5">Quests Completed</span>
        </div>
      </motion.div>

      {/* Attributes List */}
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-[32px] p-5 shadow-soft flex flex-col gap-4"
      >
        <h3 className="text-[15px] font-extrabold text-slate-800 mb-1 px-1">Attribute Mastery</h3>
        
        <AttributeRow 
          icon={<Swords className="w-5 h-5 text-rose-500" />}
          iconBg="bg-rose-100"
          title="Discipline"
          level={4}
          progress={60}
          color="bg-rose-500"
        />
        
        <AttributeRow 
          icon={<Leaf className="w-5 h-5 text-emerald-500 fill-emerald-500" />}
          iconBg="bg-emerald-100"
          title="Growth"
          level={7}
          progress={30}
          color="bg-emerald-500"
        />
        
        <AttributeRow 
          icon={<Heart className="w-5 h-5 text-blue-500 fill-blue-500" />}
          iconBg="bg-blue-100"
          title="Kindness"
          level={5}
          progress={80}
          color="bg-blue-500"
        />
      </motion.div>

    </div>
  );
}

function AttributeRow({ icon, iconBg, title, level, progress, color }: any) {
  return (
    <div className="flex items-center gap-4">
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${iconBg}`}>
        {icon}
      </div>
      
      <div className="flex-1">
        <div className="flex justify-between items-end mb-1.5">
          <span className="text-[14px] font-extrabold text-slate-700">{title}</span>
          <span className="text-[11px] font-bold text-slate-400">Lv. {level}</span>
        </div>
        <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden shadow-inner-soft">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className={`h-full rounded-full ${color}`}
          />
        </div>
      </div>
    </div>
  );
}
