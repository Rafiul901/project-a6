import type { Request, Response } from "express";

import sendResponse from "../../utils/sendResponse.js";
import { parcelService } from "./parcel.service.js";

const createParcel = async (
  req: Request,
  res: Response,
) => {
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

const getMyParcels = async (
  req: Request,
  res: Response,
) => {
  const result = await parcelService.getMyParcels(
    req.user!.userId,
  );

  return sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "My parcels retrieved successfully",
    data: result,
  });
};

export const parcelController = {
  createParcel,getMyParcels
};