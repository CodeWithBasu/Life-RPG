"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Check, Sparkles, UserCheck, Shield } from "lucide-react";
import { useAuthStore } from "@/store/authStore";

interface AvatarPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PRESET_AVATARS = [
  { id: "paladin", label: "Paladin Knight", desc: "Valiant & Resolute", url: "/avatars/paladin.jpg" },
  { id: "mage", label: "Arcane Mage", desc: "Wise & Focused", url: "/avatars/mage.jpg" },
  { id: "ranger", label: "Forest Ranger", desc: "Agile & Perceptive", url: "/avatars/ranger.jpg" },
  { id: "warrior", label: "Brave Warrior", desc: "Strong & Steadfast", url: "/avatars/warrior.jpg" },
  { id: "classic", label: "Classic Hero", desc: "A Brighter You", url: "/avatars/default.jpg" },
];

const EMOJI_AVATARS = [
  "🧙‍♂️", "🧝‍♀️", "⚔️", "🛡️", "👑", "🏹", "🐲", "🦊", "⚡", "🌟", "🦉", "🐺"
];

export default function AvatarPickerModal({ isOpen, onClose }: AvatarPickerModalProps) {
  const user = useAuthStore((state) => state.user);
  const character = useAuthStore((state) => state.user?.character);
  const updateProfile = useAuthStore((state) => state.updateProfile);

  const [selectedAvatar, setSelectedAvatar] = useState<string>("/avatars/paladin.jpg");
  const [heroName, setHeroName] = useState<string>("Basudev");
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (user) {
      if (user.avatarUrl) setSelectedAvatar(user.avatarUrl);
      if (user.displayName) setHeroName(user.displayName);
    }
  }, [user, isOpen]);

  const isEmoji = (str: string) => !str.startsWith("/") && !str.startsWith("http");

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!heroName.trim() || isSaving) return;

    setIsSaving(true);
    try {
      await updateProfile({
        displayName: heroName.trim(),
        avatarUrl: selectedAvatar,
      });
      setSavedSuccess(true);
      setTimeout(() => {
        setSavedSuccess(false);
        onClose();
      }, 700);
    } catch (err) {
      console.error("Failed to save hero profile:", err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 15 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 15 }}
            className="bg-white rounded-[32px] p-6 max-w-sm w-full shadow-2xl relative max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🎭</span>
                <div>
                  <h2 className="text-[18px] font-black text-slate-800 leading-tight">Hero Identity</h2>
                  <p className="text-[11px] text-slate-400 font-bold">Customize your persona</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Live Profile Preview */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200/60 rounded-2xl p-3.5 mb-4 flex items-center gap-3.5">
              <div className="relative w-16 h-16 shrink-0">
                {isEmoji(selectedAvatar) ? (
                  <div className="w-16 h-16 rounded-2xl bg-amber-200 flex items-center justify-center text-3xl shadow-md">
                    {selectedAvatar}
                  </div>
                ) : (
                  <img
                    src={selectedAvatar}
                    alt="Preview"
                    className="w-16 h-16 rounded-2xl object-cover shadow-md border-2 border-amber-400"
                  />
                )}
                <div className="absolute -bottom-1 -right-1 bg-slate-800 text-yellow-400 text-[9px] font-black px-1.5 py-0.5 rounded-full border border-yellow-500">
                  Lv.{character?.level ?? 12}
                </div>
              </div>

              <div className="min-w-0 flex-1">
                <h3 className="text-[15px] font-extrabold text-slate-800 truncate">
                  {heroName.trim() || "Adventurer"}
                </h3>
                <div className="flex items-center gap-1 mt-0.5">
                  <Shield className="w-3 h-3 text-amber-600" />
                  <span className="text-[11px] text-amber-800 font-bold">
                    {PRESET_AVATARS.find((a) => a.url === selectedAvatar)?.label || "Legendary Hero"}
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 font-medium">Ready for grand adventures</p>
              </div>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              {/* Hero Name Input */}
              <div>
                <label className="block text-[12px] font-extrabold text-slate-600 mb-1">
                  Hero Name
                </label>
                <input
                  type="text"
                  required
                  maxLength={24}
                  value={heroName}
                  onChange={(e) => setHeroName(e.target.value)}
                  placeholder="e.g. Basudev, Sir Roland..."
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-[14px] font-bold text-slate-800 focus:outline-none focus:border-amber-400"
                />
              </div>

              {/* Portrait Avatars */}
              <div>
                <label className="block text-[12px] font-extrabold text-slate-600 mb-2">
                  RPG Class Portraits
                </label>
                <div className="grid grid-cols-3 gap-2.5">
                  {PRESET_AVATARS.map((av) => {
                    const isSelected = selectedAvatar === av.url;
                    return (
                      <button
                        key={av.id}
                        type="button"
                        onClick={() => setSelectedAvatar(av.url)}
                        className={`relative rounded-2xl p-1 border-2 transition-all flex flex-col items-center cursor-pointer ${
                          isSelected
                            ? "border-amber-500 bg-amber-50/70 shadow-md scale-105"
                            : "border-slate-200 hover:border-amber-300 bg-white"
                        }`}
                      >
                        <div className="w-14 h-14 rounded-xl overflow-hidden mb-1">
                          <img
                            src={av.url}
                            alt={av.label}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <span className="text-[10px] font-extrabold text-slate-700 leading-tight text-center truncate w-full">
                          {av.label.split(" ")[0]}
                        </span>
                        {isSelected && (
                          <div className="absolute top-1 right-1 w-4 h-4 bg-amber-500 rounded-full flex items-center justify-center">
                            <Check className="w-2.5 h-2.5 text-white stroke-[3]" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Emoji Heroes */}
              <div>
                <label className="block text-[12px] font-extrabold text-slate-600 mb-1.5">
                  Playful Emoji Icons
                </label>
                <div className="grid grid-cols-6 gap-2">
                  {EMOJI_AVATARS.map((emoji) => {
                    const isSelected = selectedAvatar === emoji;
                    return (
                      <button
                        key={emoji}
                        type="button"
                        onClick={() => setSelectedAvatar(emoji)}
                        className={`w-10 h-10 rounded-xl text-xl flex items-center justify-center transition-all cursor-pointer ${
                          isSelected
                            ? "bg-amber-400 shadow-md scale-110 ring-2 ring-amber-500"
                            : "bg-slate-100 hover:bg-amber-100"
                        }`}
                      >
                        {emoji}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSaving || !heroName.trim()}
                  className="w-full gel-bar-yellow text-yellow-900 font-black py-3 rounded-2xl shadow-md hover:brightness-105 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {savedSuccess ? (
                    <>
                      <Check className="w-4 h-4 text-yellow-950 stroke-[3]" />
                      <span>Profile Saved!</span>
                    </>
                  ) : isSaving ? (
                    <span>Inscribing Codex...</span>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-yellow-950" />
                      <span>Save Hero Persona</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
