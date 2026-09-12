"use client";

import { Bell, Settings, Crown } from "lucide-react";

export default function TopBar() {
  return (
    <header className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 bg-slate-50/80 backdrop-blur-md">
      <div className="flex items-center gap-2">
        <Crown className="w-6 h-6 text-yellow-500 fill-yellow-500" />
        <span className="text-xl font-extrabold text-slate-800 tracking-tight">Life RPG</span>
      </div>
      
      <div className="flex items-center gap-3">
        <button className="w-10 h-10 rounded-full bg-white shadow-soft flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors">
          <Bell className="w-5 h-5 fill-current" />
        </button>
        <button className="w-10 h-10 rounded-full bg-white shadow-soft flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors">
          <Settings className="w-5 h-5 fill-current" />
        </button>
      </div>
    </header>
  );
}
