import { swaggerSpec } from "@/docs/swagger.config";
import { Application } from "express";
import swaggerUi from "swagger-ui-express";

export const setupSwagger = (app: Application): void => {
  // Endpoint para acessar a documentação
  app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec, {
      explorer: true,
      customCss: ".swagger-ui .topbar { display: none }",
      customSiteTitle: "Express Boilerplate API Docs",
    })
  );

  // Endpoint para acessar o JSON do Swagger
  app.get("/api-docs.json", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerSpec);
  });
};
