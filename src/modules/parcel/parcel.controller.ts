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

const getAvailableParcels = async (req: Request, res: Response) => {
  const query = (req as any).validatedQuery ?? req.query;

  const result = await parcelService.getAvailableParcels(query);

  return sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Available parcels retrieved successfully",
    data: result,
  });
};

const assignParcel = async (req: Request, res: Response) => {
  const parcelId = Number(req.params.id);

  const result = await parcelService.assignParcel(
    parcelId,
    req.user!.userId,
  );

  return sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Parcel assigned successfully",
    data: result,
  });
};

const updateParcelStatus = async (req: Request, res: Response) => {
  const parcelId = Number(req.params.id);

  const result = await parcelService.updateParcelStatus(
    parcelId,
    req.user!.userId,
    req.body,
  );

  return sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Parcel status updated successfully",
    data: result,
  });
};

export const parcelController = {
  createParcel,
  getMyParcels,getParcelById,cancelParcel,getAvailableParcels,assignParcel,updateParcelStatus
};