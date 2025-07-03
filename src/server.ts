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
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`📝 Ambiente: ${NODE_ENV}`);
  console.log(`🔗 URL: http://localhost:${PORT}`);
});

// shutdown
process.on("SIGTERM", () => {
  console.log("👋 SIGTERM recebido. Encerrando servidor...");
  server.close(() => {
    console.log("✅ Servidor encerrado com sucesso.");
  });
});
