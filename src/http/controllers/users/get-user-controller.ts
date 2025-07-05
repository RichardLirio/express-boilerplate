import { SuccessResponse } from "@/@types/response";
import { User } from "@/@types/user";
import { ResourceNotFoundError } from "@/domains/users/application/errors/err";
import { makeGetUserUseCase } from "@/domains/users/factories/make-get-user-use-case";
import { AppError } from "@/http/middlewares/error-handler";
import { NextFunction, Request, Response } from "express";
import z from "zod";

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

    const getUserUseCase = makeGetUserUseCase();

    const { User } = await getUserUseCase.execute({ id });

    const response: SuccessResponse<User> = {
      success: true,
      message: "User retrieved successfully",
      data: User,
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

    // Se for um erro de usuário já existente, passa para o próximo middleware
    if (error instanceof ResourceNotFoundError) {
      const userExistsError = new AppError(error.message, 404);
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
