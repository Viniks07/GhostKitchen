import {Router} from 'express';

export const authRouter = Router();

authRouter.get("/health", (req, res) => {
    return res.json({module:"auth", status: "ok"});
})