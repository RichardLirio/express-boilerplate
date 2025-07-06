import { Router } from "express";
import { authenticateUser } from "../controllers/auth/authenticate-user-controller";
const authRoutes = Router();

// Definir rotas de autenticação

authRoutes.post("/", authenticateUser);

export default authRoutes;
