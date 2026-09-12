import Link from "next/link";
import { Sword } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-slate-950 py-12 mt-20 relative z-10">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-2">
          <Sword className="w-5 h-5 text-fuchsia-500" />
          <span className="font-bold text-slate-200">Life RPG</span>
        </div>
        
        <p className="text-slate-500 text-sm">
          Built during Tech Zephyr 4.0 Hackathon. 
        </p>

        <div className="flex gap-4 text-sm text-slate-400">
          <Link href="https://github.com/CodeWithBasu/Life-RPG" target="_blank" className="hover:text-fuchsia-400 transition-colors">
            GitHub
          </Link>
          <Link href="/privacy" className="hover:text-fuchsia-400 transition-colors">
            Privacy
          </Link>
          <Link href="/terms" className="hover:text-fuchsia-400 transition-colors">
            Terms
          </Link>
        </div>
      </div>
    </footer>
  );
}
