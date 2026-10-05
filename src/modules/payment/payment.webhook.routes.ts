import { Router, type Request, type Response } from "express";

import handleStripeWebhook from "./payment.webhook.service.js";

const router = Router();

router.post("/", async (req: Request, res: Response) => {
  const signature = req.headers["stripe-signature"];

  if (!signature || Array.isArray(signature)) {
    return res.status(400).json({
      success: false,
      message: "Missing Stripe signature",
      errors: [],
    });
  }

  try {
    await handleStripeWebhook(req.body, signature);

    return res.status(200).json({ received: true });
  } catch (error) {
    console.error("Stripe webhook error:", error);

    return res.status(400).json({
      success: false,
      message: "Invalid Stripe webhook",
      errors: [],
    });
  }
});

export default router;