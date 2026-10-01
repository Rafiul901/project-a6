import type { Request, Response } from "express";

import sendResponse from "../../utils/sendResponse.js";
import { authService } from "./auth.service.js";

const register = async (req: Request, res: Response) => {
  const result = await authService.register(req.body);

  return sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Registration successful",
    data: result,
  });
};

const login = async (req: Request, res: Response) => {
  const result = await authService.login(req.body);

  return sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Login successful",
    data: result,
  });
};

const me = async (req: Request, res: Response) => {
  return sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "User information retrieved successfully",
    data: req.user,
  });
};

export const authController = {
  register,login,me
};