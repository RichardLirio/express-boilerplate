import swaggerJSDoc from "swagger-jsdoc";

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "Express Boilerplate API",
    version: "1.0.0",
    description: "API documentation for Express Boilerplate",
    contact: {
      name: "Richard Lirio",
      email: "richardlirio@hotmail.com",
    },
  },
  servers: [
    {
      url: "http://localhost:3333/api",
      description: "Development server",
    },
    {
      url: "https://sua-api.herokuapp.com",
      description: "Production server",
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
      apiKey: {
        type: "apiKey",
        in: "header",
        name: "X-API-Key",
      },
    },
  },
  security: [
    {
      bearerAuth: [],
    },
  ],
};

const options = {
  swaggerDefinition,
  apis: ["./src/http/routes/*.ts", "./src/docs/components/*.ts"],
};

export const swaggerSpec = swaggerJSDoc(options);
