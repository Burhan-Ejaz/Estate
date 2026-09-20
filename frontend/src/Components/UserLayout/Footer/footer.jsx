import React from "react";
import { Link } from "react-router-dom";
import "./footer.css";

const Footer = () => {
  return (
    <footer className="footer">

      <div className="footer-top">

        <div className="footer-logo">

          <h2>Estate.</h2>

          <p>
            Helping you discover the perfect property with trusted expertise
            and exceptional service.
          </p>

        </div>

        <div className="footer-links">

          <h3>Quick Links</h3>

          <Link to="/">Home</Link>
          <Link to="/properties">Properties</Link>
          <Link to="/contact">About</Link>
          <Link to="/contact">Contact</Link>

        </div>

        <div className="footer-contact">

          <h3>Contact</h3>

          <p>📍 New York, USA</p>
          <p>📞 +1 234 567 890</p>
          <p>✉ info@estate.com</p>

        </div>

      </div>

      <div className="footer-bottom">

        <p>© 2026 Estate. All Rights Reserved.</p>

      </div>

    </footer>
  );
};

export default Footer;