import { Router } from "express";
import {
  createUser,
  getAllUsers,
  getUserById,
} from "../controllers/userController";

const userRoutes = Router();

// Definir rotas de usuários
userRoutes.get("/", getAllUsers);

userRoutes.post("/", createUser);

userRoutes.get("/:id", getUserById);

export default userRoutes;
