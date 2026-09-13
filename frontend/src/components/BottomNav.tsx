"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, CheckSquare, ShoppingBag, BarChart2, MoreHorizontal } from "lucide-react";
import { motion } from "framer-motion";

export default function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    { name: "Home", href: "/", icon: Home },
    { name: "Quests", href: "/quests", icon: CheckSquare },
    { name: "Shop", href: "/shop", icon: ShoppingBag },
    { name: "Stats", href: "/stats", icon: BarChart2 },
    { name: "More", href: "/more", icon: MoreHorizontal },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/90 dark:bg-[#1a1740]/95 backdrop-blur-lg border-t border-slate-100 dark:border-[#2e2959] pb-safe shadow-[0_-10px_40px_rgba(0,0,0,0.03)] dark:shadow-none rounded-t-3xl md:max-w-md md:mx-auto transition-colors duration-300">
      <div className="flex justify-around items-center px-2 py-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`relative flex flex-col items-center justify-center gap-1 w-[72px] h-[64px] rounded-2xl transition-all ${
                isActive ? "bg-yellow-100 dark:bg-amber-500/20" : ""
              }`}
            >
              <Icon 
                className={`w-6 h-6 transition-colors ${
                  isActive ? "text-yellow-600 dark:text-amber-400 fill-yellow-600 dark:fill-amber-400/50" : "text-slate-400 dark:text-indigo-300/70"
                }`} 
              />
              <span className={`text-[10px] font-bold ${
                isActive ? "text-yellow-700 dark:text-amber-400" : "text-slate-400 dark:text-indigo-300/70"
              }`}>
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
