import DashSidebar from "./DashSidebar";
import DashContent from "./DashContent";
import mockData from "../../mocks/data.json";
// import "./DashboardLayout.css";

export default function DashLayout({ userRole }) {
  // Ici on simule le user connecté en prenant les données mock
  const user =
    userRole === "provider"
      ? mockData.auth.provider_success.user
      : mockData.auth.client_success.user;

  return (
    <div className="dash-layout" style={{ display: "flex", height: "100vh" }}>
      <DashSidebar user={user} role={userRole} />
      <DashContent user={user} role={userRole} />
    </div>
  );
}
