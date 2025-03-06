/**
 * File: service.router.js
 * Author: Eliazar
 * Copyright: 2025, Embedding Minds
 * License: MIT
 *
 * Purpose:
 * Defines and configures the Express router for service-related API endpoints.
 * This file maps HTTP routes to controller functions and applies middleware
 * for request validation.
 *
 * Last Modified: 2025-03-03
 */

import {Router} from "express";
import {
    getServices,
    getService,
    createNewService,
    modifyService,
    removeService,
    searchServicesByTerm,
    getServicesByPrice
} from "../controllers/service.controller.js";

import {validateSchema} from "../middlewares/validator.middleware.js";
import {serviceSchema} from "../schemas/service.schema.js";
import {validateUniqueService} from '../middlewares/service.middleware.js';

const router = Router();

// Basic CRUD operations
router.get('/services', getServices);
router.get('/services/:id', getService);
router.post('/services', validateSchema(serviceSchema), validateUniqueService, createNewService);
router.put('/services/:id', validateSchema(serviceSchema),validateUniqueService, modifyService);
router.delete('/services/:id', removeService);

// Additional specialized routes
router.get('/services/search/term', searchServicesByTerm);
router.get('/services/filter/price', getServicesByPrice);

export default router;