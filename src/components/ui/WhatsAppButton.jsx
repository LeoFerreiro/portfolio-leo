import { FaWhatsapp } from "react-icons/fa";

function WhatsAppButton() {
  return (
    <a
      href="https://wa.me/5491133849214"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50
      bg-green-500 hover:bg-green-600
      text-white p-5 rounded-full
      shadow-lg shadow-green-500/30
      transition hover:scale-110"
    >
      <FaWhatsapp className="text-3xl" />
    </a>
  );
}

export default WhatsAppButton;