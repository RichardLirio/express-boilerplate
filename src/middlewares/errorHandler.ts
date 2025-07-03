import { env } from "../env/index";
import { ErrorResponse } from "@/types/response";
import { NextFunction, Request, Response } from "express";

// Interface para erros customizados
interface CustomError extends Error {
  statusCode?: number;
  details?: unknown; // Adicionar campo para detalhes estruturados
}

// Middleware de tratamento de erros global
export const errorHandler = (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Log do erro
  // TODO: Implementar um Logger externo em produção
  console.error(`❌ Erro: ${err.message}`);
  console.error(`📍 Route: ${req.method} ${req.originalUrl}`);

  // Definir status code padrão
  const statusCode = err.statusCode || 500;

  // Definir mensagem baseada no status
  let message = err.message;
  const errorData = err.details || message;

  if (statusCode === 500) {
    message = "Internal Server Error";
  }

  // Resposta de erro padronizada
  const errorResponse: ErrorResponse = {
    success: false,
    message: "Oops! Something through",
    error: errorData,
    statusCode,
  };

  // Em desenvolvimento, incluir stack trace
  if (env.NODE_ENV === "development") {
    (errorResponse as ErrorResponse & { stack?: string }).stack = err.stack;
  }

  res.status(statusCode).json(errorResponse);
  next(); // Chamar o próximo middleware, se necessário
};

// Classe para criar erros customizados
export class AppError extends Error implements CustomError {
  public statusCode: number;
  public details?: unknown;

  constructor(message: string, statusCode: number = 500, details?: unknown) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
    this.name = "AppError";
  }
}
