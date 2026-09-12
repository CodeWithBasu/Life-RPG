"use client";

import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { useState } from "react";

export default function QuestsPage() {
  const [activeTab, setActiveTab] = useState("Active");
  
  return (
    <div className="flex flex-col gap-5 p-5 max-w-md mx-auto pb-24">
      
      {/* Tabs */}
      <div className="flex items-center justify-between bg-white rounded-full p-1.5 shadow-soft">
        {["Active", "Completed", "All"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2.5 text-[13px] font-bold rounded-full transition-all ${
              activeTab === tab 
                ? "gel-bar-yellow text-yellow-900 shadow-md" 
                : "text-slate-400 hover:text-slate-600"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Header */}
      <div className="flex items-center justify-between px-1 mt-1">
        <div>
          <h1 className="text-[22px] font-extrabold text-[#1e293b]">Quest Log</h1>
          <p className="text-[13px] text-slate-500 font-medium mt-0.5">Small steps. Big adventures.</p>
        </div>
        <button className="text-yellow-500 hover:text-yellow-600 transition-colors">
          <ChevronRight className="w-6 h-6 stroke-[3]" />
        </button>
      </div>

      {/* Quests List */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-3.5"
      >
        <QuestCard 
          iconPath="/icons/sun.jpg"
          title="Morning Routine"
          desc="Set the tone for a legendary day."
          xp={50}
          checked={false}
        />
        
        <QuestCard 
          iconPath="/icons/book.jpg"
          title="Study Something"
          desc="A sharper mind, a brighter you."
          xp={75}
          checked={true}
        />

        <QuestCard 
          iconPath="/icons/dumbbell.jpg"
          title="Move Your Body"
          desc="Stronger today. Further tomorrow."
          xp={50}
          checked={false}
        />

        <QuestCard 
          iconPath="/icons/apple.jpg"
          title="Healthy Meal"
          desc="Fuel your adventure."
          xp={40}
          checked={false}
        />

        <QuestCard 
          iconPath="/icons/leaf.jpg"
          title="Be Kind"
          desc="Make someone's day brighter."
          xp={30}
          checked={false}
        />
      </motion.div>
      
    </div>
  );
}

function QuestCard({ iconPath, title, desc, xp, checked }: any) {
  return (
    <motion.div 
      whileTap={{ scale: 0.98 }}
      className={`bg-white rounded-[28px] p-4 shadow-soft flex items-center gap-4 transition-opacity ${checked ? 'opacity-80' : 'opacity-100'}`}
    >
      {/* 3D Generated Icon */}
      <div className="w-14 h-14 flex items-center justify-center shrink-0">
        <img 
          src={iconPath} 
          alt={title} 
          className="w-14 h-14 object-contain mix-blend-multiply"
        />
      </div>
      
      <div className="flex-1 min-w-0 pr-2">
        <h3 className={`text-[15px] font-extrabold text-[#1e293b] truncate ${checked ? 'text-slate-500' : ''}`}>
          {title}
        </h3>
        <p className="text-[11px] text-slate-400 mt-0.5 font-medium truncate">{desc}</p>
        
        <div className="flex items-center gap-1.5 mt-2.5">
          {checked ? (
             <div className="w-[18px] h-[18px] rounded-full bg-yellow-400 flex items-center justify-center shadow-inner-soft">
               <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="4"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"></path></svg>
             </div>
          ) : (
             <div className="w-[18px] h-[18px] rounded-full border-2 border-slate-300"></div>
          )}
          <span className={`text-[12px] font-bold ${checked ? 'text-slate-600' : 'text-slate-400'}`}>
            {checked ? '1 / 1' : '0 / 1'}
          </span>
        </div>
      </div>
      
      {/* XP Gel Pill */}
      <div className="shrink-0 flex self-end mb-1">
        <div className="gel-bar-yellow text-yellow-900 text-[11px] font-extrabold pl-1.5 pr-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-md border border-yellow-300/50">
          <div className="w-5 h-5 bg-yellow-600 rounded-full flex items-center justify-center shadow-inner">
             <StarIcon className="w-2.5 h-2.5 fill-yellow-200 text-yellow-200" />
          </div>
          +{xp} XP
        </div>
      </div>
    </motion.div>
  );
}

function StarIcon(props: any) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}
