import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import winston from "winston";
import {generateTokens,verifyRefreshToken,generateAccessToken,generateRefreshToken,} from "../../../passport/jwt";
import mongoose from "mongoose";
import { config } from "../../../config/config";
import UserModel, { IUserDocument } from "../../../models/users";
import { RefreshToken } from "../../../models/refreshTokens";
import { AccessToken } from "../../../models/accessTokens";
import {ErrorCodes} from "../../../models/models"
//import { generateTokens } from "../../../passport/jwt"
if (!config.JWT_SECRET) {
    throw new Error("Missing JWT_SECRET in configuration");
}

const { JWT_SECRET, ACCESS_TOKEN_EXPIRY, REFRESH_TOKEN_EXPIRY } = config;

const logger: winston.Logger = winston.createLogger({
    level: "error",
    format: winston.format.json(),
    transports: [new winston.transports.Console()],
  });
 export default logger; 

// Login Controller
export async function loginController (req: Request, res: Response, next: NextFunction): Promise<void>{
    const { email, password } = req.body;
  
    try {
        // Find user by email
        const user = await UserModel.findOne({ email });
        if (!user) {
            req.apiStatus = {
                isSuccess: false,
                error: ErrorCodes[1002],
                data: "User not found or verified",
                log: "User not found",
                toastMessage: "Invalid email or password",
            };
            next();
            return;
        }
  
        // Validate password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            req.apiStatus = {
                isSuccess: false,
                error: ErrorCodes[1012],
                data: "Failed to login",
                toastMessage: "Invalid email or password",
            };
            next();
            return;
        }
  
        // Generate Tokens
        const { accessToken, accessTokenExpiresAt, refreshToken, refreshTokenExpiresAt } = generateTokens(user.id);
  
        // Save tokens in the database
        await AccessToken.create({ token: accessToken, userId: user.id, accessExpiresAt: accessTokenExpiresAt });
        await RefreshToken.create({ token: refreshToken, userId: user.id, refreshExpiresAt: refreshTokenExpiresAt });
  
        // User details to return
        const userInfo = {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        };
  
        // Success response
        req.apiStatus = {
            isSuccess: true,
            data: {
                access_token: accessToken,
                accessExpiresAt:ACCESS_TOKEN_EXPIRY,
                refresh_token: refreshToken,
                refreshExpiresAt:REFRESH_TOKEN_EXPIRY,
                user: userInfo,
            },
            toastMessage: "Login successful",
        };
        next();
        return;
    } catch (error) {
        logger.error("Login error:", error);
        req.apiStatus = {
            isSuccess: false,
            error: ErrorCodes[1010],
            data: error instanceof Error ? error.message : JSON.stringify(error),
            toastMessage: "Internal server error",
        };
        next();
        return;
    }
};


// Refresh Token Controller
export async function refreshTokenController(req: Request, res: Response, next: NextFunction) {
    try {
      const { refresh_token: refreshToken } = req.body;
      
      if (!refreshToken) {
        req.apiStatus = {
          isSuccess: false,
          error: ErrorCodes[1001],
          data: "Refresh token is required",
          toastMessage: "Session expired. Please log in again.",
        };
        next();
        return;
      }
  
      // Verify refresh token
      const decoded = verifyRefreshToken(refreshToken);
      if (!decoded) {
        req.apiStatus = {
          isSuccess: false,
          error: ErrorCodes[1012],
          data: "Invalid or expired refresh token",
          toastMessage: "Please log in again.",
        };
        next();
        return;
      }
  
      // Check if refresh token exists in DB
      const tokenFromDb = await RefreshToken.findOne({ token: refreshToken });
      if (!tokenFromDb) {
        req.apiStatus = {
          isSuccess: false,
          error: ErrorCodes[1012],
          data: "Refresh token not found",
          toastMessage: "Refresh token not found. Please log in again.",
        };
         next();
         return;
      }
  
      // Fetch user details
      const user = await UserModel.findById(decoded.id);
      if (!user) {
        await RefreshToken.deleteOne({ token: refreshToken });
        req.apiStatus = {
          isSuccess: false,
          error: ErrorCodes[1012],
          data: "User not found",
          toastMessage: "User no longer exists.",
        };
        next();
        return ;
      }
  
      // Generate new tokens
      const { accessToken, accessExpiresAt } = generateAccessToken(String(user._id));

      await AccessToken.create({ token: accessToken, userId: user.id,accessExpiresAt:accessExpiresAt });
  
  
      // Send response
      req.apiStatus = {
        isSuccess: true,
        data: {
          access_token: accessToken,
          accessExpiresAt: accessExpiresAt,
        },
        toastMessage: "Token refreshed successfully",
      };
      next();
    } catch (error) {
      logger.error("Refresh token error:", error);
      req.apiStatus = {
        isSuccess: false,
        error: ErrorCodes[1010],
        data: "Failed to refresh token",
        toastMessage: "An error occurred while refreshing the token. Please try again later.",
      };
      next();
    }
  }

// Logout Controller
const ACCESS_SECRET = config.JWT_SECRET || "default_access_secret";

export const logoutController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        // Extract access token from headers
        const accessToken = req.headers.authorization?.split(" ")[1];
        console.log("Access Token:", accessToken);

        // Extract refresh token from request body
        const { refreshToken } = req.body;
        console.log("Refresh Token:", refreshToken);

        if (!accessToken || !refreshToken) {
            req.apiStatus = {
                isSuccess: false,
                error: ErrorCodes[1001],
                data: "Access token and Refresh token are required",
                log: "Access token and Refresh token are required",
            };
            next();
            return;
        }

        // Verify access token
        try {
            jwt.verify(accessToken, ACCESS_SECRET);
        } catch (error) {
            req.apiStatus = {
                isSuccess: false,
                error: ErrorCodes[1003],
                data: "Invalid or expired access token",
                toastMessage: "Session expired. Please log in again.",
            };
            next();
            return;
        }

        // Verify refresh token
        const refreshTokenData = verifyRefreshToken(refreshToken);
        if (!refreshTokenData) {
            req.apiStatus = {
                isSuccess: false,
                error: ErrorCodes[1004], // Use an appropriate error code
                data: "Invalid or expired refresh token",
                toastMessage: "Invalid refresh token provided.",
            };
            next();
            return;
        }

        // Check if tokens exist in the database
        const accessTokenExists = await AccessToken.findOne({ token: accessToken });
        const refreshTokenExists = await RefreshToken.findOne({ token: refreshToken });

        if (!accessTokenExists || !refreshTokenExists) {
            req.apiStatus = {
                isSuccess: false,
                error: ErrorCodes[1002],
                data: "Invalid tokens provided",
                toastMessage: "Invalid tokens provided",
            };
            next();
            return;
        }

        // Delete tokens from the database
        await AccessToken.deleteOne({ token: accessToken });
        await RefreshToken.deleteOne({ token: refreshToken });

        req.apiStatus = {
            isSuccess: true,
            message: "Success",
            data: "User logged out and tokens deleted",
            toastMessage: "User logged out successfully",
        };

        next();
        return;
    } catch (error: unknown) {
        logger.error(`Logout error: ${error instanceof Error ? error.message : "Unknown error"}`);

        req.apiStatus = {
            isSuccess: false,
            error: ErrorCodes[1010],
            data: "Failed to logout",
            toastMessage: "An error occurred while logging out. Please try again later.",
        };

        next();
        return;
    }
};

// Admin Profile Controller
export async function getAdminProfile(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      // Extract access token from Authorization header
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        req.apiStatus = {
          isSuccess: false,
          error: ErrorCodes[1012],
          data: "Unauthorized",
          toastMessage: "Unauthorized",
        };
        next();
        return;
      }
  
      const accessToken = authHeader.split(" ")[1]; // Get the token part after "Bearer "
  
      // Verify and extract user ID from token
      let decoded: { id: string };
      try {
        decoded = jwt.verify(accessToken, config.JWT_SECRET) as { id: string };
      } catch (error) {
        req.apiStatus = {
          isSuccess: false,
          error: ErrorCodes[1012],
          data: "Invalid token",
          toastMessage: "Session expired. Please log in again.",
        };
        return next();
      }
  
      // Fetch stored access token from DB
      const tokenFromDb = await AccessToken.findOne({ token: accessToken });
      if (!tokenFromDb) {
        req.apiStatus = {
          isSuccess: false,
          error: ErrorCodes[1012],
          data: "Invalid or expired access token",
          log: "Access token not found",
        };
        return next();
      }
  
      // Extract projection from request body (if provided)
      const { projection = {} } = req.body;
      projection._id = 1; // Always include _id
  
      // Fetch admin profile using MongoDB aggregation
      const adminProfile = await UserModel.aggregate([
        { $match: { _id: new mongoose.Types.ObjectId(decoded.id) } },
        { $project: projection }, // Apply dynamic projection
      ]);
  
      if (!adminProfile.length) {
        req.apiStatus = {
          isSuccess: false,
          error: ErrorCodes[1012],
          data: "Admin profile not found",
          toastMessage: "Admin profile does not exist.",
        };
        return next();
      }
  
      // Fetch refresh token associated with the user
      const refreshTokenData = await RefreshToken.findOne({ userId: decoded.id }).select("token").lean();
      const refreshToken = refreshTokenData ? refreshTokenData.token : null;
  
      // Generate new access token if refresh token exists
      let newAccessToken = accessToken; // Default to current token
      if (refreshToken) {
        const verifiedRefresh = verifyRefreshToken(refreshToken);
        if (verifiedRefresh) {
          const newTokenData = generateAccessToken(decoded.id);
          newAccessToken = newTokenData.accessToken;
        }
      }
  
      req.apiStatus = {
        isSuccess: true,
        data: {
          ...adminProfile[0], // Spread the first result since aggregation returns an array
          access_token: newAccessToken,
          refresh_token: refreshToken,
        },
        toastMessage: "Admin profile fetched successfully",
      };
      next();
      return;
    } catch (error) {
      logger.error(`Error fetching admin profile: ${error instanceof Error ? error.message : JSON.stringify(error)}`);
  
      req.apiStatus = {
        isSuccess: false,
        error: ErrorCodes[1010],
        data: "Internal server error",
        toastMessage: "An error occurred while fetching the profile.",
      };
      next();
      return;
    }
  }
  
  


  export async function updateAdminProfile(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      // Extract access token from Authorization header
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        req.apiStatus = {
          isSuccess: false,
          error: ErrorCodes[1012],
          data: "Unauthorized",
          toastMessage: "Unauthorized",
        };
        return next();
      }
  
      const accessToken = authHeader.split(" ")[1]; // Extract token after "Bearer "
  
      // Validate token existence in DB
      const tokenFromDb = await AccessToken.findOne({ token: accessToken });
      if (!tokenFromDb) {
        req.apiStatus = {
          isSuccess: false,
          error: ErrorCodes[1012],
          data: "Invalid or expired access token",
          log: "Access token not found",
        };
        return next();
      }
  
      // Get admin ID from the token
      const adminId = tokenFromDb.userId;
      if (!adminId) {
        req.apiStatus = {
          isSuccess: false,
          error: ErrorCodes[1012],
          data: "User ID not found in token",
        };
        return next();
      }
  
      // Fetch admin details
      const adminProfile = await UserModel.findById(adminId);
      if (!adminProfile) {
        req.apiStatus = {
          isSuccess: false,
          error: ErrorCodes[1012],
          data: "Admin profile not found",
          toastMessage: "Admin profile does not exist.",
        };
        return next();
      }
  
      // Prevent updating password field
      const updateData = { ...req.body };
      if (updateData.password) {
        delete updateData.password;
      }
  
      // Allowed fields for update
      const allowedFields = ["name", "email", "role", "isDeleted"];
      const updates: Record<string, any> = {};
  
      Object.keys(updateData).forEach((key) => {
        if (allowedFields.includes(key)) {
          updates[key] = updateData[key];
        }
      });
  
      if (Object.keys(updates).length === 0) {
        req.apiStatus = {
          isSuccess: false,
          data: "No valid fields to update",
          toastMessage: "Please provide valid fields to update.",
          error: ErrorCodes[1003],
        };
        return next();
      }
  
      // Update admin profile
      const updatedAdmin = await UserModel.findByIdAndUpdate(adminId, updates, {
        new: true,
      }).select("-password");
  
      if (!updatedAdmin) {
        req.apiStatus = {
          isSuccess: false,
          data: "Admin profile not updated",
          toastMessage: "Update failed",
          error: ErrorCodes[1003],
        };
        return next();
      }
  
      req.apiStatus = {
        isSuccess: true,
        data: updatedAdmin, // Return updated admin profile
        toastMessage: "Updated successfully",
      };
      return next();
    } catch (error) {
      logger.error(`Error updating admin profile: ${error}`);
      req.apiStatus = {
        isSuccess: false,
        data: "An error occurred while updating the profile.",
        toastMessage: "Error occurred.",
        error: ErrorCodes[1006],
      };
      return next();
    }
  }