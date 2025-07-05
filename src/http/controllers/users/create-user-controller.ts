import { UserAlreadyExistsError } from "@/domains/users/application/errors/err";
import { makeCreateUserUseCase } from "@/domains/users/factories/make-create-user-use-case";
import { AppError } from "@/http/middlewares/error-handler";
import { hash } from "bcryptjs";
import { NextFunction, Request, Response } from "express";
import z from "zod";

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

    const createUserUseCase = makeCreateUserUseCase();

    const passwordHash = await hash(password, 10); // Hashe da senha

    const { User } = await createUserUseCase.execute({
      name,
      email,
      password: passwordHash,
    });

    const response = {
      success: true,
      message: "User created successfully",
      data: { User },
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
