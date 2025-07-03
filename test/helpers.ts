import { prisma } from "./e2e-setup";

export class E2ETestHelper {
  // Helper para criar dados de teste
  async createTestData() {
    const user = await prisma.user.create({
      data: {
        email: "test@example.com",
        name: "Test User",
        password: "hashedpassword",
      },
    });

    return { user };
  }

  // Helper para limpar dados específicos
  async cleanupData(tableName: string) {
    await prisma.$executeRawUnsafe(
      `TRUNCATE TABLE "public"."${tableName}" RESTART IDENTITY CASCADE;`
    );
  }
}
