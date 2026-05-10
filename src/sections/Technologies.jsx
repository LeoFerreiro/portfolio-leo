import { motion } from "framer-motion";

import {
  FaHtml5,
  FaCss3Alt,
  FaJs,
  FaReact,
  FaNodeJs,
  FaGitAlt,
  FaGithub,
} from "react-icons/fa";

import {
  SiTailwindcss,
  SiMongodb,
  SiExpress,
} from "react-icons/si";

const technologies = [
  {
    name: "HTML5",
    icon: <FaHtml5 />,
    color: "text-orange-500",
  },

  {
    name: "CSS3",
    icon: <FaCss3Alt />,
    color: "text-blue-400",
  },

  {
    name: "JavaScript",
    icon: <FaJs />,
    color: "text-yellow-400",
  },

  {
    name: "React",
    icon: <FaReact />,
    color: "text-cyan-400",
  },

  {
    name: "Node.js",
    icon: <FaNodeJs />,
    color: "text-green-500",
  },

  {
    name: "Express",
    icon: <SiExpress />,
    color: "text-gray-300",
  },

  {
    name: "MongoDB",
    icon: <SiMongodb />,
    color: "text-green-400",
  },

  {
    name: "Tailwind",
    icon: <SiTailwindcss />,
    color: "text-cyan-300",
  },

  {
    name: "Git",
    icon: <FaGitAlt />,
    color: "text-orange-400",
  },

  {
    name: "GitHub",
    icon: <FaGithub />,
    color: "text-white",
  },
];

function Technologies() {
  return (
    <section
      id="technologies"
      className="min-h-screen flex items-center px-6 py-24"
    >
      <motion.div
        initial={{ opacity: 0, y: 80 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="max-w-7xl mx-auto"
      >

        {/* Title */}
        <div className="text-center mb-20">

          <p className="text-blue-400 font-semibold mb-4">
            Tecnologías
          </p>

          <h2 className="text-4xl md:text-5xl font-bold">
            Mi Stack Tecnológico
          </h2>

          <p className="text-gray-400 mt-6 max-w-2xl mx-auto">
            Tecnologías modernas enfocadas en desarrollo
            frontend y backend para crear experiencias web
            rápidas, escalables y atractivas.
          </p>

        </div>

        {/* Cards */}
        <div
          className="grid grid-cols-2 sm:grid-cols-3
          lg:grid-cols-5 gap-6"
        >

          {technologies.map((tech, index) => (
            <motion.div
              key={tech.name}
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                delay: index * 0.1,
              }}
              viewport={{ once: true }}
              whileHover={{
                scale: 1.08,
                rotate: 2,
              }}
              className="group relative"
            >

              {/* Glow */}
              <div
                className="absolute inset-0 rounded-3xl
                bg-gradient-to-r from-blue-500/20
                to-purple-500/20 blur-xl opacity-0
                group-hover:opacity-100 transition"
              />

              {/* Card */}
              <div
                className="relative bg-[#111827]/80
                backdrop-blur-md border border-white/10
                rounded-3xl p-8 flex flex-col
                items-center justify-center
                hover:border-blue-400 transition"
              >

                <div
                  className={`text-6xl mb-6 ${tech.color}`}
                >
                  {tech.icon}
                </div>

                <h3 className="text-xl font-semibold">
                  {tech.name}
                </h3>

              </div>

            </motion.div>
          ))}

        </div>
      </motion.div>
    </section>
  );
}

export default Technologies;