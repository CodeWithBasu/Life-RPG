"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, LogOut, X, Check, Bell, Volume2, Shield, HelpCircle, Sliders } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import AvatarPickerModal from "@/components/AvatarPickerModal";
import { soundEngine } from "@/lib/audio";

export default function MorePage() {
  const router = useRouter();
  const [toastMessage, setToastMessage] = useState("");
  const ensureAuthenticated = useAuthStore((state) => state.ensureAuthenticated);
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);
  const updateProfile = useAuthStore((state) => state.updateProfile);
  const logout = useAuthStore((state) => state.logout);

  // Modals & States
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [hapticsEnabled, setHapticsEnabled] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [dailyGoalTarget, setDailyGoalTarget] = useState(3);

  useEffect(() => {
    ensureAuthenticated();
    setSoundEnabled(soundEngine.isSoundEnabled());
    setHapticsEnabled(soundEngine.isHapticsEnabled());
    if (user?.displayName) {
      setEditName(user.displayName);
    }
  }, [ensureAuthenticated, user?.displayName]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 2200);
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editName.trim() || !user) return;
    await updateProfile({ displayName: editName.trim() });
    setActiveModal(null);
    showToast(`Hero name updated to "${editName.trim()}"!`);
  };

  const handleLogout = async () => {
    try {
      await logout();
      showToast("Logged out successfully! Farewell, Hero...");
      setTimeout(() => {
        router.push("/login");
      }, 500);
    } catch (e) {
      router.push("/login");
    }
  };

  const displayName = user?.displayName || "Basudev";
  const displayEmail = user?.email || "hero@liferpg.com";
  const avatarUrl = user?.avatarUrl || "/avatars/paladin.jpg";
  const isEmojiAvatar = !avatarUrl.startsWith("/") && !avatarUrl.startsWith("http");

  return (
    <div className="flex flex-col gap-6 p-5 max-w-md mx-auto pb-32 relative">
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-5 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-full text-xs font-extrabold shadow-lg"
          >
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="px-2 mt-2">
        <h1 className="text-[24px] font-extrabold text-slate-800 dark:text-slate-100">Settings & More</h1>
        <p className="text-[13px] text-slate-500 dark:text-indigo-300 font-medium">Manage your adventure.</p>
      </div>

      {/* Profile Summary Card */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setActiveModal("avatar")}
        className="bg-white dark:bg-[#1f1b4a] rounded-[32px] p-5 shadow-soft dark:shadow-none border border-transparent dark:border-[#2e2959] flex items-center gap-4 cursor-pointer"
      >
        <div className="w-16 h-16 rounded-full overflow-hidden border-[3px] border-slate-100 dark:border-indigo-800 shadow-sm shrink-0 bg-slate-100 dark:bg-indigo-950 flex items-center justify-center text-3xl">
           {isEmojiAvatar ? (
             <span>{avatarUrl}</span>
           ) : (
             <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
           )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h2 className="text-[18px] font-extrabold text-slate-800 dark:text-slate-100 leading-tight truncate">{displayName}</h2>
            <span className="text-[10px] bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300 font-black px-2 py-0.5 rounded-full">Lv.{user?.character?.level || 1}</span>
          </div>
          <p className="text-[12px] font-bold text-slate-400 dark:text-indigo-300 mt-0.5 truncate">{displayEmail}</p>
        </div>
        <button className="bg-slate-100 dark:bg-[#13112a] p-2 rounded-full text-slate-400 dark:text-indigo-300">
          <ChevronRight className="w-5 h-5" />
        </button>
      </motion.div>

      {/* Settings Menu List */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col gap-3"
      >
        <MenuRow
          iconPath="/icons/account.jpg"
          title="Account Settings"
          subtitle="Change Hero Name, Credentials"
          onClick={() => {
            setEditName(displayName);
            setActiveModal("profile");
          }}
        />
        <MenuRow
          iconPath="/icons/bell.jpg"
          title="Notifications"
          subtitle={notificationsEnabled ? "Daily Streak Reminders: Active" : "Reminders: Paused"}
          onClick={() => setActiveModal("notifications")}
        />
        <MenuRow
          iconPath="/icons/gear.jpg"
          title="Game Preferences"
          subtitle={`Daily Target: ${dailyGoalTarget} Quests`}
          onClick={() => setActiveModal("preferences")}
        />
        <MenuRow
          iconPath="/icons/speaker.jpg"
          title="Sound & Haptics"
          subtitle={soundEnabled ? "BGM & Level-Up Fanfare: On" : "Sound Effects: Muted"}
          onClick={() => setActiveModal("sound")}
        />
        <MenuRow
          iconPath="/icons/help.jpg"
          title="Help & Lore"
          subtitle="Game Mechanics, XP Formula, FAQ"
          onClick={() => setActiveModal("help")}
        />
      </motion.div>

      {/* Danger Zone */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="mt-2"
      >
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleLogout}
          className="w-full bg-rose-500 rounded-[24px] p-4 flex items-center justify-center gap-2 text-white shadow-[0_8px_16px_-4px_rgba(244,63,94,0.3),inset_0_-4px_0_rgba(159,18,57,0.4)] hover:brightness-110 transition-all border border-rose-400 cursor-pointer"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-extrabold text-[16px]">Log Out ({displayName})</span>
        </motion.button>
        <p className="text-center text-[11px] font-bold text-slate-400 mt-5">Life RPG v1.0.0</p>
      </motion.div>

      {/* Interactive Modals */}
      <AnimatePresence>
        {/* Full Hero Profile & Avatar Modal */}
        <AvatarPickerModal
          isOpen={activeModal === "profile" || activeModal === "avatar"}
          onClose={() => setActiveModal(null)}
        />

        {/* Notifications Modal */}
        {activeModal === "notifications" && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-[32px] p-6 max-w-sm w-full shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-[17px] font-black text-slate-800">Notifications</h3>
                <button onClick={() => setActiveModal(null)} className="p-1 text-slate-400">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex items-center justify-between bg-slate-50 p-4 rounded-2xl">
                <div>
                  <span className="text-[13px] font-bold text-slate-700 block">Daily Streak Alarm</span>
                  <span className="text-[11px] text-slate-400">Remind at 8:00 PM UTC</span>
                </div>
                <button
                  onClick={() => {
                    setNotificationsEnabled(!notificationsEnabled);
                    showToast(notificationsEnabled ? "Notifications muted" : "Daily reminders active!");
                  }}
                  className={`w-12 h-7 rounded-full transition-colors relative p-1 ${
                    notificationsEnabled ? "bg-amber-400" : "bg-slate-300"
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${
                      notificationsEnabled ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              <button
                onClick={() => setActiveModal(null)}
                className="w-full py-2.5 bg-slate-100 font-bold text-slate-600 rounded-2xl"
              >
                Close
              </button>
            </motion.div>
          </div>
        )}

        {/* Sound Modal */}
        {activeModal === "sound" && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-[32px] p-6 max-w-sm w-full shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-[17px] font-black text-slate-800">Sound & Audio</h3>
                <button onClick={() => setActiveModal(null)} className="p-1 text-slate-400">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex items-center justify-between bg-slate-50 p-4 rounded-2xl">
                <div>
                  <span className="text-[13px] font-bold text-slate-700 block">Fanfare & Chimes</span>
                  <span className="text-[11px] text-slate-400">Level-up and quest chimes</span>
                </div>
                <button
                  onClick={() => {
                    const next = !soundEnabled;
                    setSoundEnabled(next);
                    soundEngine.setSoundEnabled(next);
                    if (next) soundEngine.playQuestComplete();
                    showToast(next ? "Audio chimes enabled!" : "Audio chimes muted");
                  }}
                  className={`w-12 h-7 rounded-full transition-colors relative p-1 cursor-pointer ${
                    soundEnabled ? "bg-amber-400" : "bg-slate-300"
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${
                      soundEnabled ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between bg-slate-50 p-4 rounded-2xl">
                <div>
                  <span className="text-[13px] font-bold text-slate-700 block">Haptic Feedback</span>
                  <span className="text-[11px] text-slate-400">Tactile buzz on tap & level up</span>
                </div>
                <button
                  onClick={() => {
                    const next = !hapticsEnabled;
                    setHapticsEnabled(next);
                    soundEngine.setHapticsEnabled(next);
                    if (next) soundEngine.vibrate([40, 30, 45]);
                    showToast(next ? "Haptics enabled!" : "Haptics disabled");
                  }}
                  className={`w-12 h-7 rounded-full transition-colors relative p-1 cursor-pointer ${
                    hapticsEnabled ? "bg-amber-400" : "bg-slate-300"
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${
                      hapticsEnabled ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              <button
                onClick={() => setActiveModal(null)}
                className="w-full py-2.5 bg-slate-100 font-bold text-slate-600 rounded-2xl"
              >
                Close
              </button>
            </motion.div>
          </div>
        )}

        {/* Game Preferences Modal */}
        {activeModal === "preferences" && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-[32px] p-6 max-w-sm w-full shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-[17px] font-black text-slate-800">Daily Quest Target</h3>
                <button onClick={() => setActiveModal(null)} className="p-1 text-slate-400">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex items-center justify-center gap-4 py-3">
                {[1, 3, 5, 7].map((num) => (
                  <button
                    key={num}
                    onClick={() => {
                      setDailyGoalTarget(num);
                      showToast(`Daily target set to ${num} quests!`);
                    }}
                    className={`w-12 h-12 rounded-2xl font-black text-sm transition-all ${
                      dailyGoalTarget === num
                        ? "gel-bar-yellow text-yellow-900 shadow-md scale-110"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setActiveModal(null)}
                className="w-full gel-bar-yellow text-yellow-900 font-black py-2.5 rounded-2xl shadow-sm"
              >
                Save Preferences
              </button>
            </motion.div>
          </div>
        )}

        {/* Help & Lore Modal */}
        {activeModal === "help" && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-[32px] p-6 max-w-sm w-full shadow-2xl space-y-3.5 text-xs text-slate-600 max-h-[80vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <h3 className="text-[16px] font-black text-slate-800">Life RPG Rulebook</h3>
                <button onClick={() => setActiveModal(null)} className="p-1 text-slate-400">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-2">
                <div className="bg-amber-50 p-3 rounded-xl border border-amber-200/50">
                  <span className="font-extrabold text-amber-900 block mb-0.5">⭐ Leveling Formula</span>
                  <span>XP to next level = Math.floor(100 * level^1.5). Large XP rewards smoothly roll over multiple levels!</span>
                </div>

                <div className="bg-amber-50 p-3 rounded-xl border border-amber-200/50">
                  <span className="font-extrabold text-amber-900 block mb-0.5">🔥 Streak Bonus Multiplier</span>
                  <span>Gain +5% bonus XP per full 5-day streak, capped at +25% at 25 days!</span>
                </div>

                <div className="bg-amber-50 p-3 rounded-xl border border-amber-200/50">
                  <span className="font-extrabold text-amber-900 block mb-0.5">🤖 Narrative AI</span>
                  <span>Sage and the chronicler narrate your hero journey based on verified server stats.</span>
                </div>
              </div>

              <button
                onClick={() => setActiveModal(null)}
                className="w-full py-2.5 bg-slate-100 font-bold text-slate-600 rounded-2xl"
              >
                Close
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-28 left-1/2 -translate-x-1/2 bg-slate-800 text-white px-6 py-3 rounded-full shadow-xl font-bold text-[13px] z-50 whitespace-nowrap border border-slate-700 flex items-center gap-2"
          >
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function MenuRow({ iconPath, title, subtitle, onClick }: any) {
  return (
    <motion.div
      whileTap={{ scale: 0.96 }}
      onClick={onClick}
      className="bg-white dark:bg-[#1f1b4a] rounded-[24px] p-3.5 shadow-soft dark:shadow-none border border-transparent dark:border-[#2e2959] flex items-center gap-4 cursor-pointer hover:bg-slate-50 dark:hover:bg-[#2d285c] transition-colors"
    >
      <div className="w-14 h-14 flex items-center justify-center shrink-0">
        <img src={iconPath} className="w-full h-full object-contain mix-blend-multiply dark:mix-blend-normal dark:opacity-90" alt={title} />
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="text-[15px] font-extrabold text-slate-800 dark:text-slate-100 leading-tight truncate">{title}</h3>
        <p className="text-[11px] font-bold text-slate-400 dark:text-indigo-300 mt-0.5 truncate">{subtitle}</p>
      </div>
      <ChevronRight className="w-5 h-5 text-slate-300 dark:text-indigo-400 mr-2 shrink-0" />
    </motion.div>
  );
}
