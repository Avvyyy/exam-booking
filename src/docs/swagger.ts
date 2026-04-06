import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Application } from "express";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Exam Scheduling API",
      version: "1.0.0",
      description: "API documentation for the Exam Scheduling system",
    }, components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        LoginRequest: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: { type: "string", format: "email" },
            password: { type: "string" },
          },
        },
        RegisterRequest: {
          type: "object",
          required: ["firstName", "lastName", "email", "password", "role"],
          properties: {
            firstName: { type: "string" },
            lastName: { type: "string" },
            email: { type: "string", format: "email" },
            password: { type: "string" },
            role: { type: "string", enum: ["student", "admin"] },
            matricNo: { type: "string" },
            department: { type: "string" },
            level: { type: "integer" },
            selectedCourseIds: {
              type: "array",
              items: { type: "integer" },
            },
          },
        },
        StudentOnboardingRequest: {
          type: "object",
          required: [
            "matricNo",
            "firstName",
            "lastName",
            "email",
            "level",
            "department",
            "password",
            "selectedCourseIds",
          ],
          properties: {
            matricNo: { type: "string" },
            firstName: { type: "string" },
            lastName: { type: "string" },
            email: { type: "string", format: "email" },
            level: { type: "integer" },
            department: { type: "string" },
            password: { type: "string" },
            selectedCourseIds: {
              type: "array",
              items: { type: "integer" },
            },
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
    servers: [
      {
        url: "http://localhost:3000",
        description: "Development server",
      },
      {
        url: "https://exma-rr6x.onrender.com",
        description: "Production server",
      },
    ],
  },
  apis: ["./src/features/**/routes.ts"],
};

const swaggerSpec = swaggerJsdoc(options);

export const swaggerDocs = (app: Application) => {
  app.get("/api-docs.json", (_req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerSpec);
  });

  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  console.log("Swagger docs available at http://localhost:3000/api-docs");
};
