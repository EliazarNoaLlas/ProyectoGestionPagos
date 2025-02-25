// models/client.model.js
import pool from "../config/db.js";

// Obtener todos los clientes
export const getAllClients = async () => {
  const { rows } = await pool.query("SELECT * FROM clients ORDER BY created_at DESC");
  return rows;
};

// Obtener un cliente por ID
export const getClientById = async (id) => {
  const { rows } = await pool.query("SELECT * FROM clients WHERE id = $1", [id]);
  return rows[0];
};

// Crear un nuevo cliente
export const createClient = async ({ name, service, amount, dueDate }) => {
  const { rows } = await pool.query(
    `INSERT INTO clients (name, service, amount, due_date) 
     VALUES ($1, $2, $3, $4) 
     RETURNING *`,
    [name, service, amount, dueDate]
  );
  return rows[0];
};

// Actualizar un cliente
export const updateClient = async (id, { name, service, amount, dueDate, status }) => {
  const { rows } = await pool.query(
    `UPDATE clients 
     SET name = $1, service = $2, amount = $3, due_date = $4, status = $5
     WHERE id = $6
     RETURNING *`,
    [name, service, amount, dueDate, status, id]
  );
  return rows[0];
};

// Eliminar un cliente
export const deleteClient = async (id) => {
  const { rowCount } = await pool.query("DELETE FROM clients WHERE id = $1", [id]);
  return rowCount > 0;
};


// Buscar clientes por nombre (insensible a mayúsculas/minúsculas)
export const findClientsByName = async (name) => {
  const query = `
    SELECT * FROM clients
    WHERE LOWER(name) LIKE LOWER($1)
    ORDER BY created_at DESC;
  `;
  const values = [`%${name}%`];

  const { rows } = await pool.query(query, values);
  return rows;
};

// Registrar pago cambiando el estado a 'Pagado'
export const registerClientPayment = async (id) => {
  const query = `
    UPDATE clients
    SET status = 'Pagado'
    WHERE id = $1
    RETURNING *;
  `;

  const { rows } = await pool.query(query, [id]);
  return rows[0];
};
