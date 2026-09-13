"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, Heart, Droplet, Star, Plus, Sparkles, X, Check, Target, Pencil, Trash2 } from "lucide-react";
import { api } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import LevelUpModal from "@/components/LevelUpModal";
import { soundEngine } from "@/lib/audio";

interface TaskItem {
  id: string;
  title: string;
  icon?: string | null;
  flavorText?: string | null;
  category: "INTELLECT" | "STRENGTH" | "DISCIPLINE" | "CREATIVITY";
  difficulty: "EASY" | "MEDIUM" | "HARD" | "EPIC";
  status: "ACTIVE" | "COMPLETED";
  completedAt?: string | null;
  reminderTime?: string | null;
}

const CATEGORY_ICONS: Record<string, string> = {
  DISCIPLINE: "/icons/sun.jpg",
  INTELLECT: "/icons/book.jpg",
  STRENGTH: "/icons/dumbbell.jpg",
  CREATIVITY: "/icons/leaf.jpg",
};

const DIFFICULTY_XP: Record<string, number> = {
  EASY: 10,
  MEDIUM: 25,
  HARD: 50,
  EPIC: 100,
};

const QUEST_ICONS = [
  { icon: "⚔️", label: "Workout / Fitness" },
  { icon: "📚", label: "Reading / Study" },
  { icon: "💧", label: "Hydration / Water" },
  { icon: "🧘", label: "Meditation / Zen" },
  { icon: "🏃", label: "Cardio / Running" },
  { icon: "💻", label: "Coding / Work" },
  { icon: "🎨", label: "Creativity / Art" },
  { icon: "🌿", label: "Nature / Outdoors" },
  { icon: "🍎", label: "Nutrition / Healthy" },
  { icon: "💤", label: "Sleep / Rest" },
  { icon: "⚡", label: "Quick Chore" },
  { icon: "🎯", label: "Priority Goal" },
  { icon: "💰", label: "Budget / Finance" },
  { icon: "🎵", label: "Music / Practice" },
  { icon: "🛡️", label: "Good Habit" },
  { icon: "💖", label: "Wellness / Care" },
];

const QUICK_DAILY_GOALS = [
  { title: "Drink 2L Water", category: "DISCIPLINE" as const, difficulty: "EASY" as const, icon: "💧" },
  { title: "30 Min Workout", category: "STRENGTH" as const, difficulty: "MEDIUM" as const, icon: "⚔️" },
  { title: "Read 20 Pages", category: "INTELLECT" as const, difficulty: "MEDIUM" as const, icon: "📚" },
  { title: "10 Min Meditation", category: "DISCIPLINE" as const, difficulty: "EASY" as const, icon: "🧘" },
  { title: "Creative Journaling", category: "CREATIVITY" as const, difficulty: "EASY" as const, icon: "🎨" },
  { title: "Walk in Nature", category: "STRENGTH" as const, difficulty: "EASY" as const, icon: "🌿" },
];

export default function QuestsPage() {
  const [activeTab, setActiveTab] = useState("Active");
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [newLevelNum, setNewLevelNum] = useState(13);
  const [quests, setQuests] = useState<TaskItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // New Quest Modal State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [selectedIcon, setSelectedIcon] = useState<string>("⚔️");
  const [newCategory, setNewCategory] = useState<"INTELLECT" | "STRENGTH" | "DISCIPLINE" | "CREATIVITY">("DISCIPLINE");
  const [newDifficulty, setNewDifficulty] = useState<"EASY" | "MEDIUM" | "HARD" | "EPIC">("EASY");
  const [newReminderTime, setNewReminderTime] = useState<string>("");
  const [isClassifying, setIsClassifying] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Edit/Delete State
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);

  // Reminder Toast State
  const [toastMessage, setToastMessage] = useState("");

  const ensureAuthenticated = useAuthStore((state) => state.ensureAuthenticated);
  const updateCharacter = useAuthStore((state) => state.updateCharacter);
  const character = useAuthStore((state) => state.user?.character);

  const loadTasks = async () => {
    try {
      await ensureAuthenticated();
      const tasks = await api.get<TaskItem[]>("/api/tasks");
      setQuests(tasks);
    } catch (err: any) {
      console.warn("Could not load tasks:", err?.message || err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      quests.forEach(q => {
        if (q.status === 'ACTIVE' && q.reminderTime) {
          const remTime = new Date(q.reminderTime);
          const diffSeconds = Math.floor((now.getTime() - remTime.getTime()) / 1000);
          
          if (diffSeconds >= 0 && diffSeconds < 10) {
            setToastMessage(`Apka time agaya hai, "${q.title}" isse jaldi se pura kare!`);
            setTimeout(() => setToastMessage(""), 5000);
            soundEngine.playCoin(); // attention sound
          }
        }
      });
    }, 10000);
    return () => clearInterval(interval);
  }, [quests]);

  const handleCompleteQuest = async (id: string) => {
    const target = quests.find((q) => q.id === id);
    if (!target || target.status === "COMPLETED") return;

    // Optimistic update
    setQuests((prev) =>
      prev.map((q) => (q.id === id ? { ...q, status: "COMPLETED" } : q))
    );

    // Trigger real procedural audio and haptic celebration
    soundEngine.playQuestComplete();

    try {
      const res: any = await api.patch(`/api/tasks/${id}/complete`);

      if (res?.character) {
        updateCharacter(res.character);
      }

      if (res?.leveledUp) {
        soundEngine.playLevelUp();
        setNewLevelNum(res.newLevel);
        setShowLevelUp(true);
      }
    } catch (err) {
      console.error("Complete task error:", err);
      // Revert if failed
      setQuests((prev) =>
        prev.map((q) => (q.id === id ? { ...q, status: "ACTIVE" } : q))
      );
    }
  };

  const handleDeleteQuest = async (id: string) => {
    try {
      await api.delete(`/api/tasks/${id}`);
      setQuests((prev) => prev.filter((q) => q.id !== id));
      soundEngine.playLevelUp(); // some feedback
    } catch (err) {
      console.error("Failed to delete quest:", err);
    }
  };

  const openEditModal = (task: TaskItem) => {
    setEditingTaskId(task.id);
    setNewTitle(task.title);
    setNewCategory(task.category);
    setNewDifficulty(task.difficulty);
    setSelectedIcon(task.icon || "⚔️");
    if (task.reminderTime) {
       const d = new Date(task.reminderTime);
       const h = String(d.getHours()).padStart(2, '0');
       const m = String(d.getMinutes()).padStart(2, '0');
       setNewReminderTime(`${h}:${m}`);
    } else {
       setNewReminderTime("");
    }
    setShowEditModal(true);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTaskId || !newTitle.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const payload: any = {
        title: newTitle.trim(),
        category: newCategory,
        difficulty: newDifficulty,
        icon: selectedIcon,
      };

      if (newReminderTime) {
        const [hours, minutes] = newReminderTime.split(':');
        const d = new Date();
        d.setHours(parseInt(hours, 10));
        d.setMinutes(parseInt(minutes, 10));
        d.setSeconds(0);
        d.setMilliseconds(0);
        if (d.getTime() < new Date().getTime()) {
           d.setDate(d.getDate() + 1);
        }
        payload.reminderTime = d.toISOString();
      }

      const updated = await api.patch<TaskItem>(`/api/tasks/${editingTaskId}`, payload);
      setQuests((prev) => prev.map((q) => (q.id === editingTaskId ? updated : q)));
      
      setShowEditModal(false);
      setEditingTaskId(null);
      setNewTitle("");
      setNewReminderTime("");
    } catch (err) {
      console.error("Failed to edit quest:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClassifyAI = async () => {
    if (!newTitle.trim()) return;
    setIsClassifying(true);
    try {
      const lower = newTitle.toLowerCase();
      if (lower.includes("water") || lower.includes("drink") || lower.includes("hydrat")) {
        setSelectedIcon("💧");
      } else if (lower.includes("workout") || lower.includes("pushup") || lower.includes("gym") || lower.includes("lift")) {
        setSelectedIcon("⚔️");
      } else if (lower.includes("read") || lower.includes("study") || lower.includes("book") || lower.includes("learn")) {
        setSelectedIcon("📚");
      } else if (lower.includes("meditat") || lower.includes("mind") || lower.includes("breath")) {
        setSelectedIcon("🧘");
      } else if (lower.includes("run") || lower.includes("walk") || lower.includes("cardio") || lower.includes("steps")) {
        setSelectedIcon("🏃");
      } else if (lower.includes("code") || lower.includes("program") || lower.includes("work")) {
        setSelectedIcon("💻");
      } else if (lower.includes("journal") || lower.includes("write") || lower.includes("art") || lower.includes("draw")) {
        setSelectedIcon("🎨");
      } else if (lower.includes("sleep") || lower.includes("rest") || lower.includes("nap")) {
        setSelectedIcon("💤");
      } else if (lower.includes("clean") || lower.includes("chore") || lower.includes("tidy")) {
        setSelectedIcon("⚡");
      }

      const result = await api.post<{ category: any; difficulty: any }>("/api/tasks/classify", {
        taskText: newTitle,
      });
      if (result.category) setNewCategory(result.category);
      if (result.difficulty) setNewDifficulty(result.difficulty);
    } catch (err) {
      console.error("Classification error:", err);
    } finally {
      setIsClassifying(false);
    }
  };

  const handleCreateQuest = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!newTitle.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const payload: any = {
        title: newTitle.trim(),
        category: newCategory,
        difficulty: newDifficulty,
        icon: selectedIcon,
      };
      
      if (newReminderTime) {
        const [hours, minutes] = newReminderTime.split(':');
        const d = new Date();
        d.setHours(parseInt(hours, 10));
        d.setMinutes(parseInt(minutes, 10));
        d.setSeconds(0);
        d.setMilliseconds(0);
        // If the time has already passed today, set it for tomorrow
        if (d.getTime() < new Date().getTime()) {
           d.setDate(d.getDate() + 1);
        }
        payload.reminderTime = d.toISOString();
      }

      const created = await api.post<TaskItem>("/api/tasks", payload);

      setQuests((prev) => [created, ...prev]);
      setNewTitle("");
      setNewReminderTime("");
      setShowCreateModal(false);
      soundEngine.playCoin();
    } catch (err) {
      console.error("Failed to create quest:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickAdd = async (goal: typeof QUICK_DAILY_GOALS[0]) => {
    try {
      const created = await api.post<TaskItem>("/api/tasks", {
        title: goal.title,
        category: goal.category,
        difficulty: goal.difficulty,
        icon: goal.icon,
      });
      setQuests((prev) => [created, ...prev]);
      soundEngine.playCoin();
    } catch (err) {
      console.error("Quick add failed:", err);
    }
  };

  const filteredQuests = quests.filter((q) => {
    if (activeTab === "Active") return q.status !== "COMPLETED";
    if (activeTab === "Completed") return q.status === "COMPLETED";
    return true;
  });

  const levelUpStats = [
    {
      label: "Mastery Level",
      oldValue: (character?.level ?? 12) - 1,
      newValue: newLevelNum,
      icon: <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />,
      positive: true,
    },
    {
      label: "Max HP",
      oldValue: 100,
      newValue: 100 + (newLevelNum - 1) * 5,
      icon: <Heart className="w-5 h-5 text-red-500 fill-red-500" />,
      positive: true,
    },
    {
      label: "Max Mana",
      oldValue: 100,
      newValue: 100 + (newLevelNum - 1) * 5,
      icon: <Droplet className="w-5 h-5 text-blue-500 fill-blue-500" />,
      positive: true,
    },
  ];

  return (
    <div className="flex flex-col gap-5 p-5 max-w-md mx-auto pb-28 relative">
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className="fixed top-10 left-1/2 -translate-x-1/2 z-50 bg-amber-500 text-white font-extrabold px-6 py-4 rounded-full shadow-[0_8px_30px_rgba(245,158,11,0.4)] border-4 border-amber-300 flex items-center gap-3 w-[90%] md:w-auto justify-center"
          >
            <span className="text-sm md:text-base">{toastMessage}</span>
            <button onClick={() => setToastMessage("")} className="ml-2 hover:bg-amber-600 p-1 rounded-full transition-colors">
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tabs */}
      <div className="flex items-center justify-between bg-white dark:bg-[#1a1740] rounded-full p-1.5 shadow-soft dark:shadow-none border border-transparent dark:border-[#2e2959]">
        {["Active", "Completed", "All"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2.5 text-[13px] font-bold rounded-full transition-all cursor-pointer ${
              activeTab === tab 
                ? "gel-bar-yellow text-yellow-900 shadow-md" 
                : "text-slate-400 dark:text-indigo-300 hover:text-slate-600 dark:hover:text-indigo-200"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Header & Main Add Button */}
      <div className="flex items-center justify-between px-1 mt-1">
        <div>
          <h1 className="text-[22px] font-extrabold text-[#1e293b] dark:text-slate-50">Quest Log</h1>
          <p className="text-[13px] text-slate-500 dark:text-indigo-300 font-medium mt-0.5">Small steps. Big adventures.</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="gel-bar-yellow text-yellow-900 font-extrabold px-3.5 py-2 rounded-full shadow-md flex items-center gap-1.5 hover:scale-105 active:scale-95 transition-transform cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span className="text-[13px]">Add Goal</span>
        </button>
      </div>

      {/* Prominent Quick-Add Goal Banner */}
      <motion.div
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-gradient-to-r from-amber-400 to-yellow-400 rounded-[28px] p-4 text-yellow-950 shadow-md flex flex-col gap-2.5"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-yellow-950" />
            <span className="text-[14px] font-black">Quick Daily Goals</span>
          </div>
          <span className="text-[11px] font-bold bg-yellow-500/40 px-2.5 py-0.5 rounded-full">
            +1 Click
          </span>
        </div>

        {/* Quick Goal Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
          {QUICK_DAILY_GOALS.map((goal, i) => (
            <button
              key={i}
              onClick={() => handleQuickAdd(goal)}
              className="whitespace-nowrap bg-white/90 hover:bg-white text-yellow-950 text-[11px] font-extrabold px-3 py-1.5 rounded-full shadow-sm hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center gap-1"
            >
              <span>{goal.icon}</span>
              <span>+ {goal.title}</span>
            </button>
          ))}
        </div>
      </motion.div>

      {/* Explicit Add Custom Daily Goal Banner */}
      <button
        onClick={() => setShowCreateModal(true)}
        className="w-full bg-white hover:bg-amber-50/60 border-2 border-dashed border-amber-300 rounded-[24px] p-3.5 flex items-center justify-center gap-2 text-amber-900 font-extrabold text-[13px] shadow-soft hover:shadow-md hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer"
      >
        <div className="w-6 h-6 rounded-full bg-amber-400 text-yellow-950 flex items-center justify-center shadow-xs">
          <Plus className="w-3.5 h-3.5 stroke-[3]" />
        </div>
        <span>+ Add Your Custom Daily Goal</span>
      </button>

      {/* Quests List */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3.5">
        {isLoading ? (
          <div className="text-center py-12 text-slate-400 font-bold">Loading quests...</div>
        ) : filteredQuests.length === 0 ? (
          <div className="bg-white rounded-[28px] p-8 text-center shadow-soft flex flex-col items-center">
            <span className="text-4xl">📜</span>
            <h3 className="text-[16px] font-extrabold text-slate-700 mt-2">No Quests Found</h3>
            <p className="text-[12px] text-slate-400 mt-1 max-w-[240px]">
              {activeTab === "Completed"
                ? "Complete your daily quests to see them logged here."
                : "Forge a new quest below to begin your adventure today!"}
            </p>
            {activeTab !== "Completed" && (
              <button
                onClick={() => setShowCreateModal(true)}
                className="mt-4 gel-bar-yellow text-yellow-900 font-extrabold px-5 py-2.5 rounded-full text-xs shadow-md"
              >
                + Add Daily Goal
              </button>
            )}
          </div>
        ) : (
          filteredQuests.map((q) => (
            <QuestCard
              key={q.id}
              icon={q.icon}
              iconPath={CATEGORY_ICONS[q.category] || "/icons/sun.jpg"}
              title={q.title}
              desc={q.flavorText || "Small steps today, legendary tomorrow."}
              xp={DIFFICULTY_XP[q.difficulty] || 10}
              checked={q.status === "COMPLETED"}
              onToggle={() => handleCompleteQuest(q.id)}
              onEdit={() => openEditModal(q)}
              onDelete={() => handleDeleteQuest(q.id)}
            />
          ))
        )}
      </motion.div>



      {/* Add/Edit Quest Modal */}
      <AnimatePresence>
        {(showCreateModal || showEditModal) && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-[32px] p-6 max-w-sm w-full shadow-2xl relative"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">⚔️</span>
                  <h2 className="text-[18px] font-black text-slate-800">
                    {showEditModal ? "Edit Daily Goal" : "Add Daily Goal"}
                  </h2>
                </div>
                <button
                  onClick={() => {
                    setShowCreateModal(false);
                    setShowEditModal(false);
                  }}
                  className="p-1 rounded-full text-slate-400 hover:text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={showEditModal ? handleEditSubmit : handleCreateQuest} className="space-y-4">
                <div>
                  <label className="block text-[12px] font-bold text-slate-500 mb-1">Goal or Habit</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Read 20 pages, 50 pushups, Meditate..."
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-[14px] text-slate-800 focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={handleClassifyAI}
                    disabled={isClassifying || !newTitle.trim()}
                    className="text-[11px] font-extrabold text-amber-800 bg-amber-100 hover:bg-amber-200 disabled:opacity-50 px-3.5 py-1.5 rounded-full flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    {isClassifying ? "AI Categorizing..." : "AI Auto-Suggest"}
                  </button>
                </div>

                {/* Attribute & Difficulty Grid */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[12px] font-bold text-slate-500 mb-1">Attribute</label>
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value as any)}
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-[13px] text-slate-700 font-bold focus:outline-none"
                    >
                      <option value="DISCIPLINE">Discipline</option>
                      <option value="STRENGTH">Strength</option>
                      <option value="INTELLECT">Intellect</option>
                      <option value="CREATIVITY">Creativity</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[12px] font-bold text-slate-500 mb-1">Difficulty</label>
                    <select
                      value={newDifficulty}
                      onChange={(e) => setNewDifficulty(e.target.value as any)}
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-[13px] text-slate-700 font-bold focus:outline-none"
                    >
                      <option value="EASY">Easy (+10 XP)</option>
                      <option value="MEDIUM">Medium (+25 XP)</option>
                      <option value="HARD">Hard (+50 XP)</option>
                      <option value="EPIC">Epic (+100 XP)</option>
                    </select>
                  </div>
                </div>

                {/* Reminder Time */}
                <div>
                  <label className="block text-[12px] font-bold text-slate-500 mb-1">Reminder Time (Optional)</label>
                  <input
                    type="time"
                    value={newReminderTime}
                    onChange={(e) => setNewReminderTime(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-[14px] text-slate-800 focus:outline-none focus:border-amber-400"
                  />
                </div>

                {/* Quest Icon Selector */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-[12px] font-bold text-slate-500">Choose Quest Icon</label>
                    <span className="text-[11px] font-extrabold text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                      Active: <span className="text-sm">{selectedIcon}</span>
                    </span>
                  </div>
                  <div className="grid grid-cols-8 gap-1.5 p-2 bg-slate-50 rounded-2xl border border-slate-200">
                    {QUEST_ICONS.map((item) => (
                      <button
                        key={item.icon}
                        type="button"
                        onClick={() => setSelectedIcon(item.icon)}
                        className={`w-8 h-8 rounded-xl text-base flex items-center justify-center transition-all cursor-pointer ${
                          selectedIcon === item.icon
                            ? "bg-amber-400 shadow-md scale-110 ring-2 ring-amber-500"
                            : "hover:bg-amber-100/70"
                        }`}
                        title={item.label}
                      >
                        {item.icon}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || !newTitle.trim()}
                  className="w-full gel-bar-yellow text-yellow-900 font-black py-3.5 rounded-2xl shadow-md hover:brightness-105 active:scale-98 transition-transform mt-2 flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4 stroke-[3]" />
                  <span>{isSubmitting ? (showEditModal ? "Saving..." : "Forging Quest...") : (showEditModal ? "Save Changes" : "Add to Daily Quests")}</span>
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <LevelUpModal
        isOpen={showLevelUp}
        onClose={() => setShowLevelUp(false)}
        level={newLevelNum}
        stats={levelUpStats}
      />
    </div>
  );
}

function QuestCard({ icon, iconPath, title, desc, xp, checked, onToggle, onEdit, onDelete }: any) {
  return (
    <motion.div
      whileTap={{ scale: 0.98 }}
      onClick={onToggle}
      className={`group bg-white dark:bg-[#1f1b4a] rounded-[28px] p-4 shadow-soft dark:shadow-none flex items-center gap-4 transition-opacity cursor-pointer border border-transparent dark:border-[#2e2959] ${
        checked ? "opacity-80" : "opacity-100"
      }`}
    >
      <div className="w-14 h-14 flex items-center justify-center shrink-0">
        {icon ? (
          <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-800/60 flex items-center justify-center text-2xl shadow-xs">
            {icon}
          </div>
        ) : (
          <img
            src={iconPath}
            alt={title}
            className="w-14 h-14 object-contain mix-blend-multiply dark:mix-blend-normal dark:opacity-90"
          />
        )}
      </div>

      <div className="flex-1 min-w-0 pr-2">
        <h3
          className={`text-[15px] font-extrabold text-[#1e293b] dark:text-slate-100 truncate ${
            checked ? "text-slate-400 dark:text-indigo-400 line-through" : ""
          }`}
        >
          {title}
        </h3>
        <p className="text-[11px] text-slate-400 dark:text-indigo-300 mt-0.5 font-medium truncate">{desc}</p>

        <div className="flex items-center gap-1.5 mt-2.5">
          {checked ? (
            <div className="w-[18px] h-[18px] rounded-full bg-yellow-400 flex items-center justify-center shadow-inner-soft">
              <Check className="w-2.5 h-2.5 text-white stroke-[4]" />
            </div>
          ) : (
            <div className="w-[18px] h-[18px] rounded-full border-2 border-slate-300 dark:border-indigo-700"></div>
          )}
          <span className={`text-[12px] font-bold ${checked ? "text-slate-600 dark:text-indigo-300" : "text-slate-400 dark:text-indigo-400"}`}>
            {checked ? "1 / 1" : "0 / 1"}
          </span>
        </div>
      </div>

      <div className="shrink-0 flex flex-col items-end gap-2">
        {/* Actions (appear on hover) */}
        {!checked && (
          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={(e) => { e.stopPropagation(); onEdit(); }}
              className="text-slate-300 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30 p-1.5 rounded-full transition-colors"
            >
              <Pencil className="w-4 h-4" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); onDelete(); }}
              className="text-slate-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 p-1.5 rounded-full transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}

        <div className="gel-bar-yellow text-yellow-900 text-[11px] font-extrabold pl-1.5 pr-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-md border border-yellow-300/50">
          <div className="w-5 h-5 bg-yellow-600 rounded-full flex items-center justify-center shadow-inner">
            <Star className="w-2.5 h-2.5 fill-yellow-200 text-yellow-200" />
          </div>
          +{xp} XP
        </div>
      </div>
    </motion.div>
  );
}
