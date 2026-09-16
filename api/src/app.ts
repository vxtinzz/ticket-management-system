import express from "express";
import ticketRoutes from "./routes/ticketRoutes"
import responsibleRoutes from "./routes/reponsibleRoutes"


const app = express();
app.use(express.json({limit : "10kb"}))

app.get("/health", (_req, res) => {
  res.status(200).json({
    status: "ok",
  });
});

app.use(express.json({limit : "10kb"}))
app.use("/tickets", ticketRoutes)
app.use("/responsibles", responsibleRoutes)

app.use((_req, res) => {
    res.status(404)
})
    
export default app;