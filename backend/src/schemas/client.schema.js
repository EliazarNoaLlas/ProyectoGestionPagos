import { z } from "zod";

export const clientSchema = z.object({
  name: z.string({
    required_error: "El nombre es requerido",
  }).trim().min(1, { message: "El nombre no puede estar vacío" }),

  service: z.string({
    required_error: "El servicio es requerido",
  }).trim().min(1, { message: "El servicio no puede estar vacío" }),

  amount: z
    .union([z.string(), z.number()]) // Acepta string o número
    .transform((val) => Number(val))
    .refine((val) => val > 0, { message: "El monto debe ser mayor que cero" }),

  dueDate: z
    .string({
      required_error: "La fecha de vencimiento es requerida",
    })
    .transform((val) => new Date(val))
    .refine((date) => date instanceof Date && !isNaN(date), {
      message: "La fecha de vencimiento no es válida",
    }),

  status: z
    .enum(["Pendiente", "Pagado"], {
      required_error: "El estado es requerido",
    })
    .default("Pendiente"),
});
