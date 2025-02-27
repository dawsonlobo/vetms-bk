import { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import winston from "winston";
import {generateTokens,verifyRefreshToken,generateAccessToken,generateRefreshToken,} from "../../../passport/jwt";
import { config } from "../../../config/config";
import UserModel from "../../../models/users";
import { RefreshToken } from "../../../models/refreshTokens";
import { AccessToken } from "../../../models/accessTokens";
import {ErrorCodes} from "../../../models/models"


const {  ACCESS_TOKEN_EXPIRY, REFRESH_TOKEN_EXPIRY } = config;

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
  
        // Success response
        req.apiStatus = {
            isSuccess: true,
            data: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                updatedAt: user.updatedAt,
                access_token: accessToken,
                accessExpiresAt: ACCESS_TOKEN_EXPIRY,
                refresh_token: refreshToken,
                refreshExpiresAt: REFRESH_TOKEN_EXPIRY,
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
            return next();
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
            return next();
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
            return next();
        }

        // Fetch user details (excluding password)
        const user = await UserModel.findById(decoded.id).select("-password").lean();
        if (!user) {
            await RefreshToken.deleteOne({ token: refreshToken });
            req.apiStatus = {
                isSuccess: false,
                error: ErrorCodes[1012],
                data: "User not found",
                toastMessage: "User no longer exists.",
            };
            return next();
        }

        // Generate new tokens
        const { accessToken, accessExpiresAt } = generateAccessToken(String(user._id));
        const { refreshToken: newRefreshToken, refreshExpiresAt } = generateRefreshToken(String(user._id));

        // Update refresh token in DB
        await RefreshToken.findOneAndUpdate(
            { userId: user._id },
            { token: newRefreshToken, refreshExpiresAt: refreshExpiresAt },
            { upsert: true }
        );

        // Send response with all required fields
        req.apiStatus = {
            isSuccess: true,
            data: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
                access_token: accessToken,
                refresh_token: newRefreshToken,
                tokenExpiresAt: accessExpiresAt, // You can change this if you want refresh expiry here
            }
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
//const ACCESS_SECRET = config.JWT_SECRET || "default_access_secret";

export const logoutController = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        // Extract access token from headers
        const accessToken = req.headers.authorization?.split(" ")[1];
        const { refresh_token: refreshToken } = req.body;  // Ensure correct field name

        if (!accessToken || !refreshToken) {
            req.apiStatus = {
                isSuccess: false,
                error: ErrorCodes[1001],
                data: "Access token and Refresh token are required",
                toastMessage: "Session expired. Please log in again.",
            };
            return next();
        }

        // Verify Refresh Token
        const decodedRefresh = verifyRefreshToken(refreshToken);
        if (!decodedRefresh) {
            req.apiStatus = {
                isSuccess: false,
                error: ErrorCodes[1004],
                data: "Invalid or expired refresh token",
                toastMessage: "Invalid refresh token provided.",
            };
            return next();
        }

        // Find and delete tokens from DB
        const deletedAccess = await AccessToken.deleteOne({ token: accessToken });
        const deletedRefresh = await RefreshToken.deleteOne({ token: refreshToken });

        if (!deletedAccess.deletedCount && !deletedRefresh.deletedCount) {
            req.apiStatus = {
                isSuccess: false,
                error: ErrorCodes[1002],
                data: "Tokens not found or already deleted",
                toastMessage: "Tokens not found. Already logged out?",
            };
            return next();
        }

        // Successfully logged out
        req.apiStatus = {
            isSuccess: true,
            data: "User logged out successfully",
            toastMessage: "Logged out successfully",
        };

        return next();
    } catch (error: unknown) {
        logger.error(`Logout error: ${error instanceof Error ? error.message : "Unknown error"}`);

        req.apiStatus = {
            isSuccess: false,
            error: ErrorCodes[1010],
            data: "Failed to logout",
            toastMessage: "An error occurred while logging out. Please try again later.",
        };

        return next();
    }
};

// Nurse Profile Controller
export async function getNurseProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        console.log(req.user);
        
        const user = req.user as { id: string }; 
        if (!user || !user.id) {
            req.apiStatus = {
                isSuccess: false,
                error: ErrorCodes[1012],
                data: "Unauthorized",
                toastMessage: "Session expired. Please log in again.",
            };
            return next();
        }

        const projection = { _id: 1, name: 1, email: 1, role: 1, createdAt: 1, updatedAt: 1 };
        const nurseProfile = await UserModel.findById(user.id, projection).lean();

        if (!nurseProfile) {
            req.apiStatus = {
                isSuccess: false,
                error: ErrorCodes[1012],
                data: "Nurse profile not found",
                toastMessage: "Nurse profile does not exist.",
            };
            return next();
        }

        const refreshTokenData = await RefreshToken.findOne({ userId: user.id })
            .select("token refreshExpiresAt")
            .lean();

        if (!refreshTokenData) {
            req.apiStatus = {
                isSuccess: false,
                error: ErrorCodes[1012],
                data: "Refresh token not found",
                log: "No refresh token found in DB",
            };
            return next();
        }

        req.apiStatus = {
            isSuccess: true,
            data: {
                ...nurseProfile,
                refresh_token: refreshTokenData.token,
                refreshExpiresAt: REFRESH_TOKEN_EXPIRY,
            },
            toastMessage: "Nurse profile fetched successfully",
        };

        return next();
    } catch (error) {
        console.error(`Error fetching nurse profile: ${error instanceof Error ? error.message : JSON.stringify(error)}`);

        req.apiStatus = {
            isSuccess: false,
            error: ErrorCodes[1010],
            data: "Internal server error",
            toastMessage: "An error occurred while fetching the profile.",
        };
        return next();
    }
}

export async function updateNurseProfile(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const user = req.user as { id: string };
        if (!user || !user.id) {
            req.apiStatus = {
                isSuccess: false,
                error: ErrorCodes[1012],
                data: "Unauthorized",
                toastMessage: "Session expired. Please log in again.",
            };
            return next();
        }

        // Define allowed fields to update
        const allowedFields = ["name", "email", "role", "isDeleted"];
        const updateData: Partial<Record<string, any>> = {};

        Object.keys(req.body).forEach((key) => {
            if (allowedFields.includes(key)) {
                updateData[key] = req.body[key];
            }
        });

        if (Object.keys(updateData).length === 0) {
            req.apiStatus = {
                isSuccess: false,
                error: ErrorCodes[1003],
                data: "No valid fields to update",
                toastMessage: "Please provide valid fields to update.",
            };
            return next();
        }

        // Update nurse profile
        const updatedNurse = await UserModel.findByIdAndUpdate(user.id, updateData, {
            new: true,
            select: "-password",
        });

        if (!updatedNurse) {
            req.apiStatus = {
                isSuccess: false,
                error: ErrorCodes[1003],
                data: "Nurse profile not updated",
                toastMessage: "Update failed",
            };
            return next();
        }

        req.apiStatus = {
            isSuccess: true,
            data: "Updated successfully",
            toastMessage: "Updated successfully",
        };

        return next();
    } catch (error) {
        console.error(`Error updating nurse profile: ${error instanceof Error ? error.message : JSON.stringify(error)}`);

        req.apiStatus = {
            isSuccess: false,
            error: ErrorCodes[1010],
            data: "Internal server error",
            toastMessage: "An error occurred while updating the profile.",
        };
        return next();
    }
}
