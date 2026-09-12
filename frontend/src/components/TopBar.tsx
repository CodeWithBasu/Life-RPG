"use client";

import { Bell, Settings } from "lucide-react";

export default function TopBar() {
  return (
    <header className="flex items-center justify-between px-6 py-4 bg-slate-50 relative z-50">
      <div className="flex items-center gap-2">
        <span className="text-3xl drop-shadow-sm">👑</span>
        <span className="text-[22px] font-extrabold text-amber-600 tracking-tight" style={{ textShadow: "0 1px 2px rgba(217,119,6,0.1)" }}>
          Life RPG
        </span>
      </div>
      
      <div className="flex items-center gap-2">
        <button className="w-10 h-10 rounded-full bg-white shadow-soft flex items-center justify-center text-indigo-400 hover:text-indigo-600 transition-colors">
          <Bell className="w-5 h-5 fill-current" />
        </button>
        <button className="w-10 h-10 rounded-full bg-white shadow-soft flex items-center justify-center text-slate-500 hover:text-slate-700 transition-colors">
          <Settings className="w-5 h-5 fill-current" />
        </button>
      </div>
    </header>
  );
}
