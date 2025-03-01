"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedUsers = exports.config = void 0;
var dotenv_1 = require("dotenv");
var fs_1 = require("fs");
var path_1 = require("path");
// Load environment variables from the correct .env file
dotenv_1.default.config({ path: (0, path_1.resolve)(process.cwd(), ".env") });
var envFile = ".env.".concat((_a = process.env.NODE_ENV) !== null && _a !== void 0 ? _a : "development");
var envFilePath = (0, path_1.resolve)(process.cwd(), envFile);
var finalEnvFile = (0, fs_1.existsSync)(envFilePath)
    ? envFilePath
    : (0, path_1.resolve)(process.cwd(), ".env");
// Load the final env file
dotenv_1.default.config({ path: finalEnvFile });
// Helper function to load environment variables safely
function getEnvVariable(key, mandatory, defaultValue) {
    if (mandatory === void 0) { mandatory = true; }
    if (defaultValue === void 0) { defaultValue = ""; }
    var value = process.env[key];
    if (!value) {
        if (mandatory) {
            throw new Error("Environment variable ".concat(key, " is missing."));
        }
        return defaultValue; // Return default value if not mandatory
    }
    return value;
}
// Export the configuration object
exports.config = {
    PORT: parseInt(getEnvVariable("PORT", false, "3000")), // Default 3000 if not set
    MONGODB_URI: getEnvVariable("MONGODB_URI"),
    SWAGGER_SERVER_URL: getEnvVariable("SWAGGER_SERVER_URL"),
    NODE_ENV: getEnvVariable("NODE_ENV", false, "development"),
    JWT_SECRET: getEnvVariable("JWT_SECRET"),
    ACCESS_TOKEN_EXPIRY: parseInt(getEnvVariable("ACCESS_TOKEN_EXPIRY", true, "604800")), // 7 days
    REFRESH_TOKEN_EXPIRY: parseInt(getEnvVariable("REFRESH_TOKEN_EXPIRY", true, "31536000")), // 1 year
    ROUNDS: parseInt(getEnvVariable("ROUNDS", true, "10")),
};
exports.seedUsers = [
    {
        email: "admin@example.com",
        name: "Admin User",
        role: "ADMIN",
        password: "Admin@123",
    },
    {
        email: "doctor@example.com",
        name: "Dr. John Doe",
        role: "DOCTOR",
        password: "Doctor@123",
    },
    {
        email: "nurse@example.com",
        name: "Nurse Jane",
        role: "NURSE",
        password: "Nurse@123",
    },
    {
        email: "receptionist@example.com",
        name: "Receptionist Mike",
        role: "RECEPTIONIST",
        password: "Reception@123",
    },
];
