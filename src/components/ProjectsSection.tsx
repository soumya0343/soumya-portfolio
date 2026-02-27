import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import "./ProjectsSection.css";

interface Project {
  category: string;
  title: string;
  description: string;
  details: string[];
  tech: string[];
  link?: string;
  imageGradient: string;
  image?: string;
}

const projects: Project[] = [
  {
    category: "01 / PRODUCTIVITY PLATFORM",
    title: "Zync",
    description:
      "A full-stack task, goal, and journaling application featuring drag-and-drop Kanban, nested task trees, scalable Firestore schema, and granular progress tracking.",
    details: [
      "Kanban Board: Visualize workflow with a fully interactive Kanban board supporting drag-and-drop actions.",
      "Task Management: Create, update, and organize tasks. Break complex tasks down into subtasks for better granularity.",
      "Goal Tracking: Set high-level goals and link them to actionable tasks to measure progress.",
      "Responsive Design: Customized sidebar and layout for a seamless experience across devices.",
      "Authentication: Secure user authentication powered by Firebase.",
    ],
    tech: ["React 19", "TypeScript", "Vite", "Node.js", "Express", "Firebase"],
    link: "https://github.com/soumya0343/zync",
    imageGradient: "linear-gradient(135deg, #1e3c72, #2a5298)",
    image: "/assets/projects/zync-preview.png",
  },
  {
    category: "02 / CREATIVE PORTFOLIO",
    title: "Digital Portfolio",
    description:
      "An immersive, cinematic personal portfolio blending WebGL-powered fluid art with rigorous brutalist typography, dynamic theming, and multi-threaded interactive scroll animations.",
    details: [
      "Designed and launched an immersive, cinematic personal portfolio blending WebGL-powered fluid art with rigorous brutalist typography.",
      "Engineered a high-performance React application utilizing Vite and TypeScript for optimal bundle sizing and rapid client-side hydration.",
      "Implemented multi-threaded interactive scroll animations utilizing Intersection Observer API and custom React hooks to manage viewport state.",
      "Developed a robust dynamic theming engine supporting dark and light color modes through native CSS variables and iframe color inversion filtering.",
    ],
    tech: ["React", "TypeScript", "Vite", "WebGL"],
    link: "https://github.com/soumya0343/soumya-portfolio",
    imageGradient: "linear-gradient(135deg, #0f2027, #203a43)",
    image: "/assets/projects/portfolio-preview.jpg",
  },
  {
    category: "03 / DEVELOPER TOOLING",
    title: "CodeSentinel",
    description:
      "A cross-editor extension for AI-powered code review. It combines Gemini-based semantic analysis with deterministic static analysis to detect SOLID violations, security risks, and architectural issues with offline capabilities.",
    details: [
      "AI-powered review: Gemini gives thorough, context-aware feedback (summary, critical issues, best practices).",
      "Offline rule-based review: Runs without internet for clean code, architecture, security, performance, and maintainability.",
      "Two-tier behavior: AI review runs first for the best results, followed by lightning-fast local rule-based analysis.",
      "Multi-language support: Broad compatibility across Frontend (React, Angular), Backend (Node, Java, C++), and Database layers.",
    ],
    tech: ["TypeScript", "VS Code API", "Gemini", "Node.js"],
    link: "https://github.com/soumya0343/CodeSentinel",
    imageGradient: "linear-gradient(135deg, #4b134f, #c94b4b)",
  },
  {
    category: "04 / FINTECH PLATFORM",
    title: "StockWise",
    description:
      "A gamified investment platform tailored for college students, featuring a custom Node.js backend engine for XP, achievements, and milestones. Shipped a production-ready MVP in 24 hours.",
    details: [
      "Interactive Learning Modules: Comprehensive content on stock markets, mutual funds, and technical analysis.",
      "Gamification System: Earn XP, unlock achievements, and maintain daily learning streaks.",
      "Progress Tracking: Track your learning journey with detailed progress metrics and quiz-based validation.",
      "Real-time Rewards: Get instant notifications for achievements and personal milestones.",
      "User Authentication: Secure registration and login flow utilizing bcrypt and JWT.",
    ],
    tech: [
      "React.js",
      "Tailwind CSS",
      "Framer Motion",
      "Node.js",
      "MongoDB",
      "Express",
    ],
    link: "https://github.com/soumya0343/stockwise",
    imageGradient: "linear-gradient(135deg, #11998e, #38ef7d)",
    image: "/assets/projects/stockwise-preview.png",
  },
  {
    category: "05 / INTERACTIVE ART",
    title: "Mandala Studio",
    description:
      "An interactive, web-based zen experience designed for creating, customizing, and meditating with generative mathematical mandala art.",
    details: [
      "Generative Mandalas: Create beautiful, mathematically precise mandalas.",
      "Customization: Adjust size, complexity (rings), rotation speed, and apply a soothing glow effect with custom color palettes.",
      "Zen / Breathing Mode: A guided breathing animation synchronized with 'Inhale', 'Hold', and 'Exhale' prompts.",
      "Ambient Audio: Integrated Web Audio API soundscapes (Singing Bowl, Gentle Rain, Ocean Waves) to enhance relaxation.",
      "Export Module: Save customized mandala artwork instantly as a high-resolution PNG image.",
    ],
    tech: ["React", "Vite", "Framer Motion", "Web Audio API", "html2canvas"],
    link: "https://github.com/soumya0343/mandala-zen",
    imageGradient: "linear-gradient(135deg, #f12711, #f5af19)",
    image: "/assets/projects/mandala-preview.png",
  },
  {
    category: "06 / GAME DEVELOPMENT",
    title: "Infinite Canvas RPG",
    description:
      "An environmentally-themed roguelike game combining accessibility-first design with procedural dungeons and AI-powered storytelling.",
    details: [
      "Gameplay: Procedural dungeons featuring interconnected floors, a 6-tier stat-based combat system, and interactive environmental biomes.",
      "Dialogue & Story: Interactive NPCs with branching dialogue trees and dynamic Gemini API-powered conversation generation.",
      "Accessibility: Built-in colorblind modes, high contrast filters, complete keyboard-only support, and adjustable game speeds.",
      "AI Integration: Vision Seed System utilizing photo recognition for bespoke character archetype selection via Gemini 2.0 Flash.",
    ],
    tech: [
      "Next.js",
      "Phaser 3",
      "TypeScript",
      "Zustand",
      "Tailwind CSS",
      "Gemini API",
    ],
    link: "https://github.com/soumya0343/gemini-hackathon",
    imageGradient: "linear-gradient(135deg, #2b5876, #4e4376)",
    image: "/assets/projects/gemini-preview.png",
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
        <span className="projects__number">
          {projects.length < 10 ? `0${projects.length}` : projects.length}
        </span>
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
              {project.image && (
                <img
                  src={project.image}
                  alt={project.title}
                  className="project-card__img"
                />
              )}
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
              >
                {selectedProject.image && (
                  <img
                    src={selectedProject.image}
                    alt={selectedProject.title}
                    className="project-modal__banner-img"
                  />
                )}
              </div>
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

                {selectedProject.details &&
                  selectedProject.details.length > 0 && (
                    <ul className="project-modal__details-list">
                      {selectedProject.details.map((detail, idx) => (
                        <li key={idx} className="project-modal__details-point">
                          {detail}
                        </li>
                      ))}
                    </ul>
                  )}

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
