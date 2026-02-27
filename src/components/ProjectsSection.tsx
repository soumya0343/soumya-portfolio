import "./ProjectsSection.css";

const projects = [
  {
    category: "01 / DIGITAL INSTALLATION",
    title: "Aetheris Framework",
    imageGradient: "linear-gradient(135deg, #d32f2f, #ff8f00)",
  },
  {
    category: "02 / EDITORIAL DESIGN",
    title: "Monolith Annual",
    imageGradient: "linear-gradient(135deg, #cddc39, #ffea00)",
  },
  {
    category: "03 / BRAND IDENTITY",
    title: "Lumina Studio",
    imageGradient: "linear-gradient(135deg, #3e2723, #795548)",
  },
  {
    category: "04 / WEB EXPERIENCE",
    title: "Velvet Horizon",
    imageGradient: "linear-gradient(135deg, #b71c1c, #f44336)",
  },
];

const ProjectsSection = () => {
  return (
    <section className="projects" id="works">
      <div className="projects__header">
        <div className="projects__header-content">
          <h2 className="projects__title">Projects</h2>
          <p className="projects__subtitle">CURATED PROJECTS 2022—2024</p>
        </div>
        <span className="projects__number">04</span>
      </div>

      <div className="projects__grid">
        {projects.map((project, index) => (
          <div className="project-card" key={index}>
            <div
              className="project-card__image"
              style={{ background: project.imageGradient }}
            >
              {/* Overlay for inner shadow/grain if needed */}
              <div className="project-card__image-overlay"></div>
            </div>
            <div className="project-card__info">
              <div className="project-card__meta">
                <span className="project-card__category">
                  {project.category}
                </span>
              </div>
              <div className="project-card__footer">
                <h3 className="project-card__title">{project.title}</h3>
                <span className="project-card__arrow">→</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ProjectsSection;
