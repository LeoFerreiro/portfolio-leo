import Navbar from "./components/layout/Navbar";
import Hero from "./sections/Hero";
import About from "./sections/About";
import Certifications from "./sections/Certifications";
import Projects from "./sections/Projects";
import Contact from "./sections/Contact";

import Footer from "./components/layout/Footer";
import WhatsAppButton from "./components/ui/WhatsAppButton";
import ParticlesBackground from "./components/ui/ParticlesBackground";

function App() {
  return (
    <div className="portfolio-shell text-white overflow-hidden">

      <ParticlesBackground />

      <Navbar />

      <main id="main-content">
        <Hero />
        <About />
        <Certifications />
        <Projects />
        <Contact />
      </main>

      <Footer />

      <WhatsAppButton />

    </div>
  );
}

export default App;