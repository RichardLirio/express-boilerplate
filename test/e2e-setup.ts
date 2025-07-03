import { PrismaClient } from "@prisma/client";
import { execSync } from "child_process";
import { randomUUID } from "crypto";

// Cria um banco de dados único para cada suite de teste E2E
const generateDatabaseURL = () => {
  const testId = randomUUID();
  const baseUrl =
    process.env.DATABASE_URL || "postgresql://user:password@localhost:5432";
  const dbName = baseUrl.split("/").pop()?.split("?")[0] || "myapp";
  const baseUrlWithoutDb = baseUrl.substring(0, baseUrl.lastIndexOf("/"));
  return `${baseUrlWithoutDb}/${dbName}_e2e_${testId}`;
};

let prisma: PrismaClient;
let testDatabaseUrl: string;

beforeAll(async () => {
  // Gera URL única para o banco de teste E2E
  testDatabaseUrl = generateDatabaseURL();
  const dbName = testDatabaseUrl.split("/").pop();

  // Cria o banco de dados de teste
  try {
    execSync(`createdb ${dbName}`, {
      stdio: "inherit",
      env: { ...process.env, PGPASSWORD: process.env.PG_PASSWORD },
    });
  } catch (error) {
    console.log("Database might already exist, continuing...");
    console.error(error);
  }

  // Configura Prisma com o banco de teste
  process.env.DATABASE_URL = testDatabaseUrl;
  prisma = new PrismaClient();

  // Executa as migrações
  try {
    execSync("npx prisma migrate deploy", {
      stdio: "inherit",
      env: { ...process.env, DATABASE_URL: testDatabaseUrl },
    });
  } catch (error) {
    console.error("Error running migrations:", error);
  }
});

afterAll(async () => {
  // Limpa o banco de dados de teste
  await prisma.$disconnect();

  const dbName = testDatabaseUrl.split("/").pop();
  try {
    execSync(`dropdb ${dbName}`, {
      stdio: "inherit",
      env: { ...process.env, PGPASSWORD: process.env.PG_PASSWORD },
    });
  } catch (error) {
    console.log("Error dropping test database:", error);
  }
});

beforeEach(async () => {
  // Limpa todas as tabelas antes de cada teste
  const tablenames = await prisma.$queryRaw<Array<{ tablename: string }>>`
    SELECT tablename FROM pg_tables WHERE schemaname='public'
  `;

  for (const { tablename } of tablenames) {
    if (tablename !== "_prisma_migrations") {
      await prisma.$executeRawUnsafe(
        `TRUNCATE TABLE "public"."${tablename}" RESTART IDENTITY CASCADE;`
      );
    }
  }
});

export { prisma };
