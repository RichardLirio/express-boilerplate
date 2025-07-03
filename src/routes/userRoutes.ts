import { Router } from "express";
import { getAllUsers } from "../controllers/userController";

const userRoutes = Router();

// Definir rotas de usuários
userRoutes.get("/", getAllUsers);

export default userRoutes;
