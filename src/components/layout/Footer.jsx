import {
  FaGithub,
  FaLinkedin,
  FaWhatsapp,
} from "react-icons/fa";

function Footer() {
  return (
    <footer
      className="border-t border-white/10
      bg-[#020617] py-10 px-6"
    >
      <div
        className="max-w-7xl mx-auto
        flex flex-col md:flex-row
        items-center justify-between gap-6"
      >

        {/* Left */}
        <div>
          <h2 className="text-2xl font-bold">
            Portfolio
            <span className="text-blue-500">
              Leo
            </span>
          </h2>

          <p className="text-gray-400 mt-2">
            Full Stack Developer
          </p>
        </div>

        {/* Socials */}
        <div className="flex gap-6 text-2xl">

          <a
            href="#"
            className="hover:text-blue-400 transition"
          >
            <FaGithub />
          </a>

          <a
            href="#"
            className="hover:text-blue-400 transition"
          >
            <FaLinkedin />
          </a>

          <a
            href="#"
            className="hover:text-green-400 transition"
          >
            <FaWhatsapp />
          </a>

        </div>

      </div>

      {/* Bottom */}
      <div className="text-center mt-10 text-gray-500 text-sm">
        © 2026 Leonardo Ferreiro. Todos los derechos reservados.
      </div>
    </footer>
  );
}

export default Footer;