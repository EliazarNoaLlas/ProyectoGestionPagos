/*
 * File: client_services.controller.js
 * Author: Eliazar
 * Copyright: 2025, Embedding Minds
 * License: MIT
 *
 * Purpose:
 * Implements the controller logic for handling HTTP requests related to client services.
 * Provides endpoints for creating, retrieving, updating, and deleting client services.
 *
 * Last Modified: 2025-03-02
 */

import {
    getAllClientServices,
    getClientServiceById,
    createClientService,
    updateClientService,
    updateClientServiceStatus,
    updateClientServicePaymentStatus,
    deleteClientService,
    getClientServicesByClientId,
    findClientServicesByServiceName
} from "../models/client_services.model.js";
import {findClientsByName} from "../models/client.model.js";

// Retrieves all client services
export const getClientServices = async (req, res) => {
    try {
        const services = await getAllClientServices();
        res.json(services);
    } catch (error) {
        res.status(500).json({ message: "Error retrieving client services", error: error.message });
    }
};

// Retrieves a specific client service by ID
export const getClientService = async (req, res) => {
    const { id } = req.params;
    try {
        const service = await getClientServiceById(id);
        if (!service) return res.status(404).json({ message: "Client service not found" });
        res.json(service);
    } catch (error) {
        res.status(500).json({ message: "Error retrieving client service", error: error.message });
    }
};

// Creates a new client service
export const createNewClientService = async (req, res) => {
    try {
        const newService = await createClientService(req.body);
        res.status(201).json(newService);
    } catch (error) {
        res.status(500).json({ message: "Error creating client service", error: error.message });
    }
};

// Updates an existing client service
export const modifyClientService = async (req, res) => {
    const { id } = req.params;
    try {
        const updatedService = await updateClientService(id, req.body);
        if (!updatedService) return res.status(404).json({ message: "Client service not found" });
        res.json(updatedService);
    } catch (error) {
        res.status(500).json({ message: "Error updating client service", error: error.message });
    }
};

// Updates only the status of a client service
export const changeClientServiceStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    try {
        const updatedService = await updateClientServiceStatus(id, status);
        if (!updatedService) return res.status(404).json({ message: "Client service not found" });
        res.json(updatedService);
    } catch (error) {
        res.status(500).json({ message: "Error updating client service status", error: error.message });
    }
};

// Updates only the payment status of a client service
export const changeClientServicePaymentStatus = async (req, res) => {
    const { id } = req.params;
    const { payment_status } = req.body;
    try {
        const updatedService = await updateClientServicePaymentStatus(id, payment_status);
        if (!updatedService) return res.status(404).json({ message: "Client service not found" });
        res.json(updatedService);
    } catch (error) {
        res.status(500).json({ message: "Error updating client service payment status", error: error.message });
    }
};

// Deletes a client service
export const removeClientService = async (req, res) => {
    const { id } = req.params;
    try {
        const deleted = await deleteClientService(id);
        if (!deleted) return res.status(404).json({ message: "Client service not found" });
        res.json({ message: "Client service deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting client service", error: error.message });
    }
};

// Retrieves all client services for a specific client
export const getClientServicesByClient = async (req, res) => {
    const { client_id } = req.params;
    try {
        const services = await getClientServicesByClientId(client_id);
        res.json(services);
    } catch (error) {
        res.status(500).json({ message: "Error retrieving client services for client", error: error.message });
    }
};


/**
 * Searches for clients by name
 *
 * This function finds all clients whose names partially match
 * the provided search term.
 *
 * @param {Object} req - Express request object with name to search in query
 * @param {Object} res - Express response object
 * @returns {Promise<void>} - Responds with found clients or an error message
 */
export const searchClientsServices = async (req, res) => {
    try {
        // Verificar que el parámetro de búsqueda esté presente y sea un string no vacío
        const { name } = req.query;

        // Validación más estricta del parámetro de búsqueda
        if (!name || typeof name !== 'string' || name.trim() === '') {
            return res.status(400).json({
                message: "Se requiere un nombre válido para la búsqueda"
            });
        }

        // Eliminar espacios en blanco al inicio y al final
        const trimmedName = name.trim();

        // Encontrar clientes que coincidan con el nombre
        const clients = await findClientServicesByServiceName(trimmedName);

        // Si no se encuentran clientes, devolver un mensaje específico
        if (clients.length === 0) {
            return res.status(404).json({
                message: "No se encontraron clientes con ese nombre"
            });
        }

        // Devolver los clientes encontrados
        res.json(clients);
    } catch (error) {
        console.error('Error en la búsqueda de clientes:', error);
        res.status(500).json({
            message: "Error al buscar clientes",
            error: error.message
        });
    }
};