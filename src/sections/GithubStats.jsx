import { motion } from "framer-motion";

function GithubStats() {
  return (
    <section className="px-6 py-24 flex flex-col items-center text-center">
      <motion.div
        initial={{ opacity: 0, y: 80 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="max-w-6xl mx-auto text-center"
      >
        <p className="text-blue-400 font-semibold mb-4">
          GitHub
        </p>

        <h2 className="text-4xl md:text-5xl font-bold mb-10">
          Actividad y estadísticas
        </h2>

        <div className="bg-[#111827]/80 border border-white/10 rounded-3xl p-6 md:p-10 backdrop-blur-md shadow-2xl shadow-blue-950/20">
          <img
            src="https://github-readme-streak-stats.herokuapp.com/?user=LeoFerreiro&theme=tokyonight&hide_border=true"
            alt="GitHub Stats"
            className="mx-auto w-full max-w-3xl"
          />
        </div>
      </motion.div>
    </section>
  );
}

export default GithubStats;
