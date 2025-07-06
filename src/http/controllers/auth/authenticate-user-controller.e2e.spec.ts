import { describe, it, beforeAll } from "vitest";
import request from "supertest";
import app from "@/app";
import { Application } from "express";
import { cleanupTestDatabase, setupTestDatabase } from "test/e2e-setup";
import prisma from "@/lib/prisma";
import { hashPassword } from "@/utils/hash-password";

describe("Authenticate User E2E Tests", () => {
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

  describe("POST /api/login", () => {
    it("should possible to authenticate a user", async () => {
      const user = await prisma.user.create({
        data: {
          name: "John Doe",
          email: "johndoe@example.com",
          password: await hashPassword("123456"),
        },
      });

      const response = await request(application)
        .post("/api/login")
        .send({
          email: user.email,
          password: "123456",
        })
        .expect(200);

      expect(response.body.success).toEqual(true);
      expect(response.body.data).toEqual(
        expect.objectContaining({
          token: expect.any(String),
          User: expect.objectContaining({
            id: expect.any(String),
            name: user.name,
            email: user.email,
          }),
        })
      );
    });

    it("should return user does not exist error", async () => {
      const response = await request(application)
        .post("/api/login")
        .send({
          email: "johndoe@example.com",
          password: "123456",
        })
        .expect(400);

      expect(response.body.success).toEqual(false);
      expect(response.body.error).toEqual("User does not exist");
    });

    it("should not be able to authenticate a user with a invalid password", async () => {
      const user = await prisma.user.create({
        data: {
          name: "John Doe",
          email: "johndoe@example.com",
          password: await hashPassword("123456"),
        },
      });

      const response = await request(application)
        .post(`/api/login`)
        .send({
          email: user.email,
          password: "456789",
        })
        .expect(400);

      expect(response.body.success).toEqual(false);
      expect(response.body.error).toEqual("Invalid credentials");
    });
  });
});
