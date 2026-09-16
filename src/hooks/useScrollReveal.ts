import { useEffect } from "react";

/**
 * Reveal-on-scroll, ported from app.js.
 * Observes every `.rv` node, adds `.in` when it enters the viewport.
 * Anything inside `.hero` is revealed immediately (it's the centerpiece), but
 * on the next frame rather than synchronously — see below.
 * Re-runs whenever `deps` change so freshly rendered nodes get observed.
 */
export function useScrollReveal(deps: unknown[] = []): void {
  useEffect(() => {
    // Hero: reveal on the NEXT frame, not synchronously. Adding `.in` during
    // the effect means the browser never paints the `opacity: 0` start state,
    // so there is nothing to transition from and the `data-d` stagger
    // (.06s/.12s/.18s in index.css) is skipped entirely. One rAF gives the
    // initial state a frame to land, after which the transition runs.
    const heroRaf = requestAnimationFrame(() => {
      document.querySelectorAll<HTMLElement>(".hero .rv").forEach((n) => n.classList.add("in"));
    });

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

    // Safety net for nodes the observer can miss (late layout shifts, browsers
    // that fire no initial entry). It reads getBoundingClientRect on every
    // pending node, which forces synchronous layout, so it must never run
    // straight off the scroll event: unthrottled that is a forced reflow on
    // every frame of every scroll. rAF-throttled it runs at most once a frame,
    // and once every node is revealed the listeners remove themselves.
    let queued = false;
    let disposed = false;

    const reveal = () => {
      queued = false;
      const pending = document.querySelectorAll<HTMLElement>(".rv:not(.in)");
      if (!pending.length) {
        stopScrollWatch();
        return;
      }
      const vh = window.innerHeight || document.documentElement.clientHeight || 800;
      pending.forEach((n) => {
        if (n.getBoundingClientRect().top < vh * 0.96) n.classList.add("in");
      });
    };

    const onScroll = () => {
      if (queued || disposed) return;
      queued = true;
      requestAnimationFrame(reveal);
    };

    function stopScrollWatch() {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    const timers = [200, 600, 1200, 2200].map((t) => window.setTimeout(onScroll, t));
    onScroll();

    return () => {
      disposed = true;
      cancelAnimationFrame(heroRaf);
      io.disconnect();
      stopScrollWatch();
      timers.forEach(clearTimeout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
