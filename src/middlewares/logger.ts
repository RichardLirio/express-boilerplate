import { Request, Response, NextFunction } from "express";

// Middleware simples de logging de requests
export const requestLogger = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const start = Date.now();

  // Capturar quando a resposta termina
  res.on("finish", () => {
    const duration = Date.now() - start;
    const timestamp = new Date().toISOString();

    // Log colorido no console
    const statusColor =
      res.statusCode >= 400 ? "🔴" : res.statusCode >= 300 ? "🟡" : "🟢"; // Mostrar visualmente uma cor de acordo com o status da resposta

    console.log(
      `${statusColor} [${timestamp}] ${req.method} ${req.originalUrl} - ${res.statusCode} - ${duration}ms`
    );
  });

  next();
};
