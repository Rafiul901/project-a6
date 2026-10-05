import { z } from "zod";

export const getUsersSchema = z.object({
  page: z.coerce.number().int().positive().default(1),

  limit: z.coerce
    .number()
    .int()
    .positive()
    .max(100)
    .default(10),

  role: z
    .enum(["CUSTOMER", "DELIVERY_AGENT", "ADMIN"])
    .optional(),
});


export const getAllParcelsSchema = z.object({
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


export const getAuditLogsSchema = z.object({
  page: z.coerce.number().int().positive().default(1),

  limit: z.coerce.number().int().positive().max(100).default(10),

  action: z.string().optional(),

  entity: z.string().optional(),
});

export type GetAuditLogsQuery = z.infer<typeof getAuditLogsSchema>;

export type GetAllParcelsQuery = z.infer<typeof getAllParcelsSchema>;

export type GetUsersQuery = z.infer<typeof getUsersSchema>;