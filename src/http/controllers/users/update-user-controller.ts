import {
  ResourceNotFoundError,
  UserAlreadyExistsError,
} from "@/domains/users/application/errors/err";
import { makeUpdateUserUseCase } from "@/domains/users/factories/make-update-user-use-case";
import { AppError } from "@/http/middlewares/error-handler";
import { NextFunction, Request, Response } from "express";
import z from "zod";

// PATCH /api/users - update user
export const updateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const updateUserBodySchema = z.object({
      name: z.string().optional(),
      email: z.string().email().optional(),
      password: z.string().min(6).optional(),
    });

    const updateUserParamsSchema = z.object({
      id: z.string().uuid(),
    });

    const { name, email, password } = updateUserBodySchema.parse(req.body);
    const { id } = updateUserParamsSchema.parse(req.params);

    const updateUserUseCase = makeUpdateUserUseCase();

    const { updatedUser } = await updateUserUseCase.execute(id, {
      name,
      email,
      password: password ? password : undefined,
    });

    const response = {
      success: true,
      message: "User updated successfully",
      data: { updatedUser },
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

    // Se for um erro de usuário já existente, passa para o próximo middleware
    if (error instanceof ResourceNotFoundError) {
      const userExistsError = new AppError(error.message, 404);
      return next(userExistsError);
    }

    // Se for um erro de usuário já existente, passa para o próximo middleware
    if (error instanceof UserAlreadyExistsError) {
      const userExistsError = new AppError(error.message, 409);
      return next(userExistsError);
    }

    // Para outros erros, cria um erro genérico
    const genericError = new AppError(
      error instanceof Error ? error.message : "Internal Server Error",
      500
    );
    next(genericError);
  }
};
