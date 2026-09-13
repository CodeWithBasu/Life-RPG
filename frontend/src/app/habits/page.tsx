"use client";

import { motion, AnimatePresence } from "framer-motion";
import { CheckSquare, Plus, Check, X, Trash2 } from "lucide-react";
import { useState, useRef, useEffect } from "react";

export default function HabitsPage() {
  const [habits, setHabits] = useState<any[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [toast, setToast] = useState("");
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [newHabitName, setNewHabitName] = useState("");
  const [newHabitTarget, setNewHabitTarget] = useState("30");

  const todayStr = new Date().toDateString();

  // Load and apply streak penalties
  useEffect(() => {
    const saved = localStorage.getItem('life-rpg-habits');
    
    let loadedHabits = saved ? JSON.parse(saved) : [
      { id: 1, name: "Read 10 pages", streak: 5, targetDays: 30, lastCompletedDate: todayStr },
      { id: 2, name: "Meditate for 10 mins", streak: 12, targetDays: 30, lastCompletedDate: null },
      { id: 3, name: "Drink 2L Water", streak: 1, targetDays: 30, lastCompletedDate: null },
    ];

    // Penalty check: If a habit wasn't done today OR yesterday, break the streak.
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    loadedHabits = loadedHabits.map((habit: any) => {
      if (habit.lastCompletedDate) {
        const lastDate = new Date(habit.lastCompletedDate);
        lastDate.setHours(0, 0, 0, 0);
        
        // If last completed date is before yesterday, streak resets to 0.
        if (lastDate < yesterday) {
          return { ...habit, streak: 0 };
        }
      }
      return habit;
    });

    setHabits(loadedHabits);
    setIsLoaded(true);
  }, [todayStr]);

  // Save to localStorage whenever habits change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('life-rpg-habits', JSON.stringify(habits));
    }
  }, [habits, isLoaded]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  const toggleHabit = (id: number) => {
    const habit = habits.find(h => h.id === id);
    if (!habit) return;

    const isCompletedToday = habit.lastCompletedDate === todayStr;
    
    // Lock it in: prevents unticking for today
    if (isCompletedToday) return;

    showToast(`+10 XP! Completed "${habit.name}"`);

    setHabits(habits.map(h => {
      if (h.id === id) {
        return {
          ...h,
          lastCompletedDate: todayStr,
          streak: h.streak + 1
        };
      }
      return h;
    }));
  };

  const deleteHabit = (id: number, e: React.MouseEvent) => {
    e.stopPropagation(); // prevent toggling the habit
    if (confirm("Are you sure you want to delete this habit? You will lose your streak!")) {
      setHabits(habits.filter(h => h.id !== id));
      showToast("Habit deleted.");
    }
  };

  const addHabit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHabitName.trim()) return;
    setHabits([...habits, { 
      id: Date.now(), 
      name: newHabitName.trim(), 
      streak: 0, 
      targetDays: parseInt(newHabitTarget) || 30,
      lastCompletedDate: null
    }]);
    setNewHabitName("");
    setNewHabitTarget("30");
    dialogRef.current?.close();
    showToast(`Added new habit: ${newHabitName}`);
  };

  if (!isLoaded) return null;

  return (
    <div className="flex flex-col gap-6 p-5 max-w-6xl mx-auto w-full pb-24">
      <div className="flex items-center justify-between mt-2 px-2">
        <div>
          <h1 className="text-[28px] font-extrabold text-slate-800 flex items-center gap-3">
            <CheckSquare className="w-8 h-8 text-amber-500" /> Habits
          </h1>
          <p className="text-[14px] text-slate-500 font-medium">Build consistency. Forge your destiny.</p>
        </div>
        <button 
          onClick={() => dialogRef.current?.showModal()}
          className="bg-amber-400 hover:bg-amber-500 text-white font-extrabold px-5 py-2.5 rounded-full shadow-[0_4px_0_0_#d97706] active:shadow-none active:translate-y-1 transition-all flex items-center gap-2"
        >
          <Plus className="w-5 h-5 stroke-[3]" /> New Habit
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <AnimatePresence>
          {habits.map((habit, i) => {
            const isCompletedToday = habit.lastCompletedDate === todayStr;
            return (
              <motion.div
                key={habit.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                transition={{ delay: i * 0.05 }}
                className={`rounded-[28px] p-5 border-2 transition-all cursor-pointer relative group overflow-hidden ${
                  isCompletedToday
                    ? "bg-emerald-50 border-emerald-200 shadow-[0_6px_0_0_#a7f3d0]"
                    : "bg-white border-slate-100 shadow-[0_6px_0_0_#f1f5f9] hover:border-slate-200"
                }`}
                onClick={() => toggleHabit(habit.id)}
                whileHover={{ y: -3 }}
                whileTap={{ y: 3, boxShadow: "0 0 0 0 transparent" }}
              >
                {/* Delete Button (Appears on Hover) */}
                <button 
                  onClick={(e) => deleteHabit(habit.id, e)}
                  className="absolute top-4 right-4 p-2 bg-rose-100 text-rose-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-rose-200 z-10"
                  title="Delete Habit"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                <div className="flex items-start justify-between">
                  <div className="flex flex-col pr-10">
                    <h3 className={`font-extrabold text-[18px] leading-tight ${isCompletedToday ? 'text-emerald-900 line-through decoration-emerald-300' : 'text-slate-800'}`}>
                      {habit.name}
                    </h3>
                    <div className="flex items-center gap-1.5 mt-2">
                      <span className="text-[16px]">🔥</span>
                      <span className={`text-[13px] font-black ${isCompletedToday ? 'text-emerald-600' : 'text-amber-500'}`}>
                        {habit.streak} / {habit.targetDays} Days
                      </span>
                    </div>
                  </div>

                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center border-2 shadow-inner transition-colors shrink-0 ml-2 ${
                    isCompletedToday 
                      ? "bg-emerald-400 border-emerald-500 text-white" 
                      : "bg-slate-50 border-slate-200 text-transparent"
                  }`}>
                    <Check className="w-6 h-6 stroke-[3]" />
                  </div>
                </div>
                
                {/* Minimal Progress Bar underneath */}
                <div className="mt-4 h-1.5 w-full bg-slate-100 rounded-full overflow-hidden shadow-inner-soft relative">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(100, (habit.streak / habit.targetDays) * 100)}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className={`absolute top-0 left-0 bottom-0 rounded-full shadow-sm ${isCompletedToday ? 'bg-emerald-400' : 'bg-amber-400'}`}
                  />
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Add Habit Native Modal */}
      <dialog 
        ref={dialogRef}
        className="w-full max-w-sm rounded-[32px] p-6 shadow-2xl backdrop:bg-black/60 backdrop:backdrop-blur-sm open:animate-in open:zoom-in-95 open:fade-in duration-200 m-auto"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-black text-slate-800">New Habit</h2>
          <button onClick={() => dialogRef.current?.close()} className="p-2 bg-slate-100 rounded-full hover:bg-slate-200 text-slate-500">
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={addHabit} className="flex flex-col gap-4">
          <input 
            type="text"
            placeholder="e.g. Do 20 Pushups"
            value={newHabitName}
            onChange={(e) => setNewHabitName(e.target.value)}
            className="w-full bg-slate-50 border-2 border-slate-200 rounded-2xl p-4 font-bold text-slate-700 outline-none focus:border-amber-400 focus:bg-white transition-colors"
            autoFocus
          />
          <div className="flex items-center gap-3">
             <span className="font-bold text-slate-500 text-sm whitespace-nowrap">Target Days:</span>
             <input 
               type="number"
               min="1"
               max="365"
               placeholder="30"
               value={newHabitTarget}
               onChange={(e) => setNewHabitTarget(e.target.value)}
               className="w-full bg-slate-50 border-2 border-slate-200 rounded-2xl p-3 font-bold text-slate-700 outline-none focus:border-amber-400 focus:bg-white transition-colors"
             />
          </div>
          <button 
            type="submit"
            className="w-full bg-amber-400 hover:bg-amber-500 text-white font-black text-lg p-4 rounded-2xl shadow-[0_4px_0_0_#d97706] active:shadow-none active:translate-y-1 transition-all mt-2"
          >
            Forge Habit
          </button>
        </form>
      </dialog>

      {/* Global Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div 
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-slate-800 text-white px-6 py-4 rounded-full shadow-2xl font-bold text-[14px] z-50 flex items-center gap-3 border border-slate-700/50"
          >
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_10px_rgba(52,211,153,0.8)]"></div>
            {toast}
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
