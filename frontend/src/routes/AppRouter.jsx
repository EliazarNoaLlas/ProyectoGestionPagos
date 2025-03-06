import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Clients from "../pages/Clients";
import CreateClient from "../pages/CreateClient";
import ClientDetailPage from "../pages/ClientDetailPage.jsx";

import ServicesInterface from "../pages/ServicesPage.jsx";
import CreateService from "../pages/CreateService.jsx";
import ServiceDetailPage from "../pages/ServiceDetailPage.jsx";


import ClientServiceInterface from "../pages/ClientServicePage.jsx";
import CreateClientService from "../pages/CreateClientService.jsx";
import ClientServiceDetailPage from "../pages/ClientServiceDetailPage.jsx";


import Reports from "../pages/Reports";
import Settings from "../pages/Settings";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import PaymentPage from "../pages/Payments.jsx";
import PaymentDetailPage from "../pages/PaymentDetailPage.jsx";



const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/clients" element={<Clients />} />
        <Route path="/create-client" element={<CreateClient />} />
        <Route path="/clients/:id" element={<ClientDetailPage />} />
        <Route path="/services" element={<ServicesInterface />} />
        <Route path="/create-service" element={<CreateService />} />
        <Route path="/services/:id" element={<ServiceDetailPage />} />

        <Route path="/client-services" element={<ClientServiceInterface />} />
        <Route path="/create-client-service" element={<CreateClientService />} />
        <Route path="/client-services/:id" element={<ClientServiceDetailPage />} />


        <Route path="/payments" element={<PaymentPage />} />
        <Route path="/payments/:id" element={<PaymentDetailPage />} />

        <Route path="/reports" element={<Reports />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="*" element={<h1>404 - Página no encontrada</h1>} />
      </Routes>
    </Router>
  );
};

export default AppRouter;
