// controllers/clientController.js
import Client from '../models/client.model.js';

// Obtener todos los clientes
export const getAllClients = async (req, res) => {
  try {
    const clients = await Client.find().sort({ createdAt: -1 });
    res.json(clients);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los clientes', error: error.message });
  }
};

// Obtener un cliente por ID
export const getClientById = async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);
    if (!client) {
      return res.status(404).json({ message: 'Cliente no encontrado' });
    }
    res.json(client);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el cliente', error: error.message });
  }
};

// Buscar clientes por nombre
export const searchClients = async (req, res) => {
  try {
    const { name } = req.query;
    const clients = await Client.find({
      name: { $regex: name, $options: 'i' }
    });
    res.json(clients);
  } catch (error) {
    res.status(500).json({ message: 'Error al buscar clientes', error: error.message });
  }
};

// Crear un nuevo cliente
export const createClient = async (req, res) => {
  try {
    const { name, service, amount, dueDate } = req.body;
    const client = new Client({
      name,
      service,
      amount,
      dueDate
    });
    
    const savedClient = await client.save();
    res.status(201).json(savedClient);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear el cliente', error: error.message });
  }
};

// Actualizar un cliente
export const updateClient = async (req, res) => {
  try {
    const { name, service, amount, dueDate, status } = req.body;
    
    const updatedClient = await Client.findByIdAndUpdate(
      req.params.id,
      {
        name,
        service,
        amount,
        dueDate,
        status
      },
      { new: true }
    );

    if (!updatedClient) {
      return res.status(404).json({ message: 'Cliente no encontrado' });
    }

    res.json(updatedClient);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar el cliente', error: error.message });
  }
};

// Registrar pago
export const registerPayment = async (req, res) => {
  try {
    const updatedClient = await Client.findByIdAndUpdate(
      req.params.id,
      { status: 'Pagado' },
      { new: true }
    );

    if (!updatedClient) {
      return res.status(404).json({ message: 'Cliente no encontrado' });
    }

    res.json(updatedClient);
  } catch (error) {
    res.status(500).json({ message: 'Error al registrar el pago', error: error.message });
  }
};

// Eliminar un cliente
export const deleteClient = async (req, res) => {
  try {
    const deletedClient = await Client.findByIdAndDelete(req.params.id);
    
    if (!deletedClient) {
      return res.status(404).json({ message: 'Cliente no encontrado' });
    }

    res.json({ message: 'Cliente eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar el cliente', error: error.message });
  }
};
