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


export const getMyParcelsSchema = z.object({
  page: z.coerce.number().int().positive().default(1),

  limit: z.coerce
    .number()
    .int()
    .positive()
    .max(100)
    .default(10),

  status: z
    .enum([
      "PENDING",
      "PICKED_UP",
      "IN_TRANSIT",
      "OUT_FOR_DELIVERY",
      "DELIVERED",
      "CANCELLED",
    ])
    .optional(),
});

export const cancelParcelSchema = z.object({
  reason: z
    .string()
    .min(3, "Cancellation reason must be at least 3 characters")
    .optional(),
});

export const getAvailableParcelsSchema = z.object({
  page: z.coerce.number().int().positive().default(1),

  limit: z.coerce
    .number()
    .int()
    .positive()
    .max(100)
    .default(10),
});




export type GetAvailableParcelsQuery = z.infer<
  typeof getAvailableParcelsSchema
>;

export type GetMyParcelsQuery = z.infer<
  typeof getMyParcelsSchema
>;

export type CreateParcelInput = z.infer<
  typeof createParcelSchema
>;