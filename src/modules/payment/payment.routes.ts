import { Router } from "express";

import auth from "../../middleware/auth.js";
import role from "../../middleware/role.js";
import validateRequest from "../../middleware/validateRequest.js";

import {
  createPaymentSchema,
  getMyPaymentsSchema,
} from "./payment.validation.js";
import { paymentController } from "./payment.controller.js";

const router = Router();

router.post(
  "/",
  auth,
  role("CUSTOMER"),
  validateRequest(createPaymentSchema),
  paymentController.createPayment,
);

router.post(
  "/:id/checkout",
  auth,
  role("CUSTOMER"),
  paymentController.createCheckoutSession,
);

router.get(
  "/:id",
  auth,
  role("CUSTOMER"),
  paymentController.getPaymentById,
);

router.get(
  "/my",
  auth,
  role("CUSTOMER"),
  validateRequest(getMyPaymentsSchema, "query"),
  paymentController.getMyPayments,
);


export default router;