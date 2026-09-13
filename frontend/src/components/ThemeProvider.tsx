"use client";

import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext({
  theme: "light",
  setTheme: (t: string) => {},
  resolvedTheme: "light"
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState("light");
  
  // We avoid server-side hydration mismatches by only mounting theme logic on the client
  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "dark") {
      setThemeState("dark");
      document.documentElement.classList.add("dark");
    } else {
      setThemeState("light");
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, []);

  const setTheme = (t: string) => {
    setThemeState(t);
    localStorage.setItem("theme", t);
    if (t === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, resolvedTheme: theme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
