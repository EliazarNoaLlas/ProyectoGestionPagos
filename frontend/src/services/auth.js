import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL + "/auth"; // Usa la URL base desde el .env


// registrarse
export const registerRequest = async (user) => {
  try {
    const response = await axios.post(`${API_URL}/register`, user, {
      headers: { "Content-Type": "application/json" }
    });
    return response.data;
  } catch (error) {
    console.error("Error en addClient:", error.response?.data || error.message);
    throw error;
  }
};
