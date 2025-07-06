import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../src/utils/hash-password";
const prisma = new PrismaClient();
async function main() {
  const admin = await prisma.user.create({
    data: {
      name: "Admin User",
      email: "admin@example.com",
      password: await hashPassword("admin123"),
    },
  });

  console.log({ admin }, "Admin User created succesfuly");
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
