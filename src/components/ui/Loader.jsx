import { motion } from "framer-motion";

function Loader() {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      className="fixed inset-0 z-[999]
      bg-[#020617] flex items-center justify-center"
    >

      <div className="text-center">

        {/* Spinner */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{
            repeat: Infinity,
            duration: 1.2,
            ease: "linear",
          }}
          className="w-20 h-20 border-4
          border-blue-500 border-t-transparent
          rounded-full mx-auto"
        />

        {/* Text */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8 text-3xl font-bold"
        >
          Portfolio
          <span className="text-blue-500">
            Leo
          </span>
        </motion.h1>

      </div>
    </motion.div>
  );
}

export default Loader;