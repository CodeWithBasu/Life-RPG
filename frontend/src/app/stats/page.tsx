"use client";

import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Award, Zap, Flame, Trophy, TrendingUp, CheckCircle2, Calendar, Clock, BarChart3, ChevronRight, Star } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { api } from "@/lib/api";
import { soundEngine } from "@/lib/audio";

type CadenceType = "Daily" | "Weekly" | "Monthly";

interface TaskItem {
  id: string;
  title: string;
  category: "INTELLECT" | "STRENGTH" | "DISCIPLINE" | "CREATIVITY";
  difficulty: "EASY" | "MEDIUM" | "HARD" | "EPIC";
  status: "ACTIVE" | "COMPLETED";
  completedAt?: string | null;
  createdAt: string;
}

const DIFFICULTY_XP: Record<string, number> = {
  EASY: 10,
  MEDIUM: 25,
  HARD: 50,
  EPIC: 100,
};

export default function StatsPage() {
  const ensureAuthenticated = useAuthStore((state) => state.ensureAuthenticated);
  const character = useAuthStore((state) => state.user?.character);
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [activeTab, setActiveTab] = useState<"Overview" | "Attributes" | "Achievements">("Overview");
  const [cadence, setCadence] = useState<CadenceType>("Weekly");

  useEffect(() => {
    ensureAuthenticated();
    api.get<TaskItem[]>("/api/tasks")
      .then((data) => {
        if (Array.isArray(data)) {
          setTasks(data);
        }
      })
      .catch(() => {});
  }, [ensureAuthenticated]);

  const completedTasks = useMemo(() => {
    return tasks.filter((t) => t.status === "COMPLETED" && t.completedAt);
  }, [tasks]);

  const level = character?.level ?? 12;
  const currentXp = character?.currentXp ?? 320;
  const xpNeeded = Math.floor(100 * Math.pow(level, 1.5));
  const xpPercent = Math.min(100, Math.max(0, Math.round((currentXp / (xpNeeded || 1)) * 100)));
  const strokeDashoffset = 282.7 * (1 - xpPercent / 100);

  const currentStreak = character?.streak?.currentStreak ?? 5;
  const longestStreak = character?.streak?.longestStreak ?? 12;
  const streakBonusPercent = Math.min(25, Math.floor(currentStreak / 5) * 5);

  const attributes = character?.attributes || [];
  const disciplineVal = attributes.find((a) => a.name === "DISCIPLINE")?.value ?? 24;
  const strengthVal = attributes.find((a) => a.name === "STRENGTH")?.value ?? 18;
  const intellectVal = attributes.find((a) => a.name === "INTELLECT")?.value ?? 30;
  const creativityVal = attributes.find((a) => a.name === "CREATIVITY")?.value ?? 15;

  // Real Category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {
      DISCIPLINE: 0,
      STRENGTH: 0,
      INTELLECT: 0,
      CREATIVITY: 0,
    };
    completedTasks.forEach((t) => {
      if (t.category && counts[t.category] !== undefined) {
        counts[t.category] += 1;
      }
    });
    return counts;
  }, [completedTasks]);

  // =========================================================================
  // 1. REAL DAILY DATA CALCULATION
  // =========================================================================
  const dailyMetrics = useMemo(() => {
    const today = new Date();
    const todayStr = today.toDateString();

    const todayCompleted = completedTasks.filter((t) => {
      if (!t.completedAt) return false;
      return new Date(t.completedAt).toDateString() === todayStr;
    });

    const xpToday = todayCompleted.reduce((sum, t) => sum + (DIFFICULTY_XP[t.difficulty] || 10), 0);
    const habitsHit = todayCompleted.length;

    const todayCreated = tasks.filter((t) => new Date(t.createdAt).toDateString() === todayStr);
    const dailyTarget = Math.max(3, todayCreated.length);
    const dailyPace = Math.min(100, Math.round((habitsHit / dailyTarget) * 100));

    // Slots based on exact completedAt hour
    const slots = [
      { label: "Morning Focus", time: "06:00 - 12:00", icon: "🌅", startH: 6, endH: 12 },
      { label: "Midday Surge", time: "12:00 - 17:00", icon: "☀️", startH: 12, endH: 17 },
      { label: "Evening Grind", time: "17:00 - 21:00", icon: "🌆", startH: 17, endH: 21 },
      { label: "Night Review", time: "21:00 - 24:00", icon: "🌙", startH: 21, endH: 24 },
    ].map((slot) => {
      const slotTasks = todayCompleted.filter((t) => {
        const h = new Date(t.completedAt!).getHours();
        if (slot.startH === 21) {
          return h >= 21 || h < 6;
        }
        return h >= slot.startH && h < slot.endH;
      });

      const slotXp = slotTasks.reduce((acc, t) => acc + (DIFFICULTY_XP[t.difficulty] || 10), 0);
      const percent = slotTasks.length > 0 ? Math.min(100, Math.round((slotTasks.length / 2) * 100)) : 0;

      return {
        ...slot,
        xp: slotXp,
        quests: slotTasks.length,
        percent,
      };
    });

    return { xpToday, habitsHit, dailyTarget, dailyPace, slots };
  }, [completedTasks, tasks]);

  // =========================================================================
  // 2. REAL WEEKLY 7-DAY DATA CALCULATION
  // =========================================================================
  const weeklyMetrics = useMemo(() => {
    const today = new Date();
    const dayOfWeek = (today.getDay() + 6) % 7; // 0 = Mon, 6 = Sun
    const monday = new Date(today);
    monday.setDate(today.getDate() - dayOfWeek);
    monday.setHours(0, 0, 0, 0);

    const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const daysData = dayNames.map((dayName, idx) => {
      const date = new Date(monday);
      date.setDate(monday.getDate() + idx);
      const dateStr = date.toDateString();

      const dayTasks = completedTasks.filter((t) => {
        if (!t.completedAt) return false;
        return new Date(t.completedAt).toDateString() === dateStr;
      });

      const dayXp = dayTasks.reduce((acc, t) => acc + (DIFFICULTY_XP[t.difficulty] || 10), 0);
      const isToday = dateStr === today.toDateString();

      return {
        day: dayName,
        date: date.getDate(),
        xp: dayXp,
        quests: dayTasks.length,
        isToday,
      };
    });

    const maxXp = Math.max(50, ...daysData.map((d) => d.xp));
    const totalWeeklyXp = daysData.reduce((acc, d) => acc + d.xp, 0);

    let bestDayObj = daysData[0];
    daysData.forEach((d) => {
      if (d.xp > bestDayObj.xp) bestDayObj = d;
    });

    const formattedDays = daysData.map((d) => ({
      ...d,
      height: `${Math.max(14, Math.round((d.xp / maxXp) * 100))}%`,
    }));

    return { days: formattedDays, totalWeeklyXp, bestDay: bestDayObj };
  }, [completedTasks]);

  // =========================================================================
  // 3. REAL MONTHLY 28-DAY HEATMAP CALCULATION
  // =========================================================================
  const monthlyMetrics = useMemo(() => {
    const today = new Date();
    const heatmapCells = [];
    let activeDaysCount = 0;
    let totalMonthlyXp = 0;

    for (let i = 27; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const dStr = d.toDateString();

      const dayTasks = completedTasks.filter((t) => {
        if (!t.completedAt) return false;
        return new Date(t.completedAt).toDateString() === dStr;
      });

      const count = dayTasks.length;
      const dayXp = dayTasks.reduce((acc, t) => acc + (DIFFICULTY_XP[t.difficulty] || 10), 0);
      totalMonthlyXp += dayXp;

      if (count > 0) activeDaysCount++;

      let level = 0;
      if (count === 1) level = 1;
      else if (count === 2) level = 2;
      else if (count >= 3) level = 3;

      heatmapCells.push({
        dayNum: d.getDate(),
        month: d.toLocaleDateString("en-US", { month: "short" }),
        dateStr: dStr,
        level,
        quests: count,
        xp: dayXp,
        isToday: i === 0,
      });
    }

    const avgDailyXp = Math.round(totalMonthlyXp / Math.max(1, activeDaysCount)) || 25;
    const xpRemaining = Math.max(0, xpNeeded - currentXp);
    const daysToLevel = Math.max(1, Math.ceil(xpRemaining / avgDailyXp));

    return {
      cells: heatmapCells,
      activeDaysCount,
      totalMonthlyXp,
      avgDailyXp,
      daysToLevel,
    };
  }, [completedTasks, xpNeeded, currentXp]);

  const achievements = useMemo(() => {
    return [
      { title: "First Blood", desc: "Completed your first quest", icon: "⚔️", unlocked: completedTasks.length >= 1, progress: Math.min(1, completedTasks.length), total: 1 },
      { title: "Ignited Flame", desc: "Maintain a 5-day streak", icon: "🔥", unlocked: currentStreak >= 5, progress: Math.min(5, currentStreak), total: 5 },
      { title: "Novice Ascendant", desc: "Reach Level 10", icon: "⭐", unlocked: level >= 10, progress: Math.min(10, level), total: 10 },
      { title: "Centurion", desc: "Earn 1,000+ total coins", icon: "👑", unlocked: (character?.currencyBalance ?? 0) >= 1000, progress: Math.min(1000, character?.currencyBalance ?? 0), total: 1000 },
      { title: "Master of Mind", desc: "Reach 35+ Intellect pts", icon: "🔮", unlocked: intellectVal >= 35, progress: Math.min(35, intellectVal), total: 35 },
    ];
  }, [completedTasks.length, currentStreak, level, character?.currencyBalance, intellectVal]);

  const handleTabChange = (tab: "Overview" | "Attributes" | "Achievements") => {
    soundEngine.playTap();
    setActiveTab(tab);
  };

  const handleCadenceChange = (newCadence: CadenceType) => {
    soundEngine.playTap();
    setCadence(newCadence);
  };

  return (
    <div className="flex flex-col gap-5 p-5 max-w-md mx-auto pb-32">
      {/* Header */}
      <div className="px-1 mt-1">
        <h1 className="text-[24px] font-extrabold text-slate-800 dark:text-slate-50 tracking-tight">Your Stats</h1>
        <p className="text-[13px] text-slate-500 dark:text-indigo-300 font-medium">Tracking your real verified journey.</p>
      </div>

      {/* Main Tabs */}
      <div className="flex items-center justify-between bg-white dark:bg-[#1f1b4a] rounded-full p-1.5 shadow-soft dark:shadow-none border border-transparent dark:border-[#2e2959]">
        {(["Overview", "Attributes", "Achievements"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => handleTabChange(tab)}
            className={`flex-1 py-2 text-[12px] font-extrabold rounded-full transition-all cursor-pointer ${
              activeTab === tab
                ? "gel-bar-yellow text-yellow-900 shadow-md"
                : "text-slate-400 dark:text-indigo-300 hover:text-slate-600 dark:hover:text-slate-100"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === "Overview" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
          {/* Hero Stat: Level Circle */}
          <div className="bg-white dark:bg-[#1f1b4a] rounded-[32px] p-6 shadow-soft dark:shadow-none border border-transparent dark:border-[#2e2959] flex flex-col items-center justify-center relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-yellow-100 dark:bg-amber-500/20 rounded-full blur-2xl opacity-50"></div>
            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-blue-100 dark:bg-indigo-500/20 rounded-full blur-2xl opacity-50"></div>

            <div className="relative w-40 h-40 mb-3">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" className="text-slate-100 dark:text-[#13112a]" strokeWidth="10" />
                <motion.circle
                  initial={{ strokeDashoffset: 282.7 }}
                  animate={{ strokeDashoffset }}
                  transition={{ duration: 1.2, ease: "easeOut" }}
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="#eab308"
                  strokeWidth="10"
                  strokeLinecap="round"
                  strokeDasharray="282.7"
                  className="drop-shadow-sm"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-[40px] font-black text-slate-800 dark:text-amber-400 leading-none">{level}</span>
                <span className="text-[11px] font-bold text-slate-400 dark:text-indigo-300 mt-1 uppercase tracking-wider">Level</span>
              </div>
            </div>

            <div className="flex flex-col items-center">
              <h2 className="text-[16px] font-black text-slate-800">
                {level >= 20 ? "Legendary Champion" : level >= 10 ? "Novice Adventurer" : "Fledgling Seeker"}
              </h2>
              <div className="bg-amber-50 border border-amber-200/60 px-4 py-1.5 rounded-full mt-2 flex items-center gap-2">
                <Zap className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
                <span className="text-[12px] font-extrabold text-amber-900">
                  {currentXp} / {xpNeeded} XP ({xpPercent}%)
                </span>
              </div>
            </div>
          </div>

          {/* Streak & Multiplier Cards */}
          <div className="grid grid-cols-2 gap-3.5">
            <div className="bg-white dark:bg-[#1f1b4a] rounded-[26px] p-4 shadow-soft dark:shadow-none border border-transparent dark:border-[#2e2959] flex flex-col items-center text-center relative overflow-hidden">
              <div className="w-14 h-14 flex items-center justify-center mb-1">
                <img src="/icons/flame.jpg" className="w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal dark:opacity-90" alt="Flame" />
              </div>
              <span className="text-[22px] font-black text-slate-800 dark:text-slate-100">{currentStreak} Days</span>
              <span className="text-[11px] font-bold text-slate-400 dark:text-indigo-300 mt-0.5">Current Streak</span>
              {streakBonusPercent > 0 && (
                <span className="mt-2 text-[10px] font-black text-emerald-700 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/50 px-2.5 py-0.5 rounded-full">
                  +{streakBonusPercent}% XP Multiplier
                </span>
              )}
            </div>

            <div className="bg-white dark:bg-[#1f1b4a] rounded-[26px] p-4 shadow-soft dark:shadow-none border border-transparent dark:border-[#2e2959] flex flex-col items-center text-center">
              <div className="w-14 h-14 flex items-center justify-center mb-1">
                <img src="/icons/trophy.jpg" className="w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal dark:opacity-90" alt="Trophy" />
              </div>
              <span className="text-[22px] font-black text-slate-800 dark:text-slate-100">{completedTasks.length}</span>
              <span className="text-[11px] font-bold text-slate-400 dark:text-indigo-300 mt-0.5">Quests Completed</span>
              <span className="mt-2 text-[10px] font-bold text-slate-400 dark:text-indigo-400 bg-slate-100 dark:bg-[#13112a] px-2.5 py-0.5 rounded-full">
                Best Streak: {longestStreak}d
              </span>
            </div>
          </div>

          {/* ======================================================= */}
          {/* REAL PROGRESS TIMELINE & GRAPHS (Daily, Weekly, Monthly) */}
          {/* ======================================================= */}
          <div className="bg-white rounded-[32px] p-5 shadow-soft flex flex-col gap-4 border border-amber-100/60">
            {/* Header with Cadence Pills */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-[15px] font-black text-slate-800">Progress Graphs</h3>
                <p className="text-[11px] text-slate-400 font-bold">Real Live Analytics</p>
              </div>

              {/* Cadence Pills */}
              <div className="flex bg-slate-100 p-1 rounded-full gap-1">
                {(["Daily", "Weekly", "Monthly"] as CadenceType[]).map((c) => (
                  <button
                    key={c}
                    onClick={() => handleCadenceChange(c)}
                    className={`px-3 py-1 rounded-full text-[11px] font-extrabold transition-all cursor-pointer ${
                      cadence === c
                        ? "bg-amber-400 text-yellow-950 shadow-xs"
                        : "text-slate-400 hover:text-slate-700"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {/* 1. REAL DAILY CADENCE */}
            {cadence === "Daily" && (
              <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="space-y-3 pt-1">
                {/* Daily Real Metric Strip */}
                <div className="grid grid-cols-3 gap-2 bg-amber-50/80 p-3 rounded-2xl border border-amber-200/50">
                  <div className="text-center">
                    <span className="text-[10px] font-bold text-amber-800">XP Today</span>
                    <p className="text-[16px] font-black text-amber-950">+{dailyMetrics.xpToday} XP</p>
                  </div>
                  <div className="text-center border-x border-amber-200/60">
                    <span className="text-[10px] font-bold text-amber-800">Habits Hit</span>
                    <p className="text-[16px] font-black text-amber-950">
                      {dailyMetrics.habitsHit} / {dailyMetrics.dailyTarget}
                    </p>
                  </div>
                  <div className="text-center">
                    <span className="text-[10px] font-bold text-amber-800">Daily Pace</span>
                    <p className={`text-[16px] font-black ${dailyMetrics.dailyPace >= 100 ? "text-emerald-600" : "text-amber-800"}`}>
                      {dailyMetrics.dailyPace}%
                    </p>
                  </div>
                </div>

                {/* Real Time-of-Day Slots */}
                <div className="space-y-2 pt-1">
                  {dailyMetrics.slots.map((slot, i) => (
                    <div key={i} className="bg-slate-50 p-3 rounded-2xl border border-slate-100 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="text-2xl">{slot.icon}</span>
                        <div>
                          <h4 className="text-[13px] font-extrabold text-slate-800 leading-tight">{slot.label}</h4>
                          <span className="text-[10px] font-bold text-slate-400">
                            {slot.time} • {slot.quests} {slot.quests === 1 ? "habit" : "habits"}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0">
                        <div className="w-20 h-2.5 bg-slate-200 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${slot.percent}%` }}
                            transition={{ duration: 0.8, delay: i * 0.1 }}
                            className="h-full rounded-full bg-gradient-to-r from-amber-400 to-yellow-500"
                          />
                        </div>
                        <span className="text-[11px] font-black text-amber-900 min-w-[45px] text-right">
                          +{slot.xp} XP
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* 2. REAL WEEKLY CADENCE */}
            {cadence === "Weekly" && (
              <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="space-y-3 pt-1">
                {/* Weekly Summary Badges */}
                <div className="flex items-center justify-between px-1">
                  <span className="text-[12px] font-extrabold text-slate-500">
                    Weekly Total: {weeklyMetrics.totalWeeklyXp} XP
                  </span>
                  <span className="text-[11px] font-extrabold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                    {weeklyMetrics.days.filter((d) => d.quests > 0).length} / 7 Active Days
                  </span>
                </div>

                {/* Real 7-Day Bar Chart */}
                <div className="h-44 bg-gradient-to-b from-amber-50/50 to-slate-50/80 rounded-2xl p-4 flex items-end justify-between border border-amber-100/50 gap-2">
                  {weeklyMetrics.days.map((d, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center h-full justify-end group cursor-pointer">
                      {/* Floating tooltip on hover */}
                      <span className="text-[9px] font-black text-amber-900 opacity-0 group-hover:opacity-100 transition-opacity mb-1 whitespace-nowrap">
                        {d.xp} XP
                      </span>

                      {/* Bar */}
                      <div className="w-full max-w-[28px] bg-slate-200/80 rounded-t-xl overflow-hidden flex flex-col justify-end relative h-28">
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: d.height }}
                          transition={{ duration: 0.9, delay: i * 0.08, ease: "easeOut" }}
                          className={`w-full rounded-t-xl transition-all ${
                            d.isToday
                              ? "bg-gradient-to-t from-amber-500 to-yellow-400 shadow-md ring-2 ring-yellow-400/80"
                              : d.xp > 0
                              ? "bg-gradient-to-t from-amber-300 to-amber-400 group-hover:brightness-110"
                              : "bg-slate-200"
                          }`}
                        />
                      </div>

                      {/* Day Label */}
                      <div className="mt-2 text-center">
                        <span className={`text-[11px] font-black block ${d.isToday ? "text-amber-800 font-extrabold" : "text-slate-400"}`}>
                          {d.day}
                        </span>
                        {d.isToday && (
                          <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mx-auto mt-0.5"></div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Best Day Highlight */}
                <div className="bg-slate-50 p-2.5 rounded-2xl border border-slate-100 flex items-center justify-between text-[11px]">
                  <span className="font-extrabold text-slate-600">🏆 Top Day</span>
                  <span className="font-black text-amber-900">
                    {weeklyMetrics.bestDay.day} ({weeklyMetrics.bestDay.xp} XP, {weeklyMetrics.bestDay.quests} {weeklyMetrics.bestDay.quests === 1 ? "Quest" : "Quests"})
                  </span>
                </div>
              </motion.div>
            )}

            {/* 3. REAL MONTHLY CADENCE */}
            {cadence === "Monthly" && (
              <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="space-y-3 pt-1">
                <div className="flex items-center justify-between px-1">
                  <span className="text-[12px] font-extrabold text-slate-500">28-Day Habit Heatmap</span>
                  <span className="text-[11px] font-black text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
                    {monthlyMetrics.activeDaysCount} / 28 Days Active
                  </span>
                </div>

                {/* Real 28-Day Grid */}
                <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                  <div className="grid grid-cols-7 gap-1.5">
                    {monthlyMetrics.cells.map((item, idx) => {
                      const colors = [
                        "bg-slate-200/60 border-slate-200 text-slate-400",      // 0: Rest
                        "bg-amber-200 border-amber-300 text-amber-900",          // 1: 1 quest
                        "bg-amber-400 border-amber-500 text-yellow-950",         // 2: 2 quests
                        "bg-amber-500 border-amber-600 shadow-xs text-yellow-950",// 3: 3+ quests
                      ];
                      return (
                        <div
                          key={idx}
                          title={`${item.dateStr}: ${item.quests === 0 ? "Rest day" : `${item.quests} quests (${item.xp} XP)`}`}
                          className={`h-7 rounded-lg border flex items-center justify-center text-[10px] font-black transition-transform hover:scale-110 cursor-pointer ${colors[item.level]} ${
                            item.isToday ? "ring-2 ring-indigo-500 font-black" : ""
                          }`}
                        >
                          {item.dayNum}
                        </div>
                      );
                    })}
                  </div>

                  {/* Heatmap Legend */}
                  <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 mt-3 pt-2 border-t border-slate-200/60">
                    <span>Rest (0)</span>
                    <div className="flex items-center gap-1.5">
                      <div className="w-3.5 h-3.5 rounded bg-slate-200/60 border border-slate-300" />
                      <div className="w-3.5 h-3.5 rounded bg-amber-200 border border-amber-300" />
                      <div className="w-3.5 h-3.5 rounded bg-amber-400 border border-amber-500" />
                      <div className="w-3.5 h-3.5 rounded bg-amber-500 border border-amber-600" />
                    </div>
                    <span>Epic (3+)</span>
                  </div>
                </div>

                {/* Monthly Milestone Projections */}
                <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-3 rounded-2xl border border-amber-200/60 flex items-center justify-between">
                  <div>
                    <span className="text-[12px] font-black text-amber-950 block">Next Level Projection</span>
                    <span className="text-[10px] text-amber-800 font-bold">
                      ~{monthlyMetrics.daysToLevel} {monthlyMetrics.daysToLevel === 1 ? "day" : "days"} at pace (~{monthlyMetrics.avgDailyXp} XP/day)
                    </span>
                  </div>
                  <span className="text-[14px] font-black text-amber-900 bg-amber-300/60 px-3 py-1 rounded-xl">
                    Lv. {level + 1}
                  </span>
                </div>
              </motion.div>
            )}
          </div>

          {/* Quests Breakdown Bar */}
          <div className="bg-white dark:bg-[#1f1b4a] rounded-[28px] p-5 shadow-soft dark:shadow-none border border-transparent dark:border-[#2e2959] space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-[14px] font-black text-slate-800 dark:text-slate-100">Quests Completed by Category</h3>
              <span className="text-[11px] font-bold text-slate-400 dark:text-indigo-300">{completedTasks.length} Total</span>
            </div>

            <div className="space-y-2.5">
              <CategoryBar label="Discipline" count={categoryCounts.DISCIPLINE} total={completedTasks.length || 1} color="bg-rose-500" />
              <CategoryBar label="Strength" count={categoryCounts.STRENGTH} total={completedTasks.length || 1} color="bg-emerald-500" />
              <CategoryBar label="Intellect" count={categoryCounts.INTELLECT} total={completedTasks.length || 1} color="bg-amber-400" />
              <CategoryBar label="Creativity" count={categoryCounts.CREATIVITY} total={completedTasks.length || 1} color="bg-blue-400" />
            </div>
          </div>
        </motion.div>
      )}

      {activeTab === "Attributes" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
          <AttributeCard
            icon="🗡️"
            name="Discipline"
            subtitle="Focus, Daily Habits, Willpower"
            value={disciplineVal}
            color="bg-rose-500"
            rankTitle={disciplineVal >= 25 ? "Veteran Knight" : "Adept Guardian"}
          />
          <AttributeCard
            icon="🍃"
            name="Strength"
            subtitle="Vitality, Physical Fitness, Energy"
            value={strengthVal}
            color="bg-emerald-500"
            rankTitle={strengthVal >= 25 ? "Ironclad Berserker" : "Steadfast Warrior"}
          />
          <AttributeCard
            icon="💖"
            name="Intellect"
            subtitle="Learning, Logic, Problem Solving"
            value={intellectVal}
            color="bg-amber-400"
            rankTitle={intellectVal >= 30 ? "Grand Sage" : "Arcane Scholar"}
          />
          <AttributeCard
            icon="🎨"
            name="Creativity"
            subtitle="Imagination, Art, Strategy"
            value={creativityVal}
            color="bg-blue-400"
            rankTitle={creativityVal >= 20 ? "Master Artisan" : "Visionary Apprentice"}
          />
        </motion.div>
      )}

      {activeTab === "Achievements" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
          {achievements.map((ach, idx) => (
            <div
              key={idx}
              className={`bg-white dark:bg-[#1f1b4a] rounded-[24px] p-4 shadow-soft dark:shadow-none flex items-center gap-3.5 border transition-all ${
                ach.unlocked
                  ? "border-amber-200/80 dark:border-amber-800/60 bg-gradient-to-r from-amber-50/40 dark:from-amber-950/20 to-white dark:to-[#1f1b4a]"
                  : "border-slate-100 dark:border-[#2e2959] opacity-75"
              }`}
            >
              <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/40 flex items-center justify-center text-2xl shrink-0 shadow-xs border border-amber-100 dark:border-amber-800/60">
                {ach.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="text-[14px] font-black text-slate-800 dark:text-slate-100">{ach.title}</h4>
                  {ach.unlocked ? (
                    <span className="text-[10px] font-black text-emerald-800 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full">
                      Completed
                    </span>
                  ) : (
                    <span className="text-[10px] font-extrabold text-slate-400 dark:text-indigo-300 bg-slate-100 dark:bg-[#13112a] px-2 py-0.5 rounded-full">
                      {ach.progress} / {ach.total}
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-400 dark:text-indigo-300 font-medium truncate mt-0.5">{ach.desc}</p>
                {/* Micro Progress Bar */}
                <div className="h-1.5 w-full bg-slate-100 dark:bg-[#13112a] rounded-full mt-2 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${ach.unlocked ? "bg-emerald-500" : "bg-amber-400"}`}
                    style={{ width: `${Math.min(100, (ach.progress / ach.total) * 100)}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      )}
    </div>
  );
}

function CategoryBar({ label, count, total, color }: any) {
  const percent = Math.min(100, Math.round((count / total) * 100));
  return (
    <div>
      <div className="flex justify-between text-[11px] font-extrabold mb-1">
        <span className="text-slate-600 dark:text-slate-300">{label}</span>
        <span className="text-slate-400 dark:text-indigo-300">{count} ({percent}%)</span>
      </div>
      <div className="h-2 w-full bg-slate-100 dark:bg-[#13112a] rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}

function AttributeCard({ icon, name, subtitle, value, color, rankTitle }: any) {
  const level = Math.max(1, Math.floor(value / 10));
  const progress = Math.min(100, (value % 10) * 10 || 50);

  return (
    <div className="bg-white dark:bg-[#1f1b4a] rounded-[26px] p-4 shadow-soft dark:shadow-none border border-transparent dark:border-[#2e2959] flex items-center gap-4">
      <div className="text-3xl shrink-0 drop-shadow-sm">{icon}</div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-0.5">
          <div>
            <h4 className="text-[14px] font-black text-slate-800 dark:text-slate-100 leading-tight">{name}</h4>
            <span className="text-[10px] font-extrabold text-amber-700 dark:text-amber-400">{rankTitle}</span>
          </div>
          <span className="text-[12px] font-extrabold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/40 px-2.5 py-0.5 rounded-full">
            Lv. {level} ({value} pts)
          </span>
        </div>
        <p className="text-[11px] text-slate-400 dark:text-indigo-300 font-medium truncate mb-2">{subtitle}</p>
        <div className="h-2 w-full bg-slate-100 dark:bg-[#13112a] rounded-full overflow-hidden">
          <div className={`h-full rounded-full ${color}`} style={{ width: `${progress}%` }} />
        </div>
      </div>
    </div>
  );
}
