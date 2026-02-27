import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import "./ProjectsSection.css";

interface Project {
  category: string;
  title: string;
  description: string;
  tech: string[];
  link?: string;
  imageGradient: string;
}

const projects: Project[] = [
  {
    category: "01 / DIGITAL INSTALLATION",
    title: "Aetheris Framework",
    description:
      "An experiential WebGL framework designed for large-scale digital installations. It leverages custom shaders and generative algorithms to create immersive, reactive audio-visual environments that respond to human presence in real-time.",
    tech: ["WebGL", "Three.js", "GLSL", "React"],
    link: "https://example.com/aetheris",
    imageGradient: "linear-gradient(135deg, #d32f2f, #ff8f00)",
  },
  {
    category: "02 / EDITORIAL DESIGN",
    title: "Monolith Annual",
    description:
      "A brutalist digital editorial experience that challenges traditional reading paradigms. Featuring extreme typography, horizontal scrolling narratives, and harsh monochromatic contrasts to emphasize unvarnished truth in journalism.",
    tech: ["Next.js", "GSAP", "Tailwind CSS"],
    imageGradient: "linear-gradient(135deg, #cddc39, #ffea00)",
  },
  {
    category: "03 / BRAND IDENTITY",
    title: "Lumina Studio",
    description:
      "Complete digital rebranding for a boutique architecture firm. The design system relies on negative space, structured grids, and subtle motion to reflect the physical spaces the studio creates—translating concrete and light into pixels.",
    tech: ["Figma", "React", "Framer Motion"],
    link: "https://example.com/lumina",
    imageGradient: "linear-gradient(135deg, #3e2723, #795548)",
  },
  {
    category: "04 / WEB EXPERIENCE",
    title: "Velvet Horizon",
    description:
      "An award-winning interactive portfolio for a luxury fashion designer. The site uses fluid transitions and high-performance canvas rendering to simulate the tactile feeling of premium fabrics and materials on screen.",
    tech: ["Vue.js", "Canvas API", "WebGL"],
    imageGradient: "linear-gradient(135deg, #b71c1c, #f44336)",
  },
];

interface ProjectsSectionProps {
  onModalToggle?: (isOpen: boolean) => void;
}

const ProjectsSection = ({ onModalToggle }: ProjectsSectionProps) => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (selectedProject) {
      document.body.style.overflow = "hidden";
      onModalToggle?.(true);
    } else {
      document.body.style.overflow = "";
      onModalToggle?.(false);
    }
    return () => {
      document.body.style.overflow = "";
      onModalToggle?.(false);
    };
  }, [selectedProject, onModalToggle]);

  return (
    <section className="projects" id="works">
      <div className="projects__header">
        <div className="projects__header-content">
          <h2 className="projects__title" data-reveal="up">
            Projects
          </h2>
          <p
            className="projects__subtitle"
            data-reveal="up"
            data-reveal-delay="1"
          >
            CURATED PROJECTS 2022—2024
          </p>
        </div>
        <span className="projects__number">04</span>
      </div>

      <div className="projects__grid">
        {projects.map((project, index) => (
          <div
            className="project-card"
            key={index}
            data-reveal="up"
            data-reveal-delay={index + 1}
            onClick={() => setSelectedProject(project)}
            role="button"
            tabIndex={0}
          >
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

      {/* Project Modal Overlay */}
      {selectedProject &&
        createPortal(
          <div
            className="project-modal"
            onClick={() => setSelectedProject(null)}
          >
            <div
              className="project-modal__content"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="project-modal__close"
                onClick={() => setSelectedProject(null)}
                aria-label="Close modal"
              >
                ✕
              </button>
              <div
                className="project-modal__banner"
                style={{ background: selectedProject.imageGradient }}
              ></div>
              <div className="project-modal__body">
                <span className="project-modal__category">
                  {selectedProject.category}
                </span>
                <h3 className="project-modal__title">
                  {selectedProject.title}
                </h3>
                <p className="project-modal__desc">
                  {selectedProject.description}
                </p>

                <div className="project-modal__tech">
                  <h4 className="project-modal__tech-title">TECHNOLOGIES</h4>
                  <div className="project-modal__tags">
                    {selectedProject.tech.map((t, i) => (
                      <span key={i} className="project-modal__tag">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                {selectedProject.link && (
                  <a
                    href={selectedProject.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="project-modal__link"
                  >
                    <span className="project-modal__link-text">
                      LAUNCH PROJECT
                    </span>
                    <span className="project-modal__link-arrow">→</span>
                  </a>
                )}
              </div>
            </div>
          </div>,
          document.body,
        )}
    </section>
  );
};

export default ProjectsSection;
