import dotenv from "dotenv";

dotenv.config();

const config = {
  port: Number(process.env.PORT) || 5000,

  nodeEnv: process.env.NODE_ENV || "development",

  appUrl: process.env.APP_URL || "http://localhost:3000",

  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET!,
    refreshSecret: process.env.JWT_REFRESH_SECRET!,
  },
  stripe: {
  secretKey: process.env.STRIPE_SECRET_KEY!,
  webhookSecret: process.env.STRIPE_WEBHOOK_SECRET!,
},
};

export default config;