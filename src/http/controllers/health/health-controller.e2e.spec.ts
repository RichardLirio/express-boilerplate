import { describe, it, expect, beforeAll } from "vitest";
import request from "supertest";
import app from "@/app";
import { Application } from "express";

describe("Helth E2E Test", () => {
  let application: Application;

  beforeAll(async () => {
    application = app;
  });

  describe("GET /api/health", () => {
    it("should return server status", async () => {
      const response = await request(application)
        .get("/api/health")
        .expect(200);

      expect(response.body.success).toEqual(true);
      expect(response.body.data.status).toEqual("healthy");
    });
  });
});
