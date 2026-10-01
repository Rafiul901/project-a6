import type { Request, Response, NextFunction } from "express";
import type { UserRole } from "../types/auth.js";

const role = (...allowedRoles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "You are not authorized",
        errors: [],
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "You do not have permission to access this resource",
        errors: [],
      });
    }

    next();
  };
};

export default role;