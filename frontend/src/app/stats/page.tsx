"use client";

import { motion } from "framer-motion";

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
            <motion.circle 
              initial={{ strokeDashoffset: 282.7 }}
              animate={{ strokeDashoffset: 100 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              cx="50" 
              cy="50" 
              r="45" 
              fill="none" 
              stroke="#eab308" 
              strokeWidth="10" 
              strokeLinecap="round" 
              strokeDasharray="282.7" 
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
          <motion.div 
            animate={{ y: [-2, 2, -2] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-16 h-16 flex items-center justify-center mb-1"
          >
            <img src="/icons/flame.jpg" className="w-full h-full object-contain mix-blend-multiply" alt="Flame" />
          </motion.div>
          <span className="text-[22px] font-black text-slate-800">5 Days</span>
          <span className="text-[11px] font-bold text-slate-400 mt-0.5">Current Streak</span>
        </div>

        <div className="bg-white rounded-[24px] p-4 shadow-soft flex flex-col items-center text-center">
          <motion.div 
            animate={{ scale: [1, 1.05, 1], rotate: [-2, 2, -2] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            className="w-16 h-16 flex items-center justify-center mb-1"
          >
            <img src="/icons/trophy.jpg" className="w-full h-full object-contain mix-blend-multiply" alt="Trophy" />
          </motion.div>
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
          iconPath="/icons/sword.jpg"
          title="Discipline"
          level={4}
          progress={60}
          color="bg-rose-500"
          delay={0}
        />
        
        <AttributeRow 
          iconPath="/icons/leaf.jpg"
          title="Growth"
          level={7}
          progress={30}
          color="bg-emerald-500"
          delay={0.2}
        />
        
        <AttributeRow 
          iconPath="/icons/sun.jpg"
          title="Positivity"
          level={5}
          progress={80}
          color="bg-yellow-400"
          delay={0.4}
        />
      </motion.div>

    </div>
  );
}

function AttributeRow({ iconPath, title, level, progress, color, delay }: any) {
  return (
    <div className="flex items-center gap-4">
      <motion.div 
        animate={{ rotate: [-5, 5, -5] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: delay }}
        className="w-14 h-14 flex items-center justify-center shrink-0"
      >
        <img src={iconPath} className="w-full h-full object-contain mix-blend-multiply" alt={title} />
      </motion.div>
      
      <div className="flex-1">
        <div className="flex justify-between items-end mb-1.5">
          <span className="text-[14px] font-extrabold text-slate-700">{title}</span>
          <span className="text-[11px] font-bold text-slate-400">Lv. {level}</span>
        </div>
        <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden shadow-inner-soft relative">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1, ease: "easeOut", delay: delay }}
            className={`absolute top-0 left-0 bottom-0 rounded-full ${color} shadow-sm`}
          />
        </div>
      </div>
    </div>
  );
}
