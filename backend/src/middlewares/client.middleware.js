/**
 * File: client.middleware.js
 * Author: Victor
 * Copyright: 2025, Embedding Minds
 * License: MIT
 *
 * Purpose:
 * Middleware functions for client-related operations including validation
 * of unique constraints before database operations.
 *
 * Last Modified: 2025-03-03
 */

import { findExistingClient } from "../models/client.model.js";

/**
 * Middleware to verify that email and identification number are unique in the database.
 *
 * This middleware checks if a client with the provided email or identification number
 * already exists before allowing create or update operations.
 *
 * For update operations, it excludes the current client from the uniqueness check.
 *
 * @returns {Function} Express middleware function
 */
export const validateUniqueClient = async (req, res, next) => {
    try {
        const { email, identification_number } = req.body;
        // Get client_id from URL params (for PUT requests) or null (for POST requests)
        const clientId = req.params.id || null;

        // Check for existing client with the same email or identification number
        const existingClient = await findExistingClient(email, identification_number, clientId);

        if (existingClient) {
            // Prepare a specific error message based on which field conflicts
            const errors = [];

            if (existingClient.email_conflict) {
                errors.push("El correo electrónico ya está registrado");
            }

            if (existingClient.id_number_conflict) {
                errors.push("El número de identificación ya está registrado");
            }

            return res.status(409).json({
                status: "error",
                message: "Conflicto de datos únicos",
                errors
            });
        }

        // No conflicts found, proceed to the next middleware or controller
        next();
    } catch (error) {
        return res.status(500).json({
            status: "error",
            message: "Error al verificar la unicidad del cliente",
            error: error.message
        });
    }
};