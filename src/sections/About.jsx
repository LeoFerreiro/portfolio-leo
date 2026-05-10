import { motion } from "framer-motion";

function About() {
  return (
    <section
      id="about"
      className="min-h-screen flex items-center justify-center px-6 py-24"
    >
      <div className="max-w-6xl grid md:grid-cols-2 gap-16 items-center">

        {/* Left */}
        <motion.div
          initial={{ opacity: 0, x: -80 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <p className="text-blue-400 font-semibold mb-4">
            Sobre mí
          </p>

          <h2 className="text-4xl md:text-5xl font-bold leading-tight">
            Full Stack Developer
            <span className="text-blue-400"> creativo</span>
            <br />
            y apasionado por el desarrollo web
          </h2>

          <p className="text-gray-400 mt-8 leading-8 text-lg">
            Me especializo en crear aplicaciones y sitios web modernos,
            rápidos y responsivos utilizando tecnologías como React,
            Node.js y MongoDB.

            Actualmente continúo perfeccionando mis habilidades mediante
            proyectos personales enfocados en diseño moderno,
            experiencia de usuario y desarrollo full stack.
          </p>

          <div className="flex gap-4 mt-10 flex-wrap">
            
            <div
              className="bg-[#111827] border border-white/10
              px-6 py-4 rounded-2xl"
            >
              <h3 className="text-3xl font-bold text-blue-400">
                3+
              </h3>

              <p className="text-gray-400">
                Proyectos
              </p>
            </div>

            <div
              className="bg-[#111827] border border-white/10
              px-6 py-4 rounded-2xl"
            >
              <h3 className="text-3xl font-bold text-purple-400">
                Full Stack
              </h3>

              <p className="text-gray-400">
                Developer
              </p>
            </div>

          </div>
        </motion.div>

        {/* Right */}
        <motion.div
          initial={{ opacity: 0, x: 80 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="relative"
        >
          <div
            className="absolute inset-0 bg-gradient-to-r
            from-blue-500/20 to-purple-500/20 blur-3xl"
          />

          <div
            className="relative bg-[#111827]/80 backdrop-blur-md
            border border-white/10 rounded-3xl p-10"
          >
            <h3 className="text-2xl font-bold mb-6">
              Tecnologías principales
            </h3>

            <div className="grid grid-cols-2 gap-4">

              {[
                "React",
                "JavaScript",
                "Node.js",
                "MongoDB",
                "Tailwind CSS",
                "GitHub",
              ].map((tech) => (
                <div
                  key={tech}
                  className="bg-[#1F2937] py-4 px-5 rounded-xl
                  border border-white/5 hover:border-blue-400
                  hover:scale-105 transition"
                >
                  {tech}
                </div>
              ))}

            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}

export default About;