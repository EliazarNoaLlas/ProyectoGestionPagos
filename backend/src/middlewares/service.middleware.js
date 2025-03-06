/**
 * File: service.middleware.js
 * Author: Eliazar
 * Copyright: 2025, Embedding Minds
 * License: MIT
 *
 * Purpose:
 * Middleware functions for service-related operations including validation
 * of unique constraints before database operations.
 *
 * Last Modified: 2025-03-04
 */

import { searchServices } from "../models/service.model.js";

/**
 * Middleware to verify that service name is unique in the database.
 *
 * This middleware checks if a service with the provided name
 * already exists before allowing create or update operations.
 *
 * For update operations, it excludes the current service from the uniqueness check.
 *
 * @returns {Function} Express middleware function
 */
export const validateUniqueService = async (req, res, next) => {
    try {
        const { name } = req.body;
        // Get service_id from URL params (for PUT requests) or null (for POST requests)
        const serviceId = req.params.id || null;

        // Search for existing services with the same name
        const existingServices = await searchServices(name);

        // Filter out services that don't match the current update operation
        const conflictingServices = existingServices.filter(service =>
            // For create operations (no serviceId), any match is a conflict
            // For update operations, ignore the current service being updated
            serviceId === null || service.service_id !== parseInt(serviceId)
        );

        if (conflictingServices.length > 0) {
            return res.status(409).json({
                status: "error",
                message: "Conflicto de datos únicos",
                errors: ["Ya existe un servicio con este nombre"]
            });
        }

        // No conflicts found, proceed to the next middleware or controller
        next();
    } catch (error) {
        return res.status(500).json({
            status: "error",
            message: "Error al verificar la unicidad del servicio",
            error: error.message
        });
    }
};

// Additional function to find an existing service by name (optional, for more specific checks)
export const findExistingServiceByName = async (name, excludeServiceId = null) => {
    try {
        const existingServices = await searchServices(name);

        // Filter out services that don't match the current update operation
        return existingServices.filter(service =>
            excludeServiceId === null || service.service_id !== parseInt(excludeServiceId)
        );
    } catch (error) {
        console.error("Error finding existing service:", error);
        throw error;
    }
};