import express from 'express';
import {routes} from './routes/index.js';

const app = express();

app.use(express.json());

app.get("/health", (req, res) => {
    return res.status(200).json(
        {status:"ok",
        message:"Server running"
        }

    )
})

app.use(routes)

app.listen(3000, () => {
    console.log("Server running on port 3000");
})