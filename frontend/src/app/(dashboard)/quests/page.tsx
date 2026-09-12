"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, CheckCircle, Circle, Target, Flame, Brain, Shield, X, Trash2 } from "lucide-react";
import { api } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";

type Quest = {
  id: string;
  title: string;
  category: string;
  difficulty: string;
  status: string;
};

export default function QuestsPage() {
  const [quests, setQuests] = useState<Quest[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState("Intellect");
  const [newDifficulty, setNewDifficulty] = useState("EASY");
  
  const { fetchProfile } = useAuthStore();

  useEffect(() => {
    fetchQuests();
  }, []);

  const fetchQuests = async () => {
    try {
      const data = await api.get<Quest[]>('/tasks');
      setQuests(data);
    } catch (error) {
      console.error("Failed to fetch quests", error);
    }
  };

  const handleAddQuest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    try {
      const task = await api.post<Quest>('/tasks', {
        title: newTitle,
        category: newCategory,
        difficulty: newDifficulty
      });
      setQuests([task, ...quests]);
      setIsAdding(false);
      setNewTitle("");
    } catch (error) {
      console.error("Failed to add quest", error);
    }
  };

  const handleCompleteQuest = async (id: string) => {
    // Optimistic UI update
    setQuests(quests.map(q => q.id === id ? { ...q, status: 'COMPLETED' } : q));
    
    try {
      await api.patch(`/tasks/${id}/complete`);
      // Update global profile stats after gaining XP
      fetchProfile();
    } catch (error) {
      console.error("Failed to complete quest", error);
      // Revert on error
      fetchQuests();
    }
  };
  
  const handleDeleteQuest = async (id: string) => {
    try {
      await api.delete(`/tasks/${id}`);
      setQuests(quests.filter(q => q.id !== id));
    } catch (error) {
      console.error("Failed to delete quest", error);
    }
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
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-100 flex items-center gap-3">
            <Target className="w-8 h-8 text-fuchsia-500" /> Active Quests
          </h1>
          <p className="text-slate-400 mt-1">Complete tasks to earn XP and level up your attributes.</p>
        </div>
        
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className="flex items-center gap-2 px-4 py-2 bg-fuchsia-600 hover:bg-fuchsia-500 text-white rounded-lg font-medium transition-colors shadow-lg shadow-fuchsia-500/20"
        >
          {isAdding ? <X className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
          {isAdding ? "Cancel" : "Add Quest"}
        </button>
      </div>

      <AnimatePresence>
        {isAdding && (
          <motion.form 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            onSubmit={handleAddQuest}
            className="bg-slate-900 border border-slate-700 rounded-xl p-5 overflow-hidden shadow-xl"
          >
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Quest Title</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-fuchsia-500 focus:ring-1 focus:ring-fuchsia-500"
                  placeholder="e.g. Read 20 pages..."
                />
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-slate-400 mb-1">Attribute</label>
                  <select 
                    value={newCategory} 
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-fuchsia-500"
                  >
                    <option value="Intellect">Intellect</option>
                    <option value="Strength">Strength</option>
                    <option value="Discipline">Discipline</option>
                  </select>
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-slate-400 mb-1">Difficulty</label>
                  <select 
                    value={newDifficulty} 
                    onChange={(e) => setNewDifficulty(e.target.value)}
                    className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-200 focus:outline-none focus:border-fuchsia-500"
                  >
                    <option value="EASY">Easy (+10 XP)</option>
                    <option value="MEDIUM">Medium (+20 XP)</option>
                    <option value="HARD">Hard (+30 XP)</option>
                  </select>
                </div>
              </div>
              <button
                type="submit"
                className="w-full py-2 bg-fuchsia-600 hover:bg-fuchsia-500 text-white rounded-lg font-medium transition-colors"
              >
                Create Quest
              </button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      <div className="space-y-4">
        <AnimatePresence>
          {quests.map((quest) => {
            const isCompleted = quest.status === 'COMPLETED';
            return (
              <motion.div
                key={quest.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className={`flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-xl border transition-all duration-300 ${
                  isCompleted 
                    ? "bg-slate-900/40 border-slate-800/50 opacity-60" 
                    : "bg-slate-900 border-slate-700 hover:border-fuchsia-500/50 shadow-md"
                }`}
              >
                <div className="flex items-center gap-4 mb-3 sm:mb-0">
                  <button 
                    onClick={() => !isCompleted && handleCompleteQuest(quest.id)}
                    disabled={isCompleted}
                    className={`focus:outline-none transition-colors ${isCompleted ? 'text-fuchsia-500 cursor-default' : 'text-slate-400 hover:text-fuchsia-400'}`}
                  >
                    {isCompleted ? (
                      <CheckCircle className="w-8 h-8" />
                    ) : (
                      <Circle className="w-8 h-8" />
                    )}
                  </button>
                  <div>
                    <h3 className={`text-lg font-bold ${isCompleted ? "text-slate-500 line-through" : "text-slate-200"}`}>
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

                <div className="ml-12 sm:ml-0 flex items-center gap-4">
                  {!isCompleted && (
                    <div className="text-sm font-bold text-fuchsia-400 flex items-center gap-1 bg-fuchsia-500/10 px-3 py-1 rounded-lg">
                      +{quest.difficulty === "HARD" ? 30 : quest.difficulty === "MEDIUM" ? 20 : 10} XP
                    </div>
                  )}
                  <button onClick={() => handleDeleteQuest(quest.id)} className="text-slate-600 hover:text-red-400">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
        
        {quests.length === 0 && !isAdding && (
          <div className="text-center py-12 bg-slate-900/40 rounded-xl border border-slate-800 border-dashed">
            <Target className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-400 font-medium">Your quest log is empty.</p>
            <p className="text-slate-500 text-sm">Add a new quest to begin earning XP.</p>
          </div>
        )}
      </div>
    </div>
  );
}
