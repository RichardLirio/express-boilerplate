import { Router } from "express";
import userRoutes from "./user-routes";
import { getHealthStatus } from "../controllers/health/health-controller";
import authRoutes from "./auth-routes";
import {
  getRateLimitStatus,
  resetRateLimit,
} from "../middlewares/rate-limiter";

export const routes = Router();

// Rota de health check
routes.get("/health", getHealthStatus);

// Rotas de usuários
routes.use("/users", userRoutes);

// Auth
routes.use("/auth", authRoutes);

// Rota para verificar status de rate limiting (útil para debug)
routes.get("/rate-limit-status", getRateLimitStatus);

// Rota para resetar rate limiting (apenas para desenvolvimento)
if (process.env.NODE_ENV === "development") {
  routes.post("/reset-rate-limit", resetRateLimit);
}

// Rota de boas-vindas da API
routes.get("/", (_, res) => {
  res.json({
    success: true,
    message: "🎉 Welcome to API Express + TypeScript!",
    version: "1.0.0",
    endpoints: {
      publics: [
        {
          health: "/api/health",
          create_user: {
            method: "post",
            url: "/api/users",
          },
          login: "/api/login",
          logout: "/api/logout",
        },
      ],
      protected: [
        {
          users: {
            prefix: "/api/users",
            fetch_users: {
              method: "get",
              url: "/api/users",
            },

            get_user_by_id: {
              method: "get",
              url: "/api/users/:id",
            },
            delete_user_by_id: {
              method: "delete",
              url: "/api/users/:id",
            },
            update_user_by_id: {
              method: "put",
              url: "/api/users/:id",
            },
          },
        },
      ],
    },
  });
});
