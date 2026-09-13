"use client";

import { motion } from "framer-motion";
import { User, Bell, Sliders, HelpCircle, LogOut, ChevronRight, Moon, Volume2 } from "lucide-react";

export default function MorePage() {
  return (
    <div className="flex flex-col gap-6 p-5 max-w-md mx-auto pb-24">
      
      {/* Header */}
      <div className="px-2 mt-2">
        <h1 className="text-[24px] font-extrabold text-slate-800">Settings & More</h1>
        <p className="text-[13px] text-slate-500 font-medium">Manage your adventure.</p>
      </div>

      {/* Profile Summary */}
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-[32px] p-5 shadow-soft flex items-center gap-4"
      >
        <div className="w-16 h-16 rounded-full overflow-hidden border-[3px] border-slate-100 shadow-sm shrink-0 bg-slate-100">
           <img src="/avatar.jpg" alt="Avatar" className="w-full h-full object-cover" />
        </div>
        <div className="flex-1">
          <h2 className="text-[18px] font-extrabold text-slate-800 leading-tight">Basudev</h2>
          <p className="text-[12px] font-bold text-slate-400 mt-0.5">basudev@adventurer.com</p>
        </div>
        <button className="bg-slate-100 p-2 rounded-full text-slate-400 hover:text-slate-600 transition-colors">
          <ChevronRight className="w-5 h-5" />
        </button>
      </motion.div>

      {/* Settings Menu List */}
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col gap-3"
      >
        <MenuRow 
          icon={<User className="w-5 h-5 text-blue-500" />} 
          iconBg="bg-blue-100" 
          title="Account Settings" 
          subtitle="Password, Security, Data"
        />
        <MenuRow 
          icon={<Bell className="w-5 h-5 text-orange-500" />} 
          iconBg="bg-orange-100" 
          title="Notifications" 
          subtitle="Reminders, Updates, Streaks"
        />
        <MenuRow 
          icon={<Sliders className="w-5 h-5 text-indigo-500" />} 
          iconBg="bg-indigo-100" 
          title="Game Preferences" 
          subtitle="Difficulty, Habit Goals"
        />
        <MenuRow 
          icon={<Volume2 className="w-5 h-5 text-emerald-500" />} 
          iconBg="bg-emerald-100" 
          title="Sound & Haptics" 
          subtitle="BGM, Sound Effects"
        />
        <MenuRow 
          icon={<HelpCircle className="w-5 h-5 text-purple-500" />} 
          iconBg="bg-purple-100" 
          title="Help & Support" 
          subtitle="FAQ, Contact Us"
        />
      </motion.div>

      {/* Danger Zone */}
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="mt-2"
      >
        <button className="w-full bg-white rounded-[24px] p-4 shadow-soft flex items-center justify-center gap-2 text-rose-500 hover:bg-rose-50 transition-colors group border border-transparent hover:border-rose-100">
          <LogOut className="w-5 h-5" />
          <span className="font-extrabold text-[15px]">Log Out</span>
        </button>
        <p className="text-center text-[11px] font-bold text-slate-400 mt-4">Life RPG v1.0.0</p>
      </motion.div>

    </div>
  );
}

function MenuRow({ icon, iconBg, title, subtitle }: any) {
  return (
    <div className="bg-white rounded-[24px] p-4 shadow-soft flex items-center gap-4 cursor-pointer hover:bg-slate-50 transition-colors">
      <div className={`w-12 h-12 rounded-[18px] flex items-center justify-center shrink-0 ${iconBg}`}>
        {icon}
      </div>
      <div className="flex-1">
        <h3 className="text-[15px] font-extrabold text-slate-800 leading-tight">{title}</h3>
        <p className="text-[11px] font-bold text-slate-400 mt-0.5">{subtitle}</p>
      </div>
      <ChevronRight className="w-5 h-5 text-slate-300" />
    </div>
  );
}
