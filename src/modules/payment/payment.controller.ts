import type { Request, Response } from "express";

import sendResponse from "../../utils/sendResponse.js";
import { paymentService } from "./payment.service.js";

const createPayment = async (req: Request, res: Response) => {
  const result = await paymentService.createPayment(
    req.user!.userId,
    req.body,
  );

  return sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Payment created successfully",
    data: result,
  });
};

export const paymentController = {
  createPayment,
};