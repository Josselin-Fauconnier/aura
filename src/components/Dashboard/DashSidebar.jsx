import logoAura from "../../assets/logo_aura.png";
import "./DashboardSidebar.css";

export default function DashSidebar({ user, role }) {
  const navLinks =
    role === "provider"
      ? [
          { label: "Mes offres", page: "offers" },
          { label: "Mes rendez-vous", page: "appointments" },
        ]
      : [
          { label: "Toutes les offres", page: "offers" },
          { label: "Mes réservations", page: "appointments" },
        ];

  return (
    <aside className="dash-sidebar">
      <a href="/" className="dash-sidebar__logo">
        <img src={logoAura} alt="Aura logo" />
      </a>

      <div className="dash-sidebar__user-info">
        {user.profile_picture && (
          <img
            src={user.profile_picture}
            alt={user.firstname}
            className="dash-sidebar__user-pic"
          />
        )}
        <p className="dash-sidebar__user-name">
          {user.firstname} {user.name}
        </p>
      </div>

      <nav className="dash-sidebar__nav">
        {navLinks.map((link) => (
          <a
            key={link.page}
            href={`#${link.page}`}
            className="dash-sidebar__link"
          >
            {link.label}
          </a>
        ))}
      </nav>
    </aside>
  );
}
