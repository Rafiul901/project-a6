import Stripe from "stripe";
import createAuditLog from "../../utils/createAuditLog.js";
import db from "../../prisma/db.js";
import config from "../../config/index.js";
import stripe from "../../utils/stripe.js";

const handleStripeWebhook = async (
  rawBody: Buffer,
  signature: string,
) => {
  const event = stripe.webhooks.constructEvent(
    rawBody,
    signature,
    config.stripe.webhookSecret,
  );

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    const paymentId = Number(session.metadata?.paymentId);

    if (!paymentId) {
      return;
    }

    await db.orm.public.Payment
      .where({ id: paymentId })
      .update({ status: "PAID" });

    await createAuditLog({
      action: "PAYMENT_COMPLETED",
      entity: "Payment",
      entityId: paymentId,
      details: `Stripe payment completed for payment ${paymentId}`,
    });
  }
};

export default handleStripeWebhook;