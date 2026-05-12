import { motion } from "framer-motion";
import { TypeAnimation } from "react-type-animation";
import { FaGithub, FaLinkedin } from "react-icons/fa";

function Hero() {
  return (
    <section
      id="hero"
      className="relative h-screen flex flex-col items-center justify-center
      overflow-hidden px-6"
    >
      {/* Glow background */}
      <div className="absolute w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-2xl top-[-100px] left-[-100px]" />

      <div className="absolute w-[400px] h-[400px] bg-purple-500/20 rounded-full blur-2xl bottom-[-100px] right-[-100px]" />

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 80 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="z-10 text-center"
      >
        <p className="text-blue-400 text-lg mb-4">
          Hola, soy
        </p>

        <h1
          className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-extrabold
          bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-500
          bg-clip-text text-transparent"
        >
          Leonardo Ferreiro
        </h1>

        <div className="mt-6 text-2xl md:text-4xl font-semibold text-white">
          <TypeAnimation
            sequence={[
              "Full Stack Developer",
              2000,
              "React Developer",
              2000,
              "Frontend Specialist",
              2000,
            ]}
            wrapper="span"
            speed={50}
            repeat={Infinity}
          />
        </div>

        <p className="max-w-2xl mx-auto text-gray-400
           mt-8 text-base md:text-lg leading-8">
          Desarrollo experiencias web modernas, rápidas y atractivas
          utilizando tecnologías actuales como React, Node.js y MongoDB.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row
             justify-center gap-4 mt-10">
          
          <button
            className="px-8 py-4 rounded-full bg-blue-500
            hover:bg-blue-600 transition font-semibold shadow-lg shadow-blue-500/30"
          >
            Ver Proyectos
          </button>

          <button
            className="px-8 py-4 rounded-full border border-white/20
            hover:border-blue-400 hover:text-blue-400 transition font-semibold"
          >
            Contactarme
          </button>

        </div>

        {/* Socials */}
        <div className="flex justify-center gap-6 mt-10 text-3xl">
          
          <a
            href="#"
            className="hover:text-blue-400 transition"
          >
            <FaGithub />
          </a>

          <a
            href="https://www.linkedin.com/in/leonardo-ferreiro-8a033abb"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-400 transition"
          >
  <FaLinkedin />
</a>

        </div>
      </motion.div>
    </section>
  );
}

export default Hero;