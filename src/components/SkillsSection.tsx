import "./SkillsSection.css";

const skillGroups = [
  {
    category: "LANGUAGES",
    items: [
      "JavaScript",
      "TypeScript",
      "Python",
      "Java",
      "C++",
      "SQL",
      "HTML/CSS",
    ],
  },
  {
    category: "FRAMEWORKS",
    items: ["React", "Next.js", "Node.js", "Express", "Django", "TailwindCSS"],
  },
  {
    category: "TOOLS & PLATFORMS",
    items: ["Git", "Docker", "AWS", "Firebase", "Figma", "Linux", "CI/CD"],
  },
  {
    category: "DATABASES",
    items: ["PostgreSQL", "MongoDB", "Redis", "MySQL"],
  },
];

const SkillsSection = () => {
  return (
    <section className="skills" id="skills">
      <div className="skills__left">
        <iframe
          src="/fluid-art.html?palette=ember"
          className="skills__fluid"
          title="Skills Fluid Art"
          loading="lazy"
        />
      </div>
      <div className="skills__right">
        <span className="skills__number">05</span>
        <h2 className="skills__title" data-reveal="up">
          Skills
        </h2>
        <p className="skills__subtitle" data-reveal="up" data-reveal-delay="1">
          TOOLS & TECHNOLOGIES
        </p>

        <div className="skills__groups">
          {skillGroups.map((group, index) => (
            <div
              className="skills__group"
              key={index}
              data-reveal="up"
              data-reveal-delay={index + 2}
            >
              <h3 className="skills__group-title">{group.category}</h3>
              <div className="skills__tags">
                {group.items.map((item, i) => (
                  <span className="skills__tag" key={i}>
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SkillsSection;
