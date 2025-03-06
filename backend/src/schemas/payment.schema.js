/**
 * File: payment.schema.js
 * Author: Eliazar
 * Copyright: 2025, Embedding Minds
 * License: MIT
 *
 * Purpose:
 * Validation schema for payment data using Zod library.
 * Ensures data integrity before database operations.
 *
 * Last Modified: 2025-03-03
 */

import {z} from "zod";

/**
 * Payment validation schema
 *
 * Defines validation rules for payment data based on the database structure.
 * Provides meaningful error messages for validation failures.
 */
export const paymentSchema = z.object({
    payment_method: z.string({
        required_error: "Método de pago es requerido",
        invalid_type_error: "Método de pago debe ser un texto"
    })
        .trim()
        .toLowerCase()
        .min(1, { message: "Método de pago no puede estar vacío" })
        .max(50, { message: "Método de pago no puede exceder 50 caracteres" })
        .refine(
            (method) => ['efectivo', 'transferencia', 'tarjeta', 'cheque', 'otro'].includes(method),
            { message: "Método de pago inválido" }
        ),

    reference_number: z.string()
        .trim()
        .max(100, { message: "Número de referencia no puede exceder 100 caracteres" })
        .optional()
        .nullable(),

    notes: z.string()
        .trim()
        .max(500, { message: "Notas no pueden exceder 500 caracteres" })
        .optional()
        .nullable(),

    amount: z.number({
        invalid_type_error: "Monto debe ser un número"
    })
        .positive({ message: "Monto debe ser un número positivo" })
        .optional(),

    client_service_id: z.number({
        required_error: "ID de servicio de cliente es requerido",
        invalid_type_error: "ID de servicio de cliente debe ser un número"
    })
        .int({ message: "ID de servicio de cliente debe ser un entero" })
        .positive({ message: "ID de servicio de cliente debe ser un número positivo" })
});

/**
 * Payment partial update schema
 *
 * Makes all fields optional for PATCH operations
 * while maintaining the same validation rules.
 */
export const paymentUpdateSchema = paymentSchema.partial();

/**
 * Payment creation schema
 *
 * Extends the base schema for creation operations by ensuring
 * default values and excluding system-managed fields.
 */
export const paymentCreationSchema = paymentSchema
    .transform((data) => ({
        ...data,
        // Ensure payment date is provided or defaults to current date
        payment_date: data.payment_date || new Date(),
        // Normalize status to lowercase
        status: data.status?.toLowerCase() || "borrador"
    }));

/**
 * Payment status update schema
 *
 * For PATCH operations that only update the status field.
 */
export const paymentStatusSchema = z.object({
    status: z.enum(["borrador", "en proceso", "pagado"], {
        required_error: "Status is required",
        invalid_type_error: "Status must be one of: borrador, en proceso, pagado"
    })
});