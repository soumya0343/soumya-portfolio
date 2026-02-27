import YellowFluidCanvas from "./YellowFluidCanvas";
import "./ExperienceSection.css";

const experiences = [
  {
    year: "DEC 2025 - FEB 2026",
    role: "Full Stack Developer Intern / Chakra Tech",
    location: "Remote",
    description: [
      "Built full-stack modules for a blockchain esports prediction market (10+ REST APIs, order flow, market view, betslip, stats).",
      "Designed data pipelines integrating Polymarket with PandaScore; implemented BullMQ background jobs with Redis for reliable ingestion, retries, and syncing.",
      "Engineered an MCP server with ~20 micro/sub-APIs powering an AI assistant for contextual match and market queries.",
      "Optimised backend performance (removed N+1 queries, indexing, fuzzy-match fallback) reducing latency from ~15s to milliseconds.",
    ],
  },
  {
    year: "JUL 2025 - DEC 2025",
    role: "Engineering Intern / Dezerv Investments",
    location: "Bengaluru, India",
    description: [
      "Engineered a scalable Go backend to automate SEBI-compliant reporting for 5,000+ clients, replacing manual workflows with automated generation and validation and reducing manual reporting time by ~83% per reporting cycle.",
      "Built a reusable ReactJs operations dashboard introducing direct-to-S3 bulk uploads, enabling ~70% more reports per cycle.",
      "Developed a ReactJs Rationale Dashboard to explain portfolio rebalancing decisions, reducing client queries by ~35%.",
      "Contributed to Dezerv's first Flutter Web client dashboard (PMS), enabling desktop access for 16.9% non-app users.",
    ],
  },
  {
    year: "MAY 2025 - JUN 2025",
    role: "Tech Intern / Jobslet",
    location: "Remote",
    description: [
      "Led development of analytics dashboards using ReactJS and Node.js to track stage-wise user progression and first-time vs repeat activity, enabling ops teams to identify recruitment bottlenecks and reducing manual reporting effort by ~40%.",
      "Optimized backend data pipelines to reduce data latency by ~70%, enabling near real-time updates for recruitment workflows.",
      "Implemented Elasticsearch-backed indexing, filtering, and optimised search logic, reducing recruiter shortlisting time by 35%.",
      "Enhanced existing LLM-based resume parsing pipelines to improve structured data extraction and scoring-based candidate-job matching.",
    ],
  },
  {
    year: "MAY 2024 - JUL 2024",
    role: "Software Developer Intern / Multigraphics",
    location: "Delhi, India",
    description: [
      "Built a Laravel-based Employee Management System with CRUD APIs and authentication to centralize internal employee operations for 50+ concurrent users.",
      "Delivered a secure, responsive UI with advanced filtering to eliminate slow data access, reducing data latency by ~40%.",
      "Built a Question Paper Management System supporting creation, editing, and formatting workflows for 50,000+ documents annually.",
      "Added logging and audit trails with secure PDF exports to address missing document traceability, improving accountability by ~25%.",
    ],
  },
];

const ExperienceSection = () => {
  return (
    <section className="experience" id="work">
      <div className="experience__left">
        <span className="experience__number">03</span>
        <h2 className="experience__title" data-reveal="up">
          Experience
        </h2>

        <div className="timeline">
          {experiences.map((exp, index) => {
            const [jobTitle, company] = exp.role.split(" / ");
            return (
              <div
                className={`timeline__item ${index === 0 ? "timeline__item--current" : ""}`}
                key={index}
                data-reveal="up"
                data-reveal-delay={index + 1}
              >
                <div className="timeline__node"></div>
                <div className="timeline__content">
                  <span className="timeline__year">{exp.year}</span>
                  <h3 className="timeline__role">{jobTitle}</h3>
                  {(company || exp.location) && (
                    <span className="timeline__company">
                      {company} {company && exp.location && " • "}{" "}
                      {exp.location}
                    </span>
                  )}
                  <ul className="timeline__desc-list">
                    {exp.description.map((point, i) => (
                      <li key={i} className="timeline__desc-point">
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="experience__right">
        <YellowFluidCanvas />
      </div>
    </section>
  );
};

export default ExperienceSection;
