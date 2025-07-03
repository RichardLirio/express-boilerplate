import { Router } from "express";
import { createUser, getAllUsers } from "../controllers/userController";

const userRoutes = Router();

// Definir rotas de usuários
userRoutes.get("/", getAllUsers);

userRoutes.post("/", createUser);

export default userRoutes;
