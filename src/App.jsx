import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Home from "./pages/Home";
// import ServiceDetail from "./pages/ServiceDetail";
import Login from "./pages/Login";
import RegisterCustomer from "./pages/RegisterCustomer";
import RegisterProvider from "./pages/RegisterProvider";
import "./styles/main.css";
import UserProfile from "./pages/UserProfile";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/connexion" element={<Login />} />
          <Route path="/inscription/client" element={<RegisterCustomer />} />
          <Route
            path="/inscription/prestataire"
            element={<RegisterProvider />}
          />
          <Route path="/profil" element={<UserProfile />} />
          {/* les chemins apres conx doivent etre securisés ( a mettre dans le composant auth) */}
          <Route path="*" element={<h1>404 - Page not found</h1>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
