import { Router } from "express";
import { getAllUsers, getUserById } from "../controllers/users/user-controller";
import { createUser } from "../controllers/users/create-user-controller";

const userRoutes = Router();

// Definir rotas de usuários
userRoutes.get("/", getAllUsers);

userRoutes.post("/", createUser);

userRoutes.get("/:id", getUserById);

export default userRoutes;
