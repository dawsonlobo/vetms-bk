import { Request, Response, NextFunction } from "express";
import { config } from "../../../config/config";
import UserModel from "../../../models/users";
import { RefreshToken } from "../../../models/refreshTokens";
import { AccessToken } from "../../../models/accessTokens";
import bcrypt from "bcryptjs";
import {generateTokens,verifyRefreshToken,generateAccessToken,generateRefreshToken,} from "../../../passport/jwt";
import {ErrorCodes} from "../../../models/models"
import { log } from "console";

const {  ACCESS_TOKEN_EXPIRY, REFRESH_TOKEN_EXPIRY } = config;


// Login Controller
export async function loginController(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { email, password } = req.body;
  
    try {
        // Find user by email
        const user = await UserModel.findOne({ email });
        if (!user) {
            req.apiStatus = {
                isSuccess: false,
                error: ErrorCodes[1002],
                data: "User not found or verified",
                toastMessage: "User not found or verified",
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
                data: "Invalid email or password",
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
        console.error("Login error:", error);
        req.apiStatus = {
            isSuccess: false,
            error: ErrorCodes[1010],
            data: error instanceof Error ? error.message : JSON.stringify(error),
            toastMessage: "Internal server error",
        };
        next();
        return;
    }
}

// Refresh Token Controller
export async function refreshTokenController  (req: Request, res: Response, next: NextFunction) :Promise<void> {
    try {
        const { refresh_token: refreshToken } = req.body;

        console.log(refreshToken);
        
        
        if (!refreshToken) {
            req.apiStatus = {
                isSuccess: false,
                error: ErrorCodes[1001],
                data: "Refresh token is required",
                toastMessage: "Refresh token is required",
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
                toastMessage: "Invalid or expired refresh token log in again.",
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
                toastMessage: "Refresh token not found",
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
                toastMessage: "User not found",
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
        console.error("Refresh token error:", error);
        req.apiStatus = {
            isSuccess: false,
            error: ErrorCodes[1010],
            data: "An error occurred while refreshing the token. Please try again later",
            toastMessage: "An error occurred while refreshing the token. Please try again later",
        };
        next();
    }
}

// Logout Controller



export async function logoutController (req: Request, res: Response, next: NextFunction):Promise<void> {
    try {
        // Extract access token from headers
        const accessToken = req.headers.authorization?.split(" ")[1];
        const { refresh_token: refreshToken } = req.body;  // Ensure correct field name

        if (!accessToken || !refreshToken) {
            req.apiStatus = {
                isSuccess: false,
                error: ErrorCodes[1001],
                data: "Access token and Refresh token are required",
                toastMessage: "Access token and Refresh token are required",
            };
            next();
            return 
        }

        // Verify Refresh Token
        const decodedRefresh = verifyRefreshToken(refreshToken);
        if (!decodedRefresh) {
            req.apiStatus = {
                isSuccess: false,
                error: ErrorCodes[1004],
                data: "Invalid or expired refresh token",
                toastMessage: "Invalid or expired refresh token",
            };
            next();
            return
        }

        // Find and delete tokens from DB
        const deletedAccess = await AccessToken.deleteOne({ token: accessToken });
        const deletedRefresh = await RefreshToken.deleteOne({ token: refreshToken });

        if (!deletedAccess.deletedCount && !deletedRefresh.deletedCount) {
            req.apiStatus = {
                isSuccess: false,
                error: ErrorCodes[1002],
                data: "Tokens not found or already deleted",
                toastMessage: "Tokens not found or already deleted",
            };
            next();
            return 
        }

        // Successfully logged out
        req.apiStatus = {
            isSuccess: true,
            data: "User logged out successfully",
            toastMessage: "Logged out successfully",
        };

        next();
        return 
    } catch (error: unknown) {
        console.error(`Logout error: ${error instanceof Error ? error.message : "Unknown error"}`);

        req.apiStatus = {
            isSuccess: false,
            error: ErrorCodes[1010],
            data: "An error occurred while logging out. Please try again later",
            toastMessage: "An error occurred while logging out. Please try again later",
        };

        next();
        return
    }
};

// Admin Profile Controller

export async function getDoctorProfile  (req: Request, res: Response, next: NextFunction) :Promise<void>    {
    try {
        console.log(req.user);
        
        const projection = { _id: 1, name: 1, email: 1, role: 1, createdAt: 1, updatedAt: 1 };


        const user = req.user as { id: string }; 
        if (!user || !user.id) {
            req.apiStatus = {
                isSuccess: false,
                error: ErrorCodes[1012],
                data: "Unauthorized",
                toastMessage: "Unauthorized",
            };
            next();
            return
        }

        const adminProfile = await UserModel.findById(user.id, projection).lean();

        if (!adminProfile) {
            req.apiStatus = {
                isSuccess: false,
                error: ErrorCodes[1012],
                data: "Admin profile not found",
                toastMessage: "Admin profile not found.",
            };
            next();
            return
        }

        const refreshTokenData = await RefreshToken.findOne({ userId: user.id })
            .select("token refreshExpiresAt")
            .lean();

        if (!refreshTokenData) {
            req.apiStatus = {
                isSuccess: false,
                error: ErrorCodes[1012],
                data: "Refresh token not found",
                log: "Refresh token not found",
            };
            next();
            return
        }

        req.apiStatus = {
            isSuccess: true,
            data: {
                ...adminProfile,
                refresh_token: refreshTokenData.token,
                refreshExpiresAt: REFRESH_TOKEN_EXPIRY,
            },
            toastMessage: "Admin profile fetched successfully",
        };

        next();
        return
    } catch (error) {
        console.error(`Error fetching admin profile: ${error instanceof Error ? error.message : JSON.stringify(error)}`);

        req.apiStatus = {
            isSuccess: false,
            error: ErrorCodes[1010],
            data: "An error occurred while fetching the profile",
            toastMessage: "An error occurred while fetching the profile",
        };
        return next();
    }
}


// export async function updateDoctorProfile  (req: Request, res: Response, next: NextFunction) :Promise<void> {
//     try {
        
//         const user = req.user as { id: string };
//         if (!user || !user.id) {
//             req.apiStatus = {
//                 isSuccess: false,
//                 error: ErrorCodes[1012],
//                 data: "Unauthorized",
//                 toastMessage: "Unauthorized",
//             };
//             next();
//             return
//         }

//         // Define allowed fields to update
//         const allowedFields = ["name", "email", "role", "isDeleted"];
//         const updateData: Partial<Record<string, any>> = {};

//         Object.keys(req.body).forEach((key) => {
//             if (allowedFields.includes(key)) {
//                 updateData[key] = req.body[key];
//             }
//         });

//         if (Object.keys(updateData).length === 0) {
//             req.apiStatus = {
//                 isSuccess: false,
//                 error: ErrorCodes[1003],
//                 data: "Please provide valid fields to update",
//                 toastMessage: "Please provide valid fields to update",
//             };
//             next();
//             return 
//         }

//         // Update admin profile
//         const updatedAdmin = await UserModel.findByIdAndUpdate(user.id, updateData, {
//             new: true,
//             select: "-password",
//         });

//         if (!updatedAdmin) {
//             req.apiStatus = {
//                 isSuccess: false,
//                 error: ErrorCodes[1003],
//                 data: "Admin profile not updated",
//                 toastMessage: "Update failed",
//             };
//             next();
//             return 
//         }

//         req.apiStatus = {
//             isSuccess: true,
//             message:"Success",
//             data: "Updated successfully",
//             toastMessage: "Updated successfully",
//         };

//         next();
//         return 
//     } catch (error) {
//         console.error(`Error updating admin profile: ${error instanceof Error ? error.message : JSON.stringify(error)}`);

//         req.apiStatus = {
//             isSuccess: false,
//             error: ErrorCodes[1010],
//             data: "An error occurred while updating the profile",
//             toastMessage: "An error occurred while updating the profile",
//         };
//         next();
//         return 
//     }
// }



export async function updateDoctorProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        // Get user ID from request
        const user = req.user as { id: string };
        console.log("first log",user);
        console.log("second log",user.id);
        
        if (!user || !user.id) {
            req.apiStatus = {
                isSuccess: false,
                error: ErrorCodes[1012],
                data: "Unauthorized",
                toastMessage: "Unauthorized",
            };
            next();
            return;
        }

        // Extract allowed fields from request body
        const { name, email, isDeleted } = req.body;
        const updateFields: Partial<Record<string, any>> = { name, email, isDeleted };

        // Remove undefined fields to avoid unnecessary updates
        Object.keys(updateFields).forEach((key) => {
            if (updateFields[key] === undefined) {
                delete updateFields[key];
            }
        });

        if (Object.keys(updateFields).length === 0) {
            req.apiStatus = {
                isSuccess: false,
                error: ErrorCodes[1003],
                data: "Please provide valid fields to update",
                toastMessage: "Please provide valid fields to update",
            };
            next();
            return;
        }

        // Update doctor profile
        const updatedDoctor = await UserModel.findByIdAndUpdate(
            user.id, 
            updateFields, 
            { new: true, select: "-password" } // Return updated document without password
        );

        if (!updatedDoctor) {
            req.apiStatus = {
                isSuccess: false,
                error: ErrorCodes[1003],
                data: "Doctor profile not updated",
                toastMessage: "Update failed",
            };
            next();
            return;
        }

        // Success response
        req.apiStatus = {
            isSuccess: true,
            message: "Success",
            data: updatedDoctor,
            toastMessage: "Profile updated successfully",
        };
        next();
        return;

    } catch (error: any) {
        console.error(`Error updating doctor profile: ${error.message}`);

        // Handle duplicate key (email already exists) error
        if (error.code === 11000 && error.keyPattern?.email) {
            req.apiStatus = {
                isSuccess: false,
                error: ErrorCodes[11000],
                data: "Email already exists",
                toastMessage: "This email is already in use",
            };
            next();
            return;
        }

        // Generic error handling
        req.apiStatus = {
            isSuccess: false,
            error: ErrorCodes[1010],
            data: "An error occurred while updating the profile",
            toastMessage: "An error occurred while updating the profile",
        };
        next();
        return;
    }
}

