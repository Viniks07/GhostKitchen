import {Router} from 'express';

export const restaurantsRouter = Router();

restaurantsRouter.get("/health", (req, res) => {
    return res.json({module:"restaurants", status: "ok"});
})