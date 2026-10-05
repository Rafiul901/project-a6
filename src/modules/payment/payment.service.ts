import db from "../../prisma/db.js";
import ApiError from "../../errors/ApiError.js";
import createAuditLog from "../../utils/createAuditLog.js";
import type {
  CreatePaymentInput,
  GetMyPaymentsQuery,
} from "./payment.validation.js";
import config from "../../config/index.js";
import stripe from "../../utils/stripe.js";

const createPayment = async (
  customerId: number,
  payload: CreatePaymentInput,
): Promise<any> => {
  const parcel = await db.orm.public.Parcel
    .where({
      id: payload.parcelId,
      senderId: customerId,
      deletedAt: null,
    })
    .first();

  if (!parcel) {
    throw new ApiError(404, "Parcel not found");
  }

  const existingPayment = await db.orm.public.Payment
    .where({ parcelId: parcel.id })
    .first();

  if (existingPayment) {
    throw new ApiError(400, "Payment already exists for this parcel");
  }

  const payment = await db.orm.public.Payment.create({
    parcelId: parcel.id,
    amount: parcel.deliveryFee,
    currency: "BDT",
    status: "PENDING",
  });

  await createAuditLog({
    userId: customerId,
    action: "CREATE",
    entity: "Payment",
    entityId: payment.id,
    details: `Payment created for parcel ${parcel.trackingNumber}`,
  });

  return payment;
};

const createCheckoutSession = async (
  customerId: number,
  paymentId: number,
): Promise<{
  sessionId: string;
  checkoutUrl: string | null;
}> => {
  const payment = await db.orm.public.Payment
    .where({ id: paymentId })
    .first();

  if (!payment) {
    throw new ApiError(404, "Payment not found");
  }

  const parcel = await db.orm.public.Parcel
    .where({
      id: payment.parcelId,
      senderId: customerId,
      deletedAt: null,
    })
    .first();

  if (!parcel) {
    throw new ApiError(404, "Parcel not found");
  }

  if (payment.status !== "PENDING") {
    throw new ApiError(400, "This payment is not pending");
  }

  const session = await stripe.checkout.sessions.create({
    mode: "payment",

    line_items: [
      {
        price_data: {
          currency: payment.currency.toLowerCase(),
          product_data: {
            name: `Courier Delivery - ${parcel.trackingNumber}`,
          },
          unit_amount: Math.round(payment.amount * 100),
        },
        quantity: 1,
      },
    ],

    metadata: {
      paymentId: String(payment.id),
      parcelId: String(parcel.id),
    },

    success_url: `${config.appUrl}/payment/success`,
    cancel_url: `${config.appUrl}/payment/cancel`,
  });

  await db.orm.public.Payment
    .where({ id: payment.id })
    .update({ stripeSessionId: session.id });

  await createAuditLog({
    userId: customerId,
    action: "CREATE_CHECKOUT",
    entity: "Payment",
    entityId: payment.id,
    details: `Stripe checkout session created for payment ${payment.id}`,
  });

  return {
    sessionId: session.id,
    checkoutUrl: session.url,
  };
};


const getPaymentById = async (
  paymentId: number,
  customerId: number,
): Promise<any> => {
  const payment = await db.orm.public.Payment
    .where({ id: paymentId })
    .first();

  if (!payment) {
    throw new ApiError(404, "Payment not found");
  }

  const parcel = await db.orm.public.Parcel
    .where({
      id: payment.parcelId,
      senderId: customerId,
      deletedAt: null,
    })
    .first();

  if (!parcel) {
    throw new ApiError(404, "Payment not found");
  }

  return payment;
};

const getMyPayments = async (
  customerId: number,
  query: GetMyPaymentsQuery,
): Promise<{
  payments: any[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}> => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const status = query.status;
  const skip = (page - 1) * limit;

  const customerParcels = await db.orm.public.Parcel
    .where({ senderId: customerId, deletedAt: null })
    .all();

  const parcelIds = customerParcels.map((p) => p.id);

  if (parcelIds.length === 0) {
    return {
      payments: [],
      meta: { page, limit, total: 0, totalPages: 0 },
    };
  }

  const where = (p: any) => {
    let condition = p.parcelId.in(parcelIds);
    if (status) {
      condition = condition.and(p.status.eq(status));
    }
    return condition;
  };

  const payments = await db.orm.public.Payment
    .where(where)
    .orderBy((p) => p.createdAt.desc())
    .offset(skip)
    .limit(limit)
    .all();

  const rawTotal = await db.orm.public.Payment
    .where(where)
    .count();

  const total = Number(rawTotal);

  return {
    payments,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const paymentService = {
  createPayment,createCheckoutSession,getPaymentById,getMyPayments
};