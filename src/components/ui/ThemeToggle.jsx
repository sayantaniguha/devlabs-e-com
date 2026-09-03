"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeToggle({ className = "" }) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  return (
    <button
      type="button"
      aria-label="Toggle theme"
      className={`text-on-surface-variant dark:text-on-primary-container hover:text-secondary dark:hover:text-secondary-fixed transition-all scale-95 active:scale-90 duration-150 flex items-center ${className}`}
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
    >
      <span className="material-symbols-outlined text-[20px]">
        {mounted && resolvedTheme === "dark" ? "light_mode" : "dark_mode"}
      </span>
    </button>
  );
}
