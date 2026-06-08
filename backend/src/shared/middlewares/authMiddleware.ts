import jwt from "jsonwebtoken";
import crypto from "node:crypto";
import { AppError } from "../errors/AppError.js";
import { AuthRepository } from "../../modules/auth/auth.repository.js";
import type { NextFunction, Request, Response } from "express";
import type { UserRole } from "@prisma/client";
import { env } from "../config/env.js";

const authRepository = new AuthRepository();

type JwtPayload = {
  id: number;
  role: UserRole;
};

export async function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const accessToken = req.cookies.accessToken;

  if (!accessToken) {
    throw new AppError("Não autenticado", 401);
  }

  let payload: JwtPayload;

  try {
    payload = jwt.verify(accessToken, env.JWT_SECRET) as JwtPayload;
  } catch {
    throw new AppError("Não autenticado", 401);
  }

  const tokenHash = crypto
    .createHash("sha256")
    .update(accessToken)
    .digest("hex");

  const session = await authRepository.findSessionByTokenHash(tokenHash);

  if (!session) {
    throw new AppError("Sessão inválida", 401);
  }

  if (session.revokedAt) {
    throw new AppError("Sessão revogada", 401);
  }

  if (session.expiresAt < new Date()) {
    throw new AppError("Sessão expirada", 401);
  }

  req.user = {
    id: payload.id,
    role: payload.role,
  };

  return next();
}
