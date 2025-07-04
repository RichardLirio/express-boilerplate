import { describe, it, beforeAll } from "vitest";
import request from "supertest";
import app from "@/app";
import { Application } from "express";
import { cleanupTestDatabase, setupTestDatabase } from "test/e2e-setup";
import prisma from "@/lib/prisma";
import { compare } from "bcryptjs";

describe("Update User E2E Tests", () => {
  let application: Application;

  beforeAll(async () => {
    application = app;
    await setupTestDatabase();
  });

  afterAll(async () => {
    await cleanupTestDatabase();
  });

  describe("POST /api/users", () => {
    it("should return bad request for invalidate body request", async () => {
      const response = await request(application)
        .post("/api/users")
        .send({
          name: 123,
          email: "johndoe@.com",
          password: "1234",
        })
        .expect(400);

      expect(response.body.success).toEqual(false);
      expect(response.body.error).toEqual([
        expect.objectContaining({
          field: "name",
          message: "Expected string, received number",
        }),
        expect.objectContaining({
          field: "email",
          message: "Invalid email",
        }),
        expect.objectContaining({
          field: "password",
          message: "String must contain at least 6 character(s)",
        }),
      ]);
    });

    it("should return user already exists error", async () => {
      await prisma.user.create({
        data: {
          name: "John Doe",
          email: "johndoe@example.com",
          password: "123456",
        },
      });

      const response = await request(application)
        .post("/api/users")
        .send({
          name: "John Doe 2",
          email: "johndoe@example.com",
          password: "123456",
        })
        .expect(409);

      expect(response.body.success).toEqual(false);
      expect(response.body.error).toEqual("User already exists");
    });

    it("should be able to create a user", async () => {
      const userCreated = await prisma.user.create({
        data: {
          name: "John Doe",
          email: "johndoe@example.com",
          password: "123456",
        },
      });

      const response = await request(application)
        .patch(`/api/users/${userCreated.id}`)
        .send({
          name: "John Doe 2",
          email: "johndo2@example.com",
          password: "1234568",
        })
        .expect(201);

      expect(response.body.success).toEqual(true);
      expect(compare("1234568", response.body.data.password)).toEqual(true);
      expect(response.body.data).toEqual(
        expect.objectContaining({
          User: expect.objectContaining({
            id: expect.any(String),
            name: "John Doe 2",
            email: "johndo2@example.com",
          }),
        })
      );
    });
  });
});
