import { useEffect, useRef, useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";

const navLinks = [
  { name: "Inicio", to: "#hero" },
  { name: "Sobre mí", to: "#about" },
  { name: "Certificados", to: "#certificates" },
  { name: "Proyectos", to: "#projects" },
  { name: "Contacto", to: "#contact" },
];

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const toggleRef = useRef(null);
  const navRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const siblings = [...navRef.current.parentElement.children]
      .filter((element) => element !== navRef.current)
      .map((element) => ({ element, inert: element.inert }));
    siblings.forEach(({ element }) => { element.inert = true; });
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setIsOpen(false);
        toggleRef.current?.focus();
      }
      if (event.key === "Tab") {
        const controls = [...navRef.current.querySelectorAll("a[href], button")]
          .filter((element) => element.getClientRects().length > 0);
        const first = controls[0];
        const last = controls[controls.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };
    const desktop = window.matchMedia("(min-width: 1024px)");
    const closeOnDesktop = () => { if (desktop.matches) setIsOpen(false); };
    document.addEventListener("keydown", handleKeyDown);
    desktop.addEventListener("change", closeOnDesktop);
    return () => {
      document.body.style.overflow = previousOverflow;
      siblings.forEach(({ element, inert }) => { element.inert = inert; });
      document.removeEventListener("keydown", handleKeyDown);
      desktop.removeEventListener("change", closeOnDesktop);
    };
  }, [isOpen]);

  const closeMenu = (destination) => {
    setIsOpen(false);
    window.requestAnimationFrame(() => {
      const target = document.querySelector(destination);
      if (target) {
        target.setAttribute("tabindex", "-1");
        target.focus({ preventScroll: true });
      }
    });
  };

  return (
    <nav ref={navRef} className={`portfolio-navigation ${scrolled ? "is-scrolled" : ""} ${isOpen ? "is-open" : ""}`} aria-label="Navegación principal">
      <div className="navigation-inner">
        <p className="navigation-brand">Portfolio<span>Leo</span></p>
        <ul className="navigation-desktop">
          {navLinks.map((link) => <li key={link.to}><a href={link.to}>{link.name}</a></li>)}
        </ul>
        <button ref={toggleRef} className="navigation-toggle" onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? "Cerrar menú" : "Abrir menú"} aria-expanded={isOpen}
          aria-controls="navigation-mobile" type="button">
          {isOpen ? <FaTimes aria-hidden="true" /> : <FaBars aria-hidden="true" />}
        </button>
      </div>
      <div id="navigation-mobile" className="navigation-mobile" hidden={!isOpen}>
        <ul>
          {navLinks.map((link) => <li key={link.to}><a href={link.to} onClick={() => closeMenu(link.to)}>{link.name}</a></li>)}
          <li className="navigation-whatsapp"><a href="https://wa.me/5491133849214" target="_blank" rel="noopener noreferrer">
            Contactar por WhatsApp<span className="sr-only"> (abre en otra pestaña)</span>
          </a></li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
