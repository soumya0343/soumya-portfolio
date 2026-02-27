import "./SideNav.css";

const SideNav = () => {
  return (
    <>
      {/* Section links overlaid on the right panel */}
      <div className="sidenav">
        <a href="#hero" className="sidenav__item">
          <span className="sidenav__number">01</span>
          <span className="sidenav__label">HOME</span>
        </a>
        <a href="#philosophy" className="sidenav__item">
          <span className="sidenav__number">02</span>
          <span className="sidenav__label">PHILOSOPHY</span>
        </a>
        <a href="#experience" className="sidenav__item">
          <span className="sidenav__number">03</span>
          <span className="sidenav__label">EXPERIENCE</span>
        </a>
        <a href="#work" className="sidenav__item">
          <span className="sidenav__number">04</span>
          <span className="sidenav__label">WORKS</span>
        </a>
        <a href="#skills" className="sidenav__item">
          <span className="sidenav__number">05</span>
          <span className="sidenav__label">SKILLS</span>
        </a>
        <a href="#education" className="sidenav__item">
          <span className="sidenav__number">06</span>
          <span className="sidenav__label">EDUCATION</span>
        </a>
        <a href="#cocurricular" className="sidenav__item">
          <span className="sidenav__number">07</span>
          <span className="sidenav__label">LEADERSHIP</span>
        </a>
        <a href="#blog" className="sidenav__item">
          <span className="sidenav__number">08</span>
          <span className="sidenav__label">BLOGS</span>
        </a>
        <a href="#contact" className="sidenav__item">
          <span className="sidenav__number">09</span>
          <span className="sidenav__label">CONTACT</span>
        </a>
      </div>
    </>
  );
};

export default SideNav;
