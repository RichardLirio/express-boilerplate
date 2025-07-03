import { Request, Response } from "express";
import { User } from "../types/user";
import { SuccessResponse } from "@/types/response";
import prisma from "../lib/prisma";

// GET /api/users - Listar todos os usuários
export const getAllUsers = async (_: Request, res: Response) => {
  const users: User[] = await prisma.user.findMany();
  const response: SuccessResponse<User[]> = {
    success: true,
    message: "Users retrieved successfully",
    data: users,
  };

  res.status(200).json(response);
};
