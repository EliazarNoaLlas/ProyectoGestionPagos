/**
 * File: clients.routes.js
 * Author: Eliazar
 * Copyright: 2025, Embedding Minds
 * License: MIT
 *
 * Purpose:
 * Defines and configures the Express router for client-related API endpoints.
 * This file maps HTTP routes to controller functions and applies middleware
 * for request validation.
 *
 * Last Modified: 2025-03-04
 */

import { Router } from "express";
import {
    getClients,
    getClient,
    createNewClient,
    modifyClient,
    removeClient,
    searchClients
} from "../controllers/client.controller.js";

import { validateSchema } from "../middlewares/validator.middleware.js";
import { validateUniqueClient } from "../middlewares/client.middleware.js";
import { clientSchema } from "../schemas/client.schema.js";

const router = Router();

// Rutas de clientes con prefijo más descriptivo
router.get('/clients', getClients);
router.get('/clients/search', searchClients);
router.get('/clients/:id', getClient);

router.post('/clients',
    validateSchema(clientSchema),
    validateUniqueClient,
    createNewClient
);
router.put('/clients/:id',
    validateSchema(clientSchema),
    validateUniqueClient,
    modifyClient
);
router.delete('/clients/:id', removeClient);

export default router;