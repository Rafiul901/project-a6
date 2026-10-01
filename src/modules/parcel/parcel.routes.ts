
import { Router } from "express";

import auth from "../../middleware/auth.js";
import role from "../../middleware/role.js";
import validateRequest from "../../middleware/validateRequest.js";
import {
  createParcelSchema,
  getMyParcelsSchema,
  getAvailableParcelsSchema,updateParcelStatusSchema
} from "./parcel.validation.js";

import { parcelController } from "./parcel.controller.js";

const router = Router();

router.post(
  "/",
  auth,
  role("CUSTOMER"),
  validateRequest(createParcelSchema),
  parcelController.createParcel,
);



router.get(
  "/my",
  auth,
  role("CUSTOMER"),
  validateRequest(getMyParcelsSchema, "query"),
  parcelController.getMyParcels,
);

router.get(
  "/:id",
  auth,
  role("CUSTOMER"),
  parcelController.getParcelById,
);

router.patch(
  "/:id/cancel",
  auth,
  role("CUSTOMER"),
  parcelController.cancelParcel,
);

router.get(
  "/available",
  auth,
  role("DELIVERY_AGENT"),
  validateRequest(getAvailableParcelsSchema, "query"),
  parcelController.getAvailableParcels,
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
