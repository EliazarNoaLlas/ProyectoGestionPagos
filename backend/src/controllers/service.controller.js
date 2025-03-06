/**
 * File: service.controller.js
 * Author: Eliazar
 * Copyright: 2025, Embedding Minds
 * License: MIT
 *
 * Purpose:
 * Implementation of controllers to manage CRUD operations for services
 * and handle HTTP requests related to services.
 *
 * Last Modified: 2025-03-02
 */

import {
    getAllServices,
    getServiceById,
    createService,
    updateService,
    deleteService,
    searchServices,
    getServicesByPriceRange
} from "../models/service.model.js";

/**
 * Gets all services from the system
 *
 * This function handles the HTTP request to retrieve the complete list
 * of services stored in the database.
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<void>} - Responds with a JSON containing all services or an error message
 */
export const getServices = async (req, res) => {
    try {
        // Request all services from the model
        const services = await getAllServices();
        // Return services as JSON response
        res.json(services);
    } catch (error) {
        // Handle any errors that may occur and return a 500 status
        res.status(500).json({ message: "Error retrieving services", error: error.message });
    }
};

/**
 * Gets a specific service by its ID
 *
 * This function searches for and returns a service's information
 * based on the ID provided in the URL parameters.
 *
 * @param {Object} req - Express request object with service ID in params
 * @param {Object} res - Express response object
 * @returns {Promise<void>} - Responds with the requested service or an error message
 */
export const getService = async (req, res) => {
    try {
        // Extract ID from request parameters
        const { id } = req.params;
        // Find service by ID using the model
        const service = await getServiceById(id);
        // If service is not found, return a 404 error
        if (!service) return res.status(404).json({ message: "Service not found" });
        // Return the found service as JSON response
        res.json(service);
    } catch (error) {
        // Handle any errors and return a 500 status
        res.status(500).json({ message: "Error retrieving service", error: error.message });
    }
};

/**
 * Creates a new service in the system
 *
 * This function processes service data sent in the request body
 * and creates a new record in the database.
 *
 * @param {Object} req - Express request object with service data in body
 * @param {Object} res - Express response object
 * @returns {Promise<void>} - Responds with the created service or an error message
 */
export const createNewService = async (req, res) => {
    try {
        // Create a new service using the data from the request body
        const service = await createService(req.body);
        // Return the created service with a 201 status (Created)
        res.status(201).json(service);
    } catch (error) {
        // Handle any errors during creation and return a 500 status
        res.status(500).json({ message: "Error creating service", error: error.message });
    }
};

/**
 * Updates an existing service's information
 *
 * This function modifies a service's data based on the provided ID
 * and the new data sent in the request body.
 *
 * @param {Object} req - Express request object with ID in params and updated data in body
 * @param {Object} res - Express response object
 * @returns {Promise<void>} - Responds with the updated service or an error message
 */
export const modifyService = async (req, res) => {
    try {
        // Extract ID from request parameters
        const { id } = req.params;
        // Update the service with the data provided in the request body
        const service = await updateService(id, req.body);
        // If service is not found, return a 404 error
        if (!service) return res.status(404).json({ message: "Service not found" });
        // Return the updated service as JSON response
        res.json(service);
    } catch (error) {
        // Handle any errors during update and return a 500 status
        res.status(500).json({ message: "Error updating service", error: error.message });
    }
};

/**
 * Removes a service from the system
 *
 * This function permanently deletes a service from the database
 * based on the ID provided in the URL parameters.
 *
 * @param {Object} req - Express request object with service ID in params
 * @param {Object} res - Express response object
 * @returns {Promise<void>} - Responds with a success message or error
 */
export const removeService = async (req, res) => {
    try {
        // Extract ID from request parameters
        const { id } = req.params;
        // Attempt to delete the service using the model
        const success = await deleteService(id);
        // If service is not found, return a 404 error
        if (!success) return res.status(404).json({ message: "Service not found" });
        // Return a success message if deletion was successful
        res.json({ message: "Service successfully deleted" });
    } catch (error) {
        // Handle any errors during deletion and return a 500 status
        res.status(500).json({ message: "Error deleting service", error: error.message });
    }
};

/**
 * Searches for services by name or description
 *
 * This function finds all services whose names or descriptions match
 * the provided search term.
 *
 * @param {Object} req - Express request object with search term in query
 * @param {Object} res - Express response object
 * @returns {Promise<void>} - Responds with found services or an error message
 */
export const searchServicesByTerm = async (req, res) => {
    try {
        // Extract the term parameter from the query
        const { term } = req.query;
        // Validate that a search term was provided
        if (!term) return res.status(400).json({ message: "Search term is required" });
        // Find services that match the term using the model
        const services = await searchServices(term);
        // Return found services as JSON response
        res.json(services);
    } catch (error) {
        // Handle any errors during search and return a 500 status
        res.status(500).json({ message: "Error searching for services", error: error.message });
    }
};

/**
 * Gets services within a specified price range
 *
 * This function retrieves all services with prices between
 * the specified minimum and maximum values.
 *
 * @param {Object} req - Express request object with min and max price in query
 * @param {Object} res - Express response object
 * @returns {Promise<void>} - Responds with services in the price range or an error message
 */
export const getServicesByPrice = async (req, res) => {
    try {
        // Extract min and max prices from query parameters
        const { min, max } = req.query;

        // Validate that both min and max prices were provided
        if (!min || !max) {
            return res.status(400).json({ message: "Both minimum and maximum prices are required" });
        }

        // Convert string values to numbers
        const minPrice = parseFloat(min);
        const maxPrice = parseFloat(max);

        // Validate that the values are valid numbers
        if (isNaN(minPrice) || isNaN(maxPrice)) {
            return res.status(400).json({ message: "Price values must be numbers" });
        }

        // Validate that min price is not greater than max price
        if (minPrice > maxPrice) {
            return res.status(400).json({ message: "Minimum price cannot be greater than maximum price" });
        }

        // Get services within the specified price range
        const services = await getServicesByPriceRange(minPrice, maxPrice);

        // Return found services as JSON response
        res.json(services);
    } catch (error) {
        // Handle any errors and return a 500 status
        res.status(500).json({ message: "Error retrieving services by price range", error: error.message });
    }
};