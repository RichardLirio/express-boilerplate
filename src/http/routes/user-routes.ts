import { Router } from "express";
import {
  createUser,
  getAllUsers,
  getUserById,
} from "../controllers/user-controller";

const userRoutes = Router();

// Definir rotas de usuários
userRoutes.get("/", getAllUsers);

userRoutes.post("/", createUser);

userRoutes.get("/:id", getUserById);

export default userRoutes;
