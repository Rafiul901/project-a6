import { z } from "zod";

export const createPaymentSchema = z.object({
  parcelId: z.coerce.number().int().positive(),
});

export const createCheckoutSchema = z.object({
  paymentId: z.coerce.number().int().positive(),
});

export const getMyPaymentsSchema = z.object({
  page: z.coerce.number().int().positive().default(1),

  limit: z.coerce
    .number()
    .int()
    .positive()
    .max(100)
    .default(10),

  status: z
    .enum(["PENDING", "PAID", "FAILED", "REFUNDED"])
    .optional(),
});

export type GetMyPaymentsQuery = z.infer<typeof getMyPaymentsSchema>;

export type CreateCheckoutInput = z.infer<typeof createCheckoutSchema>;

export type CreatePaymentInput = z.infer<typeof createPaymentSchema>;