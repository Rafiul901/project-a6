import { Router } from "express";

import auth from "../../middleware/auth.js";
import role from "../../middleware/role.js";
import validateRequest from "../../middleware/validateRequest.js";

import { createPaymentSchema } from "./payment.validation.js";
import { paymentController } from "./payment.controller.js";

const router = Router();

router.post(
  "/",
  auth,
  role("CUSTOMER"),
  validateRequest(createPaymentSchema),
  paymentController.createPayment,
);

export default router;