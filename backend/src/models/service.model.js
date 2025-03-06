/*
 * File: service.model.js
 * Author: Eliazar
 * Copyright: 2025, Embedding Minds
 * License: MIT
 *
 * Purpose:
 * Implementation of the repository pattern for service data management.
 *
 * Last Modified: 2025-03-02
 */

import pool from "../config/db.js";

/**
 * Retrieves all services from the database.
 */
export const getAllServices = async () => {
    // Execute query to select all services ordered by name
    const {rows} = await pool.query("SELECT * FROM services ORDER BY name");
    // Return the resulting array of service records
    return rows;
};

/**
 * Retrieves a specific service by its unique identifier.
 */
export const getServiceById = async (service_id) => {
    // Execute parameterized query with service_id as the parameter ($1)
    const {rows} = await pool.query("SELECT * FROM services WHERE service_id = $1", [service_id]);
    // Return the first result (or undefined if no results)
    return rows[0];
};

/**
 * Creates a new service record in the database.
 */
export const createService = async ({
                                        name,
                                        description,
                                        price
                                    }) => {
    // Define SQL query to insert a new service and return all fields
    const query = `
        INSERT INTO services (name, description, price)
        VALUES ($1, $2, $3) RETURNING *`;

    // Define parameters array in the same order as the placeholders in the query
    const params = [name, description, price];

    // Execute the query with the parameters
    const {rows} = await pool.query(query, params);

    // Return the newly created service object
    return rows[0];
};

/**
 * Updates an existing service record in the database.
 */
export const updateService = async (service_id, {
    name,
    description,
    price
}) => {
    // Define SQL query to update a service with the specified ID and return all fields
    const query = `
        UPDATE services
        SET name        = $1,
            description = $2,
            price       = $3
        WHERE service_id = $4 RETURNING *`;

    // Define parameters array in the same order as the placeholders in the query
    const params = [name, description, price, service_id];

    // Execute the query with the parameters
    const {rows} = await pool.query(query, params);

    // Return the updated service object or undefined if service not found
    return rows[0];
};

/**
 * Deletes a service record from the database.
 */
export const deleteService = async (service_id) => {
    // Execute DELETE query with service_id as the parameter
    const {rowCount} = await pool.query("DELETE FROM services WHERE service_id = $1", [service_id]);

    // Return true if at least one row was affected (deleted), false otherwise
    return rowCount > 0;
};


/**
 * Searches for services by name or description using case-insensitive and accent-insensitive matching.
 *
 * @param {string} searchTerm - The term to search for in service name or description.
 * @returns {Promise<Array>} - A promise resolving to an array of matching services.
 */
export const searchServices = async (searchTerm) => {
    try {
        // Validación del término de búsqueda
        if (!searchTerm || typeof searchTerm !== "string") {
            throw new Error("Término de búsqueda inválido");
        }

        // Limpiar y preparar el término de búsqueda
        const cleanedTerm = searchTerm
            .trim()           // Eliminar espacios al inicio y final
            .replace(/\s+/g, ' '); // Reemplazar múltiples espacios por uno solo

        // Definir consulta SQL con unaccent e ILIKE para búsqueda flexible
        const query = `
            SELECT *
            FROM services
            WHERE unaccent(LOWER(name)) ILIKE unaccent(LOWER($1))
               OR unaccent(LOWER(description)) ILIKE unaccent(LOWER($1))
            ORDER BY name ASC
            LIMIT 100;
        `;

        // Crear parámetro con comodines para coincidencia parcial
        const values = [`%${cleanedTerm}%`];

        // Ejecutar la consulta con el parámetro de búsqueda
        const { rows } = await pool.query(query, values);

        return rows;
    } catch (error) {
        console.error("Error en searchServices:", error);
        throw new Error("Fallo en la consulta de base de datos");
    }
};

/**
 * Retrieves services within a specified price range.
 */
export const getServicesByPriceRange = async (minPrice, maxPrice) => {
    // Execute parameterized query with price range parameters
    const {rows} = await pool.query(
        "SELECT * FROM services WHERE price BETWEEN $1 AND $2 ORDER BY price",
        [minPrice, maxPrice]
    );

    // Return the array of service records within the price range
    return rows;
};