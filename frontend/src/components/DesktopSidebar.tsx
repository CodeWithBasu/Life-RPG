"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Sword, CheckSquare, ShoppingBag, Backpack, BarChart2, Trophy, Settings } from "lucide-react";

export default function DesktopSidebar() {
  const pathname = usePathname();

  const navItems = [
    { name: "Dashboard", href: "/", icon: Home },
    { name: "Quests", href: "/quests", icon: Sword },
    { name: "Habits", href: "/habits", icon: CheckSquare },
    { name: "Shop", href: "/shop", icon: ShoppingBag },
    { name: "Inventory", href: "/inventory", icon: Backpack },
    { name: "Stats", href: "/stats", icon: BarChart2 },
    { name: "Achievements", href: "/achievements", icon: Trophy },
    { name: "Settings", href: "/more", icon: Settings },
  ];

  return (
    <aside className="w-[280px] bg-white text-slate-800 flex-shrink-0 flex-col hidden md:flex min-h-screen relative overflow-hidden border-r border-slate-200 z-20">
      
      {/* Logo */}
      <div className="pt-8 pb-6 px-8 text-[24px] font-black tracking-tight text-amber-500 flex items-center gap-2">
        <span className="text-[32px] drop-shadow-sm leading-none -mt-1">👑</span>
        Life RPG
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-4 relative z-10">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-4 py-3.5 px-5 rounded-2xl transition-all font-extrabold text-[15px] border-2 ${
                isActive
                  ? "bg-amber-50 text-amber-600 border-amber-300 shadow-[0_4px_0_0_#fcd34d] -translate-y-1"
                  : "bg-white text-slate-500 border-transparent hover:border-slate-200 hover:shadow-[0_4px_0_0_#e2e8f0] hover:-translate-y-1 hover:text-slate-700 hover:bg-slate-50"
              } active:translate-y-0 active:shadow-none`}
            >
              <Icon
                className={`w-6 h-6 ${
                  isActive ? "text-amber-500" : "text-slate-400"
                }`}
                strokeWidth={isActive ? 2.5 : 2}
              />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Footer Text */}
      <div className="p-8 pb-12 relative z-10 flex flex-col gap-6">
        <div className="text-slate-400 font-medium italic text-[15px] leading-snug">
          Discipline <br/>
          Builds <br/>
          Freedom
        </div>
        
        <div className="text-slate-300 font-bold text-[11px] leading-tight">
          Same You.<br/>A Stronger Tomorrow.
        </div>
      </div>

      {/* Decorative Castle Background in Sidebar */}
      <div className="absolute bottom-0 left-0 w-full h-[300px] opacity-[0.03] pointer-events-none bg-cover bg-bottom" style={{ backgroundImage: "url('/castle-bg.jpg')" }}></div>
    </aside>
  );
}
