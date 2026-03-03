import "./CoCurricularSection.css";

const coCurricularData = [
  {
    role: "Exhibitions, Guest Lectures & Foreign Relations Head",
    organization: "Quark Controls, BITS Pilani, Goa Campus",
    period: "Jul 2024 – Aug 2025",
    location: "Goa, India",
    description: [
      "Led a 150+ member team managing Exhibitions and Guest Lectures for Quark, BITS Goa’s annual tech fest, with 20,000+ attendees.",
      "Executed major attractions including the 3D Light Show, Robo Wars, and Auto Expo, driving a 44% YoY increase in footfall in the fest.",
      "Organised BITS Goa’s first-ever Technical Experience Zone, increasing revenue by 38% YoY and external exhibits by 50%.",
      "Hosted prominent speakers, including a former NASA astrophysicist and the VP of ASUS India, creating meaningful opportunities for students to interact with global leaders.",
    ],
  },
  {
    role: "Volunteer Teacher",
    organization: "Nirmaan Organization - BITS Goa Chapter",
    period: "Dec 2022 – sep 2023",
    location: "Goa, India",
    description: [
      "Actively volunteered during JoGW’23, a campus-wide initiative focused on compassion and social outreach.",
      "Visited a school for special needs students, interacted with them through engaging activities, and contributed to creating an inclusive and joyful environment.",
    ],
  },
  {
    role: "Core Member",
    organization: "Department of Arts and Decoration",
    period: "Dec 2022 – Dec 2023",
    description: [
      "Collaborated on campus-wide art installations and decorations for major college festivals.",
      "Participated in the end-to-end design process, from conceptual ideation to physical execution.",
      "Constructed and painted large-scale artistic structures and assisted in their structural installation across the campus.",
    ],
  },
  {
    role: "Core Member",
    organization: "Center for Technical Education, BITS Goa",
    period: "Feb 2023 – May 2024",
    description: [
      "Coordinated the organization of 'Tech Weekend', a marquee technical event and exhibition at BITS Goa.",
      "Spearheaded outreach and invitations for 20+ schools, facilitating student participation in technical workshops and exhibits.",
      "Managed end-to-end logistics and organizational workflows to ensure seamless event execution.",
    ],
  },
];

const CoCurricularSection = () => {
  return (
    <section className="cocurricular" id="cocurricular">
      <div className="cocurricular__left">
        <iframe
          src="/fluid-art.html?palette=warm"
          className="cocurricular__fluid"
          title="CoCurricular Fluid Art"
          loading="lazy"
        />
      </div>
      <div className="cocurricular__right">
        <span className="cocurricular__number">07</span>
        <h2 className="cocurricular__title" data-reveal="up">
          Leadership &<br />
          Activities
        </h2>
        <p
          className="cocurricular__subtitle"
          data-reveal="up"
          data-reveal-delay="1"
        >
          CO-CURRICULAR & RESPONSIBILITY
        </p>

        <div className="cocurricular__list">
          {coCurricularData.map((item, index) => (
            <div
              className="cocurricular-item"
              key={`co-${index}`}
              data-reveal="up"
              data-reveal-delay={index + 2}
            >
              <div className="cocurricular-item__header">
                <h3 className="cocurricular-item__degree">{item.role}</h3>
                <span className="cocurricular-item__period">{item.period}</span>
              </div>
              <div className="cocurricular-item__details">
                <span className="cocurricular-item__institution">
                  {item.organization}
                </span>
                {item.location && (
                  <span className="cocurricular-item__location">
                    {" • "} {item.location}
                  </span>
                )}
              </div>
              {item.description && (
                <ul className="cocurricular-item__description">
                  {item.description.map((point, i) => (
                    <li key={i}>{point}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CoCurricularSection;
