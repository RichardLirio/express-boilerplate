import { SuccessResponse } from "@/@types/response";
import { env } from "@/env";
import { Request, Response } from "express";

// Controller para health check detalhado
export const getHealthStatus = (_: Request, res: Response): void => {
  const healthData = {
    status: "healthy",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(), // tempo de atividade do processo
    memory: process.memoryUsage(), // uso de memoria do processo
    version: process.version, // versao do nodejs
    environment: env.NODE_ENV || "development",
  };

  const response: SuccessResponse = {
    success: true,
    message: "Server working normally",
    data: healthData,
  };

  res.status(200).json(response);
};
