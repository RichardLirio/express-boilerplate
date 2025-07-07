import { ResourceNotFoundError } from "@/domains/users/application/errors/err";
import { makeDeleteUserUseCase } from "@/domains/users/factories/make-delete-user-use-case";
import { AppError } from "@/http/middlewares/error-handler";
import { NextFunction, Request, Response } from "express";
import z from "zod";

// DELETE /api/users/:id - delata usuario por ID
export const deleteUserById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const deleteUserParamsSchema = z.object({
      id: z.string().uuid(),
    });

    const { id } = deleteUserParamsSchema.parse(req.params);

    const deleteUserUseCase = makeDeleteUserUseCase();

    await deleteUserUseCase.execute({ id });

    res.status(204).json({});
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
