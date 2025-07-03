import { ErrorResponse } from "@/types/response";
import { Request, Response } from "express";

// Interface para erros customizados
interface CustomError extends Error {
  statusCode?: number;
}

// Middleware de tratamento de erros global
export const errorHandler = (err: CustomError, req: Request, res: Response) => {
  // Log do erro
  // TODO: Implementar um Logger externo em produção
  console.error(`❌ Erro: ${err.message}`);
  console.error(`📍 Route: ${req.method} ${req.originalUrl}`);

  // Definir status code padrão
  const statusCode = err.statusCode || 500;

  // Definir mensagem baseada no status
  let message = err.message;
  if (statusCode === 500) {
    message = "Internal Server Error";
  }

  // Resposta de erro padronizada
  const errorResponse: ErrorResponse = {
    success: false,
    message: "Oops! Something through",
    error: message,
    statusCode,
  };

  // Em desenvolvimento, incluir stack trace
  if (process.env.NODE_ENV === "development") {
    (errorResponse as ErrorResponse & { stack?: string }).stack = err.stack;
  }

  res.status(statusCode).json(errorResponse);
};
