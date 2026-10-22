import "../styles/sections/nav.css";
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import type { CSSProperties } from "react";
import { RESUME_URL } from "../data/portfolio";

/* "Felt pocket of cards": section cards peek out of an olive felt pocket.
   Desktop: the pocket runs across the top, cards rise on hover, a paper ribbon
   bookmarks the active section and slides between cards as you scroll.
   Phone/tablet (<=860px): the pocket moves to the bottom of the screen, three
   cards peek out of it, and tapping the felt raises the whole deck as a menu. */

interface CardDef {
  sec: string;
  label: string;
  /** Longer label used in the phone deck */
  deck: string;
  hue: string;
  /** text colour on that hue */
  ink?: string;
  /** resting tilt (deg) on the desktop bar */
  r: number;
  /** resting tilt (deg) in the phone deck */
  dr: number;
}

const CARDS: CardDef[] = [
  { sec: "about", label: "About", deck: "About", hue: "var(--w-sun)", r: -2, dr: 1 },
  { sec: "work", label: "Work", deck: "Selected Work", hue: "var(--w-cobalt)", ink: "var(--w-paper)", r: 1, dr: -1 },
  { sec: "experience", label: "Experience", deck: "Experience", hue: "var(--w-orange)", r: -1, dr: 1.5 },
  { sec: "skills", label: "Skills", deck: "Skills", hue: "var(--w-green)", r: 2, dr: -1 },
  { sec: "background", label: "Background", deck: "Background", hue: "var(--w-pink)", r: -2, dr: 1 },
  { sec: "ask", label: "Ask AI", deck: "Ask my AI", hue: "var(--w-mint)", r: 1, dr: -1.5 },
  { sec: "contact", label: "Contact", deck: "Contact", hue: "var(--w-sage)", r: -1, dr: 1 },
];

const HOME_CARD: CardDef = { sec: "home", label: "Home", deck: "Home", hue: "var(--w-kraft)", r: 0, dr: -1.5 };
const DECK: CardDef[] = [HOME_CARD, ...CARDS];
const BY_SEC: Record<string, CardDef> = Object.fromEntries(DECK.map((c) => [c.sec, c]));

/** The three cards that peek out of the phone pocket: Work, the current section, Contact. */
function peekCards(active: string): CardDef[] {
  const mid = active === "home" || active === "work" || active === "contact" ? "about" : active;
  const midTilt: CardDef = { ...BY_SEC[mid], r: 1 };
  return [{ ...BY_SEC.work, r: -2 }, midTilt, { ...BY_SEC.contact, r: -1 }];
}

function cardStyle(c: CardDef, extra?: Record<string, string | number>): CSSProperties {
  return {
    "--h": c.hue,
    ...(c.ink ? { "--tx": c.ink } : {}),
    ...extra,
  } as CSSProperties;
}

/* Theme state lives in useTheme (App). The nav only needs to know which face of
   the clasp to show, so it watches data-theme on <html>. */
function subscribeTheme(cb: () => void) {
  const mo = new MutationObserver(cb);
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  return () => mo.disconnect();
}
const readDark = () => document.documentElement.getAttribute("data-theme") === "dark";

const Arrow = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M7 17 17 7" />
    <path d="M8 7h9v9" />
  </svg>
);

function Clasp({ dark, onToggle }: { dark: boolean; onToggle: () => void }) {
  return (
    <span className="nv-clasp">
      <button className="nv-tg" type="button" aria-label="Dark theme" aria-pressed={dark} title={dark ? "Switch to light theme" : "Switch to dark theme"} onClick={onToggle}>
        <span className="nv-tgcard" aria-hidden="true">
          <span className="nv-tgface nv-tgsun" />
          <span className="nv-tgface nv-tgmoon" />
        </span>
        <span className="nv-tgline" aria-hidden="true" />
      </button>
    </span>
  );
}

export default function Nav({ onToggleTheme }: { onToggleTheme: () => void }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const ribbonRef = useRef<HTMLSpanElement>(null);
  const linkRefs = useRef<Record<string, HTMLAnchorElement | null>>({});
  const toggleRef = useRef<HTMLButtonElement>(null);
  const firstDeckRef = useRef<HTMLAnchorElement>(null);
  const [active, setActive] = useState("home");
  const [open, setOpen] = useState(false);
  const activeRef = useRef("home");
  const dark = useSyncExternalStore(subscribeTheme, readDark, () => false);

  /* Slide the paper ribbon onto the active card (desktop bar). */
  const moveRibbon = useCallback((sec: string) => {
    const rib = ribbonRef.current;
    if (!rib) return;
    const link = linkRefs.current[sec];
    if (!link || !link.offsetWidth) {
      rib.classList.remove("is-on");
      return;
    }
    rib.style.setProperty("--x", `${link.offsetLeft + link.offsetWidth - 22}px`);
    rib.classList.add("is-on");
  }, []);

  /* Scroll-spy: same rule as before (the last section whose top is above a
     line 34% down the viewport), rAF-throttled. Also tucks the cards deeper
     into the pocket once the page has scrolled. */
  useEffect(() => {
    const secIds = DECK.map((c) => c.sec);
    let ticking = false;

    const spy = () => {
      rootRef.current?.classList.toggle("nv--tucked", window.scrollY > 24);
      const mid = window.scrollY + window.innerHeight * 0.34;
      let cur = secIds[0];
      for (const id of secIds) {
        const s = document.getElementById(id);
        if (s && s.offsetTop <= mid) cur = id;
      }
      if (cur !== activeRef.current) {
        activeRef.current = cur;
        setActive(cur);
      }
    };

    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          spy();
          ticking = false;
        });
        ticking = true;
      }
    };
    const onResize = () => moveRibbon(activeRef.current);

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    const t = setTimeout(spy, 60);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      clearTimeout(t);
    };
  }, [moveRibbon]);

  useEffect(() => {
    moveRibbon(active);
  }, [active, moveRibbon]);

  /* Phone deck: lock page scroll, Escape closes, focus moves into the deck. */
  const close = useCallback((returnFocus: boolean) => {
    setOpen(false);
    if (returnFocus) toggleRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!open) return;
    const html = document.documentElement;
    html.classList.add("nv-lock");
    firstDeckRef.current?.focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close(true);
    };
    const mq = window.matchMedia("(min-width: 861px)");
    const onMq = () => {
      if (mq.matches) close(false);
    };
    window.addEventListener("keydown", onKey);
    mq.addEventListener("change", onMq);
    return () => {
      html.classList.remove("nv-lock");
      window.removeEventListener("keydown", onKey);
      mq.removeEventListener("change", onMq);
    };
  }, [open, close]);

  const peek = peekCards(active);

  return (
    <div className={`nv${open ? " nv--open" : ""}`} ref={rootRef}>
      {/* ---------- desktop: felt bar across the top ---------- */}
      <nav className="nv-bar" aria-label="Primary">
        <div className="nv-cards rv">
          {CARDS.map((c, i) => (
            <a
              key={c.sec}
              href={`#${c.sec}`}
              className={`nv-c${active === c.sec ? " is-on" : ""}`}
              style={cardStyle(c, { "--r": `${c.r}deg`, "--k": i })}
              aria-current={active === c.sec ? "true" : undefined}
              ref={(node) => {
                linkRefs.current[c.sec] = node;
              }}
            >
              {c.label}
            </a>
          ))}
          <span className="nv-rib" ref={ribbonRef} aria-hidden="true" />
        </div>
        <a className="nv-cvcard" href={RESUME_URL} target="_blank" rel="noopener noreferrer">
          <span>
            Resume <Arrow />
          </span>
          <span className="sr-only"> (PDF, opens in a new tab)</span>
        </a>
        <div className="nv-felt">
          <span className="nv-hi" lang="hi">
            नमस्ते
          </span>
          <a className="nv-brand" href="#home">
            Soumya Gupta
          </a>
          <div className="nv-util">
            <Clasp dark={dark} onToggle={onToggleTheme} />
          </div>
        </div>
      </nav>

      {/* ---------- phone / tablet: name + Resume at the top of the page ---------- */}
      <div className="nv-top">
        <a className="nv-brand" href="#home" onClick={() => setOpen(false)}>
          Soumya Gupta
        </a>
        <a className="nv-cv" href={RESUME_URL} target="_blank" rel="noopener noreferrer">
          Resume <Arrow />
          <span className="sr-only"> (PDF, opens in a new tab)</span>
          <span className="nv-cv-o" aria-hidden="true" />
        </a>
      </div>

      {/* ---------- phone / tablet: the pocket at the bottom ---------- */}
      <div className="nv-scrim" aria-hidden="true" onClick={() => close(false)} />
      <nav className="nv-deck" id="nv-deck" aria-label="All sections" inert={!open}>
        {DECK.map((c, i) => (
          <a
            key={c.sec}
            href={`#${c.sec}`}
            className={`nv-c${active === c.sec ? " is-on" : ""}`}
            style={cardStyle(c, { "--r": `${c.dr}deg`, "--i": i, "--ri": DECK.length - 1 - i })}
            aria-current={active === c.sec ? "true" : undefined}
            ref={i === 0 ? firstDeckRef : undefined}
            onClick={() => close(false)}
          >
            {c.deck}
          </a>
        ))}
      </nav>
      <nav className="nv-pocket" aria-label="Sections">
        <div className="nv-pcards" inert={open}>
          {peek.map((c) => (
            <a
              key={c.sec}
              href={`#${c.sec}`}
              className={`nv-c${active === c.sec ? " is-on" : ""}`}
              style={cardStyle(c, { "--r": `${c.r}deg` })}
              aria-current={active === c.sec ? "true" : undefined}
            >
              {c.label}
            </a>
          ))}
        </div>
        <div className="nv-felt">
          <button
            ref={toggleRef}
            className="nv-open"
            type="button"
            aria-expanded={open}
            aria-controls="nv-deck"
            onClick={() => setOpen((o) => !o)}
          >
            <span className="nv-hi" lang="hi" aria-hidden="true">
              नमस्ते
            </span>
            <span className="nv-open-l">{open ? "Close" : "All sections"}</span>
          </button>
          <div className="nv-util">
            <Clasp dark={dark} onToggle={onToggleTheme} />
          </div>
        </div>
      </nav>
    </div>
  );
}
