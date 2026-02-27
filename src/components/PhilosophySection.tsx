import BlueFluidCanvas from "./BlueFluidCanvas";
import "./PhilosophySection.css";

const PhilosophySection = () => {
  return (
    <section className="philosophy" id="manifesto">
      <div className="philosophy__left">
        <BlueFluidCanvas />
      </div>
      <div className="philosophy__right">
        <span className="philosophy__number">02</span>
        <h2 className="philosophy__title" data-reveal="up">
          The Philosophy
        </h2>
        <div className="philosophy__columns">
          <p
            className="philosophy__text"
            data-reveal="up"
            data-reveal-delay="2"
          >
            Design is not merely an aesthetic choice but a spatial dialogue. My
            approach integrates the raw honesty of contemporary art with the
            functional precision of modern engineering. Every pixel serves a
            purpose; every void tells a story.
          </p>
          <p
            className="philosophy__text"
            data-reveal="up"
            data-reveal-delay="3"
          >
            I believe in the beauty of constraint. By stripping away the
            superfluous, we arrive at the core essence of a brand's
            identity—creating experiences that are felt as much as they are
            seen.
          </p>
        </div>
      </div>
    </section>
  );
};

export default PhilosophySection;
