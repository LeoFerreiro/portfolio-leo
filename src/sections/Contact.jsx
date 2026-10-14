import emailjs from "@emailjs/browser";
import { useRef, useState } from "react";

function Contact() {
  const form = useRef(null);
  const sending = useRef(false);
  const [status, setStatus] = useState("idle");
  const [emailInvalid, setEmailInvalid] = useState(false);

  const sendEmail = async (event) => {
    event.preventDefault();
    if (sending.current) return;
    sending.current = true;
    setStatus("sending");
    try {
      await emailjs.sendForm(
        "service_bnuwkni",
        "template_no4bfo4",
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
          <form ref={form} onSubmit={sendEmail} aria-label="Formulario de contacto" aria-busy={status === "sending"} aria-describedby="contact-feedback">
            <div className="contact-field">
              <label htmlFor="contact-name">Nombre</label>
              <input id="contact-name" type="text" name="user_name" autoComplete="name" placeholder="Tu nombre" readOnly={status === "sending"} />
            </div>
            <div className="contact-field">
              <label htmlFor="contact-email">Email</label>
              <input id="contact-email" type="email" name="user_email" autoComplete="email" placeholder="Tu email" readOnly={status === "sending"}
                aria-invalid={emailInvalid || undefined} aria-describedby={emailInvalid ? "contact-email-error" : undefined}
                onInvalid={() => setEmailInvalid(true)} onInput={() => setEmailInvalid(false)} />
              {emailInvalid && <p id="contact-email-error" className="contact-field-error" role="alert">Ingresá un email válido.</p>}
            </div>
            <div className="contact-field">
              <label htmlFor="contact-message">Mensaje</label>
              <textarea id="contact-message" name="message" rows="6" placeholder="Contame sobre tu proyecto..." readOnly={status === "sending"} />
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
