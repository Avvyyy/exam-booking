import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { config } from "../config/config";
import { UserRole } from "../features/user/types";
import { AppError } from "../utils/app-error";

interface TokenPayload {
  userId: number;
  role: UserRole;
}

export const requireAuth = (roles?: UserRole[]) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    const authedReq = req as Request & {
      user?: {
        id: number;
        role: UserRole;
      };
    };

    const authorization = req.headers.authorization;

    if (!authorization || !authorization.startsWith("Bearer ")) {
      return next(new AppError("Missing or invalid authorization token", 401));
    }

    const token = authorization.split(" ")[1];

    if (!token) {
      return next(new AppError("Missing authorization token", 401));
    }

    try {
      const payload = jwt.verify(token, config.jwtSecret) as unknown as TokenPayload;

      authedReq.user = {
        id: payload.userId,
        role: payload.role,
      };

      if (roles && roles.length > 0 && !roles.includes(payload.role)) {
        return next(new AppError("Forbidden: insufficient permissions", 403));
      }

      return next();
    } catch (_error) {
      return next(new AppError("Invalid or expired token", 401));
    }
  };
};
