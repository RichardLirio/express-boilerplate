import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "@/env";
import { JwtPayload } from "@/@types/jwt";

interface AuthRequest extends Request {
  user?: {
    userId: string;
  };
}

// Geração do token JWT
export const generateToken = (userId: string): string => {
  return jwt.sign({ userId }, env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

// Middleware de autenticação
export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    // Extrair token do header Authorization
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      res.status(401).json({
        error: "Access token not provided",
      });
      return;
    }

    // Verificar se o token está no formato correto (Bearer token)
    const token = authHeader.startsWith("Bearer ")
      ? authHeader.slice(7)
      : authHeader;

    if (!token) {
      res.status(401).json({
        error: "Invalid access token",
      });
      return;
    }

    // Verificar e decodificar o token
    const decoded = jwt.verify(token, env.JWT_SECRET) as JwtPayload;

    // Adicionar informações do usuário à requisição
    req.user = {
      userId: decoded.userId,
    };

    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({
        error: "The expired token",
      });
      return;
    }

    if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({
        error: "Invalid access token",
      });
      return;
    }

    res.status(500).json({
      error: "Internal server error",
    });
  }
};
