import { z } from "zod";

export const registerSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters"),

  email: z
    .string()
    .email("Please provide a valid email"),

  password: z
    .string()
    .min(6, "Password must be at least 6 characters"),

  phone: z
    .string()
    .optional(),
});

export type RegisterInput = z.infer<typeof registerSchema>;