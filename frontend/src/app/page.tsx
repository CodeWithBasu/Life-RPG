"use client";

import { motion } from "framer-motion";
import { Sword, Shield, Zap, Sparkles } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 selection:bg-fuchsia-500/30 overflow-hidden relative">
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>

      <main className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 pt-20 pb-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3 py-1 text-sm font-medium rounded-full bg-slate-900 border border-slate-800 text-fuchsia-400 mb-8"
        >
          <Sparkles className="w-4 h-4" />
          <span>Level Up Your Life v1.0</span>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-br from-fuchsia-400 to-indigo-600 drop-shadow-sm"
        >
          Turn Habits Into<br />Epic Quests
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="max-w-2xl text-lg md:text-xl text-slate-400 mb-10"
        >
          Stop treating your life like a boring spreadsheet. Gain XP, build streaks, 
          and upgrade your real-world stats by completing daily tasks and habits.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
        >
          <Link 
            href="/dashboard" 
            className="group relative inline-flex h-14 items-center justify-center overflow-hidden rounded-md bg-fuchsia-600 px-8 font-medium text-white transition-all duration-300 hover:bg-fuchsia-500 hover:ring-2 hover:ring-fuchsia-400 hover:ring-offset-2 hover:ring-offset-slate-900"
          >
            <span className="absolute right-0 -mt-12 h-32 w-8 translate-x-12 rotate-12 bg-white opacity-10 transition-all duration-1000 ease-out group-hover:-translate-x-40"></span>
            <span className="flex items-center gap-2">
              <Sword className="w-5 h-5" />
              Start Your Journey
            </span>
          </Link>
          
          <Link 
            href="/login" 
            className="inline-flex h-14 items-center justify-center rounded-md border border-slate-800 bg-slate-900/50 px-8 font-medium text-slate-300 transition-colors hover:bg-slate-800 hover:text-white backdrop-blur-sm"
          >
            Login to Profile
          </Link>
        </motion.div>

        {/* Features Preview */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-24 max-w-5xl mx-auto w-full"
        >
          <FeatureCard 
            icon={<Sword className="w-6 h-6 text-fuchsia-400" />}
            title="Non-Linear Leveling"
            desc="Earn XP for completing tasks. Every level is harder than the last."
          />
          <FeatureCard 
            icon={<Zap className="w-6 h-6 text-yellow-400" />}
            title="Daily Streaks"
            desc="Don't break the chain. Build powerful streaks by showing up every day."
          />
          <FeatureCard 
            icon={<Shield className="w-6 h-6 text-emerald-400" />}
            title="Attribute Stats"
            desc="Coding builds Intellect. Gym builds Strength. Level up your real stats."
          />
        </motion.div>

        {/* How It Works Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mt-32 max-w-4xl mx-auto text-left relative z-10 w-full bg-slate-900/50 p-8 md:p-12 rounded-3xl border border-slate-800 backdrop-blur-md"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-10 text-center text-slate-100">Your Journey Awaits</h2>
          
          <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-700 before:to-transparent">
            
            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
              <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-slate-950 bg-fuchsia-500 text-slate-950 font-bold shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-lg z-10">1</div>
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-slate-800 bg-slate-900/80 shadow-md">
                <h3 className="font-bold text-slate-200 text-lg mb-1">Define Your Quests</h3>
                <p className="text-slate-400 text-sm">Add your real-world tasks, habits, and dailies into your spellbook.</p>
              </div>
            </div>

            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
              <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-slate-950 bg-indigo-500 text-slate-950 font-bold shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-lg z-10">2</div>
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-slate-800 bg-slate-900/80 shadow-md">
                <h3 className="font-bold text-slate-200 text-lg mb-1">Execute & Survive</h3>
                <p className="text-slate-400 text-sm">Check them off in real life to gain XP and loot. Miss them, and lose health.</p>
              </div>
            </div>

            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
              <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-slate-950 bg-emerald-500 text-slate-950 font-bold shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-lg z-10">3</div>
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-slate-800 bg-slate-900/80 shadow-md">
                <h3 className="font-bold text-slate-200 text-lg mb-1">Level Up Stats</h3>
                <p className="text-slate-400 text-sm">Grow your attributes dynamically. Unlock new ranks as you progress.</p>
              </div>
            </div>

          </div>
        </motion.div>
      </main>
    </div>
  );
}

function FeatureCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
  return (
    <div className="flex flex-col items-center p-8 bg-slate-900/40 border border-slate-800 rounded-2xl backdrop-blur-sm hover:border-slate-700 transition-colors shadow-xl">
      <div className="p-4 bg-slate-800/80 rounded-xl mb-5 shadow-inner">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-slate-200 mb-3">{title}</h3>
      <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
    </div>
  );
}
