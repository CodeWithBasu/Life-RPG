"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, CheckCircle, Circle, Target, Flame, Brain, Shield } from "lucide-react";

type Quest = {
  id: string;
  title: string;
  category: string;
  difficulty: string;
  completed: boolean;
};

const initialQuests: Quest[] = [
  { id: "1", title: "Read 20 pages of a book", category: "Intellect", difficulty: "EASY", completed: false },
  { id: "2", title: "Go to the gym for 1 hour", category: "Strength", difficulty: "HARD", completed: false },
  { id: "3", title: "Code for 2 hours", category: "Intellect", difficulty: "MEDIUM", completed: true },
];

export default function QuestsPage() {
  const [quests, setQuests] = useState<Quest[]>(initialQuests);

  const toggleQuest = (id: string) => {
    setQuests(quests.map(q => q.id === id ? { ...q, completed: !q.completed } : q));
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Intellect": return <Brain className="w-4 h-4 text-blue-400" />;
      case "Strength": return <Flame className="w-4 h-4 text-red-400" />;
      default: return <Shield className="w-4 h-4 text-emerald-400" />;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "HARD": return "text-red-400 border-red-500/30 bg-red-500/10";
      case "MEDIUM": return "text-yellow-400 border-yellow-500/30 bg-yellow-500/10";
      default: return "text-green-400 border-green-500/30 bg-green-500/10";
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-100 flex items-center gap-3">
            <Target className="w-8 h-8 text-fuchsia-500" /> Active Quests
          </h1>
          <p className="text-slate-400 mt-1">Complete tasks to earn XP and level up your attributes.</p>
        </div>
        
        <button className="flex items-center gap-2 px-4 py-2 bg-fuchsia-600 hover:bg-fuchsia-500 text-white rounded-lg font-medium transition-colors shadow-lg shadow-fuchsia-500/20">
          <Plus className="w-5 h-5" /> Add Quest
        </button>
      </div>

      <div className="space-y-4">
        <AnimatePresence>
          {quests.map((quest) => (
            <motion.div
              key={quest.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-xl border transition-all duration-300 ${
                quest.completed 
                  ? "bg-slate-900/40 border-slate-800/50 opacity-60" 
                  : "bg-slate-900 border-slate-700 hover:border-fuchsia-500/50 shadow-md"
              }`}
            >
              <div className="flex items-center gap-4 mb-3 sm:mb-0">
                <button 
                  onClick={() => toggleQuest(quest.id)}
                  className="text-slate-400 hover:text-fuchsia-400 transition-colors focus:outline-none"
                >
                  {quest.completed ? (
                    <CheckCircle className="w-8 h-8 text-fuchsia-500" />
                  ) : (
                    <Circle className="w-8 h-8" />
                  )}
                </button>
                <div>
                  <h3 className={`text-lg font-bold ${quest.completed ? "text-slate-500 line-through" : "text-slate-200"}`}>
                    {quest.title}
                  </h3>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="flex items-center gap-1 text-xs font-medium text-slate-400">
                      {getCategoryIcon(quest.category)} {quest.category}
                    </span>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-md border ${getDifficultyColor(quest.difficulty)}`}>
                      {quest.difficulty}
                    </span>
                  </div>
                </div>
              </div>

              {!quest.completed && (
                <div className="ml-12 sm:ml-0 text-sm font-bold text-fuchsia-400 flex items-center gap-1 bg-fuchsia-500/10 px-3 py-1 rounded-lg">
                  +{quest.difficulty === "HARD" ? 30 : quest.difficulty === "MEDIUM" ? 20 : 10} XP
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
