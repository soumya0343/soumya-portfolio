import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import Nav from "./components/Nav";
import Hero from "./components/Hero";
import Proof from "./components/Proof";
import About from "./components/About";
import Work from "./components/Work";
import Experience from "./components/Experience";
import Skills from "./components/Skills";
import Background from "./components/Background";
import Ask from "./components/Ask";
import Contact from "./components/Contact";
import CaseStudy from "./components/CaseStudy";
import { useTheme } from "./hooks/useTheme";
import { useScrollReveal } from "./hooks/useScrollReveal";
import { usePageTime } from "./hooks/usePageTime";

function readSlug(): string | null {
  return new URLSearchParams(window.location.search).get("id");
}

export default function App() {
  const [, toggleTheme] = useTheme();
  const [slug, setSlug] = useState<string | null>(readSlug);

  // Remember where the home page was scrolled so "All Projects" returns there
  // instead of dumping you at the top.
  const homeScroll = useRef(0);
  const pendingRestore = useRef(false);

  useEffect(() => {
    const onPop = () => setSlug(readSlug());
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  const openCase = useCallback((s: string) => {
    homeScroll.current = window.scrollY;
    window.history.pushState({}, "", `?id=${encodeURIComponent(s)}`);
    setSlug(s);
  }, []);

  const back = useCallback(() => {
    pendingRestore.current = true;
    window.history.pushState({}, "", window.location.pathname);
    setSlug(null);
  }, []);

  // Restore the saved home scroll position once home re-renders (before paint).
  useLayoutEffect(() => {
    if (slug === null && pendingRestore.current) {
      pendingRestore.current = false;
      window.scrollTo({ top: homeScroll.current, behavior: "instant" as ScrollBehavior });
    }
  }, [slug]);

  // Reveal-on-scroll re-binds whenever the route changes.
  useScrollReveal([slug]);

  // Report active time-on-page per route to Vercel Analytics.
  usePageTime(slug === null ? "home" : `case:${slug}`);

  if (slug !== null) {
    return <CaseStudy slug={slug} onBack={back} onNavigate={openCase} onToggleTheme={toggleTheme} />;
  }

  return (
    <>
      <Nav onToggleTheme={toggleTheme} />
      <main className="main">
        <Hero />
        <Proof />
        <About />
        <Work onOpen={openCase} />
        <Experience />
        <Skills />
        <Background />
        <Ask />
        <Contact />
      </main>
    </>
  );
}
