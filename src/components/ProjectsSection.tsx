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
    category: "01 / PRODUCTIVITY PLATFORM",
    title: "Zync",
    description:
      "A full-stack task, goal, and journaling application featuring drag-and-drop Kanban, nested task trees, scalable Firestore schema, and granular progress tracking.",
    tech: ["React 19", "TypeScript", "Node.js", "Express", "Firebase"],
    link: "https://github.com",
    imageGradient: "linear-gradient(135deg, #1e3c72, #2a5298)",
  },
  {
    category: "02 / CREATIVE PORTFOLIO",
    title: "Digital Portfolio",
    description:
      "An immersive, cinematic personal portfolio blending WebGL-powered fluid art with rigorous brutalist typography, dynamic theming, and multi-threaded interactive scroll animations.",
    tech: ["React", "TypeScript", "Vite", "WebGL"],
    link: "https://github.com",
    imageGradient: "linear-gradient(135deg, #0f2027, #203a43)",
  },
  {
    category: "03 / DEVELOPER TOOLING",
    title: "CodeSentinel",
    description:
      "A cross-editor extension for AI-powered code review. It combines Gemini-based semantic analysis with deterministic static analysis to detect SOLID violations, security risks, and architectural issues with offline capabilities.",
    tech: ["TypeScript", "VS Code API", "Gemini", "Node.js"],
    link: "https://github.com",
    imageGradient: "linear-gradient(135deg, #4b134f, #c94b4b)",
  },
  {
    category: "04 / FINTECH PLATFORM",
    title: "StockWise",
    description:
      "A gamified investment platform tailored for college students, featuring a custom Node.js backend engine for XP, achievements, and milestones. Shipped a production-ready MVP in 24 hours to secure 2nd place among 47 teams.",
    tech: ["React.js", "Tailwind CSS", "Node.js", "REST APIs"],
    link: "https://github.com",
    imageGradient: "linear-gradient(135deg, #11998e, #38ef7d)",
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
