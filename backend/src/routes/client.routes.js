// routes/clientRoutes.js
import { Router } from "express";
import {
  getClients,
  getClient,
  createNewClient,
  modifyClient,
  removeClient,
  searchClients,
  registerPayment
} from "../controllers/client.controller.js";

import { validateSchema } from "../middlewares/validator.middleware.js";
import { clientSchema } from "../schemas/client.schema.js"; // Esquema adecuado para clientes

const router = Router();

// Rutas para clientes
router.get('/clients', getClients);
router.get('/clients/search', searchClients);
router.get('/clients/:id', getClient);

// Validación para crear y actualizar clientes
router.post('/clients', validateSchema(clientSchema), createNewClient);
router.put('/clients/:id', validateSchema(clientSchema), modifyClient);
router.delete("/clients/:id", removeClient);


router.patch('/clients/:id/payment', registerPayment);

export default router;
