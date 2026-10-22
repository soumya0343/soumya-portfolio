import "../styles/sections/work.css";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import type { CSSProperties, MouseEvent } from "react";
import { flushSync } from "react-dom";
import { PROJECTS } from "../data/portfolio";
import type { Project } from "../data/portfolio";
import { shotAlt } from "./projectShots";

const FEATURED = 4;
const NUMBER_WORDS = ["Zero", "One", "Two", "Three", "Four", "Five", "Six"];

/* Folder colours. `--on` is the text colour on that fill; fills never flip
   with the theme, so text on them uses the never-flipping paper inks. */
type Look = { c: string; on: string; btn: string; btnInk: string; tape: string; tilt: string; ring?: string };
const FEATURED_LOOKS: Look[] = [
  { c: "var(--w-cobalt)", on: "#fff", btn: "var(--w-sun)", btnInk: "var(--w-paper-ink)", tape: "rgba(247,201,72,.85)", tilt: "1.6deg" },
  { c: "var(--w-felt)", on: "var(--w-felt-ink)", btn: "var(--w-sun)", btnInk: "var(--w-paper-ink)", tape: "rgba(255,77,141,.7)", tilt: "-1.4deg" },
  { c: "var(--w-sun)", on: "var(--w-paper-ink)", btn: "var(--w-paper-ink)", btnInk: "var(--w-paper)", tape: "rgba(169,223,198,.9)", tilt: "1.2deg", ring: "var(--w-cobalt)" },
  { c: "var(--w-pink)", on: "var(--w-paper-ink)", btn: "var(--w-paper-ink)", btnInk: "var(--w-paper)", tape: "rgba(247,201,72,.9)", tilt: "-1.8deg", ring: "var(--w-cobalt)" },
];
const OTHER_LOOKS: Look[] = [
  { c: "var(--w-mint)", on: "var(--w-paper-ink)", btn: "var(--w-paper-ink)", btnInk: "var(--w-paper)", tape: "rgba(247,201,72,.85)", tilt: "1.2deg", ring: "var(--w-cobalt)" },
  { c: "var(--w-kraft)", on: "var(--w-paper-ink)", btn: "var(--w-paper-ink)", btnInk: "var(--w-paper)", tape: "rgba(255,77,141,.6)", tilt: "-1deg", ring: "var(--w-cobalt)" },
  { c: "var(--w-sage)", on: "var(--w-paper-ink)", btn: "var(--w-paper-ink)", btnInk: "var(--w-paper)", tape: "rgba(169,223,198,.95)", tilt: "1.4deg", ring: "var(--w-cobalt)" },
  { c: "var(--w-coral)", on: "var(--w-paper-ink)", btn: "var(--w-paper-ink)", btnInk: "var(--w-paper)", tape: "rgba(247,201,72,.9)", tilt: "-1.3deg", ring: "var(--w-cobalt)" },
];

/* The key fact the hand-drawn ring circles inside each featured result. It is
   only drawn when the phrase is actually present in that project's `result`. */
const RING: Record<string, string> = {
  curate: "270 tests",
  saral: "88.3% pass rate",
  repolens: "Live on an Azure VM",
  inferlog: "PII-safe by construction",
};

/** The card's lead: the project's one-liner up to its first colon. */
function lead(one: string): string {
  const i = one.indexOf(":");
  return i > 0 ? `${one.slice(0, i)}.` : one;
}

const Arrow = () => (
  <svg className="wk-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M4 12h15" />
    <path d="m13 6 6 6-6 6" />
  </svg>
);
const Out = () => (
  <svg className="wk-ico wk-ico--out" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M7 17 17 7" />
    <path d="M8 7h9v9" />
  </svg>
);

function ResultText({ text, ring }: { text: string; ring?: string }) {
  const at = ring ? text.indexOf(ring) : -1;
  if (!ring || at < 0) return <>{text}</>;
  return (
    <>
      {text.slice(0, at)}
      <span className="wk-ring">
        {ring}
        <svg viewBox="0 0 120 40" preserveAspectRatio="none" aria-hidden="true">
          <path pathLength={1} d="M8 24 C 6 8, 96 2, 114 14 C 124 28, 52 40, 14 34 C 2 30, 6 12, 34 7" />
        </svg>
      </span>
      {text.slice(at + ring.length)}
    </>
  );
}

interface FolderProps {
  p: Project;
  look: Look;
  right?: boolean;
  mini?: boolean;
  /** place in the sticky stack (featured folders only) */
  k?: number;
  onOpen: (p: Project, e: MouseEvent<HTMLAnchorElement>) => void;
}

function Folder({ p, look, right, mini, k, onOpen }: FolderProps) {
  const shown = mini ? 3 : 4;
  const extra = p.tech.length - shown;
  const style = {
    "--c": look.c,
    "--on": look.on,
    "--btn": look.btn,
    "--btn-ink": look.btnInk,
    "--tape": look.tape,
    "--tilt": look.tilt,
    ...(look.ring ? { "--ring": look.ring } : {}),
    ...(k !== undefined ? { "--k": k } : {}),
  } as CSSProperties;
  const cls = ["wk-ch", "rv", right && "wk-ch--r", mini && "wk-ch--mini"].filter(Boolean).join(" ");
  const nameId = `wk-name-${p.slug}`;

  return (
    <article className={cls} style={style} aria-labelledby={nameId}>
      <div className="wk-tab">
        <b>Project {p.idx}</b>
        <span>{p.cat}</span>
      </div>
      <div className="wk-card">
        <div className="wk-text">
          <h3 className="wk-name" id={nameId}>
            {p.title}
          </h3>
          <p className="wk-lead">{lead(p.one)}</p>
          <ul className="wk-tech" aria-label={`${p.title} tech stack`}>
            {p.tech.slice(0, shown).map((t) => (
              <li key={t}>{t}</li>
            ))}
            {extra > 0 && <li className="wk-more">+{extra} more</li>}
          </ul>
          <div className="wk-links">
            <a className="wk-open" href={`?id=${encodeURIComponent(p.slug)}`} onClick={(e) => onOpen(p, e)}>
              <span className="wk-open-l">Open case study</span>
              <span className="sr-only">: {p.title}</span>
              <Arrow />
            </a>
            {p.live && (
              <a className="wk-ext" href={p.live} target="_blank" rel="noopener noreferrer">
                {p.liveLabel ?? "Live"}
                <Out />
                <span className="sr-only"> for {p.title} (opens in a new tab)</span>
              </a>
            )}
            {p.link && (
              <a className="wk-ext" href={p.link} target="_blank" rel="noopener noreferrer">
                Repo
                <Out />
                <span className="sr-only"> for {p.title} (opens in a new tab)</span>
              </a>
            )}
          </div>
        </div>
        <figure className="wk-shot">
          <span className="wk-tape" aria-hidden="true" />
          {p.image ? (
            <img src={p.image} alt={shotAlt(p.slug, p.title)} loading="lazy" decoding="async" width={1470} height={805} />
          ) : (
            <div className="wk-ph" role="img" aria-label={`Placeholder: no screenshot of ${p.title} yet`}>
              <span>Screenshot coming</span>
            </div>
          )}
          {p.result && (
            <figcaption className="wk-result">
              <span className="wk-rk">Result</span>
              <span className="wk-rt">
                <ResultText text={p.result} ring={mini ? undefined : RING[p.slug]} />
              </span>
            </figcaption>
          )}
        </figure>
      </div>
    </article>
  );
}

export default function Work({ onOpen }: { onOpen: (slug: string) => void }) {
  const [showAll, setShowAll] = useState(false);
  const moreRef = useRef<HTMLDivElement>(null);
  const beforeTop = useRef<number | null>(null);
  const featured = PROJECTS.slice(0, FEATURED);
  const stackRef = useRef<HTMLDivElement>(null);
  const others = PROJECTS.slice(FEATURED);

  // Record the button's viewport position at click time.
  const toggle = () => {
    beforeTop.current = moreRef.current?.getBoundingClientRect().top ?? null;
    setShowAll((v) => !v);
  };

  // Only when COLLAPSING: the folders above the button disappear, so pin the
  // button in place (before paint) instead of letting the page fly up.
  useLayoutEffect(() => {
    const before = beforeTop.current;
    beforeTop.current = null;
    if (showAll || before == null) return;
    const after = moreRef.current?.getBoundingClientRect().top ?? 0;
    const delta = after - before;
    if (delta) window.scrollBy({ top: delta, behavior: "instant" as ScrollBehavior });
  }, [showAll]);

  // Folders revealed by the button aren't seen by the scroll-reveal observer
  // (it binds on route change), so observe them here.
  useEffect(() => {
    if (!showAll) return;
    const nodes = document.querySelectorAll<HTMLElement>("#wk-others .rv:not(.in)");
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        }),
      { threshold: 0.08 },
    );
    nodes.forEach((n) => io.observe(n));
    return () => io.disconnect();
  }, [showAll]);

  // Open a case study. Plain clicks stay in the app (with a shared-element
  // lift of the print into the case-study hero where the browser supports
  // view transitions); modified clicks fall through to the real `?id=` link.
  // Sticky stack: as the next folder slides up over one, that one sinks back a little
  // (--cover 0 → 1 drives a small scale and dim in work.css). Without sticky (phones)
  // folders never overlap, so --cover stays 0.
  useEffect(() => {
    const stack = stackRef.current;
    if (!stack) return;
    const folders = Array.from(stack.querySelectorAll<HTMLElement>(":scope > .wk-ch"));
    // the heading pins too: the folders pin just under however tall it wraps, and
    // the last folder's height decides when the heading lets go (see work.css)
    const head = stack.querySelector<HTMLElement>(":scope > .wk-head");
    const last = folders[folders.length - 1];
    const ro = new ResizeObserver(() => {
      if (head) stack.style.setProperty("--wk-hh", `${head.offsetHeight}px`);
      if (last) stack.style.setProperty("--wk-last", `${last.offsetHeight}px`);
    });
    if (head) ro.observe(head);
    if (last) ro.observe(last);
    let frame = 0;
    const update = () => {
      frame = 0;
      for (let i = 0; i < folders.length - 1; i++) {
        const a = folders[i].getBoundingClientRect();
        const b = folders[i + 1].getBoundingClientRect();
        const cover = Math.min(1, Math.max(0, (a.bottom - b.top) / a.height));
        folders[i].style.setProperty("--cover", cover.toFixed(3));
      }
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      ro.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  const open = (p: Project, e: MouseEvent<HTMLAnchorElement>) => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    const doc = document as Document & { startViewTransition?: (cb: () => void) => unknown };
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const img = e.currentTarget.closest(".wk-ch")?.querySelector<HTMLElement>(".wk-shot img");
    if (!doc.startViewTransition || reduce || !img) {
      onOpen(p.slug);
      return;
    }
    img.style.viewTransitionName = "cs-shot";
    doc.startViewTransition(() => {
      flushSync(() => onOpen(p.slug));
    });
  };

  return (
    <section id="work" className="wk" aria-labelledby="wk-h">
      <div className="wk-in">

        <div className="wk-stack" ref={stackRef}>
          <header className="wk-head rv">
            <h2 className="wk-h" id="wk-h">
              <span className="wk-num" aria-hidden="true">
                02
              </span>
              Selected work
            </h2>
            <p className="wk-note">
              {NUMBER_WORDS[featured.length] ?? featured.length} folders. Each one ends with the result from its case study.
            </p>
          </header>

          {featured.map((p, i) => (
            <Folder key={p.slug} p={p} look={FEATURED_LOOKS[i % FEATURED_LOOKS.length]} right={i % 2 === 1} k={i} onOpen={open} />
          ))}
        </div>

        {others.length > 0 && (
          <>
            <div className="wk-others" id="wk-others" hidden={!showAll}>
              {showAll &&
                others.map((p, i) => (
                  <Folder key={p.slug} p={p} look={OTHER_LOOKS[i % OTHER_LOOKS.length]} mini onOpen={open} />
                ))}
            </div>
            <div className="wk-all" ref={moreRef}>
              <button type="button" aria-expanded={showAll} aria-controls="wk-others" onClick={toggle}>
                {showAll ? "Close the other folders" : `Open the other ${others.length} folders`}
                <small>
                  {showAll ? `back to ${(NUMBER_WORDS[featured.length] ?? String(featured.length)).toLowerCase()}` : `${PROJECTS.length} projects in all`}
                  <svg className={`wk-ico wk-ico--dn${showAll ? " is-up" : ""}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M12 5v14" />
                    <path d="m6 13 6 6 6-6" />
                  </svg>
                </small>
              </button>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
