import "./SideNav.css";

const SideNav = () => {
  return (
    <>
      {/* Section links overlaid on the right panel */}
      <div className="sidenav">
        <a href="#profile" className="sidenav__item">
          <span className="sidenav__number">01</span>
          <span className="sidenav__label">PROFILE</span>
        </a>
        <a href="#work" className="sidenav__item">
          <span className="sidenav__number">02</span>
          <span className="sidenav__label">WORK</span>
        </a>
        <a href="#manifesto" className="sidenav__item">
          <span className="sidenav__number">03</span>
          <span className="sidenav__label">MANIFESTO</span>
        </a>
      </div>

      {/* Vertical contact text on far right edge */}
      <div className="contact-rail">
        <span className="contact-rail__text">CONTACT ME</span>
        <span className="contact-rail__divider">|</span>
        <span className="contact-rail__text">CONTACT ME</span>
      </div>

      {/* Get in touch button bottom right */}
      <a href="mailto:hello@soumyagupta.dev" className="get-in-touch">
        <span>GET IN TOUCH</span>
        <span className="get-in-touch__arrow">→</span>
      </a>
    </>
  );
};

export default SideNav;
