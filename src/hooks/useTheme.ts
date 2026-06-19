import { useCallback, useEffect, useState } from "react";

export type Theme = "dark" | "light";

function readTheme(): Theme {
  try {
    const t = localStorage.getItem("sg-theme");
    if (t === "light" || t === "dark") return t;
  } catch {
    /* ignore */
  }
  return "dark";
}

/** Owns data-theme on <html> + persistence. Mirrors the no-flash script in the prototype. */
export function useTheme(): [Theme, () => void] {
  const [theme, setTheme] = useState<Theme>(readTheme);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    try {
      localStorage.setItem("sg-theme", theme);
    } catch {
      /* ignore */
    }
  }, [theme]);

  const toggle = useCallback(() => {
    setTheme((t) => (t === "light" ? "dark" : "light"));
  }, []);

  return [theme, toggle];
}
