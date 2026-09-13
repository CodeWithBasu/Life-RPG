"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Sparkles, Bot } from "lucide-react";
import { api } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";

interface Message {
  role: "user" | "sage";
  text: string;
}

interface SageMentorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SageMentorModal({ isOpen, onClose }: SageMentorModalProps) {
  const character = useAuthStore((state) => state.user?.character);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "sage",
      text: `Greetings, traveler. I am Sage, chronicler of thy deeds. Thy blade rests at Level ${
        character?.level ?? 12
      }. What wisdom dost thou seek?`,
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const quickPrompts = [
    "Which attribute should I train?",
    "How do I protect my streak?",
    "Give me daily inspiration.",
  ];

  const handleSend = async (messageText?: string) => {
    const textToSend = (messageText || input).trim();
    if (!textToSend || isTyping) return;

    setInput("");
    const userMsg: Message = { role: "user", text: textToSend };
    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    try {
      const historyStr = messages
        .map((m) => `${m.role === "user" ? "Player" : "Sage"}: ${m.text}`)
        .join("\n");

      const res: any = await api.post("/api/ai/mentor", {
        message: textToSend,
        history: historyStr,
      });

      const reply = res?.reply || "The stars veil thy path, yet thy resolve remains true.";
      setMessages((prev) => [...prev, { role: "sage", text: reply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "sage",
          text: `Stay steadfast, hero of Level ${
            character?.level ?? 12
          }. Even in quiet shadows, thy ${character?.streak?.currentStreak ?? 5}-day momentum guides thee.`,
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/50 backdrop-blur-sm">
          <motion.div
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="w-full max-w-md bg-white rounded-t-[36px] sm:rounded-[36px] shadow-2xl flex flex-col max-h-[85vh] h-[600px] overflow-hidden"
          >
            {/* Header */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-amber-50 to-yellow-50">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-400 flex items-center justify-center text-2xl shadow-md border-2 border-white">
                  🧙‍♂️
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h2 className="text-[17px] font-black text-slate-800">Sage</h2>
                    <span className="text-[10px] font-extrabold uppercase tracking-wide bg-amber-200/60 text-amber-900 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-amber-700" /> AI Mentor
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 font-bold">In-Game Companion & Guide</p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="p-2 rounded-full text-slate-400 hover:text-slate-600 bg-white/60 shadow-sm transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Chat Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-slate-50/50">
              {messages.map((m, idx) => (
                <div
                  key={idx}
                  className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[82%] p-3.5 rounded-2xl text-[13px] leading-relaxed shadow-sm ${
                      m.role === "user"
                        ? "bg-amber-400 text-amber-950 font-bold rounded-tr-none shadow-amber-200"
                        : "bg-white text-slate-700 font-medium rounded-tl-none border border-slate-100"
                    }`}
                  >
                    {m.text}
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white p-3.5 rounded-2xl rounded-tl-none border border-slate-100 shadow-sm flex items-center gap-1.5 text-xs text-slate-400 font-bold">
                    <Bot className="w-4 h-4 text-amber-500 animate-spin" />
                    <span>Sage is contemplating...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Prompts */}
            <div className="p-3 bg-white border-t border-slate-100 flex gap-1.5 overflow-x-auto scrollbar-hide">
              {quickPrompts.map((prompt, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(prompt)}
                  disabled={isTyping}
                  className="whitespace-nowrap bg-amber-50 hover:bg-amber-100 active:scale-95 text-amber-900 text-[11px] font-bold px-3 py-1.5 rounded-full border border-amber-200/50 transition-all cursor-pointer"
                >
                  {prompt}
                </button>
              ))}
            </div>

            {/* Input Footer */}
            <div className="p-3.5 bg-white border-t border-slate-100 flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Ask Sage for guidance..."
                className="flex-1 px-4 py-3 bg-slate-100/80 rounded-2xl text-[13px] text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-300"
              />
              <button
                onClick={() => handleSend()}
                disabled={!input.trim() || isTyping}
                className="w-11 h-11 rounded-2xl gel-bar-yellow text-yellow-900 flex items-center justify-center shadow-md disabled:opacity-40 active:scale-95 transition-transform"
              >
                <Send className="w-4 h-4 stroke-[2.5]" />
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
