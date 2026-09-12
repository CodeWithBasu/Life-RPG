"use client";

import { Bell, Settings } from "lucide-react";
import { usePathname } from "next/navigation";

export default function TopBar() {
  const pathname = usePathname();

  return (
    <header className="flex items-center justify-between px-6 py-4 bg-slate-50 relative z-50">
      <div className="flex items-center gap-2">
        <span className="text-3xl drop-shadow-sm">👑</span>
        <span className="text-[22px] font-extrabold text-amber-600 tracking-tight" style={{ textShadow: "0 1px 2px rgba(217,119,6,0.1)" }}>
          Life RPG
        </span>
      </div>
      
      {pathname === "/shop" ? (
        <div className="gel-bar-yellow px-4 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm border border-yellow-300/50">
          <div className="w-5 h-5 bg-yellow-600 rounded-full flex items-center justify-center shadow-inner">
             <svg className="w-3 h-3 fill-yellow-200 text-yellow-200" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
          </div>
          <span className="font-extrabold text-yellow-900 text-[13px]">1,240</span>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <button className="w-10 h-10 rounded-full bg-white shadow-soft flex items-center justify-center text-indigo-400 hover:text-indigo-600 transition-colors">
            <Bell className="w-5 h-5 fill-current" />
          </button>
          <button className="w-10 h-10 rounded-full bg-white shadow-soft flex items-center justify-center text-slate-500 hover:text-slate-700 transition-colors">
            <Settings className="w-5 h-5 fill-current" />
          </button>
        </div>
      )}
    </header>
  );
}
