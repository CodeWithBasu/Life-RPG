"use client";

import { motion } from "framer-motion";
import { Zap, Flame, Target, Trophy } from "lucide-react";

export default function DashboardOverview() {
  // Mock data for display purposes
  const level = 5;
  const currentXp = 450;
  const nextLevelXp = 1000;
  const xpPercentage = (currentXp / nextLevelXp) * 100;

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="max-w-5xl mx-auto space-y-8"
    >
      <motion.div variants={item} className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-slate-100">Hero Overview</h1>
          <p className="text-slate-400">Welcome back, your journey continues.</p>
        </div>
      </motion.div>

      {/* Level Progress Banner */}
      <motion.div variants={item} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden">
        {/* Glow effect */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-fuchsia-500/10 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="flex flex-col md:flex-row items-center gap-6 relative z-10">
          <div className="w-24 h-24 rounded-full bg-slate-950 border-4 border-fuchsia-500 flex items-center justify-center flex-col shadow-[0_0_20px_rgba(217,70,239,0.3)]">
            <span className="text-sm text-fuchsia-400 font-bold uppercase tracking-widest">LVL</span>
            <span className="text-3xl font-black text-white">{level}</span>
          </div>
          
          <div className="flex-1 w-full space-y-2">
            <div className="flex justify-between text-sm font-medium">
              <span className="text-slate-300">Experience Points</span>
              <span className="text-fuchsia-400">{currentXp} / {nextLevelXp} XP</span>
            </div>
            <div className="h-4 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-800">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${xpPercentage}%` }}
                transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-fuchsia-600 to-fuchsia-400 relative"
              >
                <div className="absolute inset-0 bg-white/20 w-full h-full [mask-image:linear-gradient(to_right,transparent,white,transparent)] animate-[shimmer_2s_infinite]"></div>
              </motion.div>
            </div>
            <p className="text-xs text-slate-500 text-right">{nextLevelXp - currentXp} XP to next level</p>
          </div>
        </div>
      </motion.div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={<Flame className="text-orange-500" />} title="Day Streak" value="7" variants={item} />
        <StatCard icon={<Target className="text-emerald-500" />} title="Quests Done" value="24" variants={item} />
        <StatCard icon={<Zap className="text-yellow-500" />} title="Energy Level" value="High" variants={item} />
        <StatCard icon={<Trophy className="text-amber-400" />} title="Total Coins" value="1,250" variants={item} />
      </div>

      {/* Attributes & Recent Quests Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div variants={item} className="lg:col-span-1 bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <h3 className="text-lg font-bold text-slate-200 mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5 text-indigo-400" /> Attributes
          </h3>
          <div className="space-y-4">
            <AttributeBar name="Strength" level={4} color="bg-red-500" />
            <AttributeBar name="Intellect" level={7} color="bg-blue-500" />
            <AttributeBar name="Discipline" level={5} color="bg-emerald-500" />
            <AttributeBar name="Charisma" level={2} color="bg-amber-500" />
          </div>
        </motion.div>

        <motion.div variants={item} className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-slate-200 flex items-center gap-2">
              <Target className="w-5 h-5 text-fuchsia-400" /> Recent Quests
            </h3>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-slate-950/50 rounded-xl border border-slate-800/50">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-500 flex items-center justify-center font-bold">✓</div>
                <span className="text-slate-300 font-medium">Read 20 pages</span>
              </div>
              <span className="text-xs font-bold text-fuchsia-400">+20 XP</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-950/50 rounded-xl border border-slate-800/50">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-500 flex items-center justify-center font-bold">✓</div>
                <span className="text-slate-300 font-medium">1 Hour Workout</span>
              </div>
              <span className="text-xs font-bold text-fuchsia-400">+50 XP</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-950/50 rounded-xl border border-slate-800/50">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-800 text-slate-500 flex items-center justify-center font-bold">?</div>
                <span className="text-slate-400 font-medium line-through">Drink 2L Water</span>
              </div>
              <span className="text-xs font-bold text-slate-600">Missed</span>
            </div>
          </div>
        </motion.div>
      </div>

    </motion.div>
  );
}

function StatCard({ icon, title, value, variants }: any) {
  return (
    <motion.div variants={variants} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex items-center gap-4 hover:bg-slate-800/50 transition-colors">
      <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 shadow-inner">
        {icon}
      </div>
      <div>
        <div className="text-slate-400 text-sm font-medium">{title}</div>
        <div className="text-2xl font-bold text-slate-100">{value}</div>
      </div>
    </motion.div>
  );
}

function AttributeBar({ name, level, color }: { name: string, level: number, color: string }) {
  return (
    <div>
      <div className="flex justify-between text-xs font-medium mb-1">
        <span className="text-slate-300">{name}</span>
        <span className="text-slate-400">Lv.{level}</span>
      </div>
      <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-800">
        <div className={`h-full ${color}`} style={{ width: `${Math.min(level * 10, 100)}%` }}></div>
      </div>
    </div>
  );
}
