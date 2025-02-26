import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Clients from "../pages/Clients";
import Reports from "../pages/Reports";
import Settings from "../pages/Settings";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import CreateClient from "../pages//CreateClient";
import PaymentManagement from "../pages/Payments.jsx";
import ClientDetailPage from "../pages/ClientDetailPage.jsx";



const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/clients" element={<Clients />} />
        <Route path="/create-client" element={<CreateClient />} />
        <Route path="/payment" element={<PaymentManagement />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/clients/:id" element={<ClientDetailPage />} /> {/* Nueva ruta */}
        <Route path="*" element={<h1>404 - Página no encontrada</h1>} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
