/*
 * File: payment.model.js
 * Author: Eliazar
 * Copyright: 2025, Embedding Minds
 * License: MIT
 *
 * Purpose:
 * Implementation of the repository pattern for payment data management.
 *
 * Last Modified: 2024-04-20
 */

import pool from "../config/db.js";

/**
 * Retrieves all payments from the database ordered by payment date (newest first).
 */
export const getAllPayments = async () => {
    // Execute query to select all payments ordered by payment date in descending order
    const {rows} = await pool.query("SELECT * FROM payments ORDER BY created_at DESC");
    // Return the resulting array of payment records
    return rows;
};

/**
 * Retrieves a specific payment by its unique identifier.
 */
export const getPaymentById = async (payment_id) => {
    const {rows} = await pool.query("SELECT * FROM payments WHERE payment_id = $1", [payment_id]);
    return rows[0];
};

/**
 * Retrieve detailed client service information
 * @param {number} client_service_id - ID of the client service
 * @returns {Promise<Object>} - Detailed service information
 */
const getClientServiceDetails = async (client_service_id) => {
    const client = await pool.connect();

    try {
        // Obtener detalles completos del servicio del cliente
        const {rows} = await client.query(
            `SELECT cs.client_service_id,
                    cs.amount_due,
                    cs.status AS service_status,
                    c.client_id,
                    c.name    AS client_name
             FROM client_services cs
                      JOIN clients c ON cs.client_id = c.client_id
             WHERE cs.client_service_id = $1
               AND cs.status NOT IN ('pagado')`,
            [client_service_id]
        );

        if (rows.length === 0) {
            throw new Error("El servicio del cliente no existe o está en un estado no válido para pagos.");
        }

        return rows[0];
    } finally {
        client.release();
    }
};

/**
 * Validate remaining amount and update service status
 * @param {Object} client - Client and service details
 * @param {number} payment_amount - Amount being paid
 * @param {Object} client_connection - Database client for transaction
 */
const processPaymentAndUpdateService = async (client, payment_amount, client_connection) => {
    const { client_service_id, amount_due } = client;

    // Calcular saldo restante
    const remaining_amount = Math.max(amount_due - payment_amount, 0);
    const payment_status = remaining_amount === 0 ? 'pagado' : 'pendiente';
    const service_status = remaining_amount === 0 ? 'cancelado' : 'activo';

    // Actualizar servicio del cliente - CORREGIDO: Removido punto y coma erróneo
    await client_connection.query(
        `UPDATE client_services
         SET amount_due = $1,
             status = $2,
             payment_status = $3
         WHERE client_service_id = $4`,
        [remaining_amount, service_status, payment_status, client_service_id]
    );

    return { remaining_amount };
};

/**
 * Crear un nuevo pago con gestión de transacciones
 */
export const createPayment = async (paymentData) => {
    const client = await pool.connect();

    try {
        // Iniciar transacción
        await client.query('BEGIN');

        // Obtener detalles del servicio
        const serviceDetails = await getClientServiceDetails(paymentData.client_service_id);

        // Procesar pago y actualizar estado del servicio
        const {remaining_amount} = await processPaymentAndUpdateService(
            serviceDetails,
            paymentData.amount || serviceDetails.amount_due,
            client
        );

        // Insertar registro de pago
        const {rows} = await client.query(
            `INSERT INTO payments (amount,
                                   payment_date,
                                   payment_method,
                                   reference_number,
                                   notes,
                                   status,
                                   payment_type,
                                   client_service_id)
             VALUES ($1, CURRENT_TIMESTAMP, $2, $3, $4, $5, $6, $7) RETURNING *`,
            [
                paymentData.amount || serviceDetails.amount_due,
                paymentData.payment_method.toLowerCase(),
                paymentData.reference_number,
                paymentData.notes,
                paymentData.payment_status || 'en proceso',
                paymentData.payment_type || 'efectivo',
                paymentData.client_service_id
            ]
        );

        // Confirmar transacción
        await client.query('COMMIT');

        return {
            payment: rows[0],
            remaining_service_amount: remaining_amount
        };
    } catch (error) {
        // Revertir transacción en caso de error
        await client.query('ROLLBACK');
        throw error;
    } finally {
        client.release();
    }
};

/**
 * Updates an existing payment record in the database.
 */
export const updatePayment = async (payment_id, {
    amount,
    payment_date,
    payment_method,
    reference_number,
    notes,
    status,
    payment_type,
    client_service_id
}) => {
    const {rows} = await pool.query(
        `UPDATE payments
         SET amount            = $1,
             payment_date      = $2,
             payment_method    = $3,
             reference_number  = $4,
             notes             = $5,
             status            = $6,
             payment_type      = $7,
             client_service_id = $8,
             WHERE payment_id = $9 RETURNING *`,
        [amount, payment_date, payment_method, reference_number, notes, status, payment_type, client_service_id, payment_id]
    );
    return rows[0];
};

/**
 * Deletes a payment record from the database.
 */
export const deletePayment = async (payment_id) => {
    // Execute DELETE query with payment_id as the parameter
    const {rowCount} = await pool.query("DELETE FROM payments WHERE payment_id = $1", [payment_id]);

    // Return true if at least one row was affected (deleted), false otherwise
    return rowCount > 0;
};

/**
 * Retrieves all payments for a specific client_service.
 */
export const getPaymentsByClientService = async (client_service_id) => {
    // Execute parameterized query with client_id as the parameter
    const query = `
        SELECT *
        FROM payments
        WHERE client_service_id = $1
        ORDER BY payment_date DESC`;

    // Execute the query with the client_service_id parameter
    const {rows} = await pool.query(query, [client_service_id]);
    // Return the array of payment records for the specified client service
    return rows;
};

/**
 * Updates the status of a payment.
 */
export const updatePaymentStatus = async (payment_id, status) => {
    // Define SQL query to update only the status field
    const query = `
        UPDATE payments
        SET status = $1
        WHERE payment_id = $2 RETURNING *`;

    // Execute the query with the status and payment_id parameters
    const {rows} = await pool.query(query, [status, payment_id]);

    // Return the updated payment object or undefined if payment not found
    return rows[0];
};

/**
 * Retrieves payments filtered by date range.
 */
export const getPaymentsByDateRange = async (startDate, endDate) => {
    // Define SQL query to select payments within the date range
    const query = `
        SELECT *
        FROM payments
        WHERE payment_date BETWEEN $1 AND $2
        ORDER BY payment_date DESC`;

    // Execute the query with start and end date parameters
    const {rows} = await pool.query(query, [startDate, endDate]);

    // Return the array of payment records within the date range
    return rows;
};

/**
 * Retrieves payments with detailed client and service information.
 */
export const getDetailedPayments = async () => {
    // Define SQL query to join payments with client_services table
    const query = `
        SELECT p.*,
               cs.client_id,
               c.name        as client_name,
               c.email       as client_email,
               cs.service_name,
               cs.total_cost as service_total_cost
        FROM payments p
                 JOIN client_services cs ON p.client_service_id = cs.client_service_id
                 JOIN clients c ON cs.client_id = c.client_id
        ORDER BY p.payment_date DESC`;

    // Execute the query
    const {rows} = await pool.query(query);

    // Return the array of detailed payment records
    return rows;
};

/**
 * Retrieves payments for a specific client.
 */
export const getPaymentsByClientId = async (client_id) => {
    // Define SQL query to join payments with client_services to filter by client_id
    const query = `
        SELECT p.*
        FROM payments p
                 JOIN client_services cs ON p.client_service_id = cs.client_service_id
        WHERE cs.client_id = $1
        ORDER BY p.payment_date DESC`;

    // Execute the query with the client_id parameter
    const {rows} = await pool.query(query, [client_id]);

    // Return the array of payment records for the specified client
    return rows;
};

/**
 * Calculates total payments amount for a specific client.
 */
export const getTotalPaymentsByClientId = async (client_id) => {
    // Define SQL query to sum payment amounts for a client via client_services join
    const query = `
        SELECT COALESCE(SUM(p.amount), 0) as total
        FROM payments p
                 JOIN client_services cs ON p.client_service_id = cs.client_service_id
        WHERE cs.client_id = $1`;

    // Execute the query with the client_id parameter
    const {rows} = await pool.query(query, [client_id]);

    // Return the total amount (or 0 if no payments)
    return parseFloat(rows[0].total);
};

/**
 * Retrieves payments for a specific status.
 */
export const getPaymentsByStatus = async (status) => {
    // Validate that status is one of the allowed values
    const validStatuses = ['borrador', 'en proceso', 'pagado'];
    if (!validStatuses.includes(status)) {
        throw new Error(`Invalid status value. Must be one of: ${validStatuses.join(', ')}`);
    }

    // Define SQL query to select payments with the specified status
    const query = `
        SELECT *
        FROM payments
        WHERE status = $1
        ORDER BY payment_date DESC`;

    // Execute the query with the status parameter
    const {rows} = await pool.query(query, [status]);

    // Return the array of payment records with the specified status
    return rows;
};
