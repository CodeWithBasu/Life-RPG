import { Nunito } from "next/font/google";
import "./globals.css";

import TopBar from "@/components/TopBar";
import BottomNav from "@/components/BottomNav";

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
    <html lang="en">
      <body className={`${nunito.variable} antialiased bg-slate-100 flex justify-center`}>
        {/* Mobile Wrapper */}
        <div className="w-full max-w-md bg-slate-50 min-h-screen relative shadow-2xl overflow-hidden pb-24">
          <TopBar />
          <main>{children}</main>
          <BottomNav />
        </div>
      </body>
    </html>
  );
}
