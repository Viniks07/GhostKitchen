import type {NextFunction, Request, Response} from "express";
import { AppError } from "../errors/AppError.js";

export function errorHandlerMiddleware(
    error: unknown,
    req: Request,
    res: Response,
    next: NextFunction
) {
    if (error instanceof AppError) {
        return res.status(error.statusCode).json({
            message: error.message,
        });
    }


    return res.status(500).json({
        message: "Internal Server Error",
    });
}