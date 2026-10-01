import { Router } from "express";

import validateRequest from "../../middleware/validateRequest.js";
import auth from "../../middleware/auth.js";

import {
  registerSchema,
  loginSchema,
} from "./auth.validation.js";

import { authController } from "./auth.controller.js";


const router = Router();

router.post(
  "/register",
  validateRequest(registerSchema),
  authController.register,
);

router.post(
  "/login",
  validateRequest(loginSchema),
  authController.login,
);

router.get(
  "/me",
  auth,
  authController.me,
);



export default router;