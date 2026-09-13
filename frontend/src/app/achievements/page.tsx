"use client";

import { motion } from "framer-motion";
import { Trophy, Star, Award, Zap } from "lucide-react";

export default function AchievementsPage() {
  const achievements = [
    { id: 1, title: "First Blood", desc: "Complete your first quest.", icon: "🩸", unlocked: true },
    { id: 2, title: "Consistency is Key", desc: "Reach a 7-day streak.", icon: "🔥", unlocked: true },
    { id: 3, title: "Deep Pockets", desc: "Hoard 10,000 gold.", icon: "💰", unlocked: false },
    { id: 4, title: "Master of Discipline", desc: "Reach level 10 in Discipline.", icon: "⚔️", unlocked: false },
  ];

  return (
    <div className="flex flex-col gap-6 p-5 max-w-6xl mx-auto w-full pb-24">
      <div className="px-2 mt-2">
        <h1 className="text-[28px] font-extrabold text-slate-800 flex items-center gap-3">
          <Trophy className="w-8 h-8 text-amber-500" /> Achievements
        </h1>
        <p className="text-[14px] text-slate-500 font-medium">Your wall of legends.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {achievements.map((ach, i) => (
          <motion.div
            key={ach.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`rounded-[24px] p-5 border-2 flex items-center gap-5 transition-transform ${
              ach.unlocked 
                ? "bg-amber-50 border-amber-200 shadow-[0_6px_0_0_#fcd34d]" 
                : "bg-white border-slate-100 shadow-[0_6px_0_0_#f1f5f9] opacity-70 grayscale"
            }`}
          >
            <div className={`w-16 h-16 rounded-[20px] flex items-center justify-center text-[32px] shadow-inner ${
              ach.unlocked ? "bg-amber-200" : "bg-slate-100"
            }`}>
              {ach.icon}
            </div>
            <div className="flex-1">
              <h3 className="font-extrabold text-[16px] text-slate-800">{ach.title}</h3>
              <p className="text-[13px] font-bold text-slate-500 mt-1">{ach.desc}</p>
            </div>
            {ach.unlocked && (
              <div className="w-10 h-10 bg-amber-400 rounded-full flex items-center justify-center text-white shadow-md border-[3px] border-amber-100">
                <Star className="w-5 h-5 fill-white" />
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
