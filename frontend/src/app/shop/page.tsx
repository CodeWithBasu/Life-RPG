"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Check } from "lucide-react";
import { api } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import { soundEngine } from "@/lib/audio";

interface ShopItemModel {
  id: string;
  name: string;
  cost: number;
  type: "THEME" | "FRAME" | "TITLE";
}

const ITEM_METADATA: Record<string, { boost: string; image: string; category: string }> = {
  "Traveler's Cloak": { boost: "+1 Quest Slot", image: "/shop_backpack.jpg", category: "Gear" },
  "Focus Hood": { boost: "+10 Focus", image: "/shop_hood.jpg", category: "Gear" },
  "Scholar's Tome": { boost: "+10 XP Gain", image: "/icons/book.jpg", category: "Boosts" },
  "Dragon Knight Frame": { boost: "+10% Max HP", image: "/icons/sun.jpg", category: "Gear" },
  "Midnight Obsidian Theme": { boost: "Dark Royal Aura", image: "/shop_backpack.jpg", category: "Cosmetics" },
  "The Disciplined Title": { boost: "+5% Streak XP", image: "/icons/leaf.jpg", category: "Cosmetics" },
};

export default function ShopPage() {
  const [activeTab, setActiveTab] = useState("All");
  const [shopItems, setShopItems] = useState<ShopItemModel[]>([]);
  const [purchasedIds, setPurchasedIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [feedback, setFeedback] = useState<string | null>(null);

  const ensureAuthenticated = useAuthStore((state) => state.ensureAuthenticated);
  const updateCharacter = useAuthStore((state) => state.updateCharacter);
  const character = useAuthStore((state) => state.user?.character);

  const loadShop = async () => {
    try {
      await ensureAuthenticated();
      const items = await api.get<ShopItemModel[]>("/api/shop");
      setShopItems(items);

      // Extract already purchased items if user character has inventory
      if (character?.inventory) {
        const owned = character.inventory.map((inv: any) => inv.shopItemId);
        setPurchasedIds(owned);
      }
    } catch (err) {
      console.error("Failed to load shop items:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadShop();
  }, []);

  const handlePurchase = async (item: ShopItemModel) => {
    if (purchasedIds.includes(item.id)) return;

    const currentCoins = character?.currencyBalance ?? 0;
    if (currentCoins < item.cost) {
      setFeedback(`Need ${item.cost - currentCoins} more coins to purchase ${item.name}!`);
      setTimeout(() => setFeedback(null), 3000);
      return;
    }

    try {
      const res: any = await api.post(`/api/shop/${item.id}/purchase`);
      if (res.success) {
        soundEngine.playCoin();
        setPurchasedIds((prev) => [...prev, item.id]);
        updateCharacter({ currencyBalance: res.newBalance });
        setFeedback(`Equipped ${item.name}!`);
        setTimeout(() => setFeedback(null), 3000);
      }
    } catch (err: any) {
      setFeedback(err.message || "Purchase failed");
      setTimeout(() => setFeedback(null), 3000);
    }
  };

  const currentCoins = (character?.currencyBalance ?? 1240).toLocaleString();

  const mappedItems = shopItems.map((item) => {
    const meta = ITEM_METADATA[item.name] || {
      boost: `+${item.cost} Style`,
      image: "/icons/leaf.jpg",
      category: item.type === "THEME" ? "Cosmetics" : item.type === "FRAME" ? "Gear" : "Boosts",
    };
    return {
      ...item,
      ...meta,
    };
  });

  const filteredItems =
    activeTab === "All"
      ? mappedItems
      : mappedItems.filter((item) => item.category === activeTab);

  return (
    <div className="flex flex-col bg-[#f8fafc] dark:bg-transparent min-h-screen pb-24">
      <div className="px-5 pt-4 pb-4 flex flex-col gap-5">
        {/* Page Title & Currency Pill */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-black text-slate-800 dark:text-slate-50 tracking-tight">Shop</h1>
          <div className="gel-bar-yellow text-yellow-900 font-extrabold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm border border-amber-200/50">
            <div className="w-5 h-5 bg-amber-500 rounded-full flex items-center justify-center shadow-inner">
              <Star className="w-3 h-3 fill-amber-100 text-amber-100" />
            </div>
            <span className="text-sm font-black">{currentCoins}</span>
          </div>
        </div>

        {/* Feedback Alert Toast */}
        <AnimatePresence>
          {feedback && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-amber-400 text-amber-950 font-bold text-xs p-3 rounded-2xl text-center shadow-md"
            >
              {feedback}
            </motion.div>
          )}
        </AnimatePresence>

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
          {isLoading ? (
            <div className="col-span-2 text-center py-12 text-slate-400 font-bold">
              Loading merchant inventory...
            </div>
          ) : (
            filteredItems.map((item, index) => {
              const isPurchased = purchasedIds.includes(item.id);
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
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal dark:opacity-90"
                    />
                  </div>
                  <h3 className="text-sm font-black text-slate-800 dark:text-slate-100 text-center leading-tight mb-1">
                    {item.name}
                  </h3>
                  <p className="text-[11px] font-bold text-slate-400 dark:text-indigo-300 mb-4 text-center">
                    {item.boost}
                  </p>

                  <button
                    onClick={() => handlePurchase(item)}
                    disabled={isPurchased}
                    className={`mt-auto w-full text-sm font-extrabold py-2 rounded-xl flex items-center justify-center gap-1.5 transition-colors border ${
                      isPurchased
                        ? "bg-slate-100 dark:bg-indigo-900/40 text-slate-400 dark:text-indigo-400 border-slate-200 dark:border-indigo-800/50 cursor-default"
                        : "bg-amber-100/50 dark:bg-[#2d285c] hover:bg-amber-100 dark:hover:bg-[#3d377c] text-amber-900 dark:text-amber-400 border-amber-200/50 dark:border-[#4d459c]"
                    }`}
                  >
                    {isPurchased ? (
                      <span className="flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" /> Owned
                      </span>
                    ) : (
                      <>
                        <div className="w-4 h-4 bg-amber-500 rounded-full flex items-center justify-center shadow-inner">
                          <Star className="w-2.5 h-2.5 fill-amber-100 text-amber-100" />
                        </div>
                        {item.cost}
                      </>
                    )}
                  </button>
                </motion.div>
              );
            })
          )}
        </motion.div>
      </div>
    </div>
  );
}
