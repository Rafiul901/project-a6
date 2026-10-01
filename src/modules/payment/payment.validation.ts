import { z } from "zod";

export const createPaymentSchema = z.object({
  parcelId: z.coerce.number().int().positive(),
});

export type CreatePaymentInput = z.infer<typeof createPaymentSchema>;