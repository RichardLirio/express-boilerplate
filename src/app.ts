import express, { Application } from "express";
import cors from "cors";
import helmet from "helmet";
import { requestLogger } from "./http/middlewares/logger";
import { routes } from "./http/routes";
import { errorHandler } from "./http/middlewares/error-handler";
import { env } from "./env";
import {
  generalRateLimit,
  rateLimitLogger,
} from "./http/middlewares/rate-limiter";

export const app: Application = express();

app.use(helmet()); // Headers de seguranca
app.use(
  cors({
    origin: env.CORS_ORIGIN || "http://localhost:3333",
    credentials: true,
  })
);

//desabilitando o ETag para evitar problemas com cache em desenvolvimento
app.set("etag", false);

// Middlewares de parsing
app.use(express.json({ limit: "10mb" })); // Parse JSON
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded

// Middleware de logging para rate limiting
app.use(rateLimitLogger);

// Rate limiting geral para todas as rotas
app.use(generalRateLimit);

// Middleware de logging personalizado (simples)
app.use(requestLogger);

// Rotas principais
app.use("/api", routes);

// Middleware para rotas não encontradas
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: `Rote ${req.method} ${req.originalUrl} not found`,
  });
});

// Middleware global de tratamento de erros (sempre por último pois deve capturar todos os possiveis erros)
app.use(errorHandler);

export default app;
