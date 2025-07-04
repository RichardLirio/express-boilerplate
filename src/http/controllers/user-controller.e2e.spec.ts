import { describe, it, expect, beforeAll } from "vitest";
import request from "supertest";
import app from "@/app";
import { Application } from "express";
import prisma from "@/lib/prisma";
import { cleanupTestDatabase, setupTestDatabase } from "test/e2e-setup";

describe("Users E2E Tests", () => {
  let application: Application;

  beforeAll(async () => {
    application = app;
    await setupTestDatabase();
  });

  afterAll(async () => {
    await cleanupTestDatabase();
  });

  describe("GET /users", () => {
    it("should return all users", async () => {
      // Cria dados de teste
      await prisma.user.createMany({
        data: [
          {
            name: "John Doe",
            email: "johndoe@example.com",
            password: "123456",
          },
          {
            name: "John Doe 2",
            email: "johndo2@example.com",
            password: "123456",
          },
        ],
      });

      const response = await request(application).get("/api/users").expect(200);

      expect(response.body.data).toHaveLength(2);
      expect(response.body.success).toEqual(true);
      expect(response.body.data[0]).toHaveProperty("name");
      expect(response.body.data[0]).toHaveProperty("email");
      expect(response.body.data[0]).toHaveProperty("id");
    });
  });
});
