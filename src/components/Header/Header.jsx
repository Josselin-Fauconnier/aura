// src/components/Header.jsx

import { useState } from "react";
import { Link } from "react-router-dom";
import ServiceDropdown from "../ServiceDropdown/ServiceDropdown";
import "./Header.scss";
import logoAura from "../../assets/logo_aura.png";
import whiteAura from "../../assets/logo_aura_white.png";
import peopleIcon from "../../assets/icons/people.svg";

const navLinks = [
  { label: "Accueil", href: "/" },
  { label: "Services", href: "/services" }, // NOTE: Ce lien ne sera plus utilisé directement
  { label: "Connexion", href: "/connexion" },
  { label: "Inscription", href: "/inscription" },
];

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);
  const closeMenu = () => setIsMenuOpen(false);

  // Fonction utilitaire pour le rendu des liens avec la bonne balise
  const renderLink = (link) => (
    <Link key={link.label} to={link.href} onClick={closeMenu}>
      {link.label}
    </Link>
  );

  return (
    <>
      <header className="aura-header">
        <div className="aura-header__topbar">
          <div className="aura-header__topbar-inner">
            <div className="aura-header__topbar-left" />
            <div className="aura-header__topbar-profile">
              <img
                className="aura-header__topbar-profile-icon"
                src={peopleIcon}
                alt="Profile"
              />
            </div>
          </div>
        </div>

        <div className="aura-header__bar">
          <div className="aura-header__side aura-header__side--left">
            <nav className="aura-header__nav aura-header__nav--left">
              {/* LIEN ACCUEIL (Index 0) */}
              {renderLink(navLinks[0])}

              {/* REMPLACEMENT DYNAMIQU: DROPDOWN DES SERVICES */}
              <ServiceDropdown className="nav-item" />
            </nav>
          </div>

          <div className="aura-header__center">
            {/* Le logo est un lien vers l'accueil */}
            <Link to="/" onClick={closeMenu}>
              <img
                src={logoAura}
                alt="Aura logo"
                className="aura-header__logo"
              />
            </Link>
          </div>

          <div className="aura-header__side aura-header__side--right">
            <nav className="aura-header__nav aura-header__nav--right">
              {/* LIENS CONNEXION/INSCRIPTION (Index 2 et 3) */}
              {navLinks.slice(2).map(renderLink)}
            </nav>

            <button
              type="button"
              className={`aura-header__burger ${
                isMenuOpen ? "aura-header__burger--open" : ""
              }`}
              onClick={toggleMenu}
              aria-label={isMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>
      </header>

      {/* OVERLAY / MENU MOBILE */}
      <div
        className={`aura-header__overlay ${
          isMenuOpen ? "aura-header__overlay--open" : ""
        }`}
      >
        <div className="aura-header__overlay-header">
          <div className="aura-header__overlay-user">
            <span className="aura-header__overlay-user-icon"></span>
          </div>
          <div className="aura-header__overlay-logo">
            <img src={whiteAura} alt="Aura" />
          </div>
          <button
            type="button"
            className="aura-header__overlay-close"
            onClick={closeMenu}
            aria-label="Fermer le menu"
          >
            ✕
          </button>
        </div>

        <nav className="aura-header__overlay-nav">
          {/* LIEN ACCUEIL */}
          {renderLink(navLinks[0])}

          {/* DROPDOWN DES SERVICES DANS L'OVERLAY */}
          <ServiceDropdown className="overlay-item" />

          {/* LIENS CONNEXION/INSCRIPTION */}
          {navLinks.slice(2).map(renderLink)}
        </nav>
      </div>
    </>
  );
}
