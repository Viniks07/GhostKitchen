import {Router} from 'express';
import { AuthController } from "./auth.controller.js";
import { authMiddleware } from "../../shared/middlewares/authMiddleware.js";

export const authRouter = Router();

const authController = new AuthController();

authRouter.post("/register", async (req, res) =>{
    return authController.register(req, res);
})

authRouter.post("/login", async (req, res) =>{
    return authController.login(req, res);
})