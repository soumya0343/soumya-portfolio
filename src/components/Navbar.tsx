import { useState, useEffect } from "react";
import "./Navbar.css";

const Navbar = () => {
  const [isLightMode, setIsLightMode] = useState(false);

  useEffect(() => {
    // Check local storage on mount
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "light") {
      setIsLightMode(true);
      document.documentElement.setAttribute("data-theme", "light");
    }
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
        <a href="#home" className="navbar__link navbar__link--active">
          HOME
        </a>
        <a href="#manifesto" className="navbar__link">
          PHILOSOPHY
        </a>
        <a href="#work" className="navbar__link">
          EXPERIENCE
        </a>
        <a href="#works" className="navbar__link">
          PROJECTS
        </a>
        <a href="#skills" className="navbar__link">
          SKILLS
        </a>
        <a href="#blog" className="navbar__link">
          BLOGS
        </a>
        <a href="#contact" className="navbar__link">
          CONTACT
        </a>

        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className="navbar__link navbar__theme-toggle"
          aria-label="Toggle theme"
        >
          {isLightMode ? "DARK" : "LIGHT"}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
