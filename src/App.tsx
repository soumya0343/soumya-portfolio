import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import FluidCanvas from "./components/FluidCanvas";
import PhilosophySection from "./components/PhilosophySection";
import ExperienceSection from "./components/ExperienceSection";
import EducationSection from "./components/EducationSection";
import CoCurricularSection from "./components/CoCurricularSection";
import ProjectsSection from "./components/ProjectsSection";
import SkillsSection from "./components/SkillsSection";
import BlogSection from "./components/BlogSection";
import ContactSection from "./components/ContactSection";

import useScrollReveal from "./hooks/useScrollReveal";
import { useState } from "react";
import "./App.css";

function App() {
  useScrollReveal();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="app">
      {!isModalOpen && <Navbar />}

      {/* Page 1: Hero */}
      <section className="app__section" id="home">
        <div className="app__layout">
          <div className="app__left">
            <HeroSection />
          </div>
          <div className="app__right">
            <FluidCanvas />
          </div>
        </div>
      </section>

      {/* Page 2: Philosophy */}
      <PhilosophySection />

      {/* Page 3: Experience */}
      <ExperienceSection />

      {/* Page 4: Projects */}
      <ProjectsSection onModalToggle={setIsModalOpen} />

      {/* Page 5: Skills */}
      <SkillsSection />

      {/* Page 6: Education */}
      <EducationSection />

      {/* Page 7: Co-Curricular */}
      <CoCurricularSection />

      {/* Page 8: Blogs */}
      <BlogSection />

      {/* Page 9: Contact */}
      <ContactSection />
    </div>
  );
}

export default App;
