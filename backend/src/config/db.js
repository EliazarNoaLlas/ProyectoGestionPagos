// config/db.js
import pg from "pg";
import {
  DB_HOST,
  DB_PORT,
  DB_DATABASE,
  DB_USER,
  DB_PASSWORD,
} from "./config.js";

const pool = new pg.Pool({
  host: DB_HOST,
  database: DB_DATABASE,
  user: DB_USER,
  password: DB_PASSWORD,
  port: DB_PORT,
});

pool.connect()
  .then(() => console.log("✅ Conectado a PostgreSQL"))
  .catch((err) => {
    console.error("❌ Error al conectar a PostgreSQL:", err.message);
    process.exit(1);
  });

export default pool;