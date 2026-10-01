import type { Request, Response, NextFunction } from "express";

import config from "../config/index.js";
import { verifyToken } from "../utils/jwt.js";

const auth = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      success: false,
      message: "You are not authorized",
      errors: [],
    });
  }

  const [type, token] = authHeader.split(" ");

  if (type !== "Bearer" || !token) {
    return res.status(401).json({
      success: false,
      message: "Invalid authorization format",
      errors: [],
    });
  }

  try {
    const decoded = verifyToken(
      token,
      config.jwt.accessSecret,
    );

    req.user = decoded;

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
      errors: [],
    });
  }
};

export default auth;