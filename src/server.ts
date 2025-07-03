import app from "./app";
import { env } from "./env";

// Tratamento de erros não capturados
process.on("uncaughtException", (err: Error) => {
  console.error("💥 Uncaught Exception:", err.name, err.message);
  process.exit(1);
});

process.on("unhandledRejection", (err: Error) => {
  console.error("💥 Unhandled Rejection:", err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

// Inicializar servidor
const server = app.listen(env.PORT, () => {
  console.log(`🚀 Server running on port: ${env.PORT}`);
  console.log(`📝 Environment: ${env.NODE_ENV}`);
  console.log(`🔗 URL: http://localhost:${env.PORT}`);
});

// shutdown
process.on("SIGTERM", () => {
  console.log("👋 SIGTERM received. Shutting down server...");
  server.close(() => {
    console.log("✅ Server shut down successfully.");
  });
});
