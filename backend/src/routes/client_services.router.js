/**
 * File: client_services.router.js
 * Author: Eliazar
 * Copyright: 2025, Embedding Minds
 * License: MIT
 *
 * Purpose:
 * Defines and configures the Express router for client services API endpoints.
 * This file maps HTTP routes to controller functions and applies middleware
 * for request validation.
 *
 * Last Modified: 2025-03-03
 */

import {Router} from "express";
import {
    getClientServices,
    getClientService,
    createNewClientService,
    modifyClientService,
    changeClientServiceStatus,
    changeClientServicePaymentStatus,
    removeClientService,
    getClientServicesByClient,
    searchClientsServices
} from "../controllers/client_services.controller.js";

import {validateSchema} from "../middlewares/validator.middleware.js";

const router = Router();

// Basic CRUD operations
router.get('/client/services', getClientServices);
router.get('/client/services/search', searchClientsServices);
router.get('/client/services/:id', getClientService);
router.post('/client/services', createNewClientService);
router.put('/client/services/:id', modifyClientService);
router.delete('/client/services/:id', removeClientService);

// Additional specialized routes
router.get('/client/:client_id', getClientServicesByClient);
router.patch('/client/status/:id', changeClientServiceStatus);
router.patch('/client/payment-status/:id', changeClientServicePaymentStatus);

export default router;