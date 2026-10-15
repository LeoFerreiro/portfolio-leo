import emailjs from "@emailjs/browser";
import { useRef, useState } from "react";

const requiredMessages = {
  user_name: "Ingresá tu nombre.",
  user_email: "Ingresá tu email.",
  message: "Escribí un mensaje.",
};

function validateField(field) {
  if (!field.value.trim()) return requiredMessages[field.name];
  if (field.name === "user_email" && !field.validity.valid) {
    return "Ingresá un email válido.";
  }
  return "";
}

function Contact() {
  const form = useRef(null);
  const sending = useRef(false);
  const [status, setStatus] = useState("idle");
  const [errors, setErrors] = useState({});

  const updateFieldError = (event) => {
    const field = event.currentTarget;
    const name = field.name;
    const error = validateField(field);
    setErrors((previous) => {
      if (!previous[name]) return previous;
      const next = { ...previous };
      if (error) next[name] = error;
      else delete next[name];
      return next;
    });
  };

  const sendEmail = async (event) => {
    event.preventDefault();
    if (sending.current) return;
    const nextErrors = {};
    for (const name of Object.keys(requiredMessages)) {
      const error = validateField(form.current.elements.namedItem(name));
      if (error) nextErrors[name] = error;
    }
    setErrors(nextErrors);
    const firstInvalid = Object.keys(nextErrors)[0];
    if (firstInvalid) {
      setStatus("idle");
      form.current.elements.namedItem(firstInvalid).focus();
      return;
    }
    sending.current = true;
    setStatus("sending");
    try {
      await emailjs.sendForm(
        "service_bnuwkni",
        "template_k1a42st",
        form.current,
        "7Qydx-qRhje9FjKOe"
      );
      setStatus("success");
    } catch {
      setStatus("error");
    } finally {
      sending.current = false;
    }
  };

  const feedback = {
    idle: "",
    sending: "Enviando mensaje...",
    success: "Mensaje enviado correctamente",
    error: "Error al enviar el mensaje",
  };

  return (
    <section id="contact" className="editorial-contact" aria-labelledby="contact-title">
      <div className="contact-page">
        <div className="contact-introduction">
          <p className="contact-kicker">Contacto</p>
          <h2 id="contact-title">Hablemos de<br />tu proyecto.</h2>
          <p className="contact-invitation">¿Querés conversar sobre un proyecto web? Contame qué necesitás y en qué etapa está.</p>
          <dl className="contact-information">
            <div><dt>Email</dt><dd><a href="mailto:leoferreiro1@gmail.com">leoferreiro1@gmail.com</a></dd></div>
            <div><dt>Ubicación</dt><dd>Buenos Aires, Argentina</dd></div>
          </dl>
          <ul className="contact-channels" aria-label="Otros medios de contacto">
            <li><a href="https://github.com/LeoFerreiro">GitHub</a></li>
            <li><a href="https://www.linkedin.com/in/leo-ferreiro/">LinkedIn</a></li>
            <li><a href="https://wa.me/5491133849214">WhatsApp</a></li>
          </ul>
        </div>
        <div className="contact-form-column">
          <form ref={form} onSubmit={sendEmail} noValidate aria-label="Formulario de contacto" aria-busy={status === "sending"} aria-describedby="contact-feedback">
            <div className="contact-field">
              <label htmlFor="contact-name">Nombre</label>
              <input id="contact-name" type="text" name="user_name" autoComplete="name" placeholder="Tu nombre" required readOnly={status === "sending"}
                aria-invalid={!!errors.user_name || undefined} aria-describedby={errors.user_name ? "contact-name-error" : undefined}
                onInput={updateFieldError} />
              {errors.user_name && <p id="contact-name-error" className="contact-field-error" role="alert">{errors.user_name}</p>}
            </div>
            <div className="contact-field">
              <label htmlFor="contact-email">Email</label>
              <input id="contact-email" type="email" name="user_email" autoComplete="email" placeholder="Tu email" required readOnly={status === "sending"}
                aria-invalid={!!errors.user_email || undefined} aria-describedby={errors.user_email ? "contact-email-error" : undefined}
                onInput={updateFieldError} />
              {errors.user_email && <p id="contact-email-error" className="contact-field-error" role="alert">{errors.user_email}</p>}
            </div>
            <div className="contact-field">
              <label htmlFor="contact-message">Mensaje</label>
              <textarea id="contact-message" name="message" rows="6" placeholder="Contame sobre tu proyecto..." required readOnly={status === "sending"}
                aria-invalid={!!errors.message || undefined} aria-describedby={errors.message ? "contact-message-error" : undefined}
                onInput={updateFieldError} />
              {errors.message && <p id="contact-message-error" className="contact-field-error" role="alert">{errors.message}</p>}
            </div>
            <button type="submit" disabled={status === "sending"}>{status === "sending" ? "Enviando..." : "Enviar mensaje"}</button>
          </form>
          <p id="contact-feedback" className="contact-feedback" role={status === "error" ? "alert" : "status"}
            aria-live={status === "error" ? "assertive" : "polite"} aria-atomic="true">{feedback[status]}</p>
        </div>
      </div>
    </section>
  );
}

export default Contact;
