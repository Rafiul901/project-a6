import type { Request, Response } from "express";
import type { GetAuditLogsQuery } from "./admin.validation.js";
import sendResponse from "../../utils/sendResponse.js";
import { adminService } from "./admin.service.js";

const getUsers = async (req: Request, res: Response) => {
  const query = (req as any).validatedQuery ?? req.query;

  const result = await adminService.getUsers(query);

  return sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Users retrieved successfully",
    data: result,
  });
};

const getAllParcels = async (req: Request, res: Response) => {
  const query = (req as any).validatedQuery ?? req.query;

  const result = await adminService.getAllParcels(query);

  return sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "All parcels retrieved successfully",
    data: result,
  });
};
const getAuditLogs = async (req: Request, res: Response) => {
  const query = (req as any).validatedQuery as GetAuditLogsQuery;

  const result = await adminService.getAuditLogs(query);

  return sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Audit logs retrieved successfully",
    data: result,
  });
};

export const adminController = {
  getUsers,getAllParcels,getAuditLogs
};