
import { Router } from "express";

import auth from "../../middleware/auth.js";
import role from "../../middleware/role.js";
import validateRequest from "../../middleware/validateRequest.js";

import { createParcelSchema } from "./parcel.validation.js";
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
  parcelController.getMyParcels,
);

export default router;
