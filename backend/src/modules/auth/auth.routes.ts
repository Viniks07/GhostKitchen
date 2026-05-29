import {Router} from 'express';
import { AuthController } from "./auth.controller.js";
import { authMiddleware } from "../../shared/middlewares/authMiddleware.js";

export const authRouter = Router();

const authController = new AuthController();

authRouter.get("/health", (req, res) => {
    return res.json({module:"auth", status: "ok"});


})

authRouter.post("/login", async (req, res) =>{
    return authController.login(req, res);
})

authRouter.post("/register", async (req, res) =>{
    return authController.register(req, res);
})

authRouter.get("/profile", authMiddleware, (req, res) =>{
    return res.status(200).json({user:req.user});
})