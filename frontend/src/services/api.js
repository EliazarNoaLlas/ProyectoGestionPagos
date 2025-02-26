import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL + "/api/clients"; // Usa la URL base desde el .env

// Obtener todos los clientes
export const getClients = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

// Obtener un cliente por ID
export const getClientById = async (clientId) => {
  try {
    const response = await axios.get(`${API_URL}/${clientId}`);
    return response.data;
  } catch (error) {
    console.error("Error en getClientById:", error.response?.data || error.message);
    throw error;
  }
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

// Buscar clientes por nombre
export const searchClients = async (name) => {
  try {
    const response = await axios.get(`${API_URL}/search`, { params: { name } });
    return response.data;
  } catch (error) {
    console.error("Error en searchClients:", error.response?.data || error.message);
    return [];
  }
};

export const updateClient = async (clientId, updatedData) => {
  try {
    const response = await axios.put(`${API_URL}/${clientId}`, updatedData, {
      headers: { "Content-Type": "application/json" }
    });
    return response.data; // Devuelve los datos actualizados del cliente
  } catch (error) {
    console.error("Error en updateClient:", error.response?.data || error.message);
    throw error; // Lanza el error para ser manejado en el componente
  }
};


// Eliminar un cliente
export const deleteClient = async (clientId) => {
  try {
    await axios.delete(`${API_URL}/${clientId}`);
    return { success: true, message: "Cliente eliminado correctamente" };
  } catch (error) {
    console.error("Error en deleteClient:", error.response?.data || error.message);
    throw error;
  }
};
