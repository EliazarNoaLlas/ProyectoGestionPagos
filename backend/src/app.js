// app.js
import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import cookieParser from "cookie-parser";


import clientRoutes from './routes/client.routes.js';
import authRoutes from './routes/auth.routes.js';


const app = express();
app.use(cors({
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  credentials: true
}));
// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Rutas
app.use('/api', clientRoutes);
app.use("/api/auth", authRoutes);


// Manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Algo salió mal!', error: err.message });
});

export default app;