import type { Request, Response, NextFunction } from "express";
import type { ZodType } from "zod";

const validateRequest = (
  schema: ZodType,
  source: "body" | "query" = "body",
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req[source]);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: result.error.issues,
      });
    }

    req[source] = result.data;

    next();
  };
};

export default validateRequest;