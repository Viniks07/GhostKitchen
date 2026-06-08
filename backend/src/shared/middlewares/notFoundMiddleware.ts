import type { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/AppError.js";

export function notFoundMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
    next(new AppError("Rota não encontrada", 404));
}
