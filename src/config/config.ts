import dotenv from "dotenv";
import { existsSync } from "fs";
import { resolve } from "path";

// Load environment variables from the correct .env file
dotenv.config({ path: resolve(process.cwd(), ".env") });

const envFile = `.env.${process.env.NODE_ENV ?? "development"}`;
const envFilePath = resolve(process.cwd(), envFile);
const finalEnvFile = existsSync(envFilePath) ? envFilePath : resolve(process.cwd(), ".env");

// Load the final env file
dotenv.config({ path: finalEnvFile });

// Helper function to load environment variables safely
function getEnvVariable(key: string, mandatory = true, defaultValue: string = ""): string {
  const value = process.env[key];

  if (!value) {
    if (mandatory) {
      throw new Error(`Environment variable ${key} is missing.`);
    }
    return defaultValue; // Return default value if not mandatory
  }
  return value;
}

// Define the application configuration interface
interface AppConfig {
  PORT: number;
  MONGODB_URI: string;
  SWAGGER_SERVER_URL: string;
  NODE_ENV: string;
  JWT_SECRET: string;
  ACCESS_TOKEN_EXPIRY: number;
  REFRESH_TOKEN_EXPIRY: number;
  ROUNDS: number;
}

// Export the configuration object
export const config: AppConfig = {
  PORT: parseInt(getEnvVariable("PORT", false, "3000")), // Default 3000 if not set
  MONGODB_URI: getEnvVariable("MONGODB_URI"),
  SWAGGER_SERVER_URL: getEnvVariable("SWAGGER_SERVER_URL"),
  NODE_ENV: getEnvVariable("NODE_ENV", false, "development"),
  JWT_SECRET: getEnvVariable("JWT_SECRET"),
  ACCESS_TOKEN_EXPIRY: parseInt(getEnvVariable("ACCESS_TOKEN_EXPIRY", true, "604800")), // 7 days
  REFRESH_TOKEN_EXPIRY: parseInt(getEnvVariable("REFRESH_TOKEN_EXPIRY", true, "31536000")), // 1 year
  ROUNDS: parseInt(getEnvVariable("ROUNDS", true, "15")),
};
