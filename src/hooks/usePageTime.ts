import { useEffect } from "react";
import { track } from "@vercel/analytics";

/**
 * Tracks how long a visitor actively spends on a route and reports it to
 * Vercel Analytics as a custom `page_time` event when they leave or hide the tab.
 *
 * "Active" time only accumulates while the tab is visible — backgrounded tabs
 * are paused so an idle tab left open overnight doesn't inflate the number.
 *
 * @param route a stable label for the current view (e.g. "home" or "case:foo")
 */
export function usePageTime(route: string) {
  useEffect(() => {
    let active = 0; // ms of visible time accumulated
    let since = document.visibilityState === "visible" ? Date.now() : 0;
    let sent = false;

    const accumulate = () => {
      if (since) {
        active += Date.now() - since;
        since = 0;
      }
    };

    const onVisibility = () => {
      if (document.visibilityState === "visible") {
        since = Date.now();
      } else {
        accumulate();
        report(); // tab hidden may precede unload on mobile — report now
      }
    };

    const report = () => {
      accumulate();
      const seconds = Math.round(active / 1000);
      if (sent || seconds < 2) return; // skip bounces / double-fires
      sent = true;
      track("page_time", { route, seconds });
    };

    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("pagehide", report);

    return () => {
      report(); // route change within the SPA
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pagehide", report);
    };
  }, [route]);
}
