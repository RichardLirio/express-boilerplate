import { describe, it, beforeAll } from "vitest";
import request from "supertest";
import app from "@/app";
import { Application } from "express";
import { cleanupTestDatabase, setupTestDatabase } from "test/e2e-setup";
import prisma from "@/lib/prisma";
import { hashPassword } from "@/utils/hash-password";

describe("Logout User E2E Tests", () => {
  let application: Application;

  beforeAll(async () => {
    application = app;
    await setupTestDatabase();
  });

  afterEach(async () => {
    await prisma.$executeRaw`TRUNCATE TABLE "users"`;
  });

  afterAll(async () => {
    await cleanupTestDatabase();
  });

  describe("POST /api/auth/logout", () => {
    it("should possible to logout a user", async () => {
      const user = await prisma.user.create({
        data: {
          name: "John Doe",
          email: "johndoe@example.com",
          password: await hashPassword("123456"),
        },
      });

      const responseauth = await request(application)
        .post("/api/auth/login")
        .send({
          email: user.email,
          password: "123456",
        });

      const response = await request(application)
        .post("/api/auth/logout")
        .set("Authorization", `Bearer ${responseauth.body.data.token}`)
        .send();

      expect(response.body.success).toEqual(true);
      expect(response.body.message).toEqual("Logout successful");
    });

    it("should not be possible to log out an unauthorized user", async () => {
      const response = await request(application)
        .post("/api/auth/logout")
        .send();

      expect(response.body.error).toEqual("Access token not provided");
    });
  });
});
