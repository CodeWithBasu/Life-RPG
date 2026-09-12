"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Sword } from "lucide-react";

export default function Navbar() {
  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-slate-950/80 backdrop-blur-md border-b border-slate-800"
    >
      <Link href="/" className="flex items-center gap-2 group">
        <div className="p-2 bg-fuchsia-500/20 rounded-lg group-hover:bg-fuchsia-500/30 transition-colors">
          <Sword className="w-5 h-5 text-fuchsia-400" />
        </div>
        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-fuchsia-400 to-indigo-400">
          Life RPG
        </span>
      </Link>

      <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
        <Link href="#features" className="hover:text-fuchsia-400 transition-colors">Features</Link>
        <Link href="#how-it-works" className="hover:text-fuchsia-400 transition-colors">How it Works</Link>
        <Link href="#leaderboard" className="hover:text-fuchsia-400 transition-colors">Leaderboard</Link>
      </nav>

      <div className="flex items-center gap-4">
        <Link 
          href="/login" 
          className="text-sm font-medium text-slate-300 hover:text-white transition-colors"
        >
          Sign In
        </Link>
        <Link 
          href="/signup" 
          className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-500 transition-colors shadow-[0_0_15px_rgba(79,70,229,0.3)] hover:shadow-[0_0_20px_rgba(79,70,229,0.5)]"
        >
          Play For Free
        </Link>
      </div>
    </motion.header>
  );
}
