import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { config } from "./config/config";
import fs from "fs";
import path from "path";

const swaggerUrls = config.SWAGGER_SERVER_URL?.split(",") || [];

console.log("swagger urls", swaggerUrls);

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "VETMS",
      version: "1.2.0",
      description: "A simple API application with Swagger documentation",
    },
    servers: swaggerUrls.map((url) => ({ url })),
    components: {
      securitySchemes: {
        adminBearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "Specify the admin token",
        },
        userBearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "Specify the user token",
        },
        nurseBearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "Specify the nurse token",
        },

        doctorBearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "Specify the nurse token",
        },
        genericBearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "Enter any role's token",
        },
      },
    },
  },
  security: [
    {
      adminBearerAuth: [],
      userBearerAuth: [],
      nurseBearerAuth: [],
      genericBearerAuth: [],
      doctorBearerAuth: [],
    },
  ],
  apis: [
    "./src/routes/**/*.ts", // Routes folder
    "./src/models/*.ts", // Models of db
  ],
};

const swaggerSpec = swaggerJSDoc(options);
const filePath = path.join(process.cwd(), "public/swagger/main.js");

fs.writeFile(
  filePath,
  `(async () => {
      const docs = document.getElementById('docs');
      const apiDescriptionDocument = ${JSON.stringify(swaggerSpec)};
      docs.apiDescriptionDocument = apiDescriptionDocument;
    })();
`,
  (err) => {
    if (err) {
      console.error("Error writing to file:", err);
      return;
    }
    console.log("File has been written successfully.");
  },
);

export { swaggerUi, swaggerSpec };
