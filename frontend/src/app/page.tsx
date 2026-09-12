"use client";

import { motion } from "framer-motion";

export default function Home() {
  return (
    <div className="flex flex-col gap-5 p-5 max-w-md mx-auto">
      
      {/* Hero Card */}
      <motion.div 
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white rounded-[36px] shadow-soft overflow-hidden relative flex flex-col"
      >
        {/* Background Scenery (Sky & Castle representation) */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-sky-200 to-sky-100 z-0">
          <div className="absolute bottom-0 right-4 w-16 h-16 bg-white/40 rounded-tl-full rounded-tr-full blur-sm"></div>
          <div className="absolute bottom-0 right-16 w-24 h-12 bg-white/30 rounded-tl-full rounded-tr-full blur-sm"></div>
        </div>

        <div className="relative z-10 flex pt-6 pb-4 px-4 h-[180px]">
          {/* Avatar Area */}
          <div className="relative w-[130px] h-[140px] shrink-0 self-end -mb-4">
            <div className="w-full h-full bg-slate-200 rounded-[28px] overflow-hidden border-4 border-white shadow-sm relative flex items-end justify-center pb-2 bg-gradient-to-t from-slate-300 to-slate-100">
              <span className="text-7xl">🧑‍🚀</span>
            </div>
            {/* Level Badge */}
            <div className="absolute -bottom-1 -right-2 bg-slate-800 text-yellow-400 text-xs font-black px-3 py-1 rounded-full border-[3px] border-yellow-500 shadow-md">
              Lv. 12
            </div>
          </div>
          
          {/* Text Area */}
          <div className="flex-1 pl-4 flex flex-col justify-center pt-8">
            <h2 className="text-[17px] font-extrabold text-slate-800 leading-tight">A Brighter You</h2>
            <p className="text-[11px] text-slate-500 mt-1 leading-snug font-medium">
              "Small steps today, legendary tomorrow."
            </p>
          </div>
        </div>
      </motion.div>

      {/* Progress Bars Container */}
      <motion.div 
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-[32px] p-5 shadow-soft flex flex-col gap-5"
      >
        <ProgressBar icon="❤️" label="HP" colorClass="gel-bar-red" current={70} max={100} />
        
        {/* Divider */}
        <div className="h-px w-full bg-slate-100"></div>
        
        <ProgressBar icon="💧" label="Mana" colorClass="gel-bar-blue" current={60} max={100} />
        
        {/* Divider */}
        <div className="h-px w-full bg-slate-100"></div>
        
        <ProgressBar icon="⭐" label="Mastery XP" colorClass="gel-bar-yellow" current={320} max={500} />
      </motion.div>

      {/* Attributes */}
      <motion.div 
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-[32px] p-4 shadow-soft grid grid-cols-3 divide-x divide-slate-100"
      >
        <AttributeItem icon="🗡️" label="Discipline" />
        <AttributeItem icon="🍃" label="Growth" />
        <AttributeItem icon="💖" label="Kindness" />
      </motion.div>

      {/* Today's Focus */}
      <motion.div 
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-[28px] p-5 shadow-soft flex gap-4 items-center"
      >
        <div className="text-3xl shrink-0 drop-shadow-sm">☀️</div>
        <div>
          <h3 className="text-[15px] font-bold text-slate-800">Today's Focus</h3>
          <p className="text-[13px] text-slate-500 mt-0.5">Show up. You've got this.</p>
        </div>
      </motion.div>

    </div>
  );
}

function ProgressBar({ icon, label, colorClass, current, max }: any) {
  const percent = (current / max) * 100;
  return (
    <div className="flex items-center gap-3">
      <div className="text-2xl shrink-0 drop-shadow-sm">{icon}</div>
      <span className="text-sm font-bold text-slate-700 w-[72px] shrink-0">{label}</span>
      
      <div className="flex-1 h-5 bg-slate-100/80 rounded-full overflow-hidden shadow-inner-soft p-0.5 flex">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className={`h-full rounded-full ${colorClass}`}
        />
      </div>
      
      <span className="text-xs font-bold text-slate-500 w-[60px] text-right shrink-0">{current} / {max}</span>
    </div>
  );
}

function AttributeItem({ icon, label }: any) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-2">
      <div className="text-3xl drop-shadow-md">
        {icon}
      </div>
      <span className="text-[12px] font-bold text-slate-800 capitalize">{label}</span>
    </div>
  );
}
