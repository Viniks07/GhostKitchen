import { Router } from "express";
import { AuthController } from "./auth.controller.js";
import { authMiddleware } from "../../shared/middlewares/authMiddleware.js";

export const authRouter = Router();

const authController = new AuthController();

authRouter.post("/register", (req, res) => {
  return authController.register(req, res);
});

authRouter.post("/login", (req, res) => {
  return authController.login(req, res);
});

authRouter.get("/me", authMiddleware, (req, res) => {
  return authController.me(req, res);
});

authRouter.post("/logout", authMiddleware, (req, res) => {
  return authController.logout(req, res);
});
