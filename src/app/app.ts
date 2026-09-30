import express, {
  type Application,
  type Request,
  type Response,
  type NextFunction,
} from "express";
import cors from "cors";
import helmet from "helmet";
import authRoutes from "../modules/auth/auth.routes";
import ApiError from "../errors/ApiError.js";
import notFound from "../middleware/notFound.js";
import globalErrorHandler from "../middleware/globalErrorHandler.js";

import config from "../config/index.js";
import sendResponse from "../utils/sendResponse.js";

const app: Application = express();


app.use(helmet());

app.use(
  cors({
    origin: config.appUrl,
    credentials: true,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get("/health", (req: Request, res: Response) => {
  return sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "API is healthy",
    data: { status: "running" },
  });
});

app.get("/", (req: Request, res: Response) => {
  return res.send("Courier & Logistics Platform API is running!");
});

app.get("/test-error", (req: Request, res: Response, next: NextFunction) => {
  return next(new ApiError(400, "This is a test error"));
});

app.use("/api/v1/auth", authRoutes);


app.use(notFound);
app.use(globalErrorHandler);

export default app;