"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Mail, Lock, EyeOff, ArrowRight } from "lucide-react";
import { GoogleIcon, AppleIcon, DiscordIcon } from "@/components/SocialIcons";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { api } from "@/lib/api";

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const router = useRouter();
  const setToken = useAuthStore((state) => state.setToken);
  const setUser = useAuthStore((state) => state.setUser);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const data = await api.post<{ token: string; user: any }>('/auth/login', { email, password });
      setToken(data.token);
      setUser(data.user);
      router.push('/'); // Navigate to home
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-[#dff2ff] to-white relative overflow-hidden dark:from-[#13112a] dark:to-[#1a1740]">
      
      {/* Background Graphic (Castle) */}
      <div 
        className="absolute top-0 inset-x-0 h-[50vh] bg-cover bg-center z-0 opacity-40 dark:opacity-20 pointer-events-none"
        style={{ maskImage: "linear-gradient(to bottom, black 40%, transparent 100%)", WebkitMaskImage: "linear-gradient(to bottom, black 40%, transparent 100%)", backgroundImage: "url('/castle-bg.jpg')" }}
      ></div>

      {/* Top Header */}
      <div className="relative z-10 flex flex-col items-center pt-12 px-6">
        <Link href="/" className="absolute top-12 right-6 text-[15px] font-bold text-slate-500 dark:text-slate-400 hover:text-slate-700">
          Skip
        </Link>
        
        <div className="flex items-center gap-2 mt-2">
          <span className="text-4xl drop-shadow-sm">👑</span>
          <span className="text-[32px] font-extrabold text-amber-500 tracking-tight" style={{ textShadow: "0 1px 2px rgba(217,119,6,0.1)" }}>
            Life RPG
          </span>
        </div>
        <p className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.2em] mt-1.5 drop-shadow-sm">
          Real Progress. A Brighter You.
        </p>

        {/* Character Image */}
        <div className="mt-6 relative w-[220px] h-[220px] flex items-end justify-center">
           <img 
            src="/avatar.jpg" 
            alt="Character" 
            className="w-full h-full object-cover rounded-full shadow-[0_10px_40px_rgba(0,0,0,0.15)] border-4 border-white/50"
            style={{ clipPath: 'circle(48% at 50% 50%)' }}
           />
           {/* Floating quote */}
           <motion.div 
            initial={{ y: 5, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="absolute -right-4 top-10 bg-white/80 dark:bg-black/60 backdrop-blur-md px-3 py-2 rounded-2xl rounded-bl-sm shadow-md z-20 max-w-[120px]"
           >
             <p className="text-[12px] font-bold text-slate-800 dark:text-slate-200 leading-tight italic text-center">
               "Small steps today, legendary tomorrow."
             </p>
           </motion.div>
        </div>
      </div>

      {/* Login Card */}
      <motion.div 
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        transition={{ type: "spring", bounce: 0, duration: 0.8 }}
        className="relative z-20 flex-1 bg-white dark:bg-[#1f1b4a] mt-[-20px] rounded-t-[40px] shadow-[0_-10px_40px_rgba(0,0,0,0.05)] dark:shadow-none flex flex-col items-center pt-8 px-6 pb-8 border-t border-white/40 dark:border-[#2e2959]"
      >
        <h1 className="text-[22px] font-extrabold text-slate-800 dark:text-slate-100 text-center leading-tight">
          Your Real Life Adventure<br />Starts Here
        </h1>
        <p className="text-[13px] font-medium text-slate-500 dark:text-indigo-300 text-center mt-3 max-w-[280px] leading-snug">
          Build better habits, complete quests, and become a brighter you.
        </p>

        {/* 3 Icons */}
        <div className="flex items-center justify-center gap-6 mt-6 mb-4 w-full">
          <div className="flex flex-col items-center gap-1.5 w-20">
            <span className="text-3xl drop-shadow-sm">🗡️</span>
            <span className="text-[10px] font-bold text-slate-600 dark:text-indigo-200 text-center leading-tight">Build<br/>Discipline</span>
          </div>
          <div className="flex flex-col items-center gap-1.5 w-20">
            <span className="text-3xl drop-shadow-sm">🍃</span>
            <span className="text-[10px] font-bold text-slate-600 dark:text-indigo-200 text-center leading-tight">Grow<br/>Every Day</span>
          </div>
          <div className="flex flex-col items-center gap-1.5 w-20">
            <span className="text-3xl drop-shadow-sm">❤️</span>
            <span className="text-[10px] font-bold text-slate-600 dark:text-indigo-200 text-center leading-tight">A Kinder<br/>You</span>
          </div>
        </div>

        {error && (
          <div className="mb-4 w-full p-3 rounded-xl bg-red-500/10 border border-red-500/50 text-red-500 dark:text-red-400 text-sm font-bold text-center">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-3.5">
          {/* Email */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Mail className="w-5 h-5 text-slate-400 dark:text-indigo-400" />
            </div>
            <input 
              type="email" 
              placeholder="Email address"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-[#f8fafc] dark:bg-[#13112a] border border-slate-100 dark:border-[#2e2959] rounded-2xl text-[15px] font-bold text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-indigo-400 focus:outline-none focus:ring-2 focus:ring-amber-400/50 transition-shadow"
            />
          </div>

          {/* Password */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Lock className="w-5 h-5 text-slate-400 dark:text-indigo-400" />
            </div>
            <input 
              type="password" 
              placeholder="Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-12 pr-12 py-4 bg-[#f8fafc] dark:bg-[#13112a] border border-slate-100 dark:border-[#2e2959] rounded-2xl text-[15px] font-bold text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-indigo-400 focus:outline-none focus:ring-2 focus:ring-amber-400/50 transition-shadow"
            />
            <button type="button" className="absolute inset-y-0 right-0 pr-4 flex items-center">
              <EyeOff className="w-5 h-5 text-slate-400 dark:text-indigo-400 hover:text-slate-600 dark:hover:text-indigo-300 transition-colors" />
            </button>
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between mt-1 mb-2 px-1">
            <label className="flex items-center gap-2 cursor-pointer group">
              <div className="w-5 h-5 rounded-[6px] bg-[#3b82f6] flex items-center justify-center shadow-sm group-active:scale-95 transition-transform">
                <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"></path></svg>
              </div>
              <span className="text-[13px] font-bold text-slate-600 dark:text-indigo-200">Remember me</span>
            </label>
            <Link href="#" className="text-[13px] font-bold text-slate-500 dark:text-indigo-300 hover:text-slate-800 dark:hover:text-slate-100">
              Forgot password?
            </Link>
          </div>

          {/* Log In Button */}
          <button 
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-b from-amber-300 to-amber-400 disabled:from-amber-200 disabled:to-amber-300 text-amber-950 font-black text-[17px] py-4 rounded-2xl shadow-[0_4px_0_#d97706] disabled:shadow-none hover:translate-y-[2px] hover:shadow-[0_2px_0_#d97706] transition-all active:translate-y-[4px] active:shadow-none flex items-center justify-center gap-2"
          >
            {isLoading ? 'Logging in...' : 'Log In'}
            {!isLoading && <ArrowRight className="w-5 h-5" />}
          </button>
        </form>

        {/* OR Divider */}
        <div className="flex items-center w-full gap-4 mt-8 mb-6">
          <div className="flex-1 h-px bg-slate-200 dark:bg-[#2e2959]"></div>
          <span className="text-[11px] font-bold text-slate-400 dark:text-indigo-400 tracking-widest uppercase">Or continue with</span>
          <div className="flex-1 h-px bg-slate-200 dark:bg-[#2e2959]"></div>
        </div>

        {/* Social Buttons */}
        <div className="flex items-center justify-center gap-4 w-full">
          <button type="button" className="flex-1 bg-[#f8fafc] dark:bg-[#13112a] border border-slate-100 dark:border-[#2e2959] py-3 rounded-2xl flex items-center justify-center hover:bg-slate-50 dark:hover:bg-[#2d285c] active:scale-95 transition-all shadow-sm">
            <GoogleIcon />
          </button>
          <button type="button" className="flex-1 bg-[#f8fafc] dark:bg-[#13112a] border border-slate-100 dark:border-[#2e2959] py-3 rounded-2xl flex items-center justify-center text-slate-800 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-[#2d285c] active:scale-95 transition-all shadow-sm">
            <AppleIcon />
          </button>
          <button type="button" className="flex-1 bg-[#f8fafc] dark:bg-[#13112a] border border-slate-100 dark:border-[#2e2959] py-3 rounded-2xl flex items-center justify-center hover:bg-slate-50 dark:hover:bg-[#2d285c] active:scale-95 transition-all shadow-sm">
            <DiscordIcon />
          </button>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-[14px] font-medium text-slate-500 dark:text-indigo-300">
            Don't have an account? <Link href="/register" className="font-extrabold text-[#3b82f6] hover:text-blue-600 transition-colors">Sign Up</Link>
          </p>
          <p className="text-[9px] font-black text-slate-300 dark:text-indigo-500/50 uppercase tracking-[0.2em] mt-6">
            Same You. A Stronger Tomorrow.
          </p>
        </div>

      </motion.div>
    </div>
  );
}
