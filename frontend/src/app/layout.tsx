import { Nunito } from "next/font/google";
import "./globals.css";

import TopBar from "@/components/TopBar";
import BottomNav from "@/components/BottomNav";

import { ThemeProvider } from "@/components/ThemeProvider";

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
});

export const metadata = {
  title: "Life RPG - A Brighter You",
  description: "Level up real life.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${nunito.variable} antialiased bg-slate-100 dark:bg-black flex justify-center`}>
        <ThemeProvider>
          {/* Mobile Wrapper */}
          <div className="w-full max-w-md bg-slate-50 dark:bg-[#13112a] min-h-screen relative shadow-2xl overflow-hidden pb-24 transition-colors duration-300">
            <TopBar />
            <main>{children}</main>
            <BottomNav />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
