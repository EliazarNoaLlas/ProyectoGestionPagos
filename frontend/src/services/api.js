/*
 * File: service/api.js
 * Author: Eliazar
 * Copyright: 2025, Embedding Minds
 * License: MIT
 *
 * Purpose:
 * Métodos para conectarse con el backend
 *
 * Last Modified: 2025-03-05
 */

import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL + "/api/clients"; // Usa la URL base desde el .env
const SERVICE_API_URL = import.meta.env.VITE_API_URL + "/api/services"; // URL base para servicios
const PAYMENT_API_URL = import.meta.env.VITE_API_URL + "/api/payments"; // URL base para pagos


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
            headers: {"Content-Type": "application/json"}
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
        const response = await axios.get(`${API_URL}/search`, {params: {name}});
        return response.data;
    } catch (error) {
        console.error("Error en searchClients:", error.response?.data || error.message);
        return [];
    }
};

export const updateClient = async (clientId, updatedData) => {
    try {
        const response = await axios.put(`${API_URL}/${clientId}`, updatedData, {
            headers: {"Content-Type": "application/json"}
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
        return {success: true, message: "Cliente eliminado correctamente"};
    } catch (error) {
        console.error("Error en deleteClient:", error.response?.data || error.message);
        throw error;
    }
};


// Obtener todos los servicios
export const getServices = async () => {
    try {
        const response = await axios.get(SERVICE_API_URL);
        return response.data;
    } catch (error) {
        console.error("Error en getServices:", error.response?.data || error.message);
        throw new Error("No se pudieron obtener los servicios. Inténtalo de nuevo más tarde.");
    }
};


// Agregar un servicio
export const addService = async (serviceData) => {
    try {
        const response = await axios.post(SERVICE_API_URL, serviceData, {
            headers: {"Content-Type": "application/json"}
        });
        return response.data;
    } catch (error) {
        console.error("Error en addService:", error.response?.data || error.message);
        throw error;
    }
};


// Buscar servicios por término
export const searchServices = async (searchTerm) => {
    try {
        const response = await axios.get(`${SERVICE_API_URL}/search/term`, {
            params: {term: searchTerm.trim()} // Se envía como parámetro de consulta correctamente
        });
        return response.data;
    } catch (error) {
        console.error("Error en searchServices:", error.response?.data || error.message);
        throw new Error("No se pudo obtener los servicios. Inténtalo de nuevo más tarde.");
    }
};

// Obtener un servicio por ID
export const getServiceById = async (serviceId) => {
    try {
        const response = await axios.get(`${SERVICE_API_URL}/${serviceId}`);
        return response.data;
    } catch (error) {
        console.error("Error en getServiceById:", error.response?.data || error.message);
        throw new Error("No se pudo obtener el servicio. Verifica el ID e intenta nuevamente.");
    }
};

// Actualizar un servicio
export const updateService = async (serviceId, updatedData) => {
    try {
        const response = await axios.put(`${SERVICE_API_URL}/${serviceId}`, updatedData, {
            headers: {"Content-Type": "application/json"}
        });
        return response.data; // Devuelve los datos actualizados del servicio
    } catch (error) {
        console.error("Error en updateService:", error.response?.data || error.message);
        throw new Error("No se pudo actualizar el servicio. Inténtalo de nuevo más tarde.");
    }
};

// Eliminar un servicio
export const deleteService = async (serviceId) => {
    try {
        await axios.delete(`${SERVICE_API_URL}/${serviceId}`);
        return {success: true, message: "Servicio eliminado correctamente"};
    } catch (error) {
        console.error("Error en deleteService:", error.response?.data || error.message);
        throw new Error("No se pudo eliminar el servicio. Inténtalo de nuevo más tarde.");
    }
};

// =====================
// Métodos para Pagos
// =====================

// Obtener un pago por ID
export const getPaymentById = async (paymentId) => {
    try {
        const response = await axios.get(`${PAYMENT_API_URL}/${paymentId}`);
        return response.data;
    } catch (error) {
        console.error("Error en getPaymentById:", error.response?.data || error.message);
        throw error;
    }
};

// Actualizar un pago
export const updatePayment = async (paymentId, paymentData) => {
    try {
        const response = await axios.put(`${PAYMENT_API_URL}/${paymentId}`, paymentData, {
            headers: {"Content-Type": "application/json"}
        });
        return response.data;
    } catch (error) {
        console.error("Error en updatePayment:", error.response?.data || error.message);
        throw error;
    }
};

// Eliminar un pago
export const deletePayment = async (paymentId) => {
    try {
        const response = await axios.delete(`${PAYMENT_API_URL}/${paymentId}`);
        return response.data;
    } catch (error) {
        console.error("Error en deletePayment:", error.response?.data || error.message);
        throw error;
    }
};

// Actualizar solo el estado de un pago
export const updatePaymentStatus = async (paymentId, status) => {
    try {
        const response = await axios.patch(
            `${PAYMENT_API_URL}/${paymentId}/status`,
             status ,
            {
                headers: { "Content-Type": "application/json" }
            }
        );
        return response.data;
    } catch (error) {
        console.error("Error en updatePaymentStatus:", error.response?.data || error.message);
        throw error;
    }
};