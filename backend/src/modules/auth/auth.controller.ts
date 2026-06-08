import { AuthService } from "./auth.service.js";
import { AppError } from "../../shared/errors/AppError.js";
import type { Request, Response } from "express";
import { env } from "../../shared/config/env.js";

const authService = new AuthService();

export class AuthController {
  async register(req: Request, res: Response) {
    const user = await authService.register(req.body);
    return res.status(201).json({ user });
  }

  async login(req: Request, res: Response) {
    const { user, accessToken, tokenMaxAge } = await authService.login(
      req.body,
    );

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: tokenMaxAge,
    });

    return res.status(200).json({ user });
  }

  async me(req: Request, res: Response) {
    if (!req.user) {
      throw new AppError("Não autenticado", 401);
    }

    const user = await authService.getMe(req.user.id);

    return res.status(200).json({ user });
  }

  async logout(req: Request, res: Response) {
    const accessToken = req.cookies.accessToken;

    if (!accessToken) {
      throw new AppError("Não autenticado", 401);
    }

    await authService.logout(accessToken);

    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: env.NODE_ENV === "production",
      sameSite: "strict",
    });
    return res.status(204).send();
  }
}
