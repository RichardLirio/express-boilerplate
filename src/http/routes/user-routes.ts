import { Router } from "express";
import { getAllUsers, getUserById } from "../controllers/user-controller";
import { createUser } from "../controllers/user/create-user-controller";

const userRoutes = Router();

// Definir rotas de usuários
userRoutes.get("/", getAllUsers);

userRoutes.post("/", createUser);

userRoutes.get("/:id", getUserById);

export default userRoutes;
