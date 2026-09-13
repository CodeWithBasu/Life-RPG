"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, LogOut } from "lucide-react";
import { useState } from "react";

export default function MorePage() {
  const [toastMessage, setToastMessage] = useState("");

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 2000);
  };

  return (
    <div className="flex flex-col gap-6 p-5 max-w-md mx-auto pb-32 relative">
      
      {/* Header */}
      <div className="px-2 mt-2">
        <h1 className="text-[24px] font-extrabold text-slate-800">Settings & More</h1>
        <p className="text-[13px] text-slate-500 font-medium">Manage your adventure.</p>
      </div>

      {/* Profile Summary */}
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => showToast("Opening Profile Editor...")}
        className="bg-white rounded-[32px] p-5 shadow-soft flex items-center gap-4 cursor-pointer"
      >
        <div className="w-16 h-16 rounded-full overflow-hidden border-[3px] border-slate-100 shadow-sm shrink-0 bg-slate-100">
           <img src="/avatar.jpg" alt="Avatar" className="w-full h-full object-cover" />
        </div>
        <div className="flex-1">
          <h2 className="text-[18px] font-extrabold text-slate-800 leading-tight">Basudev</h2>
          <p className="text-[12px] font-bold text-slate-400 mt-0.5">basudev@adventurer.com</p>
        </div>
        <button className="bg-slate-100 p-2 rounded-full text-slate-400">
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
          iconPath="/icons/account.jpg"
          title="Account Settings" 
          subtitle="Password, Security, Data"
          onClick={() => showToast("Account Settings clicked")}
        />
        <MenuRow 
          iconPath="/icons/bell.jpg"
          title="Notifications" 
          subtitle="Reminders, Updates, Streaks"
          onClick={() => showToast("Notifications clicked")}
        />
        <MenuRow 
          iconPath="/icons/gear.jpg"
          title="Game Preferences" 
          subtitle="Difficulty, Habit Goals"
          onClick={() => showToast("Game Preferences clicked")}
        />
        <MenuRow 
          iconPath="/icons/speaker.jpg"
          title="Sound & Haptics" 
          subtitle="BGM, Sound Effects"
          onClick={() => showToast("Sound Settings clicked")}
        />
        <MenuRow 
          iconPath="/icons/help.jpg"
          title="Help & Support" 
          subtitle="FAQ, Contact Us"
          onClick={() => showToast("Help & Support clicked")}
        />
      </motion.div>

      {/* Danger Zone */}
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="mt-2"
      >
        <motion.button 
          whileTap={{ scale: 0.95 }}
          onClick={() => showToast("Logging out...")}
          className="w-full bg-rose-500 rounded-[24px] p-4 flex items-center justify-center gap-2 text-white shadow-[0_8px_16px_-4px_rgba(244,63,94,0.3),inset_0_-4px_0_rgba(159,18,57,0.4)] hover:brightness-110 transition-all border border-rose-400"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-extrabold text-[16px]">Log Out</span>
        </motion.button>
        <p className="text-center text-[11px] font-bold text-slate-400 mt-5">Life RPG v1.0.0</p>
      </motion.div>

      {/* Custom Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-28 left-1/2 -translate-x-1/2 bg-slate-800 text-white px-6 py-3 rounded-full shadow-xl font-bold text-[13px] z-50 whitespace-nowrap border border-slate-700 flex items-center gap-2"
          >
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

function MenuRow({ iconPath, title, subtitle, onClick }: any) {
  return (
    <motion.div 
      whileTap={{ scale: 0.96 }}
      onClick={onClick}
      className="bg-white rounded-[24px] p-3 shadow-soft flex items-center gap-4 cursor-pointer hover:bg-slate-50 transition-colors"
    >
      <div className="w-14 h-14 flex items-center justify-center shrink-0">
        <img src={iconPath} className="w-full h-full object-contain mix-blend-multiply" alt={title} />
      </div>
      <div className="flex-1">
        <h3 className="text-[15px] font-extrabold text-slate-800 leading-tight">{title}</h3>
        <p className="text-[11px] font-bold text-slate-400 mt-0.5">{subtitle}</p>
      </div>
      <ChevronRight className="w-5 h-5 text-slate-300 mr-2" />
    </motion.div>
  );
}
