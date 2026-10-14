import { useEffect } from "react";
import { projects, projectCategories, projectStatuses } from "../data/projects";

function Projects() {
  useEffect(() => {
    const hash = window.location.hash;
    const destinations = ["#projects", ...projects.map((project) => `#${project.id}`)];
    if (!destinations.includes(hash)) return;
    let cancelled = false;
    let frame;
    document.fonts.ready.then(() => {
      if (cancelled || window.location.hash !== hash) return;
      frame = window.requestAnimationFrame(() => {
        if (cancelled || window.location.hash !== hash) return;
        document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: "instant", block: "start" });
      });
    });
    return () => {
      cancelled = true;
      if (frame !== undefined) window.cancelAnimationFrame(frame);
    };
  }, []);
  const featured = projects.find((project) => project.featured);
  const remaining = projects.filter((project) => !project.featured);

  return (
    <section id="projects" className="editorial-projects" aria-labelledby="projects-title">
      <div className="projects-page">
        <header className="projects-opening">
          <div>
            <p className="projects-kicker">Selección de trabajo</p>
            <h2 id="projects-title">Proyectos.</h2>
          </div>
          <p>Interfaces y aplicaciones de demostración. Un recorrido por su propósito, el código y las decisiones que les dan forma.</p>
        </header>

        <article className="project-case" id={featured.id} aria-labelledby="featured-project-title">
          <header className="case-heading">
            <div>
              <p className="case-category"><span aria-hidden="true">01 / </span>{projectCategories[featured.category]}</p>
              <h3 id="featured-project-title">{featured.title}</h3>
              <p className="case-summary">{featured.description}</p>
            </div>
            <div className="case-status-and-links">
              <p className="case-status">{projectStatuses[featured.status]}</p>
              <div className="case-links">
                <a href={featured.demo} target="_blank" rel="noopener noreferrer">Ver demo<span className="sr-only"> de {featured.title} (abre en otra pestaña)</span></a>
                <a href={featured.github} target="_blank" rel="noopener noreferrer">Repositorio<span className="sr-only"> de {featured.title} (abre en otra pestaña)</span></a>
              </div>
            </div>
          </header>
          <figure className="case-image">
            <img src={featured.imageDefault} srcSet={featured.imageSources}
              sizes="(max-width: 599px) calc(100vw - 48px), (max-width: 1099px) calc(100vw - 80px), (max-width: 1439px) calc(100vw - 160px), 1280px"
              width={featured.imageWidth} height={featured.imageHeight} alt={featured.imageAlt}
              loading="lazy" decoding="async" />
            <figcaption>
              <span>Vista del inicio · Captura real de la demo</span>
              <a href={featured.image} target="_blank" rel="noopener noreferrer">Ampliar captura<span className="sr-only"> de {featured.title} (abre en otra pestaña)</span></a>
            </figcaption>
          </figure>
          <div className="case-overview">
            <div><h4>Propósito</h4><p>{featured.purpose}</p></div>
            <div><h4>Alcance implementado</h4><ul>{featured.features.map((feature) => <li key={feature}>{feature}</li>)}</ul></div>
          </div>
          <div className="case-decisions">
            <h4>Decisiones técnicas</h4>
            <dl>{featured.decisions.map((decision) => <div key={decision.title}><dt>{decision.title}</dt><dd>{decision.text}</dd></div>)}</dl>
          </div>
          <div className="case-technology-row">
            <h4>Tecnologías</h4>
            <ul>{featured.technologies.map((technology) => <li key={technology}>{technology}</li>)}</ul>
          </div>
          <div className="case-boundaries">
            <h4>Una compra simulada</h4>
            <p>{featured.limitations}</p>
            <p className="case-evidence-note">Alcance revisado en el código del proyecto. El funcionamiento de la demo online no pudo comprobarse.</p>
          </div>
        </article>

        <div className="projects-additional-cases">
          {remaining.map((project, index) => <EditorialCase key={project.id} project={project} index={index + 2} />)}
        </div>
      </div>
    </section>
  );
}

function EditorialCase({ project, index }) {
  const titleId = `${project.id}-title`;
  return (
    <article id={project.id} className={`project-case project-case-secondary case-${project.layout}`} aria-labelledby={titleId}>
      <header className="case-heading">
        <div>
          <p className="case-category"><span aria-hidden="true">0{index} / </span>{projectCategories[project.category]}</p>
          <h3 id={titleId}>{project.title}</h3>
          <p className="case-summary">{project.description}</p>
        </div>
        <div className="case-status-and-links">
          <p className="case-status">{projectStatuses[project.status]}</p>
          <div className="case-links">
            <a href={project.demo} target="_blank" rel="noopener noreferrer">Ver demo<span className="sr-only"> de {project.title} (abre en otra pestaña)</span></a>
            <a href={project.github} target="_blank" rel="noopener noreferrer">Repositorio<span className="sr-only"> de {project.title} (abre en otra pestaña)</span></a>
          </div>
        </div>
      </header>
      <div className="case-media-and-overview">
        <figure className="case-image">
          <img src={project.imageDefault} srcSet={project.imageSources}
            sizes={project.layout === "wide"
              ? "(max-width: 599px) calc(100vw - 48px), (max-width: 1099px) calc(100vw - 80px), (max-width: 1439px) calc(100vw - 160px), 1280px"
              : "(max-width: 599px) calc(100vw - 48px), (max-width: 1099px) calc(100vw - 80px), (max-width: 1439px) calc((100vw - 208px) * 0.667), 821px"}
            width={project.imageWidth} height={project.imageHeight} style={{ aspectRatio: `${project.imageWidth} / ${project.imageHeight}` }}
            alt={project.imageAlt} loading="lazy" decoding="async" />
          <figcaption><span>Captura real · Interfaz de demostración</span><a href={project.image} target="_blank" rel="noopener noreferrer">Ampliar captura<span className="sr-only"> de {project.title} (abre en otra pestaña)</span></a></figcaption>
        </figure>
        <div className="case-overview">
          <div><h4>Propósito</h4><p>{project.purpose}</p></div>
          <div><h4>Alcance implementado</h4><ul>{project.features.map((feature) => <li key={feature}>{feature}</li>)}</ul></div>
        </div>
      </div>
      <div className="case-decisions">
        <h4>Decisiones técnicas</h4>
        <dl>{project.decisions.map((decision) => <div key={decision.title}><dt>{decision.title}</dt><dd>{decision.text}</dd></div>)}</dl>
      </div>
      <div className="case-technology-row"><h4>Tecnologías</h4><ul>{project.technologies.map((technology) => <li key={technology}>{technology}</li>)}</ul></div>
      <div className="case-boundaries">
        <h4>{project.limitationTitle}</h4><p>{project.limitations}</p>
        <p className="case-evidence-note">Alcance revisado en el código del proyecto. El funcionamiento de la demo online no pudo comprobarse.</p>
      </div>
    </article>
  );
}

export default Projects;
