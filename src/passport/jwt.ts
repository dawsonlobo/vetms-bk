import jwt from "jsonwebtoken";
import { config } from "../config/config";

const ACCESS_SECRET = config.JWT_SECRET || "default_access_secret";
const REFRESH_SECRET = config.JWT_SECRET || "default_refresh_secret";

export const generateTokens = (userId: string) => {
  const accessTokenExpiresIn = config.ACCESS_TOKEN_EXPIRY || "15m"; // Default 15 minutes
  const refreshTokenExpiresIn = config.REFRESH_TOKEN_EXPIRY || "7d"; // Default 7 days

  const accessToken = jwt.sign({ id: userId }, ACCESS_SECRET, {
    expiresIn: accessTokenExpiresIn,
  });
  const refreshToken = jwt.sign({ id: userId }, REFRESH_SECRET, {
    expiresIn: refreshTokenExpiresIn,
  });

  return {
    accessToken,
    accessTokenExpiresAt: new Date(Date.now() + 15 * 60 * 1000).toISOString(), // 15 min
    refreshToken,
    refreshTokenExpiresAt: new Date(
      Date.now() + 7 * 24 * 60 * 60 * 1000,
    ).toISOString(), // 7 days
  };
};

export const generateAccessToken = (userId: string) => {
  return {
    accessToken: jwt.sign({ id: userId }, ACCESS_SECRET, { expiresIn: "15m" }),
    accessExpiresAt: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
  };
};

export const generateRefreshToken = (userId: string) => {
  return {
    refreshToken: jwt.sign({ id: userId }, REFRESH_SECRET, { expiresIn: "7d" }),
    refreshExpiresAt: new Date(
      Date.now() + 7 * 24 * 60 * 60 * 1000,
    ).toISOString(),
  };
};

export const verifyRefreshToken = (token: string): { id: string } | null => {
  try {
    return jwt.verify(token, REFRESH_SECRET) as { id: string };
  } catch {
    return null; // Safer error handling
  }
};
