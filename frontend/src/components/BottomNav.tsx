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
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-lg border-t border-slate-100 pb-safe shadow-[0_-10px_40px_rgba(0,0,0,0.03)] rounded-t-3xl md:max-w-md md:mx-auto">
      <div className="flex justify-around items-center px-2 py-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`relative flex flex-col items-center justify-center gap-1 w-[72px] h-[64px] rounded-2xl transition-all ${
                isActive ? "bg-yellow-100" : ""
              }`}
            >
              <Icon 
                className={`w-6 h-6 transition-colors ${
                  isActive ? "text-yellow-600 fill-yellow-600" : "text-slate-400"
                }`} 
              />
              <span className={`text-[10px] font-bold ${
                isActive ? "text-yellow-700" : "text-slate-400"
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
