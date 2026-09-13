"use client";

import { usePathname } from "next/navigation";
import TopBar from "@/components/TopBar";
import BottomNav from "@/components/BottomNav";

export default function AppLayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = pathname === "/login" || pathname === "/register";

  if (isAuthPage) {
    return <main className="w-full h-full min-h-screen relative">{children}</main>;
  }

  return (
    <>
      <TopBar />
      <main>{children}</main>
      <BottomNav />
    </>
  );
}
