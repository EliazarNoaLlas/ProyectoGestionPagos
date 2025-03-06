/**
 * File: client.controller.js
 * Author: Eliazar
 * Copyright: 2025, Embedding Minds
 * License: MIT
 *
 * Purpose:
 * Implementation of controllers to manage CRUD operations for clients
 * and handle HTTP requests related to clients.
 *
 * Last Modified: 2024-04-20
 */

import {
  getAllClients,
  getClientById,
  createClient,
  updateClient,
  deleteClient,
  findClientsByName
} from "../models/client.model.js";

/**
 * Gets all clients from the system
 *
 * This function handles the HTTP request to retrieve the complete list
 * of clients stored in the database.
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<void>} - Responds with a JSON containing all clients or an error message
 */
export const getClients = async (req, res) => {
  try {
    // Request all clients from the model
    const clients = await getAllClients();
    // Return clients as JSON response
    res.json(clients);
  } catch (error) {
    // Handle any errors that may occur and return a 500 status
    res.status(500).json({ message: "Error retrieving clients", error: error.message });
  }
};

/**
 * Gets a specific client by their ID
 *
 * This function searches for and returns a client's information
 * based on the ID provided in the URL parameters.
 *
 * @param {Object} req - Express request object with client ID in params
 * @param {Object} res - Express response object
 * @returns {Promise<void>} - Responds with the requested client or an error message
 */
export const getClient = async (req, res) => {
  try {
    // Extract ID from request parameters
    const { id } = req.params;
    // Find client by ID using the model
    const client = await getClientById(id);
    // If client is not found, return a 404 error
    if (!client) return res.status(404).json({ message: "Client not found" });
    // Return the found client as JSON response
    res.json(client);
  } catch (error) {
    // Handle any errors and return a 500 status
    res.status(500).json({ message: "Error retrieving client", error: error.message });
  }
};

/**
 * Creates a new client in the system
 *
 * This function processes client data sent in the request body
 * and creates a new record in the database.
 *
 * @param {Object} req - Express request object with client data in body
 * @param {Object} res - Express response object
 * @returns {Promise<void>} - Responds with the created client or an error message
 */
export const createNewClient = async (req, res) => {
  try {
    // Create a new client using the data from the request body
    const client = await createClient(req.body);
    // Return the created client with a 201 status (Created)
    res.status(201).json(client);
  } catch (error) {
    // Handle any errors during creation and return a 500 status
    res.status(500).json({ message: "Error creating client", error: error.message });
  }
};

/**
 * Updates an existing client's information
 *
 * This function modifies a client's data based on the provided ID
 * and the new data sent in the request body.
 *
 * @param {Object} req - Express request object with ID in params and updated data in body
 * @param {Object} res - Express response object
 * @returns {Promise<void>} - Responds with the updated client or an error message
 */
export const modifyClient = async (req, res) => {
  try {
    // Extract ID from request parameters
    const { id } = req.params;
    // Update the client with the data provided in the request body
    const client = await updateClient(id, req.body);
    // If client is not found, return a 404 error
    if (!client) return res.status(404).json({ message: "Client not found" });
    // Return the updated client as JSON response
    res.json(client);
  } catch (error) {
    // Handle any errors during update and return a 500 status
    res.status(500).json({ message: "Error updating client", error: error.message });
  }
};

/**
 * Removes a client from the system
 *
 * This function permanently deletes a client from the database
 * based on the ID provided in the URL parameters.
 *
 * @param {Object} req - Express request object with client ID in params
 * @param {Object} res - Express response object
 * @returns {Promise<void>} - Responds with a success message or error
 */
export const removeClient = async (req, res) => {
  try {
    // Extract ID from request parameters
    const { id } = req.params;
    // Attempt to delete the client using the model
    const success = await deleteClient(id);
    // If client is not found, return a 404 error
    if (!success) return res.status(404).json({ message: "Client not found" });
    // Return a success message if deletion was successful
    res.json({ message: "Client successfully deleted" });
  } catch (error) {
    // Handle any errors during deletion and return a 500 status
    res.status(500).json({ message: "Error deleting client", error: error.message });
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
export const searchClients = async (req, res) => {
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
    const clients = await findClientsByName(trimmedName);

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