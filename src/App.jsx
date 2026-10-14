import Navbar from "./components/layout/Navbar";
import Hero from "./sections/Hero";
import About from "./sections/About";
import Projects from "./sections/Projects";
import Contact from "./sections/Contact";

import Footer from "./components/layout/Footer";
import WhatsAppButton from "./components/ui/WhatsAppButton";
import ParticlesBackground from "./components/ui/ParticlesBackground";
import CursorGlow from "./components/ui/CursorGlow";

function App() {
  return (
    <div className="bg-[#020617] text-white overflow-hidden">

      <CursorGlow />

      <ParticlesBackground />

      <Navbar />

      <main id="main-content">
        <Hero />
        <About />
        <Projects />
        <Contact />
      </main>

      <Footer />

      <WhatsAppButton />

    </div>
  );
}

export default App;