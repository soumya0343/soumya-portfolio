import { useCallback, useEffect, useState } from "react";
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

function readSlug(): string | null {
  return new URLSearchParams(window.location.search).get("id");
}

export default function App() {
  const [, toggleTheme] = useTheme();
  const [slug, setSlug] = useState<string | null>(readSlug);

  useEffect(() => {
    const onPop = () => setSlug(readSlug());
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  const openCase = useCallback((s: string) => {
    window.history.pushState({}, "", `?id=${encodeURIComponent(s)}`);
    setSlug(s);
  }, []);

  const back = useCallback(() => {
    window.history.pushState({}, "", window.location.pathname);
    setSlug(null);
  }, []);

  // Reveal-on-scroll re-binds whenever the route changes.
  useScrollReveal([slug]);

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
