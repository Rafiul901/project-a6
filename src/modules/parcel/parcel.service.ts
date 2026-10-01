import db from "../../prisma/db.js";
import ApiError from "../../errors/ApiError.js";

import type { CreateParcelInput } from "./parcel.validation.js";

const generateTrackingNumber = () => {
  const timestamp = Date.now();

  const random = Math.floor(1000 + Math.random() * 9000);

  return `CR-${timestamp}-${random}`;
};

const createParcel = async (
  senderId: number,
  payload: CreateParcelInput,
) => {
  const trackingNumber = generateTrackingNumber();

  const parcel = await db.orm.public.Parcel.create({
    trackingNumber,
    senderId,
    receiverName: payload.receiverName,
    receiverPhone: payload.receiverPhone,
    pickupAddress: payload.pickupAddress,
    deliveryAddress: payload.deliveryAddress,
    weight: payload.weight,
    deliveryFee: payload.deliveryFee,
  });

  return parcel;
};

export const parcelService = {
  createParcel,
};