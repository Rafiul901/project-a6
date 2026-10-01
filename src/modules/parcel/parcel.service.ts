import db from "../../prisma/db.js";
import ApiError from "../../errors/ApiError.js";

import type {
  CreateParcelInput,
  GetMyParcelsQuery,
  GetAvailableParcelsQuery,
} from "./parcel.validation.js";


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

const getMyParcels = async (
  senderId: number,
  query: GetMyParcelsQuery,
): Promise<{
  parcels: any[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}> => {
  const { page, limit, status } = query;

  const skip = (page - 1) * limit;

  const where = {
    senderId,
    deletedAt: null,
    ...(status ? { status } : {}),
  };

  const [parcels, rawTotal] = await Promise.all([
    db.orm.public.Parcel
      .where(where)
      .orderBy((p) => p.createdAt.desc())
      .offset(skip)
      .limit(limit)
      .all(),

    db.orm.public.Parcel
      .where(where)
      .count(),
  ]);

  
  const total = Number(rawTotal);

  return {
    parcels,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};


const getParcelById = async (
  parcelId: number,
  senderId: number,
): Promise<{
  id: number;
  trackingNumber: string;
  senderId: number;
  deliveryAgentId: number | null;
  receiverName: string;
  receiverPhone: string;
  pickupAddress: string;
  deliveryAddress: string;
  weight: number;
  deliveryFee: number;
  status: string;
  createdAt: any;
  updatedAt: any;
}> => {
  const parcel = await db.orm.public.Parcel
    .where({
      id: parcelId,
      senderId,
      deletedAt: null,
    })
    .first();

  if (!parcel) {
    throw new ApiError(404, "Parcel not found");
  }

  return parcel;
};

const cancelParcel = async (
  parcelId: number,
  senderId: number,
): Promise<{
  id: number;
  trackingNumber: string;
  senderId: number;
  status: string;
  deletedAt: any;
  [key: string]: any;
}> => {
  const parcel = await db.orm.public.Parcel
    .where({
      id: parcelId,
      senderId,
      deletedAt: null,
    })
    .first();

  if (!parcel) {
    throw new ApiError(404, "Parcel not found");
  }

  if (parcel.status !== "PENDING") {
    throw new ApiError(400, "Only pending parcels can be cancelled");
  }

  const cancelledParcel = await db.orm.public.Parcel
    .where({ id: parcelId })
    .update({
      status: "CANCELLED",
      deletedAt: new Date().toISOString(),
    });

  if (!cancelledParcel) {
    throw new ApiError(500, "Failed to cancel parcel");
  }

  return cancelledParcel;
};

const getAvailableParcels = async (
  query: GetAvailableParcelsQuery,
): Promise<{
  parcels: any[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}> => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (page - 1) * limit;

  const where = {
    status: "PENDING" as const,
    deliveryAgentId: null,
    deletedAt: null,
  };

  const parcels = await db.orm.public.Parcel
    .where(where)
    .orderBy((p) => p.createdAt.desc())
    .offset(skip)
    .limit(limit)
    .all();

  const rawTotal = await db.orm.public.Parcel
    .where(where)
    .count();

  const total = Number(rawTotal);

  return {
    parcels,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

const assignParcel = async (
  parcelId: number,
  deliveryAgentId: number,
): Promise<any> => {
  const parcel = await db.orm.public.Parcel
    .where({
      id: parcelId,
      deletedAt: null,
    })
    .first();

  if (!parcel) {
    throw new ApiError(404, "Parcel not found");
  }

  if (parcel.status !== "PENDING") {
    throw new ApiError(400, "Only pending parcels can be assigned");
  }

  if (parcel.deliveryAgentId !== null) {
    throw new ApiError(400, "Parcel is already assigned to a delivery agent");
  }

  const updatedParcel = await db.orm.public.Parcel
    .where({ id: parcelId })
    .update({
      deliveryAgentId,
    });

  return updatedParcel;
};



export const parcelService = {
  createParcel,
  getMyParcels,getParcelById,cancelParcel,getAvailableParcels,assignParcel
};

