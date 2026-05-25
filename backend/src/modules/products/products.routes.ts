import {Router} from 'express';

export const productsRouter = Router();

productsRouter.get("/health", (req, res) => {
    return res.json({module:"products", status: "ok"});
})