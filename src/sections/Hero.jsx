import { useEffect, useRef } from "react";
import HeroScene3D from "../components/ui/HeroScene3D";
import { FaGithub, FaLinkedin, FaWhatsapp } from "react-icons/fa";
import { FiArrowDownRight, FiArrowUpRight } from "react-icons/fi";

function Hero() {
  const heroRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      document.body.classList.toggle("eclipse-active", entry.isIntersecting);
    }, { rootMargin: "-80px 0px 0px 0px" });
    observer.observe(heroRef.current);
    return () => {
      observer.disconnect();
      document.body.classList.remove("eclipse-active");
    };
  }, []);

  return (
    <section ref={heroRef} id="hero" className="eclipse-hero" aria-labelledby="eclipse-name">
      <div className="eclipse-sky" aria-hidden="true" />
      <div className="eclipse-moon" aria-hidden="true">
        <div className="eclipse-moon-frame">
          <picture>
            <source media="(max-width: 699px)" srcSet="/hero/moon-render-mobile.webp" />
            <img src="/hero/moon-render-desktop.webp" width="1600" height="1598" alt="" fetchPriority="high" decoding="async" />
          </picture>
          <HeroScene3D />
        </div>
      </div>
      <div className="eclipse-layout">
        <div className="eclipse-copy">
          <p className="eclipse-availability">Disponible para proyectos freelance</p>
          <h1 id="eclipse-name" className="eclipse-name">
            <span>Leonardo</span>
            <span>Ferreiro</span>
          </h1>
          <p className="eclipse-role">Full Stack Developer</p>
          <p className="eclipse-intro">
            Ayudo a negocios y emprendedores a transformar ideas en productos
            digitales modernos, rápidos y escalables utilizando React, Node.js y
            tecnologías actuales.
          </p>
          <div className="eclipse-actions">
            <a href="#projects" className="eclipse-cta eclipse-cta-primary">
              Ver Proyectos <FiArrowUpRight aria-hidden="true" />
            </a>
            <a href="#contact" className="eclipse-cta eclipse-cta-secondary">Contactarme</a>
          </div>
          <div className="eclipse-socials">
            <a href="https://github.com/LeoFerreiro" target="_blank" rel="noopener noreferrer">
              <FaGithub aria-hidden="true" /> <span>GitHub</span>
            </a>
            <a href="https://www.linkedin.com/in/leo-ferreiro" target="_blank" rel="noopener noreferrer">
              <FaLinkedin aria-hidden="true" /> <span>LinkedIn</span>
            </a>
            <a href="https://wa.me/5491133849214" target="_blank" rel="noopener noreferrer">
              <FaWhatsapp aria-hidden="true" /> <span>WhatsApp</span>
            </a>
          </div>
        </div>
        <div className="eclipse-footnote">
          <div className="eclipse-meta-group">
            <p className="eclipse-meta-label">Especialidades</p>
            <ul className="eclipse-specialties" aria-label="Especialidades">
              {["React Developer", "Frontend Specialist", "Freelance Web Developer"].map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div className="eclipse-meta-group">
            <p className="eclipse-meta-label">Tecnologías</p>
            <ul className="eclipse-stack" aria-label="Tecnologías">
              {["React", "Node.js", "MongoDB", "TailwindCSS", "Framer Motion"].map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <a href="#about" className="eclipse-next">Sobre mí <FiArrowDownRight aria-hidden="true" /></a>
        </div>
      </div>
    </section>
  );
}

export default Hero;
