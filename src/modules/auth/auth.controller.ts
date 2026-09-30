import type { Request, Response } from "express";

import sendResponse from "../../utils/sendResponse.js";

const register = async (req: Request, res: Response) => {
  return sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Registration request received",
    data: req.body,
  });
};

export const authController = {
  register,
};