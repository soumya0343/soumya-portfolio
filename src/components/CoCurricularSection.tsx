import "./CoCurricularSection.css";

const coCurricularData = [
  {
    role: "Position of Responsibility",
    organization: "Organization / Event",
    period: "Year — Year",
  },
];

const CoCurricularSection = () => {
  return (
    <section className="cocurricular" id="cocurricular">
      <div className="cocurricular__left">
        <span className="cocurricular__number">07</span>
        <h2 className="cocurricular__title" data-reveal="up">
          Leadership &<br /> Activities
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
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="cocurricular__right">
        <iframe
          src="/fluid-art.html?palette=warm"
          className="cocurricular__fluid"
          title="CoCurricular Fluid Art"
          loading="lazy"
        />
      </div>
    </section>
  );
};

export default CoCurricularSection;
