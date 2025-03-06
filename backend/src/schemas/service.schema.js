/**
 * File: service.schema.js
 * Author: Eliazar
 * Copyright: 2025, Embedding Minds
 * License: MIT
 *
 * Purpose:
 * Validation schema for service data using Zod library.
 * Ensures data integrity before database operations.
 *
 * Last Modified: 2025-03-03
 */

import { z } from "zod";

/**
 * Service validation schema
 *
 * Defines validation rules for service data based on the database structure.
 * Provides meaningful error messages for validation failures.
 */
export const serviceSchema = z.object({
    // Name validation - required, non-empty string with max length
    name: z.string({
        required_error: "Service name is required",
        invalid_type_error: "Name must be a string"
    })
        .trim()
        .min(1, { message: "Service name cannot be empty" })
        .max(100, { message: "Service name cannot exceed 100 characters" }),

    // Description validation - optional text
    description: z.string()
        .trim()
        .optional()
        .nullable(),

    // Price validation - required numeric value, non-negative
    price: z.number({
        required_error: "Service price is required",
        invalid_type_error: "Price must be a number"
    })
        .nonnegative({ message: "Price must be zero or greater" })
        .finite({ message: "Price must be a valid number" })
});

/**
 * Service partial update schema
 *
 * Makes all fields optional for PATCH operations
 * while maintaining the same validation rules.
 */
export const serviceUpdateSchema = serviceSchema.partial();

/**
 * Service creation schema
 *
 * Extends the base schema for creation operations.
 * In this case it's the same as the base schema since there are no
 * special transformations or system-managed fields to handle.
 */
export const serviceCreationSchema = serviceSchema;