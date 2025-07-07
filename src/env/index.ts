import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  PORT: z.coerce.number().default(3333),
  CORS_ORIGIN: z.string().url(),
  PG_USER: z.string(),
  PG_PASSWORD: z.string(),
  PG_DB: z.string(),
  DATABASE_URL: z.string(),
  JWT_SECRET: z.string(),
  SWAGGER_ENABLED: z.coerce.boolean().default(true),
  SWAGGER_UI_PATH: z.string().default("/api-docs"),
});

const _env = envSchema.safeParse(process.env);

if (_env.success === false) {
  console.error("❌ Invalid environment variables", _env.error.format());

  throw new Error("Invalid environment variables");
}

export const env = _env.data;
