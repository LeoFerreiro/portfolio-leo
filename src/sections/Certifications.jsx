import { useEffect } from "react";
import { FiArrowUpRight } from "react-icons/fi";

const certifications = [
  {
    id: "backend",
    title: "Backend Developer",
    officialName: "Curso de Backend Developer - Turno Noche",
    date: "2026-07-09",
    dateLabel: "9 de julio de 2026",
    verification: "https://validator.centrodeelearning.com/validator/9a7041d9-ee7d-4620-905a-7d7fb1faf99f",
  },
  {
    id: "frontend",
    title: "Front End Developer",
    officialName: "Curso de Programador Web Inicial - Front End Developer - Turno Noche",
    date: "2025-10-24",
    dateLabel: "24 de octubre de 2025",
    verification: "https://validator.centrodeelearning.com/validator/86183f52-f58d-454d-b631-b2608a7cab79",
  },
];

function Certifications() {
  useEffect(() => {
    if (window.location.hash !== "#certificates") return;
    let cancelled = false;
    let frame;
    const positionSection = () => {
      if (cancelled || window.location.hash !== "#certificates") return;
      // Resolve layout before waiting for the local fonts used by the section.
      document.getElementById("certificates")?.getBoundingClientRect();
      document.fonts.ready.then(() => {
        if (cancelled || window.location.hash !== "#certificates") return;
        frame = window.requestAnimationFrame(() => {
          if (cancelled || window.location.hash !== "#certificates") return;
          document.getElementById("certificates")?.scrollIntoView({ behavior: "instant", block: "start" });
        });
      });
    };
    if (document.readyState === "complete") positionSection();
    else window.addEventListener("load", positionSection, { once: true });
    return () => {
      cancelled = true;
      window.removeEventListener("load", positionSection);
      if (frame !== undefined) window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <section id="certificates" className="editorial-certifications" aria-labelledby="certifications-title" tabIndex={-1}>
      <div className="certifications-page">
        <header className="certifications-opening">
          <div>
            <p className="certifications-kicker">Recorrido formativo</p>
            <h2 id="certifications-title">Formación y<br />certificaciones.</h2>
          </div>
          <p>Cursos de desarrollo web completados en UTN.BA Centro de e-Learning.</p>
        </header>
        <ol className="certifications-list">
          {certifications.map((certificate, index) => (
            <li key={certificate.id}>
              <article className="certification-entry" aria-labelledby={`certificate-${certificate.id}`}>
                <span className="certification-index" aria-hidden="true">0{index + 1}</span>
                <div className="certification-copy">
                  <h3 id={`certificate-${certificate.id}`}>{certificate.title}</h3>
                  <p className="certification-official-name">{certificate.officialName}</p>
                  <p className="certification-institution">Universidad Tecnológica Nacional, Facultad Regional Buenos Aires</p>
                  <p className="certification-center">Secretaría de Cultura y Extensión Universitaria<br />UTN.BA Centro de e-Learning</p>
                </div>
                <div className="certification-details">
                  <dl>
                    <div><dt>Fecha</dt><dd><time dateTime={certificate.date}>{certificate.dateLabel}</time></dd></div>
                    <div><dt>Duración</dt><dd>93 horas</dd></div>
                  </dl>
                  <a href={certificate.verification} target="_blank" rel="noopener noreferrer">
                    Verificar certificado <FiArrowUpRight aria-hidden="true" focusable="false" />
                    <span className="sr-only"> de {certificate.title} (abre en otra pestaña)</span>
                  </a>
                </div>
              </article>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export default Certifications;
