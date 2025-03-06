/*
 * File: client.model.js
 * Author: Eliazar
 * Copyright: 2025, Embedding Minds
 * License: MIT
 *
 * Purpose:
 * Implementation of the repository pattern for client data management.
 *
 * Last Modified: 2024-04-20
 */

import pool from "../config/db.js";

/**
 * Retrieves all clients from the database ordered by creation date (newest first).
 */
export const getAllClients = async () => {
    // Execute query to select all clients ordered by creation date in descending order
    const {rows} = await pool.query("SELECT * FROM clients ORDER BY created_at DESC");
    // Return the resulting array of client records
    return rows;
};

/**
 * Retrieves a specific client by their unique identifier.
 */
export const getClientById = async (client_id) => {
    // Execute parameterized query with client_id as the parameter ($1)
    const {rows} = await pool.query("SELECT * FROM clients WHERE client_id = $1", [client_id]);
    // Return the first result (or undefined if no results)
    return rows[0];
};

/**
 * Creates a new client record in the database.
 */
export const createClient = async ({
                                       type,
                                       name,
                                       phone,
                                       email,
                                       identification_number,
                                       identification_type,
                                       address,
                                       city,
                                       country,
                                       postal_code
                                   }) => {
    try {
        // Define SQL query to insert a new client and return all fields
        const query = `
      INSERT INTO clients (type, name, phone, email, identification_number,
                           identification_type, address, city, country, postal_code)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`;

        const params = [
            type, name, phone, email, identification_number,
            identification_type, address, city, country, postal_code
        ];

        // Ejecutar la consulta con los parámetros
        const { rows } = await pool.query(query, params);
        return rows[0];

    } catch (error) {
        // Si el error es por clave duplicada
        if (error.code === "23505") {
            throw new Error("El email o el número de identificación ya están registrados.");
        }

        // Capturar otros errores y lanzarlos
        throw new Error(`Error al crear el cliente: ${error.message}`);
    }
};

/**
 * Updates an existing client record in the database.
 */
export const updateClient = async (client_id, {
    type,
    name,
    phone,
    email,
    identification_number,
    identification_type,
    address,
    city,
    country,
    postal_code,
    is_active
}) => {
    // Define SQL query to update a client with the specified ID and return all fields
    const query = `
        UPDATE clients
        SET type                  = $1,
            name                  = $2,
            phone                 = $3,
            email                 = $4,
            identification_number = $5,
            identification_type   = $6,
            address               = $7,
            city                  = $8,
            country               = $9,
            postal_code           = $10,
            is_active             = $11,
            updated_at            = CURRENT_TIMESTAMP
        WHERE client_id = $12 RETURNING *`;

    // Define parameters array in the same order as the placeholders in the query
    const params = [
        type, name, phone, email, identification_number, identification_type,
        address, city, country, postal_code, is_active, client_id
    ];

    // Execute the query with the parameters
    const {rows} = await pool.query(query, params);

    // Return the updated client object or undefined if client not found
    return rows[0];
};

/**
 * Deletes a client record from the database.
 */
export const deleteClient = async (client_id) => {
    // Execute DELETE query with client_id as the parameter
    const {rowCount} = await pool.query("DELETE FROM clients WHERE client_id = $1", [client_id]);

    // Return true if at least one row was affected (deleted), false otherwise
    return rowCount > 0;
};


/**
 * Searches for clients by name using case-insensitive and accent-insensitive matching.
 *
 * @param {string} name - The name to search for.
 * @returns {Promise<Array>} - A promise resolving to an array of matching clients.
 */
export const findClientsByName = async (name) => {
    try {
        // Validaciones más exhaustivas
        if (!name || typeof name !== "string") {
            throw new Error("Término de búsqueda inválido");
        }

        // Limpiar y preparar el término de búsqueda
        const cleanedName = name
            .trim()           // Eliminar espacios al inicio y final
            .replace(/\s+/g, ' '); // Reemplazar múltiples espacios por uno solo

        // Definir consulta SQL con unaccent e ILIKE para búsqueda sin distinción de mayúsculas/minúsculas y acentos
        const query = `
            SELECT *
            FROM clients
            WHERE unaccent(LOWER(name)) ILIKE unaccent(LOWER($1))
            ORDER BY created_at DESC
            LIMIT 100;
        `;

        // Crear parámetro con comodines para coincidencia parcial
        const values = [`%${cleanedName}%`];

        // Ejecutar la consulta con el parámetro de búsqueda
        const { rows } = await pool.query(query, values);

        return rows;
    } catch (error) {
        console.error("Error buscando clientes:", error);
        throw new Error("Fallo en la consulta de base de datos");
    }
};


/**
 * Checks if a client with the given email or identification number already exists.
 */
export const findExistingClient = async (
    email,
    identificationNumber,
    excludeClientId = null) => {
    let query, params;

    if (excludeClientId) {
        // For updates: check if email or ID number exists for any client OTHER THAN the one being updated
        query = `
            SELECT client_id,
                   email = $1                 AS email_conflict,
                   identification_number = $2 AS id_number_conflict
            FROM clients
            WHERE (email = $1 OR identification_number = $2)
              AND client_id != $3
                LIMIT 1`;
        params = [email, identificationNumber, excludeClientId];
    } else {
        // For new clients: check if email or ID number exists for any client
        query = `
            SELECT 
                client_id,
                email = $1 AS email_conflict,
                identification_number = $2 AS id_number_conflict
            FROM clients 
            WHERE email = $1 OR identification_number = $2
            LIMIT 1`;
        params = [email, identificationNumber];
    }

    const { rows } = await pool.query(query, params);

    // Return the conflict details (if any) or null if no conflict
    return rows.length > 0 ? rows[0] : null;
};