import { SuccessResponse } from "@/@types/response";
import { User } from "@/@types/user";
import { makeFetchUsersUseCase } from "@/domains/users/factories/make-fetch-users-use-case";
import { Request, Response } from "express";

// GET /api/users - Listar todos os usuários
export const getAllUsers = async (_: Request, res: Response) => {
  const fetchUsersUsecase = makeFetchUsersUseCase();

  const { Users } = await fetchUsersUsecase.execute();

  const response: SuccessResponse<Partial<User>[]> = {
    success: true,
    message: "Users retrieved successfully",
    data: Users,
  };

  return res.status(200).json(response);
};
