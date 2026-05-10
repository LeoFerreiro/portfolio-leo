import Navbar from "./components/layout/Navbar";
import Hero from "./sections/Hero";
import About from "./sections/About";
import Technologies from "./sections/Technologies";
import Projects from "./sections/Projects";
import GithubStats from "./sections/GithubStats";
import Contact from "./sections/Contact";

import Footer from "./components/layout/Footer";
import WhatsAppButton from "./components/ui/WhatsAppButton";
import ParticlesBackground from "./components/ui/ParticlesBackground";
import CursorGlow from "./components/ui/CursorGlow";
import Loader from "./components/ui/Loader";
import { useEffect, useState } from "react";

function App() {

  const [loading, setLoading] = useState(true);

useEffect(() => {
  const timer = setTimeout(() => {
    setLoading(false);
  }, 2000);

  return () => clearTimeout(timer);
}, []);

if (loading) {
  return <Loader />;
}

  return (
    <div className="bg-[#020617] text-white overflow-hidden">

      <CursorGlow />

      <ParticlesBackground />

      <Navbar />

      <Hero />

      <About />

      <Technologies />

      <Projects />

      <GithubStats />

      <Contact />

      <Footer />

      <WhatsAppButton />

    </div>
  );
}

export default App;