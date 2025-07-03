import { NextFunction, Request, Response } from "express";

import z from "zod";
import { AppError } from "../middlewares/error-handler";
import { hash } from "bcryptjs";
import { User } from "../../@types/user";
import prisma from "../../lib/prisma";
import { SuccessResponse } from "../../@types/response";

// GET /api/users - Listar todos os usuários
export const getAllUsers = async (_: Request, res: Response) => {
  const users: Partial<User>[] = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
      updatedAt: true, // Incluindo updatedAt para manter consistência
    },
  });

  const response: SuccessResponse<Partial<User>[]> = {
    success: true,
    message: "Users retrieved successfully",
    data: users,
  };

  res.status(200).json(response);
};

// GET /api/users/:id - Buscar usuário por ID
export const getUserById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const getUserParamsSchema = z.object({
      id: z.string().uuid(),
    });
    const { id } = getUserParamsSchema.parse(req.params);

    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new AppError("User not found", 404);
    }

    const response: SuccessResponse<Partial<User>> = {
      success: true,
      message: "User retrieved successfully",
      data: { ...user, password: undefined },
    };

    res.status(200).json(response);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const validationErrors = error.errors.map((err) => ({
        field: err.path.join("."),
        message: err.message,
      }));

      const validationError = new AppError(
        "Invalid request data",
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
      error instanceof Error ? error.message : "Internal Server Error",
      500
    );
    next(genericError);
  }
};

// POST /api/users - Criar novo usuário
export const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const createUserBodySchema = z.object({
      name: z.string(),
      email: z.string().email(),
      password: z.string().min(6),
    });

    const { name, email, password } = createUserBodySchema.parse(req.body);

    const userExists = await prisma.user.findUnique({
      where: { email },
    });

    if (userExists) {
      throw new AppError("User already exists", 409);
    }

    const passwordHash = await hash(password, 10); // hashe da senha

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: passwordHash,
      },
    });

    const response = {
      success: true,
      message: "User created successfully",
      data: {
        ...user,
        password: undefined, // nao retornar a senha no response
        updatedAt: undefined, // nao retornar campo updatedat
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
        "Invalid request data",
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
      error instanceof Error ? error.message : "Internal Server Error",
      500
    );
    next(genericError);
  }
};
