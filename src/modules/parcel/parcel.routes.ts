import { Router } from "express";

import auth from "../../middleware/auth.js";
import role from "../../middleware/role.js";
import validateRequest from "../../middleware/validateRequest.js";
import {
  createParcelSchema,
  getMyParcelsSchema,
  getAvailableParcelsSchema,
  updateParcelStatusSchema,
  getAssignedParcelsSchema,
} from "./parcel.validation.js";

import { parcelController } from "./parcel.controller.js";

const router = Router();

// 1. CREATE
router.post(
  "/",
  auth,
  role("CUSTOMER"),
  validateRequest(createParcelSchema),
  parcelController.createParcel,
);

// 2. SPECIFIC GET routes (must come before /:id)
router.get(
  "/my",
  auth,
  role("CUSTOMER"),
  validateRequest(getMyParcelsSchema, "query"),
  parcelController.getMyParcels,
);

router.get(
  "/available",
  auth,
  role("DELIVERY_AGENT"),
  validateRequest(getAvailableParcelsSchema, "query"),
  parcelController.getAvailableParcels,
);

router.get(
  "/assigned",
  auth,
  role("DELIVERY_AGENT"),
  validateRequest(getAssignedParcelsSchema, "query"),
  parcelController.getAssignedParcels,
);

// 3. WILDCARD /:id routes (must come AFTER specific ones)
router.get(
  "/:id/tracking",
  auth,
  role("CUSTOMER"),
  parcelController.getTrackingHistory,
);

router.get(
  "/:id",
  auth,
  role("CUSTOMER"),
  parcelController.getParcelById,
);

// 4. PATCH routes
router.patch(
  "/:id/cancel",
  auth,
  role("CUSTOMER"),
  parcelController.cancelParcel,
);

router.patch(
  "/:id/assign",
  auth,
  role("DELIVERY_AGENT"),
  parcelController.assignParcel,
);

router.patch(
  "/:id/status",
  auth,
  role("DELIVERY_AGENT"),
  validateRequest(updateParcelStatusSchema),
  parcelController.updateParcelStatus,
);

export default router;