import { useCallback, useEffect, useState } from "react";

export type Theme = "dark" | "light";

/** Owns data-theme on <html>. Every visit opens in light; the toggle only lasts for the visit. */
export function useTheme(): [Theme, () => void] {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    /* the old site saved a theme for every visitor; drop it so nobody reopens in dark */
    try {
      localStorage.removeItem("sg-theme");
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const toggle = useCallback(() => {
    setTheme((t) => (t === "light" ? "dark" : "light"));
  }, []);

  return [theme, toggle];
}
