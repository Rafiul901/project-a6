import type { Request, Response } from "express";
import type { GetMyParcelsQuery } from "./parcel.validation.js";

import sendResponse from "../../utils/sendResponse.js";
import { parcelService } from "./parcel.service.js";

const createParcel = async (req: Request, res: Response) => {
  const result = await parcelService.createParcel(
    req.user!.userId,
    req.body,
  );

  return sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Parcel created successfully",
    data: result,
  });
};

const getMyParcels = async (req: Request, res: Response) => {

  const query = (req as any).validatedQuery as GetMyParcelsQuery;

  const result = await parcelService.getMyParcels(
    req.user!.userId,
    query,
  );

  return sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "My parcels retrieved successfully",
    data: result,
  });
};

const getParcelById = async (req: Request, res: Response) => {
  const parcelId = Number(req.params.id);

  const result = await parcelService.getParcelById(
    parcelId,
    req.user!.userId,
  );

  return sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Parcel retrieved successfully",
    data: result,
  });
};

const cancelParcel = async (req: Request, res: Response) => {
  const parcelId = Number(req.params.id);

  const result = await parcelService.cancelParcel(
    parcelId,
    req.user!.userId,
  );

  return sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Parcel cancelled successfully",
    data: result,
  });
};

export const parcelController = {
  createParcel,
  getMyParcels,getParcelById,cancelParcel
};