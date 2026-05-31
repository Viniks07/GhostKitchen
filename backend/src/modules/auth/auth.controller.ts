import { AuthService } from "./auth.service.js";
import type { Request, Response } from "express";

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
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: tokenMaxAge,
    });

    return res.status(200).json({ user });
  }
}
