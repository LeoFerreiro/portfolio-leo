import { motion } from "framer-motion";
import { FaGithub } from "react-icons/fa";
import { FiExternalLink } from "react-icons/fi";

const projects = [
  {
    title: "VerdeStore",
    description:
      "E-commerce moderno desarrollado con React, Context API, React Router, TailwindCSS y Framer Motion. Incluye catÃ¡logo dinÃ¡mico, carrito lateral animado, checkout, filtros, bÃºsqueda y modo oscuro.",
    technologies: [
      "React",
      "TailwindCSS",
      "Context API",
      "Framer Motion",
      "Vite",
    ],
    image: "/leostore.png",
    demo: "https://storeleo.vercel.app/",
    github: "https://github.com/LeoFerreiro/ecommerce-leo",
  },
  {
    title: "Task Manager App",
    description:
      "AplicaciÃ³n full stack para gestiÃ³n de tareas con autenticaciÃ³n y persistencia de datos.",
    technologies: ["React", "Express", "MongoDB"],
    image: "/taskflowleo.png",
    demo: "https://taskleodemo.vercel.app/",
    github: "https://github.com/LeoFerreiro/taskflow",
  },
  {
    title: "Business Landing Page",
    description:
      "Landing page premium enfocada en negocios modernos con diseÃ±o creativo y animaciones suaves.",
    technologies: ["React", "Tailwind", "Framer Motion"],
    image:
      "/blpleo.png",
      demo: "https://blp-leo.vercel.app/",
      github:"https://github.com/LeoFerreiro/blp-leo",
  },
  {
    title: "NocheViva",
    description:
      "Ticketera demo para recitales y shows en vivo con cola virtual, registro validado, checkout simulado, panel de usuario, Mis tickets y flujo de arrepentimiento de compra sin persistencia de datos.",
    technologies: ["HTML", "CSS", "JavaScript", "Vercel"],
    image: "/buyticket.png",
    demo: "https://buytecket-leo.vercel.app/",
    github: "https://github.com/LeoFerreiro/buyticket-leo",
  },
];

function Projects() {
  return (
    <section
      id="projects"
      className="min-h-screen flex flex-col text-center items-center px-6 py-24"
    >
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 80 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-20 flex flex-col items-center text-center"
        >
          <p className="text-blue-400 font-semibold mb-4">
            Proyectos
          </p>

          <h2 className="text-4xl md:text-5xl font-bold">
            Mis Proyectos Destacados
          </h2>

          <p className="text-gray-400 mt-6 max-w-2xl mx-auto">
            Algunos proyectos desarrollados enfocados en diseÃ±o moderno,
            experiencia de usuario y desarrollo full stack.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 80 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.7,
                delay: index * 0.2,
              }}
              viewport={{ once: true }}
              whileHover={{ y: -10 }}
              className="group relative"
            >
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur-xl opacity-0 group-hover:opacity-100 transition" />

              <div className="relative bg-[#111827]/80 border border-white/10 rounded-3xl overflow-hidden backdrop-blur-md flex flex-col h-full hover-card">
                <div className="overflow-hidden">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-52 object-cover group-hover:scale-105 transition duration-500"
                  />
                </div>

                <div className="p-8 flex flex-col flex-1">
                  <h3 className="text-2xl font-bold mb-4">
                    {project.title}
                  </h3>

                  <p className="text-gray-400 leading-7">
                    {project.description}
                  </p>

                  <div className="flex flex-wrap gap-3 mt-6">
                    {project.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="px-4 py-2 rounded-full bg-blue-500/10 border border-blue-400/20 text-blue-300 text-sm"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  {(project.demo || project.github) && (
                    <div className="flex gap-4 mt-auto pt-8">
                      {project.demo && (
                        <a
                          href={project.demo}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-2 px-5 py-3 rounded-full bg-blue-500 hover:bg-blue-600 transition font-medium"
                        >
                          <FiExternalLink />
                          Demo
                        </a>
                      )}

                      {project.github && (
                        <a
                          href={project.github}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-2 px-5 py-3 rounded-full border border-white/10 hover:border-blue-400 transition font-medium"
                        >
                          <FaGithub />
                          GitHub
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Projects;


