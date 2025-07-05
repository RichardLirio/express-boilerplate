import { describe, it, beforeAll } from "vitest";
import request from "supertest";
import app from "@/app";
import { Application } from "express";
import { cleanupTestDatabase, setupTestDatabase } from "test/e2e-setup";
import prisma from "@/lib/prisma";
import { randomUUID } from "node:crypto";

describe("Get User E2E Tests", () => {
  let application: Application;

  beforeAll(async () => {
    application = app;
    await setupTestDatabase();
  });

  afterAll(async () => {
    await cleanupTestDatabase();
  });

  describe("GET /api/users/:id", () => {
    it("should return bad request for invalid uuid", async () => {
      const response = await request(application)
        .get("/api/users/invalid-uuid")
        .expect(400);

      expect(response.body.success).toEqual(false);
      expect(response.body.error).toEqual([
        expect.objectContaining({ field: "id", message: "Invalid uuid" }),
      ]);
    });

    it("should return resource not found error", async () => {
      const uuid = randomUUID();
      const response = await request(application)
        .get(`/api/users/${uuid}`)
        .expect(404);

      expect(response.body.success).toEqual(false);
      expect(response.body.error).toEqual("Resource not found");
    });

    it("should return a users by id", async () => {
      // Cria dados de teste
      const createdUser = await prisma.user.create({
        data: {
          name: "John Doe",
          email: "johndoe@example.com",
          password: "123456",
        },
      });

      const response = await request(application)
        .get(`/api/users/${createdUser.id}`)
        .expect(200);

      expect(response.body.success).toEqual(true);
      expect(response.body.data).toEqual(
        expect.objectContaining({ id: createdUser.id })
      );
    });
  });
});
