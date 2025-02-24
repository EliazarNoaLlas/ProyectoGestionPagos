// routes/clientRoutes.js
import { Router } from "express";
import {
  getAllClients,
  getClientById,
  searchClients,
  createClient,
  updateClient,
  registerPayment,
  deleteClient
} from "../controllers/client.controller.js";

import { validateSchema } from "../middlewares/validator.middleware.js";
import { clientSchema } from "../schemas/client.schema.js"; // Esquema adecuado para clientes

const router = Router();

// Rutas para clientes
router.get('/clients', getAllClients);
router.get('/clients/search', searchClients);
router.get('/clients/:id', getClientById);

// Validación para crear y actualizar clientes
router.post('/clients', validateSchema(clientSchema), createClient);
router.put('/clients/:id', validateSchema(clientSchema), updateClient);

router.patch('/clients/:id/payment', registerPayment);
router.delete('/clients/:id', deleteClient);

export default router;
