import { motion } from "framer-motion";
import { useState , useEffect} from "react";

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
      className={`fixed top-0 left-0 w-full z-50 backdrop-blur-md border-b transition-all duration-300
      ${
      scrolled
      ? "bg-[#020617]/90 border-white/10 py-2"
      : "bg-transparent border-transparent py-4"
      }`}
    >
      <div
        className="max-w-7xl mx-auto
        px-6 py-4 flex items-center justify-between"
      >

        {/* Logo */}
        <h1 className="text-2xl font-bold">
          Portfolio
          <span className="text-blue-500">
            Leo
          </span>
        </h1>

        {/* Desktop */}
        <ul style={{ display: "none" }} className="lg:flex gap-8 text-gray-300 font-medium">

          {navLinks.map((link) => (
            <li key={link.to}>
              <a
                href={link.to}
                className="hover:text-blue-400 transition"
              >
                {link.name}
              </a>
            </li>
          ))}

        </ul>

        {/* Mobile button */}
        <button
          className="lg:hidden text-2xl"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <FaTimes /> : <FaBars />}
        </button>

      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div
          className="lg:hidden bg-[#0F172A]
          border-t border-white/10"
        >
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

const style = document.createElement("style");

style.innerHTML = `
@media (min-width: 1024px) {
  .lg\\:flex {
    display: flex !important;
  }
}
`;

document.head.appendChild(style);

export default Navbar;