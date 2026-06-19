import { useCallback, useEffect, useRef, useState } from "react";
import { RESUME_URL } from "../data/portfolio";

interface NavLinkDef {
  sec: string;
  label: string;
}

const LINKS: NavLinkDef[] = [
  { sec: "home", label: "Home" },
  { sec: "work", label: "Work" },
  { sec: "experience", label: "Experience" },
  { sec: "skills", label: "Skills" },
  { sec: "blog", label: "Blog" },
  { sec: "ask", label: "Ask AI" },
  { sec: "contact", label: "Contact" },
];

const SHEET_LINKS: { href: string; num: string; label: string }[] = [
  { href: "#home", num: "00", label: "Home" },
  { href: "#work", num: "01", label: "Selected Work" },
  { href: "#experience", num: "02", label: "Experience" },
  { href: "#skills", num: "03", label: "Skills" },
  { href: "#background", num: "04", label: "Background" },
  { href: "#blog", num: "05", label: "Blog" },
  { href: "#ask", num: "06", label: "Ask my AI" },
  { href: "#contact", num: "07", label: "Contact" },
];

const SunIcon = () => (
  <svg className="icon-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="5" />
    <line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" />
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
    <line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" />
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
  </svg>
);
const MoonIcon = () => (
  <svg className="icon-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
);

export default function Nav({ onToggleTheme }: { onToggleTheme: () => void }) {
  const navRef = useRef<HTMLElement>(null);
  const linksWrapRef = useRef<HTMLDivElement>(null);
  const pillRef = useRef<HTMLSpanElement>(null);
  const linkRefs = useRef<Record<string, HTMLAnchorElement | null>>({});
  const [active, setActive] = useState("home");
  const [sheetOpen, setSheetOpen] = useState(false);
  const activeRef = useRef("home");

  const movePill = useCallback((sec: string | null) => {
    const pill = pillRef.current;
    if (!pill) return;
    const link = sec ? linkRefs.current[sec] : null;
    if (!link) {
      pill.style.opacity = "0";
      return;
    }
    pill.style.opacity = "1";
    pill.style.transform = `translateX(${link.offsetLeft}px)`;
    pill.style.width = `${link.offsetWidth}px`;
  }, []);

  useEffect(() => {
    const secIds = LINKS.map((l) => l.sec);
    let ticking = false;

    const spy = () => {
      const nav = navRef.current;
      if (nav) nav.classList.toggle("nav--shrink", window.scrollY > 24);
      const mid = window.scrollY + window.innerHeight * 0.34;
      let cur = secIds[0];
      for (const id of secIds) {
        const s = document.getElementById(id);
        if (s && s.offsetTop <= mid) cur = id;
      }
      if (cur !== activeRef.current) {
        activeRef.current = cur;
        setActive(cur);
        movePill(cur);
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
    const onResize = () => movePill(activeRef.current);

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    const t = setTimeout(() => {
      movePill("home");
      spy();
    }, 60);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      clearTimeout(t);
    };
  }, [movePill]);

  return (
    <>
      <nav className="nav" id="nav" ref={navRef} aria-label="Primary">
        <a className="nav__brand" href="#home" aria-label="Home">
          <span className="nav__mono">SG</span>
          <span className="nav__brand-txt">
            Soumya<span className="nav__brand-dim"> · systems</span>
          </span>
        </a>

        <div className="nav__links" id="navLinks" ref={linksWrapRef} onMouseLeave={() => movePill(activeRef.current)}>
          {LINKS.map((l) => (
            <a
              key={l.sec}
              href={`#${l.sec}`}
              className={`nav__link${active === l.sec ? " nav__link--active" : ""}`}
              data-sec={l.sec}
              ref={(node) => {
                linkRefs.current[l.sec] = node;
              }}
              onMouseEnter={() => movePill(l.sec)}
            >
              {l.label}
            </a>
          ))}
          <span className="nav__pill" id="navPill" ref={pillRef} aria-hidden="true" />
        </div>

        <div className="nav__util">
          <button className="nav__icon" id="themeBtn" aria-label="Toggle theme" title="Toggle theme" onClick={onToggleTheme}>
            <SunIcon />
            <MoonIcon />
          </button>
          <a className="nav__cv" href={RESUME_URL} target="_blank" rel="noopener noreferrer">
            Resume
          </a>
          <button className="nav__burger" id="menuBtn" aria-label="Open menu" onClick={() => setSheetOpen(true)}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="3" y1="7" x2="21" y2="7" /><line x1="3" y1="13" x2="21" y2="13" /><line x1="3" y1="19" x2="21" y2="19" />
            </svg>
          </button>
        </div>
      </nav>

      <div className={`sheet${sheetOpen ? " open" : ""}`} id="sheet">
        <div className="sheet__top">
          <div className="nav__brand">
            <span className="nav__mono">SG</span>
            <span className="nav__brand-txt">Soumya Gupta</span>
          </div>
          <button className="sheet__close" id="sheetClose" aria-label="Close menu" onClick={() => setSheetOpen(false)}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="6" y1="6" x2="18" y2="18" /><line x1="18" y1="6" x2="6" y2="18" />
            </svg>
          </button>
        </div>
        <nav className="sheet__links">
          {SHEET_LINKS.map((l) => (
            <a key={l.href} href={l.href} onClick={() => setSheetOpen(false)}>
              <span>{l.num}</span>
              {l.label}
            </a>
          ))}
        </nav>
      </div>
    </>
  );
}
