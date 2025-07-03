import dotenv from "dotenv";
import app from "./app";

dotenv.config();

const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || "development";

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
const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on port: ${PORT}`);
  console.log(`📝 Environment: ${NODE_ENV}`);
  console.log(`🔗 URL: http://localhost:${PORT}`);
});

// shutdown
process.on("SIGTERM", () => {
  console.log("👋 SIGTERM received. Shutting down server...");
  server.close(() => {
    console.log("✅ Server shut down successfully.");
  });
});
