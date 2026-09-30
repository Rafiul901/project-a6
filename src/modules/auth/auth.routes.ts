import { Router } from "express";

import validateRequest from "../../middleware/validateRequest.js";
import { registerSchema } from "./auth.validation.js";
import { authController } from "./auth.controller.js";

const router = Router();

router.post(
  "/register",
  validateRequest(registerSchema),
  authController.register,
);

export default router;