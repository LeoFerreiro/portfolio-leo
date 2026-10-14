const capabilities = [
  {
    title: "Interfaces y experiencia web",
    description: "Composición de páginas, interfaces responsive y estados de interacción para sitios y aplicaciones.",
    technologies: ["HTML", "CSS", "JavaScript", "React", "Tailwind CSS", "Framer Motion"],
  },
  {
    title: "Lógica, aplicaciones y datos",
    description: "Gestión del estado en el frontend y desarrollo de aplicaciones con servidor y persistencia de datos.",
    technologies: ["Context API", "Node.js", "Express", "MongoDB"],
  },
  {
    title: "Herramientas y entrega",
    description: "Control de versiones, organización del código y preparación de demos para compartir el trabajo.",
    technologies: ["Git", "GitHub", "Vite", "Vercel"],
  },
];

function Technologies() {
  return (
    <div id="technologies" className="about-capabilities" tabIndex={-1} aria-labelledby="capabilities-title">
      <div className="about-capabilities-heading">
        <h3 id="capabilities-title">Capacidades y tecnologías</h3>
        <p>Un recorrido por las herramientas presentes en mis proyectos.</p>
      </div>
      <div>
        {capabilities.map((capability, index) => (
          <div className="about-capability" key={capability.title}>
            <span className="about-row-index" aria-hidden="true">0{index + 1}</span>
            <div className="about-capability-copy">
              <h4>{capability.title}</h4>
              <p>{capability.description}</p>
            </div>
            <ul aria-label={`Tecnologías de ${capability.title.toLowerCase()}`}>
              {capability.technologies.map((technology) => <li key={technology}>{technology}</li>)}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Technologies;
