import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL + "/clients"; // Usa la URL base desde el .env

// Obtener todos los clientes
export const getClients = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

// Agregar un cliente
export const addClient = async (clientData) => {
  try {
    const response = await axios.post(API_URL, clientData, {
      headers: { "Content-Type": "application/json" }
    });
    return response.data;
  } catch (error) {
    console.error("Error en addClient:", error.response?.data || error.message);
    throw error;
  }
};

// Registrar pago
export const registerPayment = async (clientId) => {
  try {
    const response = await axios.patch(`${API_URL}/${clientId}/payment`);
    return response.data;
  } catch (error) {
    console.error("Error en registerPayment:", error.response?.data || error.message);
    throw error;
  }
};
