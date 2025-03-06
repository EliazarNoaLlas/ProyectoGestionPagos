/**
 * File: payment.router.js
 * Author: Eliazar
 * Copyright: 2025, Embedding Minds
 * License: MIT
 *
 * Purpose:
 * Defines and configures the Express router for payment-related API endpoints.
 * This file maps HTTP routes to controller functions and applies middleware
 * for request validation.
 *
 * Last Modified: 2025-03-03
 */

import { Router } from "express";
import {
    getPayments,
    getPayment,
    createNewPayment,
    modifyPayment,
    removePayment,
    getPaymentsByService,
    changePaymentStatus,
    getPaymentsByRange,
    getPaymentsWithDetails,
    getClientPayments,
    getClientTotalPayments,
    getPaymentsByPaymentStatus
} from "../controllers/payment.controller.js";

import { validateSchema } from "../middlewares/validator.middleware.js";
import { paymentSchema } from "../schemas/payment.schema.js";

const router = Router();

// Basic CRUD operations
router.get('/payments', getPayments);
router.get('/payments/:id', getPayment);
router.post('/payments', validateSchema(paymentSchema), createNewPayment);
router.put('/payments/:id', validateSchema(paymentSchema), modifyPayment);
router.delete('/payments/:id', removePayment);

// Additional specialized routes
router.get('/payments/details/all', getPaymentsWithDetails);
router.get('/payments/filter/date', getPaymentsByRange);
router.get('/payments/status/:status', getPaymentsByPaymentStatus);
router.get('/payments/client/:clientId', getClientPayments);
router.get('/payments/client/:clientId/total', getClientTotalPayments);
router.get('/payments/service/:clientServiceId', getPaymentsByService);
router.patch('/payments/:id/status', changePaymentStatus);

export default router;