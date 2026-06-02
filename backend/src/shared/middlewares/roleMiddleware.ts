import { AppError } from "../errors/AppError.js";
import type { NextFunction, Request, Response } from "express";
import type { UserRole } from "@prisma/client";

export function roleMiddleware(allowedRoles: UserRole[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new AppError("Não autenticado", 401);
    }

    if (!allowedRoles.includes(req.user.role)) {
      throw new AppError("Acesso negado", 403);
    }

    return next();
  };
}
