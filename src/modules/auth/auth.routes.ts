import { Router } from "express";

import validateRequest from "../../middleware/validateRequest.js";
import auth from "../../middleware/auth.js";

import {
  registerSchema,
  loginSchema,
} from "./auth.validation.js";

import { authController } from "./auth.controller.js";
import role from "../../middleware/role.js";

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

router.get(
  "/customer-test",
  auth,
  role("CUSTOMER"),
  (req, res) => {
    return res.json({
      success: true,
      message: "Customer route accessed successfully",
      user: req.user,
    });
  },
);

router.get(
  "/agent-test",
  auth,
  role("DELIVERY_AGENT"),
  (req, res) => {
    return res.json({
      success: true,
      message: "Delivery agent route accessed successfully",
      user: req.user,
    });
  },
);

router.get(
  "/admin-test",
  auth,
  role("ADMIN"),
  (req, res) => {
    return res.json({
      success: true,
      message: "Admin route accessed successfully",
      user: req.user,
    });
  },
);

export default router;