import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import FluidCanvas from "./components/FluidCanvas";
import SideNav from "./components/SideNav";
import PhilosophySection from "./components/PhilosophySection";
import "./App.css";

function App() {
  return (
    <div className="app">
      <Navbar />
      <SideNav />

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
    </div>
  );
}

export default App;
