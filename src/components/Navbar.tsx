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
        <a href="#index" className="navbar__link">
          INDEX
        </a>
        <a href="#profile" className="navbar__link navbar__link--active">
          PROFILE
        </a>
        <a href="#work" className="navbar__link">
          WORK
        </a>
      </div>
    </nav>
  );
};

export default Navbar;
