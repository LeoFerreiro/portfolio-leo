import { motion } from "framer-motion";
import { TypeAnimation } from "react-type-animation";
import { FaGithub, FaLinkedin } from "react-icons/fa";

function Hero() {
  return (
    <section
      id="hero"
      className="
      relative
      min-h-screen
      overflow-hidden

      flex
      justify-center

      px-6
      pt-32
      "
    >
      {/* Glow Azul */}
      <div
        className="
        absolute
        -top-64
        -left-64

        w-[900px]
        h-[900px]

        rounded-full
        bg-blue-500/10

        blur-[180px]
        pointer-events-none
        "
      />

      {/* Glow Violeta */}
      <div
        className="
        absolute

        left-1/2
        bottom-[-900px]

        -translate-x-1/2

        w-[2200px]
        h-[2200px]

        rounded-full
        bg-purple-600/20

        blur-[280px]
        pointer-events-none
        "
      />

      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="
        relative
        z-10

        w-full
        max-w-5xl

        flex
        flex-col
        items-center

        text-center
        "
      >
        {/* Badge */}
        <div
          className="
          inline-flex
          items-center

          px-5
          py-2

          rounded-full

          border
          border-violet-500/20

          bg-violet-500/10

          text-violet-300
          text-sm
          font-medium

          backdrop-blur-md

          mb-8
          "
        >
          🚀 Disponible para proyectos freelance
        </div>

        {/* Nombre */}
        <h1
          className="
          text-6xl
          sm:text-7xl
          md:text-8xl
          lg:text-[120px]

          font-black
          leading-none

          bg-gradient-to-r
          from-blue-400
          via-cyan-300
          to-violet-500

          bg-clip-text
          text-transparent
          "
        >
          Leonardo Ferreiro
        </h1>

        {/* Typing */}
        <div
          className="
          mt-8

          text-xl
          md:text-3xl

          font-semibold
          text-white
          "
        >
          <TypeAnimation
            sequence={[
              "Full Stack Developer",
              2500,
              "React Developer",
              2500,
              "Frontend Specialist",
              2500,
              "Freelance Web Developer",
              2500,
            ]}
            speed={50}
            repeat={Infinity}
          />
        </div>

        {/* Descripción */}
        <p
          className="
          max-w-[620px]

          mt-8

          text-gray-400
          text-lg

          leading-9

          text-center
          "
        >
          Ayudo a negocios y emprendedores a transformar
          ideas en productos digitales modernos, rápidos
          y escalables utilizando React, Node.js y
          tecnologías actuales.
        </p>

        {/* Botones */}
        <div
          className="
          flex
          flex-col
          sm:flex-row

          gap-4

          mt-12
          "
        >
          <a
            href="#projects"
            className="
            px-8 py-4

            rounded-full

            bg-violet-600
            hover:bg-violet-700

            text-white
            font-semibold

            transition

            shadow-lg
            shadow-violet-600/30
            "
          >
            Ver Proyectos
          </a>

          <a
            href="#contact"
            className="
            px-8 py-4

            rounded-full

            border border-white/10

            hover:border-violet-400
            hover:text-violet-400

            transition

            font-semibold
            "
          >
            Contactarme
          </a>
        </div>

        {/* Redes */}
        <div
          className="
          flex
          gap-6

          mt-12

          text-3xl
          text-gray-400
          "
        >
          <a
            href="https://github.com/LeoFerreiro"
            target="_blank"
            rel="noopener noreferrer"
            className="
            hover:text-white
            hover:scale-110
            transition
            "
          >
            <FaGithub />
          </a>

          <a
            href="https://www.linkedin.com/in/leo-ferreiro"
            target="_blank"
            rel="noopener noreferrer"
            className="
            hover:text-[#0A66C2]
            hover:scale-110
            transition
            "
          >
            <FaLinkedin />
          </a>
        </div>

        {/* Tecnologías */}
        <div
          className="
          flex
          flex-wrap
          justify-center

          gap-3

          mt-12
          "
        >
          {[
            "React",
            "Node.js",
            "MongoDB",
            "TailwindCSS",
            "Framer Motion",
          ].map((tech) => (
            <span
              key={tech}
              className="
              px-4
              py-2

              rounded-full

              bg-white/5
              border border-white/10

              text-sm
              text-gray-300
              "
            >
              {tech}
            </span>
          ))}
        </div>
      </motion.div>
    </section>
  );
}

export default Hero;