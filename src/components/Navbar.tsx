import { useState, useEffect } from "react";
import "./Navbar.css";

const NAV_SECTIONS = [
  { id: "home", label: "HOME" },
  { id: "manifesto", label: "ABOUT ME" },
  { id: "work", label: "EXPERIENCE" },
  { id: "works", label: "PROJECTS" },
  { id: "skills", label: "SKILLS" },
  { id: "blog", label: "BLOGS" },
  { id: "contact", label: "CONTACT" },
];

const Navbar = () => {
  const [isLightMode, setIsLightMode] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  // Persist theme on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "light") {
      setIsLightMode(true);
      document.documentElement.setAttribute("data-theme", "light");
    }
  }, []);

  // Track active section via IntersectionObserver
  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    NAV_SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (!el) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveSection(id);
        },
        { threshold: 0.4 },
      );
      observer.observe(el);
      observers.push(observer);
    });

    return () => observers.forEach((obs) => obs.disconnect());
  }, []);

  const toggleTheme = () => {
    setIsLightMode((prev) => {
      const newTheme = !prev;
      if (newTheme) {
        document.documentElement.setAttribute("data-theme", "light");
        localStorage.setItem("theme", "light");
      } else {
        document.documentElement.removeAttribute("data-theme");
        localStorage.setItem("theme", "dark");
      }
      return newTheme;
    });
  };

  return (
    <nav className="navbar">
      <div className="navbar__brand">
        <span className="navbar__brand-text">PORTFOLIO</span>
        <span className="navbar__brand-divider">/</span>
        <span className="navbar__brand-year">2026</span>
      </div>
      <div className="navbar__links">
        {NAV_SECTIONS.map(({ id, label }) => (
          <a
            key={id}
            href={`#${id}`}
            className={`navbar__link${activeSection === id ? " navbar__link--active" : ""}`}
          >
            {label}
          </a>
        ))}

        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className="navbar__theme-toggle"
          aria-label="Toggle theme"
        >
          {isLightMode ? (
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          ) : (
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="5" />
              <line x1="12" y1="1" x2="12" y2="3" />
              <line x1="12" y1="21" x2="12" y2="23" />
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
              <line x1="1" y1="12" x2="3" y2="12" />
              <line x1="21" y1="12" x2="23" y2="12" />
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
            </svg>
          )}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
