import { NextFunction, Request, Response } from "express";
import { User } from "../types/user";
import { SuccessResponse } from "@/types/response";
import prisma from "../lib/prisma";
import z from "zod";
import { AppError } from "../middlewares/errorHandler";

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

// POST /api/users - Criar novo usuário
export const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const createUserBodySchema = z.object({
      nome: z.string(),
      email: z.string().email(),
      password: z.string().min(6),
    });

    const { nome, email, password } = createUserBodySchema.parse(req.body);
    console.log("Creating user with data:", { nome, email, password });

    // logica para criar o usuario
    // const user = await userService.createUser({ nome, email, password });

    const response = {
      success: true,
      message: "Usuário criado com sucesso",
      data: {
        // user: { id: user.id, nome: user.nome, email: user.email }
      },
    };

    res.status(201).json(response);
  } catch (error) {
    // Tratamento específico para erros de validação do Zod
    if (error instanceof z.ZodError) {
      const validationErrors = error.errors.map((err) => ({
        field: err.path.join("."),
        message: err.message,
      }));

      const validationError = new AppError(
        "Dados inválidos",
        400,
        validationErrors // Passando os detalhes como terceiro parâmetro
      );

      return next(validationError);
    }

    // Se for um erro customizado, passa direto
    if (error instanceof AppError) {
      return next(error);
    }

    // Para outros erros, cria um erro genérico
    const genericError = new AppError(
      error instanceof Error ? error.message : "Erro interno do servidor",
      500
    );
    next(genericError);
  }
};
