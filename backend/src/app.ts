import express from "express";
import cookieParser from "cookie-parser";
import { routes } from "./routes/index.js";
import { notFoundMiddleware } from "./shared/middlewares/notFoundMiddleware.js";
import { errorHandlerMiddleware } from "./shared/middlewares/errorHandlerMiddleware.js";
import cors from "cors";
import { env } from "./shared/config/env.js";

export const app = express();

app.use(
  cors({
    origin: env.FRONTEND_URL,
    credentials: true,
  }),
);

app.use(cookieParser());
app.use(express.json());

app.use(routes);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);
