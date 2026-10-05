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

const createCheckoutSession = async (req: Request, res: Response) => {
  const result = await paymentService.createCheckoutSession(
    req.user!.userId,
    Number(req.params.id),
  );

  return sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Checkout session created successfully",
    data: result,
  });
};

const getPaymentById = async (req: Request, res: Response) => {
  const result = await paymentService.getPaymentById(
    Number(req.params.id),
    req.user!.userId,
  );

  return sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Payment retrieved successfully",
    data: result,
  });
};


const getMyPayments = async (req: Request, res: Response) => {
  const query = (req as any).validatedQuery ?? req.query;

  const result = await paymentService.getMyPayments(
    req.user!.userId,
    query,
  );

  return sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Payment history retrieved successfully",
    data: result,
  });
};

export const paymentController = {
  createPayment,createCheckoutSession,getPaymentById,getMyPayments
};