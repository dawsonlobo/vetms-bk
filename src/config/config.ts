import dotenv from "dotenv";
import { existsSync } from "fs";
import { resolve } from "path";

// Load environment variables from the correct .env file
dotenv.config({ path: resolve(process.cwd(), ".env") });

const envFile = `.env.${process.env.NODE_ENV || "development"}`;
const envFilePath = resolve(process.cwd(), envFile);
const finalEnvFile = existsSync(envFilePath) ? envFilePath : resolve(process.cwd(), ".env");

// Load the final env file
dotenv.config({ path: finalEnvFile });

interface AppConfig {
  PORT: number;
  MONGODB_URI: string;
  DYNAMIC_MODELS: { [key: string]: string | object }[];
  SWAGGER_SERVER_URL: string;
}

// Helper function to load environment variables with error handling
function getEnvVariable(key: string, mandatory = true): string {
  const value = process.env[key];

  if (!value && mandatory) {
    throw new Error(`Environment variable ${key} is missing.`);
  }
  return value as string;
}

interface AppConfig {
  PORT: number;
  MONGODB_URI: string;
  SWAGGER_SERVER_URL: string;
}

export const config: AppConfig = {
  PORT: parseInt(getEnvVariable("PORT", false)) || 5071, // Parse to int
  MONGODB_URI: getEnvVariable("MONGODB_URI", true),
  DYNAMIC_MODELS: [],
  SWAGGER_SERVER_URL: getEnvVariable("SWAGGER_SERVER_URL", true),
};
