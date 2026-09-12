import React from 'react';
import { motion } from 'framer-motion';
import { useAuthStore } from '../store/authStore';
import { Award, Zap, Star, ShieldAlert } from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuthStore();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-5xl mx-auto"
    >
      <header className="mb-8">
        <motion.h2 variants={itemVariants} className="text-3xl font-bold text-white mb-2">
          Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-secondary-400">{user?.username}</span>!
        </motion.h2>
        <motion.p variants={itemVariants} className="text-slate-400">
          Your journey continues. Here's your current status.
        </motion.p>
      </header>

      {/* Stats Grid */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon={Award} label="Level" value={user?.level.toString() || '1'} color="from-yellow-400 to-orange-500" />
        <StatCard icon={Zap} label="Experience" value={`${user?.xp || 0} XP`} color="from-primary-500 to-primary-600" />
        <StatCard icon={Star} label="Quests Done" value="12" color="from-secondary-400 to-secondary-600" />
        <StatCard icon={ShieldAlert} label="Bosses Defeated" value="3" color="from-red-400 to-rose-600" />
      </motion.div>

      {/* Progress Section */}
      <motion.div variants={itemVariants} className="bg-slate-800 rounded-2xl p-6 border border-slate-700 shadow-xl mb-8">
        <div className="flex justify-between items-end mb-4">
          <div>
            <h3 className="text-lg font-bold text-white mb-1">Level Progress</h3>
            <p className="text-sm text-slate-400">You need 450 more XP to reach Level { (user?.level || 1) + 1 }</p>
          </div>
          <span className="text-primary-400 font-bold">55%</span>
        </div>
        <div className="w-full bg-slate-900 rounded-full h-4 overflow-hidden border border-slate-700">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: '55%' }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.5 }}
            className="h-full bg-gradient-to-r from-primary-500 to-secondary-500 relative"
          >
            <div className="absolute top-0 left-0 right-0 bottom-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMSIvPgo8L3N2Zz4=')] opacity-50"></div>
          </motion.div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Quests */}
        <motion.div variants={itemVariants} className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Zap className="text-yellow-400 w-5 h-5" />
            Active Quests
          </h3>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-4 p-3 bg-slate-900/50 rounded-xl border border-slate-700/50 hover:border-primary-500/50 transition-colors cursor-pointer group">
                <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center border border-slate-600 group-hover:border-primary-500/50">
                  <div className="w-3 h-3 rounded-full bg-slate-600 group-hover:bg-primary-500 transition-colors"></div>
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-slate-200">Drink 2L Water</h4>
                  <p className="text-xs text-slate-500">Daily Habit • +10 XP</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
        
        {/* Upcoming Goals */}
        <motion.div variants={itemVariants} className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Star className="text-secondary-400 w-5 h-5" />
            Milestones
          </h3>
          <div className="space-y-4">
            <div className="p-4 bg-gradient-to-br from-secondary-500/10 to-primary-500/10 rounded-xl border border-secondary-500/20">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-bold text-secondary-400">Read 10 Books</h4>
                <span className="text-xs font-mono bg-secondary-500/20 text-secondary-300 px-2 py-1 rounded">7/10</span>
              </div>
              <p className="text-sm text-slate-400 mb-3">Reward: "Bookworm" Title, +500 XP</p>
              <div className="w-full bg-slate-900 rounded-full h-2">
                <div className="h-full bg-secondary-500 rounded-full" style={{ width: '70%' }}></div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

    </motion.div>
  );
}

function StatCard({ icon: Icon, label, value, color }: { icon: any, label: string, value: string, color: string }) {
  return (
    <div className="bg-slate-800 p-5 rounded-2xl border border-slate-700 flex items-center gap-4 relative overflow-hidden group">
      <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${color} opacity-10 rounded-full blur-2xl -mr-10 -mt-10 group-hover:opacity-20 transition-opacity`}></div>
      <div className={`p-3 rounded-xl bg-gradient-to-br ${color} shadow-lg`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <div>
        <p className="text-slate-400 text-xs uppercase tracking-wider font-semibold mb-1">{label}</p>
        <p className="text-2xl font-bold text-white">{value}</p>
      </div>
    </div>
  );
}
