"use client";

import { motion } from "framer-motion";
import { useState } from "react";

export default function ShopPage() {
  const [activeTab, setActiveTab] = useState("All");

  return (
    <div className="flex flex-col gap-5 p-5 max-w-md mx-auto pb-24">
      
      {/* Tabs */}
      <div className="flex gap-2">
        {["All", "Gear", "Boosts", "Cosmetics"].map((tab, i) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`text-[12px] font-bold px-4 py-2 rounded-full transition-all shadow-sm ${
              activeTab === tab 
                ? "gel-bar-yellow text-yellow-900" 
                : "bg-white text-slate-500 hover:text-slate-700"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Banner */}
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full h-[150px] bg-cover bg-center rounded-[28px] shadow-soft relative overflow-hidden text-center flex flex-col items-center justify-start pt-5"
        style={{ backgroundImage: "url('/castle-bg.jpg')" }}
      >
        <div className="absolute inset-0 bg-white/40 backdrop-blur-[2px]"></div>
        <h2 className="text-[17px] font-extrabold text-[#1e293b] relative z-10 drop-shadow-sm leading-tight">
          Better Habits<br/>Better Adventures
        </h2>
        <p className="text-[12px] text-slate-700 relative z-10 mt-1 font-bold">Invest in the you you're becoming.</p>
      </motion.div>

      {/* Grid */}
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-3 gap-3"
      >
        <ShopItem 
          iconPath="/icons/backpack.jpg"
          title="Traveler's Cloak"
          buff="+1 Quest Slot"
          price={500}
        />
        <ShopItem 
          iconPath="/icons/hood.jpg"
          title="Focus Hood"
          buff="+10 Focus"
          price={300}
        />
        <ShopItem 
          iconPath="/icons/tome.jpg"
          title="Scholar's Tome"
          buff="+10 XP Gain"
          price={400}
        />
        <ShopItem 
          iconPath="/icons/lantern.jpg"
          title="Lantern of Clarity"
          buff="+10 Mana Regen"
          price={350}
        />
        <ShopItem 
          iconPath="/icons/clover.jpg"
          title="Lucky Charm"
          buff="+5% XP Gain"
          price={250}
        />
        <ShopItem 
          iconPath="/icons/corgi.jpg"
          title="Companion"
          buff="A friend for the journey"
          price={600}
        />
      </motion.div>

    </div>
  );
}

function ShopItem({ iconPath, title, buff, price }: any) {
  return (
    <div className="bg-white rounded-[24px] p-2.5 pb-3 shadow-soft flex flex-col items-center text-center">
      <div className="w-[80px] h-[80px] flex items-center justify-center mb-1">
        <img 
          src={iconPath} 
          alt={title} 
          className="w-full h-full object-contain mix-blend-multiply drop-shadow-sm" 
        />
      </div>
      <h3 className="text-[11px] font-extrabold text-[#1e293b] leading-tight">{title}</h3>
      <p className="text-[9px] text-slate-400 mt-0.5 mb-2.5 h-6 flex items-center justify-center font-medium leading-tight">{buff}</p>
      
      <button className="w-full py-1.5 gel-bar-yellow hover:brightness-105 text-yellow-900 rounded-xl font-extrabold text-[11px] flex items-center justify-center gap-1 transition-all shadow-sm border border-yellow-300/50">
        <div className="w-3.5 h-3.5 bg-yellow-600 rounded-full flex items-center justify-center shadow-inner">
           <StarIcon className="w-[8px] h-[8px] fill-yellow-200 text-yellow-200" />
        </div>
        {price}
      </button>
    </div>
  );
}

function StarIcon(props: any) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}
