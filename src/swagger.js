"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.swaggerSpec = exports.swaggerUi = void 0;
var swagger_jsdoc_1 = require("swagger-jsdoc");
var swagger_ui_express_1 = require("swagger-ui-express");
exports.swaggerUi = swagger_ui_express_1.default;
var config_1 = require("./config/config");
var fs_1 = require("fs");
var path_1 = require("path");
var swaggerUrls = ((_a = config_1.config.SWAGGER_SERVER_URL) === null || _a === void 0 ? void 0 : _a.split(",")) || [];
console.log("swagger urls", swaggerUrls);
var options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "VETMS",
            version: "1.0.0",
            description: "A simple API application with Swagger documentation",
        },
        servers: swaggerUrls.map(function (url) { return ({ url: url }); }),
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
var swaggerSpec = (0, swagger_jsdoc_1.default)(options);
exports.swaggerSpec = swaggerSpec;
var filePath = path_1.default.join(process.cwd(), "public/swagger/main.js");
fs_1.default.writeFile(filePath, "(async () => {\n      const docs = document.getElementById('docs');\n      const apiDescriptionDocument = ".concat(JSON.stringify(swaggerSpec), ";\n      docs.apiDescriptionDocument = apiDescriptionDocument;\n    })();\n"), function (err) {
    if (err) {
        console.error("Error writing to file:", err);
        return;
    }
    console.log("File has been written successfully.");
});
