import { Router } from "express";

import auth from "../../middleware/auth.js";
import role from "../../middleware/role.js";
import validateRequest from "../../middleware/validateRequest.js";

import {
  getUsersSchema,
  getAllParcelsSchema,
  getAuditLogsSchema,
} from "./admin.validation.js";
import { adminController } from "./admin.controller.js";

const router = Router();

router.get(
  "/users",
  auth,
  role("ADMIN"),
  validateRequest(getUsersSchema, "query"),
  adminController.getUsers,
);

router.get(
  "/audit-logs",
  auth,
  role("ADMIN"),
  validateRequest(getAuditLogsSchema, "query"),
  adminController.getAuditLogs,
);

router.get(
  "/parcels",
  auth,
  role("ADMIN"),
  validateRequest(getAllParcelsSchema, "query"),
  adminController.getAllParcels,
);
export default router;