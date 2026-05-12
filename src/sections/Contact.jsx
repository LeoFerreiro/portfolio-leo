import emailjs from "@emailjs/browser";
import { useRef } from "react";
import { motion } from "framer-motion";
import {
  FaGithub,
  FaLinkedin,
  FaWhatsapp,
} from "react-icons/fa";

function Contact() {
const form = useRef();

const sendEmail = (e) => {
  e.preventDefault();

  emailjs
    .sendForm(
      "service_bnuwkni",
      "template_no4bfo4",
      form.current,
      "7Qydx-qRhje9FjKOe"
    )
    .then(
      () => {
        alert("Mensaje enviado correctamente 🚀");
      },
      () => {
        alert("Error al enviar el mensaje");
      }
    );
};

  return (
    <section
      id="contact"
      className="min-h-screen px-6 py-24 flex items-center"
    >
      <div className="max-w-6xl mx-auto w-full">

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 80 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >

          <p className="text-blue-400 font-semibold mb-4">
            Contacto
          </p>

          <h2 className="text-4xl md:text-5xl font-bold">
            Trabajemos juntos
          </h2>

          <p className="text-gray-400 mt-6 max-w-2xl mx-auto">
            ¿Tenés una idea, proyecto o necesitás una página web moderna?
            Estoy disponible para proyectos freelance y colaboraciones.
          </p>

        </motion.div>

        {/* Grid */}
        <div className="grid md:grid-cols-2 gap-12">

          {/* Left */}
          <motion.div
            initial={{ opacity: 0, x: -80 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="bg-[#111827]/80 border border-white/10
            rounded-3xl p-10 backdrop-blur-md"
          >

            <h3 className="text-3xl font-bold mb-8">
              Información de contacto
            </h3>

            <div className="space-y-6">

              <div>
                <p className="text-gray-400">
                  Email
                </p>

                <h4 className="text-xl font-semibold">
                  leoferreiro1@gmail.com
                </h4>
              </div>

              <div>
                <p className="text-gray-400">
                  Ubicación
                </p>

                <h4 className="text-xl font-semibold">
                  Buenos Aires, Argentina
                </h4>
              </div>

            </div>

            {/* Socials */}
            <div className="flex gap-6 mt-10 text-3xl">

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
          </motion.div>

          {/* Form */}
          <motion.form
            ref={form}
            onSubmit={sendEmail}
            initial={{ opacity: 0, x: 80 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="bg-[#111827]/80 border border-white/10
            rounded-3xl p-10 backdrop-blur-md space-y-6"
          >

            <div>
              <label className="block mb-2 text-gray-300">
                Nombre
              </label>

              <input
                type="text"
                name="user_name"
                placeholder="Tu nombre"
                className="w-full bg-[#1F2937] border border-white/10
                rounded-xl px-5 py-4 outline-none
                focus:border-blue-400 transition"
              />
            </div>

            <div>
              <label className="block mb-2 text-gray-300">
                Email
              </label>

              <input
                type="email"
                name="user_email"
                placeholder="Tu email"
                className="w-full bg-[#1F2937] border border-white/10
                rounded-xl px-5 py-4 outline-none
                focus:border-blue-400 transition"
              />
            </div>

            <div>
              <label className="block mb-2 text-gray-300">
                Mensaje
              </label>

              <textarea
                name="message"
                rows="5"
                placeholder="Contame sobre tu proyecto..."
                className="w-full bg-[#1F2937] border border-white/10
                rounded-xl px-5 py-4 outline-none
                focus:border-blue-400 transition resize-none"
              />
            </div>

            <button
              className="w-full py-4 rounded-xl bg-blue-500
              hover:bg-blue-600 transition font-semibold
              shadow-lg shadow-blue-500/20"
            >
              Enviar mensaje
            </button>

          </motion.form>

        </div>
      </div>
    </section>
  );
}

export default Contact;