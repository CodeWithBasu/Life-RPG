"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Scroll, Bot, CheckCircle2, Circle, Camera, Edit3 } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { api } from "@/lib/api";
import SageMentorModal from "@/components/SageMentorModal";
import WeeklyChronicleModal from "@/components/WeeklyChronicleModal";
import AvatarPickerModal from "@/components/AvatarPickerModal";
import { soundEngine } from "@/lib/audio";

export default function Home() {
  const ensureAuthenticated = useAuthStore((state) => state.ensureAuthenticated);
  const updateCharacter = useAuthStore((state) => state.updateCharacter);
  const user = useAuthStore((state) => state.user);
  const character = useAuthStore((state) => state.user?.character);

  const [showSageModal, setShowSageModal] = useState(false);
  const [showChronicleModal, setShowChronicleModal] = useState(false);
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [focusTask, setFocusTask] = useState<any>(null);
  const [focusDone, setFocusDone] = useState(false);

  useEffect(() => {
    ensureAuthenticated();
    api.get<any[]>("/api/tasks")
      .then((tasks) => {
        if (Array.isArray(tasks) && tasks.length > 0) {
          const active = tasks.find((t) => t.status === "ACTIVE") || tasks[0];
          setFocusTask(active);
          setFocusDone(active.status === "COMPLETED");
        }
      })
      .catch(() => {});
  }, [ensureAuthenticated]);

  const level = character?.level ?? 12;
  const currentXp = character?.currentXp ?? 320;
  const xpNeeded = Math.floor(100 * Math.pow(level, 1.5));
  const displayName = user?.displayName || "Basudev";
  const avatarUrl = user?.avatarUrl || "/avatars/paladin.jpg";
  const isEmojiAvatar = !avatarUrl.startsWith("/") && !avatarUrl.startsWith("http");

  const attributes = character?.attributes || [];
  const disciplineVal = attributes.find((a) => a.name === "DISCIPLINE")?.value ?? 24;
  const strengthVal = attributes.find((a) => a.name === "STRENGTH")?.value ?? 18;
  const intellectVal = attributes.find((a) => a.name === "INTELLECT")?.value ?? 30;

  // Real dynamic computation from character stats & streak
  const maxHp = 100 + (level - 1) * 5;
  const currentStreak = character?.streak?.currentStreak ?? 5;
  const currentHp = Math.min(maxHp, Math.round(maxHp * 0.75 + Math.min(25, currentStreak * 5)));
  const maxMana = 100 + (level - 1) * 5;
  const currentMana = Math.min(maxMana, Math.round(maxMana * 0.55 + Math.min(45, intellectVal * 1.5)));

  const handleToggleFocus = async () => {
    if (!focusTask || focusDone) return;
    setFocusDone(true);
    soundEngine.playQuestComplete();
    try {
      const res: any = await api.patch(`/api/tasks/${focusTask.id}/complete`);
      if (res?.character) {
        updateCharacter(res.character);
      }
    } catch {
      setFocusDone(false);
    }
  };

  return (
    <div className="flex flex-col gap-5 p-5 max-w-md mx-auto pb-28">
      {/* Hero Card */}
      <motion.div
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="w-full h-[225px] rounded-[32px] overflow-hidden relative shadow-soft bg-[#dbeafe]"
      >
        {/* Full Width Castle Background */}
        <div
          className="absolute inset-0 bg-cover bg-center z-0 opacity-90"
          style={{ backgroundImage: "url('/castle-bg.jpg')" }}
        ></div>

        {/* Floating Text Box Overlay with Hero Name & Title */}
        <div className="absolute top-5 right-4 w-[54%] flex flex-col z-20 text-right">
          <button
            onClick={() => setShowAvatarModal(true)}
            className="group flex items-center gap-1.5 self-end bg-white/70 dark:bg-black/50 hover:bg-white/90 dark:hover:bg-black/70 backdrop-blur-md px-3 py-1.5 rounded-2xl shadow-sm transition-all cursor-pointer border border-white/60 dark:border-white/20"
          >
            <span className="text-[15px] font-black text-slate-800 dark:text-slate-100 tracking-tight">
              {displayName}
            </span>
            <Edit3 className="w-3 h-3 text-slate-500 dark:text-amber-400 group-hover:text-amber-600 transition-colors" />
          </button>

          <span className="text-[11px] font-extrabold text-amber-900 dark:text-amber-300 bg-amber-200/80 dark:bg-amber-950/60 backdrop-blur-sm px-2.5 py-0.5 rounded-full inline-block self-end mt-1.5 shadow-xs border border-amber-300/60 dark:border-amber-800/60">
            Lv. {level} Adventurer
          </span>

          <p className="text-[11px] text-slate-800 dark:text-slate-200 mt-2 leading-snug font-bold drop-shadow-sm bg-white/40 dark:bg-black/50 backdrop-blur-sm px-3 py-2 rounded-xl border border-white/40 dark:border-white/10">
            "Small steps today, legendary tomorrow."
          </p>
        </div>

        {/* Avatar & Level Badge with interactive Change Photo */}
        <div className="absolute bottom-0 left-0 w-[55%] h-full flex items-end justify-center z-30 pb-3 pl-2">
          <div
            onClick={() => setShowAvatarModal(true)}
            className="w-[145px] h-[165px] relative group cursor-pointer"
          >
            {isEmojiAvatar ? (
              <div className="w-full h-full rounded-[28px] bg-gradient-to-br from-amber-200 to-amber-400 flex items-center justify-center text-7xl shadow-[0_10px_20px_rgba(0,0,0,0.15)] border-2 border-white">
                {avatarUrl}
              </div>
            ) : (
              <div
                className="w-full h-full bg-cover bg-center rounded-[28px] shadow-[0_10px_20px_rgba(0,0,0,0.15)] border-2 border-white"
                style={{ backgroundImage: `url('${avatarUrl}')` }}
              ></div>
            )}

            {/* Change Avatar Hover Badge */}
            <div className="absolute top-2 right-2 bg-slate-900/70 backdrop-blur-sm text-white p-1.5 rounded-full shadow-md group-hover:scale-110 transition-transform">
              <Camera className="w-3.5 h-3.5" />
            </div>

            {/* Level Badge */}
            <div className="absolute -bottom-1 -right-1 bg-slate-800 text-yellow-400 text-xs font-black px-3.5 py-1 rounded-full border-[2.5px] border-yellow-500 shadow-xl whitespace-nowrap">
              Lv. {level}
            </div>
          </div>
        </div>
      </motion.div>

      {/* AI Features Bar: Sage Mentor & Weekly Chronicle */}
      <motion.div
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.05 }}
        className="grid grid-cols-2 gap-3"
      >
        <button
          onClick={() => setShowSageModal(true)}
          className="bg-white dark:bg-[#1f1b4a] rounded-[24px] p-3.5 shadow-soft dark:shadow-none border border-amber-100 dark:border-[#2e2959] flex items-center gap-3 hover:scale-[1.02] active:scale-[0.98] transition-transform text-left cursor-pointer"
        >
          <div className="w-11 h-11 rounded-2xl bg-amber-400 dark:bg-amber-500/20 flex items-center justify-center text-xl shrink-0 shadow-sm">
            🧙‍♂️
          </div>
          <div>
            <div className="flex items-center gap-1">
              <span className="text-[13px] font-black text-slate-800 dark:text-slate-100">Ask Sage</span>
              <Sparkles className="w-3 h-3 text-amber-500" />
            </div>
            <p className="text-[10px] text-slate-400 dark:text-indigo-300 font-bold">AI Companion</p>
          </div>
        </button>

        <button
          onClick={() => setShowChronicleModal(true)}
          className="bg-white dark:bg-[#1f1b4a] rounded-[24px] p-3.5 shadow-soft dark:shadow-none border border-amber-100 dark:border-[#2e2959] flex items-center gap-3 hover:scale-[1.02] active:scale-[0.98] transition-transform text-left cursor-pointer"
        >
          <div className="w-11 h-11 rounded-2xl bg-amber-100 dark:bg-amber-950/40 flex items-center justify-center text-xl shrink-0 shadow-sm">
            📜
          </div>
          <div>
            <div className="flex items-center gap-1">
              <span className="text-[13px] font-black text-slate-800 dark:text-slate-100">Chronicle</span>
              <Sparkles className="w-3 h-3 text-amber-500" />
            </div>
            <p className="text-[10px] text-slate-400 dark:text-indigo-300 font-bold">AI Weekly Lore</p>
          </div>
        </button>
      </motion.div>

      {/* Progress Bars Container */}
      <motion.div
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="bg-white dark:bg-[#1f1b4a] rounded-[32px] p-5 shadow-soft dark:shadow-none flex flex-col gap-5 border border-transparent dark:border-[#2e2959]"
      >
        <ProgressBar icon="❤️" label="HP" colorClass="gel-bar-red" current={currentHp} max={maxHp} />
        <div className="h-px w-full bg-slate-100 dark:bg-[#2e2959]"></div>
        <ProgressBar icon="💧" label="Mana" colorClass="gel-bar-blue" current={currentMana} max={maxMana} />
        <div className="h-px w-full bg-slate-100 dark:bg-[#2e2959]"></div>
        <ProgressBar
          icon="⭐"
          label="Mastery XP"
          colorClass="gel-bar-yellow"
          current={currentXp}
          max={xpNeeded}
        />
      </motion.div>

      {/* Attributes */}
      <motion.div
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-white dark:bg-[#1f1b4a] rounded-[32px] p-4 shadow-soft dark:shadow-none grid grid-cols-3 divide-x divide-slate-100 dark:divide-[#2e2959] border border-transparent dark:border-[#2e2959]"
      >
        <AttributeItem icon="🗡️" label="Discipline" value={disciplineVal} />
        <AttributeItem icon="🍃" label="Strength" value={strengthVal} />
        <AttributeItem icon="💖" label="Intellect" value={intellectVal} />
      </motion.div>

      {/* Interactive Today's Focus */}
      <motion.div
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        onClick={handleToggleFocus}
        className="bg-white dark:bg-[#1f1b4a] rounded-[28px] p-4 shadow-soft dark:shadow-none flex gap-3.5 items-center cursor-pointer hover:bg-slate-50 dark:hover:bg-[#2d285c] transition-colors border border-transparent dark:border-[#2e2959]"
      >
        <div className="text-3xl shrink-0 drop-shadow-sm">☀️</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="text-[14px] font-extrabold text-slate-800 dark:text-slate-100">Today's Focus</h3>
            <span className="text-[10px] font-bold text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-950/50 px-2 py-0.5 rounded-full">
              Primary
            </span>
          </div>
          <p className="text-[12px] text-slate-500 dark:text-indigo-300 mt-0.5 truncate font-medium">
            {focusTask?.title || "Morning Routine — Set the tone for a legendary day."}
          </p>
        </div>
        <button className="shrink-0 p-1">
          {focusDone ? (
            <CheckCircle2 className="w-6 h-6 text-emerald-500 fill-emerald-100 dark:fill-emerald-950" />
          ) : (
            <Circle className="w-6 h-6 text-slate-300 dark:text-indigo-400 hover:text-amber-500 transition-colors" />
          )}
        </button>
      </motion.div>

      {/* AI Sage Mentor Modal */}
      <SageMentorModal isOpen={showSageModal} onClose={() => setShowSageModal(false)} />

      {/* AI Weekly Chronicle Modal */}
      <WeeklyChronicleModal isOpen={showChronicleModal} onClose={() => setShowChronicleModal(false)} />

      {/* Hero Avatar & Identity Modal */}
      <AvatarPickerModal isOpen={showAvatarModal} onClose={() => setShowAvatarModal(false)} />
    </div>
  );
}

function ProgressBar({ icon, label, colorClass, current, max }: any) {
  const percent = Math.min(100, Math.max(0, (current / (max || 1)) * 100));
  return (
    <div className="flex items-center gap-3">
      <div className="text-2xl shrink-0 drop-shadow-sm">{icon}</div>
      <span className="text-sm font-bold text-slate-700 dark:text-amber-50 w-[72px] shrink-0">{label}</span>

      <div className="flex-1 h-5 bg-slate-100/80 dark:bg-black/40 rounded-full overflow-hidden shadow-inner-soft dark:shadow-none p-0.5 flex">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className={`h-full rounded-full ${colorClass}`}
        />
      </div>

      <span className="text-xs font-bold text-slate-500 dark:text-indigo-300 w-[72px] text-right shrink-0">
        {current} / {max}
      </span>
    </div>
  );
}

function AttributeItem({ icon, label, value }: any) {
  return (
    <div className="flex flex-col items-center justify-center gap-1 py-2">
      <div className="text-3xl drop-shadow-md">{icon}</div>
      <span className="text-[12px] font-bold text-slate-800 dark:text-indigo-200 capitalize">{label}</span>
      <span className="text-[11px] font-extrabold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded-full">
        +{value}
      </span>
    </div>
  );
}
