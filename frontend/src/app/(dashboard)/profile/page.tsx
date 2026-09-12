"use client";

import { motion } from "framer-motion";
import { User, Shield, Sword, Award, Calendar } from "lucide-react";

export default function ProfilePage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center gap-4">
        <div className="w-20 h-20 bg-slate-900 border-2 border-indigo-500 rounded-2xl flex items-center justify-center shadow-[0_0_15px_rgba(99,102,241,0.3)]">
          <User className="w-10 h-10 text-indigo-400" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-slate-100">Hero Profile</h1>
          <p className="text-slate-400">Manage your identity and view achievements.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Stats Summary */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-900 border border-slate-800 rounded-2xl p-6"
        >
          <h2 className="text-xl font-bold text-slate-200 mb-6 flex items-center gap-2">
            <Shield className="w-5 h-5 text-indigo-400" /> Combat Stats
          </h2>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-slate-950/50 rounded-lg">
              <span className="text-slate-400">Total XP Earned</span>
              <span className="font-bold text-fuchsia-400">12,450 XP</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-slate-950/50 rounded-lg">
              <span className="text-slate-400">Quests Completed</span>
              <span className="font-bold text-emerald-400">128</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-slate-950/50 rounded-lg">
              <span className="text-slate-400">Longest Streak</span>
              <span className="font-bold text-orange-400">14 Days</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-slate-950/50 rounded-lg">
              <span className="text-slate-400">Joined</span>
              <span className="font-bold text-slate-200 flex items-center gap-1">
                <Calendar className="w-4 h-4" /> Sept 12, 2026
              </span>
            </div>
          </div>
        </motion.div>

        {/* Badges/Achievements */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-slate-900 border border-slate-800 rounded-2xl p-6"
        >
          <h2 className="text-xl font-bold text-slate-200 mb-6 flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" /> Badges
          </h2>
          
          <div className="grid grid-cols-3 gap-4">
            <div className="flex flex-col items-center gap-2 p-3 bg-slate-950/50 rounded-xl border border-slate-800">
              <div className="w-12 h-12 rounded-full bg-orange-500/20 border border-orange-500 flex items-center justify-center">
                <Flame className="w-6 h-6 text-orange-500" />
              </div>
              <span className="text-xs font-bold text-slate-300 text-center">7 Day<br/>Streak</span>
            </div>
            <div className="flex flex-col items-center gap-2 p-3 bg-slate-950/50 rounded-xl border border-slate-800">
              <div className="w-12 h-12 rounded-full bg-fuchsia-500/20 border border-fuchsia-500 flex items-center justify-center">
                <Sword className="w-6 h-6 text-fuchsia-500" />
              </div>
              <span className="text-xs font-bold text-slate-300 text-center">100<br/>Quests</span>
            </div>
            <div className="flex flex-col items-center gap-2 p-3 bg-slate-950/50 rounded-xl border border-slate-800 opacity-40 grayscale">
              <div className="w-12 h-12 rounded-full bg-slate-700 border border-slate-600 flex items-center justify-center">
                <Shield className="w-6 h-6 text-slate-400" />
              </div>
              <span className="text-xs font-bold text-slate-400 text-center">Level 10<br/>Reached</span>
            </div>
          </div>
        </motion.div>
      </div>
      
      {/* Settings Area placeholder */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-slate-900 border border-slate-800 rounded-2xl p-6"
      >
        <h2 className="text-xl font-bold text-slate-200 mb-4">Account Settings</h2>
        <p className="text-slate-400 text-sm mb-6">Clerk authentication integration will appear here.</p>
        <button className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-medium transition-colors border border-slate-700">
          Sign Out
        </button>
      </motion.div>
    </div>
  );
}
