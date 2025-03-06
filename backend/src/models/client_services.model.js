/*
 * File: client_services.model.js
 * Author: Eliazar
 * Copyright: 2025, Embedding Minds
 * License: MIT
 *
 * Purpose:
 * Implementation of the repository pattern for client services data management.
 * Handles operations related to services assigned to clients including creation,
 * retrieval, updates, and status management.
 *
 * Last Modified: 2025-03-02
 */

import pool from "../config/db.js";

/**
 * Retrieves all client services from the database ordered by creation date (newest first).
 *
 * This function executes a SQL query to fetch all records from the client_services table
 * with joined client and service information for a complete view of each assignment.
 *
 * @returns {Promise<Array>} A promise that resolves to an array of client service objects.
 */
export const getAllClientServices = async () => {
    // SQL query joining client_services with clients and services tables
    const query = `
        SELECT cs.*, c.name as client_name, s.name as service_name, s.price as service_price
        FROM client_services cs
        JOIN clients c ON cs.client_id = c.client_id
        JOIN services s ON cs.service_id = s.service_id
        ORDER BY cs.created_at DESC`;

    // Execute the query
    const {rows} = await pool.query(query);

    // Return the resulting array of client service records with joined data
    return rows;
};

/**
 * Retrieves a specific client service by its unique identifier.
 *
 * This function executes a parameterized query to find a client service with the specified ID
 * and includes the related client and service information.
 *
 * @param {number|string} client_service_id - The unique identifier of the client service to retrieve.
 * @returns {Promise<Object|undefined>} A promise that resolves to the client service object or undefined.
 */
export const getClientServiceById = async (client_service_id) => {
    // SQL query joining client_services with clients and services tables for a specific ID
    const query = `
        SELECT cs.*, c.name as client_name, s.name as service_name, s.price as service_price
        FROM client_services cs
        JOIN clients c ON cs.client_id = c.client_id
        JOIN services s ON cs.service_id = s.service_id
        WHERE cs.client_service_id = $1`;

    // Execute parameterized query with client_service_id as the parameter ($1)
    const {rows} = await pool.query(query, [client_service_id]);

    // Return the first result (or undefined if no results)
    return rows[0];
};

/**
 * Creates a new client service record in the database.
 *
 * This function inserts a new record into the client_services table linking a client with a service
 * and returns the newly created client service object with all fields including generated ones.
 *
 * @param {Object} clientServiceData - Object containing client service information.
 * @param {number|string} clientServiceData.client_id - The ID of the client.
 * @param {number|string} clientServiceData.service_id - The ID of the service.
 * @param {number} clientServiceData.amount_due - The amount due for this service.
 * @param {string} clientServiceData.due_date - The due date for payment or completion.
 * @returns {Promise<Object>} A promise that resolves to the newly created client service object.
 */
export const createClientService = async ({
                                              client_id,
                                              service_id,
                                              status = 'activo',
                                              amount_due,
                                              due_date,
                                              payment_status = 'pendiente'
                                          }) => {
    // Define SQL query to insert a new client service and return all fields
    const query = `
        INSERT INTO client_services (client_id,
                                     service_id,
                                     status,
                                     amount_due,
                                     due_date,
                                     payment_status)
        VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`;

    // Define parameters array in the same order as the placeholders in the query
    const params = [
        client_id, service_id, status, amount_due, due_date, payment_status
    ];

    // Execute the query with the parameters
    const {rows} = await pool.query(query, params);

    // Return the newly created client service object
    return rows[0];
};

/**
 * Updates an existing client service record in the database.
 *
 * This function modifies a client service record with the specified ID using the provided information
 * and returns the updated client service object.
 *
 * @param {number|string} client_service_id - The unique identifier of the client service to update.
 * @param {Object} clientServiceData - Object containing updated client service information.
 * @param {number|string} clientServiceData.client_id - The ID of the client.
 * @param {number|string} clientServiceData.service_id - The ID of the service.
 * @param {string} clientServiceData.status - The status of the client service assignment.
 * @param {number} clientServiceData.amount_due - The amount due for this service.
 * @param {string} clientServiceData.due_date - The due date for payment or completion.
 * @param {string} clientServiceData.payment_status - The payment status.
 * @returns {Promise<Object|undefined>} A promise that resolves to the updated client service object or undefined if not found.
 */
export const updateClientService = async (client_service_id, {
    client_id,
    service_id,
    status,
    amount_due,
    due_date,
    payment_status
}) => {
    // Define SQL query to update a client service with the specified ID and return all fields
    const query = `
        UPDATE client_services
        SET client_id      = $1,
            service_id     = $2,
            status         = $3,
            amount_due     = $4,
            due_date       = $5,
            payment_status = $6,
            updated_at     = CURRENT_TIMESTAMP
        WHERE client_service_id = $7 RETURNING *`;

    // Define parameters array in the same order as the placeholders in the query
    const params = [
        client_id, service_id, status, amount_due, due_date, payment_status, client_service_id
    ];

    // Execute the query with the parameters
    const {rows} = await pool.query(query, params);

    // Return the updated client service object or undefined if not found
    return rows[0];
};

/**
 * Updates only the status of a client service record.
 *
 * This function provides a targeted way to modify just the status field of a client service
 * without needing to provide all other fields.
 *
 * @param {number|string} client_service_id - The unique identifier of the client service.
 * @param {string} status - The new status value ('activo', 'inactivo', or 'cancelado').
 * @returns {Promise<Object|undefined>} A promise that resolves to the updated client service object or undefined if not found.
 */
export const updateClientServiceStatus = async (client_service_id, status) => {
    // Validate that status is one of the allowed values
    if (!['activo', 'inactivo', 'cancelado'].includes(status)) {
        throw new Error("Invalid status value. Must be 'activo', 'inactivo', or 'cancelado'");
    }

    // Define SQL query to update just the status field
    const query = `
        UPDATE client_services
        SET status     = $1,
            updated_at = CURRENT_TIMESTAMP
        WHERE client_service_id = $2 RETURNING *`;

    // Execute the query with the parameters
    const {rows} = await pool.query(query, [status, client_service_id]);

    // Return the updated client service object or undefined if not found
    return rows[0];
};

/**
 * Updates only the payment status of a client service record.
 *
 * This function provides a targeted way to modify just the payment_status field
 * without needing to provide all other fields.
 *
 * @param {number|string} client_service_id - The unique identifier of the client service.
 * @param {string} payment_status - The new payment status value ('pendiente' or 'pagado').
 * @returns {Promise<Object|undefined>} A promise that resolves to the updated client service object or undefined if not found.
 */
export const updateClientServicePaymentStatus = async (client_service_id, payment_status) => {
    // Validate that payment_status is one of the allowed values
    if (!['pendiente', 'pagado'].includes(payment_status)) {
        throw new Error("Invalid payment status value. Must be 'pendiente' or 'pagado'");
    }

    // Define SQL query to update just the payment_status field
    const query = `
        UPDATE client_services
        SET payment_status = $1,
            updated_at     = CURRENT_TIMESTAMP
        WHERE client_service_id = $2 RETURNING *`;

    // Execute the query with the parameters
    const {rows} = await pool.query(query, [payment_status, client_service_id]);

    // Return the updated client service object or undefined if not found
    return rows[0];
};

/**
 * Deletes a client service record from the database.
 *
 * This function removes the client service with the specified ID from the database
 * and returns a boolean indicating whether the deletion was successful.
 *
 * @param {number|string} client_service_id - The unique identifier of the client service to delete.
 * @returns {Promise<boolean>} A promise that resolves to true if client service was deleted, false otherwise.
 */
export const deleteClientService = async (client_service_id) => {
    // Execute DELETE query with client_service_id as the parameter
    const {rowCount} = await pool.query("DELETE FROM client_services WHERE client_service_id = $1", [client_service_id]);

    // Return true if at least one row was affected (deleted), false otherwise
    return rowCount > 0;
};

/**
 * Retrieves all client services for a specific client.
 *
 * This function executes a parameterized query to find all services assigned to a client
 * and includes the service details for each assignment.
 *
 * @param {number|string} client_id - The unique identifier of the client.
 * @returns {Promise<Array>} A promise that resolves to an array of client service objects.
 */
export const getClientServicesByClientId = async (client_id) => {
    // SQL query to get all services for a specific client with service details
    const query = `
        SELECT cs.*, s.name as service_name, s.description as service_description, s.price as service_price
        FROM client_services cs
        JOIN services s ON cs.service_id = s.service_id
        WHERE cs.client_id = $1
        ORDER BY cs.created_at DESC`;

    // Execute parameterized query with client_id as the parameter
    const {rows} = await pool.query(query, [client_id]);

    // Return the array of client service records
    return rows;
};

/**
 * Searches for client services by service name using case-insensitive and accent-insensitive matching.
 *
 * @param {string} serviceName - The name of the service to search for.
 * @returns {Promise<Array>} - A promise resolving to an array of matching client services.
 */
export const findClientServicesByServiceName = async (serviceName) => {
    try {
        // Validación del término de búsqueda
        if (!serviceName || typeof serviceName !== "string") {
            throw new Error("Término de búsqueda inválido");
        }

        // Limpiar y preparar el término de búsqueda
        const cleanedName = serviceName
            .trim()           // Eliminar espacios al inicio y final
            .replace(/\s+/g, ' '); // Reemplazar múltiples espacios por uno solo

        // Definir consulta SQL con unaccent e ILIKE para búsqueda flexible
        const query = `
            SELECT cs.*, c.name as client_name, s.name as service_name, s.price as service_price
            FROM client_services cs
            JOIN clients c ON cs.client_id = c.client_id
            JOIN services s ON cs.service_id = s.service_id
            WHERE unaccent(LOWER(s.name)) ILIKE unaccent(LOWER($1))
               OR unaccent(LOWER(c.name)) ILIKE unaccent(LOWER($1))
            ORDER BY s.name DESC
            LIMIT 100;
        `;

        // Crear parámetro con comodines para coincidencia parcial
        const values = [`%${cleanedName}%`];

        // Ejecutar la consulta con el parámetro de búsqueda
        const { rows } = await pool.query(query, values);

        return rows;
    } catch (error) {
        console.error("Error en findClientServicesByServiceName:", error);
        throw new Error("Fallo en la consulta de base de datos");
    }
};