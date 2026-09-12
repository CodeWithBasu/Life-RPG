"use client";

import { motion } from "framer-motion";
import { Sun, Book, Dumbbell, Apple, Sprout, ChevronRight } from "lucide-react";
import { useState } from "react";

export default function QuestsPage() {
  const [activeTab, setActiveTab] = useState("Active");
  
  return (
    <div className="flex flex-col gap-6 p-4">
      
      {/* Tabs */}
      <div className="flex items-center justify-between bg-white rounded-full p-1.5 shadow-soft">
        {["Active", "Completed", "All"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2 text-sm font-bold rounded-full transition-colors ${
              activeTab === tab 
                ? "bg-yellow-400 text-yellow-900 shadow-sm" 
                : "text-slate-400 hover:text-slate-600"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Header */}
      <div className="flex items-center justify-between px-2 mt-2">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Quest Log</h1>
          <p className="text-sm text-slate-500">Small steps. Big adventures.</p>
        </div>
        <button className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 hover:bg-slate-200 transition-colors">
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Quests List */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-4"
      >
        <QuestCard 
          icon={<Sun className="w-6 h-6 text-yellow-500 fill-yellow-500" />}
          iconBg="bg-yellow-100"
          title="Morning Routine"
          desc="Set the tone for a legendary day."
          xp={50}
          checked={false}
        />
        
        <QuestCard 
          icon={<Book className="w-6 h-6 text-blue-500 fill-blue-500" />}
          iconBg="bg-blue-100"
          title="Study Something"
          desc="A sharper mind, a brighter you."
          xp={75}
          checked={true}
        />

        <QuestCard 
          icon={<Dumbbell className="w-6 h-6 text-indigo-500 fill-indigo-500" />}
          iconBg="bg-indigo-100"
          title="Move Your Body"
          desc="Stronger today. Further tomorrow."
          xp={50}
          checked={false}
        />

        <QuestCard 
          icon={<Apple className="w-6 h-6 text-rose-500 fill-rose-500" />}
          iconBg="bg-rose-100"
          title="Healthy Meal"
          desc="Fuel your adventure."
          xp={40}
          checked={false}
        />

        <QuestCard 
          icon={<Sprout className="w-6 h-6 text-emerald-500 fill-emerald-500" />}
          iconBg="bg-emerald-100"
          title="Be Kind"
          desc="Make someone's day brighter."
          xp={30}
          checked={false}
        />
      </motion.div>
      
    </div>
  );
}

function QuestCard({ icon, iconBg, title, desc, xp, checked }: any) {
  return (
    <motion.div 
      whileTap={{ scale: 0.98 }}
      className={`bg-white rounded-[24px] p-4 shadow-soft flex items-center gap-4 transition-opacity ${checked ? 'opacity-60' : 'opacity-100'}`}
    >
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-inner-soft ${iconBg}`}>
        {icon}
      </div>
      
      <div className="flex-1">
        <h3 className={`text-base font-bold text-slate-800 ${checked ? 'line-through text-slate-500' : ''}`}>
          {title}
        </h3>
        <p className="text-xs text-slate-400 mt-0.5">{desc}</p>
        
        <div className="flex items-center gap-2 mt-3">
          <div className="flex items-center gap-2">
            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${checked ? 'bg-yellow-400 border-yellow-400' : 'border-slate-300'}`}>
              {checked && <div className="w-2.5 h-2.5 rounded-full bg-white" />}
            </div>
            <span className="text-xs font-bold text-slate-400">{checked ? '1/1' : '0/1'}</span>
          </div>
        </div>
      </div>
      
      <div className="shrink-0 flex self-end">
        <div className="bg-yellow-100 text-yellow-700 text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1 shadow-sm">
          <StarIcon className="w-3 h-3 fill-yellow-500 text-yellow-500" />
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
