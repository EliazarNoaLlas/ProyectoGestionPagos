/**
 * File: payment.controller.js
 * Author: Eliazar
 * Copyright: 2025, Embedding Minds
 * License: MIT
 *
 * Purpose:
 * Implementation of controllers to manage CRUD operations for payments
 * and handle HTTP requests related to payments.
 *
 * Last Modified: 2024-04-20
 */

import {
    getAllPayments,
    getPaymentById,
    createPayment,
    updatePayment,
    deletePayment,
    getPaymentsByClientService,
    updatePaymentStatus,
    getPaymentsByDateRange,
    getDetailedPayments,
    getPaymentsByClientId,
    getTotalPaymentsByClientId,
    getPaymentsByStatus
} from "../models/payment.model.js";

/**
 * Gets all payments from the system
 */
export const getPayments = async (req, res) => {
    try {
        const payments = await getAllPayments();
        res.json(payments);
    } catch (error) {
        res.status(500).json({ message: "Error retrieving payments", error: error.message });
    }
};

/**
 * Gets a specific payment by ID
 */
export const getPayment = async (req, res) => {
    try {
        const payment = await getPaymentById(req.params.id);
        if (!payment) return res.status(404).json({ message: "Payment not found" });
        res.json(payment);
    } catch (error) {
        res.status(500).json({ message: "Error retrieving payment", error: error.message });
    }
};

/**
 * Creates a new payment record
 */
export const createNewPayment = async (req, res) => {
    try {
        const result = await createPayment(req.body);
        res.status(201).json(result);
    } catch (error) {
        console.error('Error creating payment:', error);
        res.status(500).json({
            message: "Error creando el pago",
            error: error.message
        });
    }
};

/**
 * Updates an existing payment record
 */
export const modifyPayment = async (req, res) => {
    try {
        const updatedPayment = await updatePayment(req.params.id, req.body);
        if (!updatedPayment) return res.status(404).json({ message: "Payment not found" });
        res.json(updatedPayment);
    } catch (error) {
        res.status(500).json({ message: "Error updating payment", error: error.message });
    }
};

/**
 * Deletes a payment record
 */
export const removePayment = async (req, res) => {
    try {
        const deleted = await deletePayment(req.params.id);
        if (!deleted) return res.status(404).json({ message: "Payment not found" });
        res.json({ message: "Payment deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting payment", error: error.message });
    }
};

/**
 * Gets all payments for a specific client service
 */
export const getPaymentsByService = async (req, res) => {
    try {
        const payments = await getPaymentsByClientService(req.params.clientServiceId);
        res.json(payments);
    } catch (error) {
        res.status(500).json({ message: "Error retrieving payments", error: error.message });
    }
};

/**
 * Updates the status of a payment
 */
export const changePaymentStatus = async (req, res) => {
    try {
        const updatedPayment = await updatePaymentStatus(req.params.id, req.body.status);
        if (!updatedPayment) return res.status(404).json({ message: "Payment not found" });
        res.json(updatedPayment);
    } catch (error) {
        res.status(500).json({ message: "Error updating payment status", error: error.message });
    }
};

/**
 * Gets payments filtered by date range
 */
export const getPaymentsByRange = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        const payments = await getPaymentsByDateRange(startDate, endDate);
        res.json(payments);
    } catch (error) {
        res.status(500).json({ message: "Error retrieving payments by date range", error: error.message });
    }
};

/**
 * Gets detailed payment information
 */
export const getPaymentsWithDetails = async (req, res) => {
    try {
        const payments = await getDetailedPayments();
        res.json(payments);
    } catch (error) {
        res.status(500).json({ message: "Error retrieving detailed payments", error: error.message });
    }
};

/**
 * Gets all payments for a specific client
 */
export const getClientPayments = async (req, res) => {
    try {
        const payments = await getPaymentsByClientId(req.params.clientId);
        res.json(payments);
    } catch (error) {
        res.status(500).json({ message: "Error retrieving client payments", error: error.message });
    }
};

/**
 * Gets total payments amount for a specific client
 */
export const getClientTotalPayments = async (req, res) => {
    try {
        const total = await getTotalPaymentsByClientId(req.params.clientId);
        res.json({ total });
    } catch (error) {
        res.status(500).json({ message: "Error retrieving total client payments", error: error.message });
    }
};

/**
 * Gets all payments filtered by status
 */
export const getPaymentsByPaymentStatus = async (req, res) => {
    try {
        const payments = await getPaymentsByStatus(req.params.status);
        res.json(payments);
    } catch (error) {
        res.status(500).json({ message: "Error retrieving payments by status", error: error.message });
    }
};
