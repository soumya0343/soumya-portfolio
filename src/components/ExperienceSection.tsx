import YellowFluidCanvas from "./YellowFluidCanvas";
import "./ExperienceSection.css";

const experiences = [
  {
    year: "2022 — PRESENT",
    role: "Senior Digital Designer / Mono Studio",
    description:
      "Leading the creative direction for high-fidelity interactive digital experiences.",
  },
  {
    year: "2020 — 2022",
    role: "Lead Designer / Apex Labs",
    description:
      "Developed brutalist visual languages for silicon valley tech startups.",
  },
  {
    year: "2016 — 2020",
    role: "Visual Artist / Independent Practice",
    description:
      "Explored the intersection of generative art and traditional typography.",
  },
];

const ExperienceSection = () => {
  return (
    <section className="experience" id="work">
      <div className="experience__left">
        <h2 className="experience__title">Experience</h2>

        <div className="timeline">
          {experiences.map((exp, index) => (
            <div className="timeline__item" key={index}>
              <div className="timeline__node"></div>
              <div className="timeline__content">
                <span className="timeline__year">{exp.year}</span>
                <h3 className="timeline__role">{exp.role}</h3>
                <p className="timeline__desc">{exp.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="experience__right">
        <YellowFluidCanvas />
      </div>
    </section>
  );
};

export default ExperienceSection;
