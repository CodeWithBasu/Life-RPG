"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { useState } from "react";

export default function ShopPage() {
  const [activeTab, setActiveTab] = useState("All");

  const shopItems = [
    {
      id: 1,
      name: "Traveler's Cloak",
      boost: "+1 Quest Slot",
      price: 500,
      image: "/shop_backpack.jpg",
      category: "Gear"
    },
    {
      id: 2,
      name: "Focus Hood",
      boost: "+10 Focus",
      price: 300,
      image: "/shop_hood.jpg",
      category: "Gear"
    },
    {
      id: 3,
      name: "Scholar's Tome",
      boost: "+10 XP Gain",
      price: 400,
      image: "/icons/book.jpg",
      category: "Boosts"
    },
    {
      id: 4,
      name: "Lantern of Clarity",
      boost: "+10 Mana Regen",
      price: 350,
      image: "/icons/sun.jpg",
      category: "Gear"
    },
    {
      id: 5,
      name: "Lucky Charm",
      boost: "+5% XP Gain",
      price: 250,
      image: "/icons/leaf.jpg",
      category: "Boosts"
    },
    {
      id: 6,
      name: "Companion",
      boost: "A friend for the journey",
      price: 600,
      image: "/shop_corgi.jpg",
      category: "Cosmetics"
    }
  ];

  const filteredItems = activeTab === "All" ? shopItems : shopItems.filter(item => item.category === activeTab);
  
  const [purchasedItems, setPurchasedItems] = useState<number[]>([]);

  const handlePurchase = (id: number) => {
    if (!purchasedItems.includes(id)) {
      setPurchasedItems([...purchasedItems, id]);
    }
  };

  return (
    <div className="flex flex-col bg-[#f8fafc] dark:bg-transparent min-h-screen pb-24">
      <div className="px-5 pt-4 pb-4 flex flex-col gap-5">
        
        {/* Page Title */}
        <h1 className="text-3xl font-black text-slate-800 dark:text-slate-50 tracking-tight">Shop</h1>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {["All", "Gear", "Boosts", "Cosmetics"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`whitespace-nowrap px-6 py-2.5 text-sm font-extrabold rounded-full transition-all ${
                activeTab === tab 
                  ? "bg-gradient-to-b from-amber-300 to-amber-400 text-amber-900 shadow-[0_4px_0_#d97706] -translate-y-1" 
                  : "bg-white dark:bg-[#1a1740] text-slate-500 dark:text-indigo-300 shadow-sm border border-slate-100 dark:border-[#2e2959] hover:bg-slate-50 dark:hover:bg-[#1f1b4a]"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Promotional Banner */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full relative h-48 rounded-[32px] overflow-hidden shadow-md group border border-transparent dark:border-[#2e2959]"
        >
          <img src="/shop_banner.jpg" alt="Village" className="w-full h-full object-cover opacity-90" />
          <div className="absolute inset-0 bg-gradient-to-t from-white/40 dark:from-indigo-950/70 to-white/90 dark:to-indigo-900/80" />
          <div className="absolute inset-0 flex flex-col items-center justify-start pt-6 text-center">
            <h2 className="text-2xl font-black text-indigo-900 dark:text-white leading-tight drop-shadow-sm">
              Better Habits<br />Better Adventures
            </h2>
            <p className="text-indigo-700/80 dark:text-indigo-200 font-bold text-sm mt-2">
              Invest in the you<br />you're becoming.
            </p>
          </div>
        </motion.div>

        {/* Item Grid */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-3 gap-4"
        >
          {filteredItems.map((item, index) => {
            const isPurchased = purchasedItems.includes(item.id);
            return (
              <motion.div 
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white dark:bg-[#1f1b4a] rounded-[28px] p-4 flex flex-col items-center shadow-soft dark:shadow-none border border-slate-50 dark:border-[#2e2959] hover:shadow-md transition-shadow"
              >
                <div className="w-24 h-24 mb-3 flex items-center justify-center">
                  <img src={item.image} alt={item.name} className="w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal dark:opacity-90" />
                </div>
                <h3 className="text-sm font-black text-slate-800 dark:text-slate-100 text-center leading-tight mb-1">
                  {item.name}
                </h3>
                <p className="text-[11px] font-bold text-slate-400 dark:text-indigo-300 mb-4 text-center">
                  {item.boost}
                </p>
                
                <button 
                  onClick={() => handlePurchase(item.id)}
                  className={`mt-auto w-full text-sm font-extrabold py-2 rounded-xl flex items-center justify-center gap-1.5 transition-colors border ${isPurchased ? 'bg-slate-100 dark:bg-indigo-900/40 text-slate-400 dark:text-indigo-400 border-slate-200 dark:border-indigo-800/50' : 'bg-amber-100/50 dark:bg-[#2d285c] hover:bg-amber-100 dark:hover:bg-[#3d377c] text-amber-900 dark:text-amber-400 border-amber-200/50 dark:border-[#4d459c]'}`}
                >
                  {isPurchased ? (
                    "Purchased"
                  ) : (
                    <>
                      <div className="w-4 h-4 bg-amber-500 rounded-full flex items-center justify-center shadow-inner">
                        <Star className="w-2.5 h-2.5 fill-amber-100 text-amber-100" />
                      </div>
                      {item.price}
                    </>
                  )}
                </button>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
}
