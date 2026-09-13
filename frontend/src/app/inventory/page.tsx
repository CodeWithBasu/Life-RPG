"use client";

import { motion } from "framer-motion";
import { Backpack, Star, Shield, Sword } from "lucide-react";

export default function InventoryPage() {
  const items = [
    { id: 1, name: "Health Potion", type: "Consumable", icon: "❤️", qty: 5 },
    { id: 2, name: "Mana Potion", type: "Consumable", icon: "💧", qty: 3 },
    { id: 3, name: "Traveler's Cloak", type: "Gear", icon: "🎒", qty: 1 },
    { id: 4, name: "Wooden Sword", type: "Weapon", icon: "🗡️", qty: 1 },
  ];

  return (
    <div className="flex flex-col gap-6 p-5 max-w-6xl mx-auto w-full pb-24">
      <div className="px-2 mt-2">
        <h1 className="text-[28px] font-extrabold text-slate-800 flex items-center gap-3">
          <Backpack className="w-8 h-8 text-amber-500" /> Inventory
        </h1>
        <p className="text-[14px] text-slate-500 font-medium">Manage your hard-earned loot.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
        {items.map((item, i) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ y: -5 }}
            className="bg-white rounded-[24px] p-5 shadow-[0_8px_0_0_#f1f5f9] border-2 border-slate-100 flex flex-col items-center justify-center text-center cursor-pointer transition-transform"
          >
            <div className="text-[40px] drop-shadow-md mb-3">{item.icon}</div>
            <h3 className="font-extrabold text-slate-700 text-[15px]">{item.name}</h3>
            <span className="text-[12px] font-bold text-slate-400 mt-1">{item.type}</span>
            <div className="mt-4 bg-slate-100 text-slate-600 font-black text-[13px] px-3 py-1 rounded-full border border-slate-200 shadow-inner">
              x{item.qty}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
