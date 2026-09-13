"use client";

import { useEffect, useState } from "react";
import { Star, Moon, Sun, User as UserIcon } from "lucide-react";
import Link from "next/link";
import { useAuthStore } from "@/store/authStore";
import { useTheme } from "@/components/ThemeProvider";

export default function TopBar() {
  const ensureAuthenticated = useAuthStore((state) => state.ensureAuthenticated);
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const currencyBalance = useAuthStore((state) => state.user?.character?.currencyBalance);
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    ensureAuthenticated();
    if (localStorage.getItem("theme") === "system") {
      setTheme("light");
    }
  }, [ensureAuthenticated, setTheme]);

  const displayCurrency = (currencyBalance ?? 1240).toLocaleString();
  const avatarUrl = user?.avatarUrl || "/avatars/paladin.jpg";
  const isEmojiAvatar = avatarUrl && !avatarUrl.startsWith("/") && !avatarUrl.startsWith("http");

  return (
    <header className="flex items-center justify-between px-6 py-4 bg-[#f8fafc] dark:bg-[#13112a] relative z-50 transition-colors duration-300">
      <Link href="/" className="flex items-center gap-2">
        <span className="text-3xl drop-shadow-sm">👑</span>
        <span
          className="text-[22px] font-extrabold text-amber-500 tracking-tight"
          style={{ textShadow: "0 1px 2px rgba(217,119,6,0.1)" }}
        >
          Life RPG
        </span>
      </Link>

      <div className="flex items-center gap-2.5">
        <Link
          href="/shop"
          className="gel-bar-yellow text-yellow-900 font-extrabold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm border border-amber-200/50 hover:scale-105 active:scale-95 transition-transform cursor-pointer"
        >
          <div className="w-5 h-5 bg-amber-500 rounded-full flex items-center justify-center shadow-inner">
            <Star className="w-3 h-3 fill-amber-100 text-amber-100" />
          </div>
          <span className="text-sm font-black">{displayCurrency}</span>
        </Link>

        {mounted && (
          <button
            onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
            className="w-9 h-9 rounded-full bg-slate-200 dark:bg-indigo-900/50 flex items-center justify-center text-slate-500 dark:text-indigo-300 hover:bg-slate-300 dark:hover:bg-indigo-800 transition-colors cursor-pointer"
            title="Toggle theme"
          >
            {resolvedTheme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        )}

        {/* Profile / Auth Pill */}
        {isAuthenticated && user ? (
          <Link
            href="/more"
            className="w-9 h-9 rounded-full overflow-hidden border-2 border-amber-300 hover:border-amber-400 shadow-sm flex items-center justify-center bg-slate-100 dark:bg-indigo-950 text-sm hover:scale-105 active:scale-95 transition-transform cursor-pointer"
            title={`Hero Profile: ${user.displayName}`}
          >
            {isEmojiAvatar ? (
              <span className="text-lg">{avatarUrl}</span>
            ) : (
              <img src={avatarUrl} alt={user.displayName} className="w-full h-full object-cover" />
            )}
          </Link>
        ) : (
          <Link
            href="/login"
            className="text-xs font-black px-3.5 py-1.5 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 text-amber-950 hover:brightness-105 shadow-sm transition-all"
          >
            Log In
          </Link>
        )}
      </div>
    </header>
  );
}
