import app from "./app";
import { env } from "./env";
import prisma from "./lib/prisma";

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
const server = app.listen(env.PORT, async () => {
  try {
    await prisma.$connect();
    console.log("✅ Prisma connected successfully.");
  } catch (error) {
    console.error("❌ Error connecting to Prisma:", error);
  }
  console.log(`🚀 Server running on port: ${env.PORT}`);
  console.log(`📝 Environment: ${env.NODE_ENV}`);
  console.log(`🔗 URL: http://localhost:${env.PORT}`);
  if (env.SWAGGER_ENABLED) {
    console.log(
      `📄 Swagger-ui : http://localhost:${env.PORT}${env.SWAGGER_UI_PATH}`
    );
  }
});

// shutdown
process.on("SIGTERM", async () => {
  console.log("👋 SIGTERM received. Shutting down server...");
  await prisma.$disconnect();
  server.close(() => {
    console.log("✅ Server shut down successfully.");
  });
});
