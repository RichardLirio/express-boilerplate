import { Router } from "express";
import { authenticateUser } from "../controllers/auth/authenticate-user-controller";
import { authenticate } from "../middlewares/auth";
import { logoutUser } from "../controllers/auth/logout-user-controller";
import { apiRateLimit, authRateLimit } from "../middlewares/rate-limiter";
const authRoutes = Router();

// Definir rotas de autenticação

authRoutes.post("/login", authRateLimit, authenticateUser);

authRoutes.post("/logout", authenticate, apiRateLimit, logoutUser);

export default authRoutes;
