import { motion } from "framer-motion";
import { useEffect, useState } from "react";

import {
  FaBars,
  FaTimes,
} from "react-icons/fa";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);

    return () =>
      window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Inicio", to: "#hero" },
    { name: "Sobre mí", to: "#about" },
    { name: "Tecnologías", to: "#technologies" },
    { name: "Proyectos", to: "#projects" },
    { name: "Contacto", to: "#contact" },
  ];

  return (
    <motion.nav
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
      className={`fixed top-0 left-0 w-full z-50 backdrop-blur-md border-b transition-all duration-300 ${
        scrolled
          ? "bg-[#020617]/88 border-white/10 shadow-2xl shadow-blue-950/20"
          : "bg-transparent border-transparent py-4"
      }`}
    >
      <div
        className="
        max-w-7xl mx-auto
        px-6 py-4 flex items-center justify-between
        "
      >
        <h1 className="text-2xl font-bold tracking-tight">
          Portfolio
          <span className="text-blue-500">
            Leo
          </span>
        </h1>

        <ul className="hidden lg:flex gap-8 text-gray-300 font-medium">
          {navLinks.map((link) => (
            <li key={link.to}>
              <a
                href={link.to}
                className="nav-link"
              >
                {link.name}
              </a>
            </li>
          ))}
        </ul>

        <button
          className="lg:hidden text-2xl"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Abrir menú"
          type="button"
        >
          {isOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {isOpen && (
        <div className="lg:hidden bg-[#0F172A] border-t border-white/10">
          <ul className="flex flex-col items-center py-8 gap-8">
            {navLinks.map((link) => (
              <li key={link.to}>
                <a
                  href={link.to}
                  onClick={() => setIsOpen(false)}
                  className="text-lg hover:text-blue-400 transition"
                >
                  {link.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </motion.nav>
  );
}

export default Navbar;
