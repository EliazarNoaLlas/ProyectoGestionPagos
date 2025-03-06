/**
 * File: app.js
 * Author: Eliazar
 * Copyright: 2025, Embedding Minds
 * License: MIT
 *
 * Purpose: Express application configuration and middleware setup
 *
 * Last Modified: 2025-03-04
 */

import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import cookieParser from "cookie-parser";

import clientRoutes from './routes/client.routes.js';
import authRoutes from './routes/auth.routes.js';
import serviceRoutes from './routes/service.router.js';
import paymentRoutes from './routes/payment.router.js';
import clientServicesRoutes from './routes/client_services.router.js';

const app = express();

// Configuración de CORS
app.use(cors({
    origin: true,  // Permite todos los orígenes
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true
}));

// Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev'));

// Rutas
app.use('/api', clientRoutes);           // Rutas de clientes
app.use("/api/auth", authRoutes);        // Rutas de autenticación
app.use('/api', serviceRoutes);          // Rutas de servicios
app.use('/api', paymentRoutes);          // Rutas de pagos
app.use('/api', clientServicesRoutes);   // Rutas de servicios de clientes

// Manejo de errores
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        message: 'Algo salió mal!',
        error: err.message
    });
});

export default app;