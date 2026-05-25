import {Router} from 'express';

export const ordersRouter = Router();

ordersRouter.get("/health", (req, res) => {
    return res.json({module:"orders", status: "ok"});
})