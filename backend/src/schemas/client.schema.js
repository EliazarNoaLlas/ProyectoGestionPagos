/**
 * File: client.schema.js
 * Author: Eliazar
 * Copyright: 2025, Embedding Minds
 * License: MIT
 *
 * Purpose:
 * Validation schema for client data using Zod library.
 * Ensures data integrity before database operations.
 *
 * Last Modified: 2025-03-02
 */

import { z } from "zod";

/**
 * Client validation schema
 *
 * Defines validation rules for client data based on the database structure.
 * Provides meaningful error messages for validation failures.
 */
export const clientSchema = z.object({
  // Client type validation - must be either 'persona' or 'empresa'
  type: z.enum(["persona", "empresa"], {
    required_error: "Client type is required",
    invalid_type_error: "Type must be either 'persona' or 'empresa'"
  }),

  // Name validation - required, non-empty string with max length
  name: z.string({
    required_error: "Name is required",
    invalid_type_error: "Name must be a string"
  })
      .trim()
      .min(1, { message: "Name cannot be empty" })
      .max(200, { message: "Name cannot exceed 200 characters" }),

  // Phone validation - optional, with pattern validation
  phone: z.string()
      .trim()
      .max(20, { message: "Phone number cannot exceed 20 characters" })
      .regex(/^[+]?[\d\s()-]+$/, { message: "Invalid phone number format" })
      .optional()
      .nullable(),

  // Email validation - unique field with format validation
  email: z.string({
    required_error: "Email is required",
    invalid_type_error: "Email must be a string"
  })
      .trim()
      .email({ message: "Invalid email format" })
      .max(100, { message: "Email cannot exceed 100 characters" }),

  // Identification number validation - unique field
  identification_number: z.string({
    required_error: "Identification number is required",
    invalid_type_error: "Identification number must be a string"
  })
      .trim()
      .min(1, { message: "Identification number cannot be empty" })
      .max(50, { message: "Identification number cannot exceed 50 characters" }),

  // Identification type validation
  identification_type: z.string({
    required_error: "Identification type is required",
    invalid_type_error: "Identification type must be a string"
  })
      .trim()
      .min(1, { message: "Identification type cannot be empty" })
      .max(20, { message: "Identification type cannot exceed 20 characters" }),

  // Address validation - optional
  address: z.string()
      .trim()
      .optional()
      .nullable(),

  // City validation - optional
  city: z.string()
      .trim()
      .max(50, { message: "City cannot exceed 50 characters" })
      .optional()
      .nullable(),

  // Country validation - optional
  country: z.string()
      .trim()
      .max(50, { message: "Country cannot exceed 50 characters" })
      .optional()
      .nullable(),

  // Postal code validation - optional
  postal_code: z.string()
      .trim()
      .max(15, { message: "Postal code cannot exceed 15 characters" })
      .optional()
      .nullable(),

  // Active status validation - optional with default
  is_active: z.boolean()
      .default(true)
      .optional()
});

/**
 * Client partial update schema
 *
 * Makes all fields optional for PATCH operations
 * while maintaining the same validation rules.
 */
export const clientUpdateSchema = clientSchema.partial();

/**
 * Client creation schema
 *
 * Extends the base schema with additional transformations
 * and removes fields that shouldn't be provided at creation time.
 */
export const clientCreationSchema = clientSchema
    .omit({ is_active: true }) // These fields are managed by the system
    .transform((data) => ({
      ...data,
      email: data.email?.toLowerCase(), // Normalize email to lowercase
    }));