import Technologies from "./Technologies";

function About() {
  return (
    <section id="about" className="editorial-about" aria-labelledby="about-title" tabIndex={-1}>
      <div className="about-page">
        <div className="about-opening">
          <div className="about-heading">
            <p className="about-kicker">Sobre mí</p>
            <h2 id="about-title">Desarrollador<br />web.</h2>
          </div>
          <div className="about-introduction">
            <p className="about-lead">
              Soy Leonardo Ferreiro, Full Stack Developer. Desarrollo interfaces
              y aplicaciones web con React y Node.js.
            </p>
            <p>
              Trabajo en proyectos personales que combinan desarrollo frontend
              y backend, con atención al diseño, la experiencia de usuario y la
              adaptación a distintos dispositivos.
            </p>
            <p>
              Continúo perfeccionando mis habilidades a través de esos proyectos:
              desde una tienda de demostración hasta una aplicación de gestión
              de tareas.
            </p>
          </div>
        </div>
        <Technologies />
        <div className="about-github">
          <p>El código también forma parte de la presentación.</p>
          <a href="https://github.com/LeoFerreiro" target="_blank" rel="noopener noreferrer">
            Ver mi perfil en GitHub
            <span className="sr-only"> (abre en otra pestaña)</span>
          </a>
        </div>
      </div>
    </section>
  );
}

export default About;
