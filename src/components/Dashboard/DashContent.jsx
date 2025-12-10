import mockData from "../../mocks/data.json";
// import "./DashboardContent.css";
export default function DashContent({ user, role }) {
  // Filtrer les offres selon le rôle
  const offers =
    role === "provider"
      ? mockData.offers.filter((o) => o.id_provider === user.id_provider)
      : mockData.offers;

  return (
    <main
      className="dash-content"
      style={{
        flex: 1,
        padding: "2rem",
        overflowY: "auto",
        backgroundColor: "#fff",
      }}
    >
      <h1>Bienvenue, {user.firstname} !</h1>

      <h2>Offres disponibles :</h2>
      <div
        className="offers-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "1rem",
        }}
      >
        {offers.map((offer) => (
          <div
            key={offer.id_offer}
            style={{
              border: "1px solid #ddd",
              borderRadius: "8px",
              padding: "1rem",
            }}
          >
            <h3>{offer.category}</h3>
            <p>{offer.description}</p>
            <p>Durée: {offer.duration}</p>
            <p>Prix: {offer.price}€</p>
          </div>
        ))}
      </div>
    </main>
  );
}
