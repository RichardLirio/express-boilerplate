import { env } from "../env/index";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
  log: env.NODE_ENV === "development" ? ["query"] : [],
});

export default prisma;
