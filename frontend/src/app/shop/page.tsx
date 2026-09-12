"use client";

import { motion } from "framer-motion";
import { Star, Backpack, BookOpen, Flame, Clover, Dog, Shield } from "lucide-react";

export default function ShopPage() {
  return (
    <div className="flex flex-col gap-6 p-4">
      
      {/* Top Bar / Currency */}
      <div className="flex justify-between items-center bg-white rounded-full p-1.5 shadow-soft">
        <div className="flex gap-2 w-full max-w-[200px]">
          {["All", "Gear", "Boosts", "Cosmetics"].map((tab, i) => (
            <button
              key={tab}
              className={`text-[10px] font-bold px-3 py-1.5 rounded-full transition-colors ${
                i === 0 ? "bg-slate-800 text-white" : "text-slate-400 hover:text-slate-600"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="bg-yellow-100 px-4 py-1.5 rounded-full flex items-center gap-2">
          <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
          <span className="font-bold text-slate-800 text-sm">1,240</span>
        </div>
      </div>

      {/* Banner */}
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full bg-gradient-to-r from-blue-400 to-indigo-400 rounded-[32px] p-6 shadow-soft relative overflow-hidden text-center flex flex-col items-center justify-center min-h-[140px]"
      >
        <div className="absolute inset-0 bg-white/10 [mask-image:linear-gradient(to_bottom,white,transparent)]"></div>
        <h2 className="text-xl font-black text-white relative z-10 drop-shadow-sm">
          Better Habits<br/>Better Adventures
        </h2>
        <p className="text-xs text-blue-100 relative z-10 mt-1 font-medium">Invest in the you you're becoming.</p>
      </motion.div>

      {/* Grid */}
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 gap-4"
      >
        <ShopItem 
          icon={<Backpack className="w-10 h-10 text-amber-700 fill-amber-600" />}
          iconBg="bg-amber-100"
          title="Traveler's Cloak"
          buff="+1 Quest Slot"
          price={500}
        />
        <ShopItem 
          icon={<Shield className="w-10 h-10 text-indigo-700 fill-indigo-600" />}
          iconBg="bg-indigo-100"
          title="Focus Hood"
          buff="+10 Focus"
          price={300}
        />
        <ShopItem 
          icon={<BookOpen className="w-10 h-10 text-rose-700 fill-rose-600" />}
          iconBg="bg-rose-100"
          title="Scholar's Tome"
          buff="+10 XP Gain"
          price={400}
        />
        <ShopItem 
          icon={<Flame className="w-10 h-10 text-orange-500 fill-orange-400" />}
          iconBg="bg-orange-100"
          title="Lantern of Clarity"
          buff="+10 Mana Regen"
          price={350}
        />
        <ShopItem 
          icon={<Clover className="w-10 h-10 text-emerald-600 fill-emerald-500" />}
          iconBg="bg-emerald-100"
          title="Lucky Charm"
          buff="+5% XP Gain"
          price={250}
        />
        <ShopItem 
          icon={<Dog className="w-10 h-10 text-orange-400 fill-orange-300" />}
          iconBg="bg-orange-50"
          title="Companion"
          buff="A friend for the journey"
          price={600}
        />
      </motion.div>

    </div>
  );
}

function ShopItem({ icon, iconBg, title, buff, price }: any) {
  return (
    <div className="bg-white rounded-[24px] p-4 shadow-soft flex flex-col items-center text-center">
      <div className={`w-20 h-20 rounded-2xl flex items-center justify-center mb-3 shadow-inner-soft ${iconBg}`}>
        {icon}
      </div>
      <h3 className="text-sm font-bold text-slate-800 leading-tight">{title}</h3>
      <p className="text-[10px] text-slate-400 mt-1 mb-4 h-6 flex items-center justify-center">{buff}</p>
      
      <button className="w-full py-2 bg-yellow-100 hover:bg-yellow-200 text-yellow-800 rounded-xl font-bold text-xs flex items-center justify-center gap-1 transition-colors">
        <Star className="w-3 h-3 fill-yellow-600 text-yellow-600" />
        {price}
      </button>
    </div>
  );
}
