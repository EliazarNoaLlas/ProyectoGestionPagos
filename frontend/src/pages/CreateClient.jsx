import React from "react";
import { useNavigate } from "react-router-dom";
import ClientForm from "../components/ClientForm";
import {addClient } from "../services/api"

const CreateClient = () => {
  const navigate = useNavigate();

  const handleAddClient = async (newClient) => {
    try {
      const clientData = {
        name: newClient.name.trim(),
        service: newClient.service.trim(),
        amount: parseFloat(newClient.amount),
        dueDate: new Date(newClient.dueDate).toISOString(),
        status: newClient.status?.trim() || "Pendiente",
      };

      await addClient(clientData);
      alert("Cliente agregado exitosamente.");
      navigate("/clients"); // Redirige a la página de clientes
    } catch (error) {
      console.error("Error al agregar cliente:", error.response?.data || error.message);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-purple-700">Registrar Nuevo Cliente</h1>
      <ClientForm onAddClient={handleAddClient} />
    </div>
  );
};

export default CreateClient;