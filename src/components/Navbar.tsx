import "./Navbar.css";

const Navbar = () => {
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
      </div>
    </nav>
  );
};

export default Navbar;
