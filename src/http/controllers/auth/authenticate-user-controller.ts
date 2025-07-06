import {
  InvalidCredentialsError,
  UserDoesNotExistError,
} from "@/domains/users/application/errors/err";
import { makeAuthenticateUserUseCase } from "@/domains/users/factories/make-authenticate-user-use-case";
import { generateToken } from "@/http/middlewares/auth";
import { AppError } from "@/http/middlewares/error-handler";
import { NextFunction, Request, Response } from "express";
import z from "zod";

// POST /api/login - Logar e autenticar usuario
export const authenticateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authenticateUserBodySchema = z.object({
      email: z.string().email(),
      password: z.string().min(6),
    });

    const { email, password } = authenticateUserBodySchema.parse(req.body);

    const authenticateUserUseCase = makeAuthenticateUserUseCase();

    const { User } = await authenticateUserUseCase.execute({
      email,
      password,
    });

    if (User.id && User.email && User.name) {
      // Gerar token
      const token = generateToken(User.id);

      const response = {
        success: true,
        message: "User authenticated successfully",
        data: { token, User },
      };

      res.status(200).json(response);
    }
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

    // Se for um erro de usuário não registrado
    if (error instanceof UserDoesNotExistError) {
      const userNotExistsError = new AppError(error.message, 400);
      return next(userNotExistsError);
    }

    // Se for um erro de credenciais invalidas
    if (error instanceof InvalidCredentialsError) {
      const invalidCredentialsError = new AppError(error.message, 400);
      return next(invalidCredentialsError);
    }

    // Para outros erros, cria um erro genérico
    const genericError = new AppError(
      error instanceof Error ? error.message : "Internal Server Error",
      500
    );
    next(genericError);
  }
};
