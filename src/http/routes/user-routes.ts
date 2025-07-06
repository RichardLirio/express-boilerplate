import { Router } from "express";
import { createUser } from "../controllers/users/create-user-controller";
import { getUserById } from "../controllers/users/get-user-controller";
import { getAllUsers } from "../controllers/users/fetch-user-controller";
import { deleteUserById } from "../controllers/users/delete-user-controller";
import { updateUser } from "../controllers/users/update-user-controller";
import { authRateLimit } from "../middlewares/rate-limiter";
import { authenticate } from "../middlewares/auth";

const userRoutes = Router();

// Definir rotas de usuários
userRoutes.get("/", authenticate, getAllUsers);

userRoutes.post("/", authRateLimit, createUser);

userRoutes.get("/:id", authenticate, getUserById);

userRoutes.delete("/:id", authenticate, deleteUserById);

userRoutes.patch("/:id", authenticate, updateUser);

export default userRoutes;
