import { Router } from "express";
import { createUser } from "../controllers/users/create-user-controller";
import { getUserById } from "../controllers/users/get-user-controller";
import { getAllUsers } from "../controllers/users/fetch-user-controller";
import { deleteUserById } from "../controllers/users/delete-user-controller";
import { updateUser } from "../controllers/users/update-user-controller";

const userRoutes = Router();

// Definir rotas de usuários
userRoutes.get("/", getAllUsers);

userRoutes.post("/", createUser);

userRoutes.get("/:id", getUserById);

userRoutes.delete("/:id", deleteUserById);

userRoutes.patch("/:id", updateUser);

export default userRoutes;
