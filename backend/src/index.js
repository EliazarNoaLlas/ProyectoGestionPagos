// index.js
import app from './app.js';
import pool from './config/db.js';
import dotenv from 'dotenv';

dotenv.config();

const port = process.env.PORT || 3000;

// Verificar la conexión a la base de datos
pool.query('SELECT NOW()')
  .then((res) => {
    console.log(`✅ Conexión exitosa a PostgreSQL. Hora actual: ${res.rows[0].now}`);
    app.listen(port, () => {
      console.log(`🚀 Servidor escuchando en el puerto ${port}`);
    });
  })
  .catch((err) => {
    console.error('❌ Error al conectar a PostgreSQL:', err.message);
    process.exit(1);
  });
