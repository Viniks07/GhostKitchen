import express from "express";
import cookieParser from "cookie-parser";
import { routes } from "./routes/index.js";
import {notFoundMiddleware} from "./shared/middlewares/notFoundMiddleware.js";
import { errorHandlerMiddleware } from "./shared/middlewares/errorHandlerMiddleware.js";

export const app = express();

app.use(cookieParser());
app.use(express.json());

app.use(routes);
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);
