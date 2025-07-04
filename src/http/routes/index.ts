import { Router } from "express";
import userRoutes from "./user-routes";
import { getHealthStatus } from "../controllers/health/health-controller";

export const routes = Router();

// Rota de health check
routes.get("/health", getHealthStatus);

// Rotas de usuários
routes.use("/users", userRoutes);

// Rota de boas-vindas da API
routes.get("/", (_, res) => {
  res.json({
    success: true,
    message: "🎉 Welcome to API Express + TypeScript!",
    version: "1.0.0",
    endpoints: {
      health: "/api/health",
      users: "/api/users",
    },
  });
});
