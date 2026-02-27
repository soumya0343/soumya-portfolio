import "./EducationSection.css";

const educationData = [
  {
    degree: "B. E. in Electronics and Communications Engineering",
    institution:
      "Birla Institute of Technology and Science, Pilani, K. K. Birla Goa Campus",
    location: "Goa, India",
    period: "Oct 2022 — Present",
  },
  {
    degree: "Class XII (CBSE) — 93.4%",
    institution: "The Millennium School",
    location: "Lucknow, India",
    period: "Graduated 2022",
  },
  {
    degree: "Class X (CBSE) — 98.8%",
    institution: "The Millennium School",
    location: "Lucknow, India",
    period: "Graduated 2020",
  },
];

const EducationSection = () => {
  return (
    <section className="education" id="education">
      <div className="education__left">
        <iframe
          src="/fluid-art.html?palette=monochrome"
          className="education__fluid"
          title="Education Fluid Art"
          loading="lazy"
        />
      </div>
      <div className="education__right">
        <span className="education__number">06</span>
        <h2 className="education__title" data-reveal="up">
          Education
        </h2>
        <p
          className="education__subtitle"
          data-reveal="up"
          data-reveal-delay="1"
        >
          ACADEMIC BACKGROUND
        </p>

        <div className="education__list">
          {educationData.map((edu, index) => (
            <div
              className="education-item"
              key={index}
              data-reveal="up"
              data-reveal-delay={index + 2}
            >
              <div className="education-item__header">
                <h3 className="education-item__degree">{edu.degree}</h3>
                <span className="education-item__period">{edu.period}</span>
              </div>
              <div className="education-item__details">
                <span className="education-item__institution">
                  {edu.institution}
                </span>
                <span className="education-item__divider">•</span>
                <span className="education-item__location">{edu.location}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default EducationSection;
