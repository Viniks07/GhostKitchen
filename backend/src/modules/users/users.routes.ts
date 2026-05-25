import {Router} from 'express';

export const usersRouter = Router();

usersRouter.get("/health", (req, res) => {
    return res.json({module:"users", status: "ok"});
})