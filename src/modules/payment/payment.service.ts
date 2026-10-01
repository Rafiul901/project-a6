import db from "../../prisma/db.js";
import ApiError from "../../errors/ApiError.js";

import type { CreatePaymentInput } from "./payment.validation.js";

const createPayment = async (
  customerId: number,
  payload: CreatePaymentInput,
): Promise<any> => {
  const parcel = await db.orm.public.Parcel
    .where({
      id: payload.parcelId,
      senderId: customerId,
      deletedAt: null,
    })
    .first();

  if (!parcel) {
    throw new ApiError(404, "Parcel not found");
  }

  const existingPayment = await db.orm.public.Payment
    .where({ parcelId: parcel.id })
    .first();

  if (existingPayment) {
    throw new ApiError(400, "Payment already exists for this parcel");
  }

  const payment = await db.orm.public.Payment.create({
    parcelId: parcel.id,
    amount: parcel.deliveryFee,
    currency: "BDT",
    status: "PENDING",
  });

  return payment;
};

export const paymentService = {
  createPayment,
};