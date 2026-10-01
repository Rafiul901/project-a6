import { z } from "zod";

export const createParcelSchema = z.object({
  receiverName: z
    .string()
    .min(2, "Receiver name must be at least 2 characters"),

  receiverPhone: z
    .string()
    .min(7, "Receiver phone is required"),

  pickupAddress: z
    .string()
    .min(5, "Pickup address must be at least 5 characters"),

  deliveryAddress: z
    .string()
    .min(5, "Delivery address must be at least 5 characters"),

  weight: z
    .number()
    .positive("Weight must be greater than 0"),

  deliveryFee: z
    .number()
    .positive("Delivery fee must be greater than 0"),
});

export type CreateParcelInput = z.infer<
  typeof createParcelSchema
>;