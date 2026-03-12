import React from 'react';
function Footer() {
  return (
    <footer className="text-center no-print py-3 bg-dark text-light">
    <small>
      <span>&copy; Pymes 2026</span>
      <span className="mx-3">|</span>
      <a href="tel:113" className="text-light text-decoration-none">
        <i className="fa fa-phone me-1"></i> 0810-888-1234
      </a>
      <span className="mx-3">|</span>
      Seguinos en
      <a
        className="redes"
        href="https://www.facebook.com"
        style={{"backgroundColor": "#2962ff"}}
        target="_blank"
      >
        <i title="Facebook" className="fab fa-facebook-f"></i>
      </a>
      <a
        className="redes"
        href="https://twitter.com"
        style={{"backgroundColor": "#5ba4d6"}}
        target="_blank"
      >
        <i title="Twitter" className="fab fa-twitter"></i>
      </a>
      <a
        className="redes"
        style={{"backgroundColor": "#ec4c51"}}
        href="https://www.instagram.com"
        target="_blank"
      >
        <i title="Instagram" className="fab fa-instagram"></i>
      </a>
      <a
        className="redes"
        style={{"backgroundColor": "#00e676"}}
        href="https://www.whatsapp.com"
        target="_blank"
      >
        <i title="Whatsapp" className="fab fa-whatsapp"></i>
      </a>
    </small>
  </footer>

  );
}
export { Footer };
