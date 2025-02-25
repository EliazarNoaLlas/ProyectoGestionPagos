// controllers/client.controller.js
import {
  getAllClients,
  getClientById,
  createClient,
  updateClient,
  registerClientPayment,
  deleteClient
} from "../models/client.model.js";

// Obtener todos los clientes
export const getClients = async (req, res) => {
  try {
    const clients = await getAllClients();
    res.json(clients);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener los clientes", error: error.message });
  }
};

// Obtener un cliente por ID
export const getClient = async (req, res) => {
  try {
    const client = await getClientById(req.params.id);
    if (!client) return res.status(404).json({ message: "Cliente no encontrado" });
    res.json(client);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener el cliente", error: error.message });
  }
};

// Crear un nuevo cliente
export const createNewClient = async (req, res) => {
  try {
    const client = await createClient(req.body);
    res.status(201).json(client);
  } catch (error) {
    res.status(500).json({ message: "Error al crear el cliente", error: error.message });
  }
};

// Actualizar un cliente
export const modifyClient = async (req, res) => {
  try {
    const client = await updateClient(req.params.id, req.body);
    if (!client) return res.status(404).json({ message: "Cliente no encontrado" });
    res.json(client);
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar el cliente", error: error.message });
  }
};

// Eliminar un cliente
export const removeClient = async (req, res) => {
  try {
    const success = await deleteClient(req.params.id);
    if (!success) return res.status(404).json({ message: "Cliente no encontrado" });
    res.json({ message: "Cliente eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar el cliente", error: error.message });
  }
};


// Buscar clientes por nombre
export const searchClients = async (req, res) => {
  const { name } = req.query;

  if (!name) {
    return res.status(400).json({ message: "El nombre es requerido para la búsqueda" });
  }

  try {
    const clients = await findClientsByName(name);
    res.json(clients);
  } catch (error) {
    res.status(500).json({ message: "Error al buscar clientes", error: error.message });
  }
};

// Registrar pago
export const registerPayment = async (req, res) => {
  const { id } = req.params;

  try {
    const updatedClient = await registerClientPayment(id);

    if (!updatedClient) {
      return res.status(404).json({ message: "Cliente no encontrado" });
    }

    res.json({ message: "Pago registrado exitosamente", client: updatedClient });
  } catch (error) {
    res.status(500).json({ message: "Error al registrar el pago", error: error.message });
  }
};