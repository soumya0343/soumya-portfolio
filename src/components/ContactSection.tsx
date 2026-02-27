import "./ContactSection.css";

const ContactSection = () => {
  return (
    <section className="contact" id="contact">
      <div className="contact__left">
        <iframe
          src="/fluid-art.html?palette=dusk"
          className="contact__fluid"
          title="Contact Fluid Art"
          loading="lazy"
        />
      </div>
      <div className="contact__right">
        <span className="contact__number">07</span>
        <h2 className="contact__title" data-reveal="up">
          Get in Touch
        </h2>
        <p className="contact__subtitle" data-reveal="up" data-reveal-delay="1">
          LET'S CREATE SOMETHING TOGETHER
        </p>

        <div className="contact__body">
          <p className="contact__intro" data-reveal="up" data-reveal-delay="2">
            Have a project in mind or just want to say hello? I'm always open to
            discussing new opportunities, creative ideas, or ways to bring your
            vision to life.
          </p>

          <div className="contact__links">
            <a
              href="mailto:soumya0343@gmail.com"
              className="contact__link"
              data-reveal="left"
              data-reveal-delay="3"
            >
              <span className="contact__link-label">EMAIL</span>
              <span className="contact__link-value">
                soumya0343@gmail.com
                <span className="contact__link-arrow">→</span>
              </span>
            </a>
            <a
              href="https://www.linkedin.com/in/soumya-gupta-9bb270263"
              target="_blank"
              rel="noopener noreferrer"
              className="contact__link"
              data-reveal="left"
              data-reveal-delay="4"
            >
              <span className="contact__link-label">LINKEDIN</span>
              <span className="contact__link-value">
                /in/soumyagupta
                <span className="contact__link-arrow">→</span>
              </span>
            </a>
            <a
              href="https://github.com/soumya0343"
              target="_blank"
              rel="noopener noreferrer"
              className="contact__link"
              data-reveal="left"
              data-reveal-delay="5"
            >
              <span className="contact__link-label">GITHUB</span>
              <span className="contact__link-value">
                @soumya0343
                <span className="contact__link-arrow">→</span>
              </span>
            </a>
            <a
              href="https://twitter.com/soumya0343"
              target="_blank"
              rel="noopener noreferrer"
              className="contact__link"
              data-reveal="left"
              data-reveal-delay="6"
            >
              <span className="contact__link-label">TWITTER / X</span>
              <span className="contact__link-value">
                @soumya0343
                <span className="contact__link-arrow">→</span>
              </span>
            </a>
          </div>
        </div>

        <div className="contact__footer">
          <p className="contact__copyright">
            © {new Date().getFullYear()} Soumya Gupta — All rights reserved.
          </p>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
