import express from "express";
import ticketRoutes from "./routes/ticketRoutes"
import responsibleRoutes from "./routes/reponsibleRoutes"
import cors from "cors"


const app = express();
const FRONT_URL = process.env.FRONTEND_URL

app.use(cors({
    origin: FRONT_URL,
  })
);

app.use(express.json({limit : "10kb"}))
app.use("/tickets", ticketRoutes)
app.use("/responsibles", responsibleRoutes)

app.use((_req, res) => {
    res.status(404)
})
    
export default app;