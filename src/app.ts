import express, { Application } from "express";
import cors from "cors";
import helmet from "helmet";

const app: Application = express();

app.use(helmet()); // Headers de seguranca
app.use(cors()); // CORS habilitado

// Middlewares de parsing
app.use(express.json({ limit: "10mb" })); // Parse JSON
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded

// Health check
app.get("/health", (_, res) => {
  res.status(200).json({
    status: "OK",
    message: "Server working normally",
    timestamp: new Date().toISOString(),
    uptime: Math.floor(process.uptime()) + "s",
  });
});

// Middleware para rotas não encontradas
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: `Rote ${req.method} ${req.originalUrl} not found`,
  });
});

export default app;
