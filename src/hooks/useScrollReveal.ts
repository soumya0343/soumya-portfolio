import { useEffect } from "react";

/**
 * Reveal-on-scroll, ported from app.js.
 * Observes every `.rv` node, adds `.in` when it enters the viewport.
 * Anything inside `.hero` is forced visible immediately (it's the centerpiece).
 * Re-runs whenever `deps` change so freshly rendered nodes get observed.
 */
export function useScrollReveal(deps: unknown[] = []): void {
  useEffect(() => {
    document.querySelectorAll<HTMLElement>(".hero .rv").forEach((n) => n.classList.add("in"));

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    );
    document.querySelectorAll<HTMLElement>(".rv:not(.in)").forEach((n) => io.observe(n));

    const revealInView = () => {
      const vh = window.innerHeight || document.documentElement.clientHeight || 800;
      document.querySelectorAll<HTMLElement>(".rv:not(.in)").forEach((n) => {
        if (n.getBoundingClientRect().top < vh * 0.96) n.classList.add("in");
      });
    };
    window.addEventListener("scroll", revealInView, { passive: true });
    window.addEventListener("resize", revealInView, { passive: true });
    const timers = [200, 600, 1200, 2200].map((t) => window.setTimeout(revealInView, t));
    requestAnimationFrame(revealInView);

    return () => {
      io.disconnect();
      window.removeEventListener("scroll", revealInView);
      window.removeEventListener("resize", revealInView);
      timers.forEach(clearTimeout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
