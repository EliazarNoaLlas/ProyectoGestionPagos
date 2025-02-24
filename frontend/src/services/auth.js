import axios from "axios";

const API_URL = "http://localhost:3000/api/auth"; // Asegúrate de esta URL


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
