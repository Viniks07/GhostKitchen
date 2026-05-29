import express from 'express';
import cookieParser from 'cookie-parser';
import {routes} from './routes/index.js';
import { errorHandlerMiddleware } from './shared/middlewares/errorHandlerMiddleware.js';

const app = express();

app.use(cookieParser());
app.use(express.json());


app.use(routes)
app.use(errorHandlerMiddleware)
app.listen(3000, () => {
    console.log("Server running on port 3000");
})