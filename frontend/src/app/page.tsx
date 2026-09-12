"use client";

import { motion } from "framer-motion";

export default function Home() {
  return (
    <div className="flex flex-col gap-5 p-5 max-w-md mx-auto">
      
      {/* Hero Card */}
      <motion.div 
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="w-full h-[220px] rounded-[32px] overflow-hidden relative shadow-soft"
      >
        <div 
          className="w-full h-full bg-no-repeat bg-cover"
          style={{ 
            backgroundImage: "url('/hero-card.png')",
            backgroundPosition: "center 15%" // Shifts the image up to crop out the TopBar
          }}
        />
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
