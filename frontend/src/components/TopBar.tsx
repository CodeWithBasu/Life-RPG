"use client";

import { Star, Moon, Sun } from "lucide-react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function TopBar() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Force reset if their browser cached 'system' from earlier
    if (localStorage.getItem('theme') === 'system') {
      setTheme('light');
    }
  }, [setTheme]);

  return (
    <header className="flex items-center justify-between px-6 py-4 bg-[#f8fafc] dark:bg-[#13112a] relative z-50 transition-colors duration-300">
      <div className="flex items-center gap-2">
        <span className="text-3xl drop-shadow-sm">👑</span>
        <span className="text-[22px] font-extrabold text-amber-500 tracking-tight" style={{ textShadow: "0 1px 2px rgba(217,119,6,0.1)" }}>
          Life RPG
        </span>
      </div>
      <div className="flex items-center gap-3">
        <Link href="/shop" className="gel-bar-yellow text-yellow-900 font-extrabold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm border border-amber-200/50 hover:scale-105 active:scale-95 transition-transform cursor-pointer">
          <div className="w-5 h-5 bg-amber-500 rounded-full flex items-center justify-center shadow-inner">
            <Star className="w-3 h-3 fill-amber-100 text-amber-100" />
          </div>
          <span className="text-sm">1,240</span>
        </Link>
        {mounted && (
          <button
            onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
            className="w-9 h-9 rounded-full bg-slate-200 dark:bg-indigo-900/50 flex items-center justify-center text-slate-500 dark:text-indigo-300 hover:bg-slate-300 dark:hover:bg-indigo-800 transition-colors"
          >
            {resolvedTheme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        )}
      </div>
    </header>
  );
}

