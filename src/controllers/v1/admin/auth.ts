import { Request, Response, NextFunction } from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { config } from "../../../config/config";
import UserModel, { IUserDocument } from "../../../models/users";
import { RefreshToken } from "../../../models/refreshTokens";
import { AccessToken } from "../../../models/accessTokens";

if (!config.JWT_SECRET) {
    throw new Error("Missing JWT_SECRET in configuration");
}

const { JWT_SECRET, ACCESS_TOKEN_EXPIRY, REFRESH_TOKEN_EXPIRY } = config;

// Login Controller
export const loginController = async (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate(
        "local",
        { session: false },
        async (err: Error | null, user: IUserDocument | false, info?: { message?: string }) => {
            if (err) return next(err);
            if (!user) {
                return res.status(401).json({
                    status: 401,
                    message: "Authentication failed",
                    data: "Authentication failed",
                    toastMessage: info?.message ?? "Invalid credentials, please try again",
                });
            }

            try {
                const accessToken = jwt.sign(
                    { id: user._id, role: user.role },
                    JWT_SECRET,
                    { expiresIn: ACCESS_TOKEN_EXPIRY }
                );

                const refreshToken = jwt.sign(
                    { id: user._id },
                    JWT_SECRET,
                    { expiresIn: REFRESH_TOKEN_EXPIRY }
                );

                await RefreshToken.deleteMany({ userId: user._id });
                await RefreshToken.create({ userId: user._id, token: refreshToken });
                await AccessToken.create({ userId: user._id, token: accessToken });

                return res.status(200).json({
                    status: 200,
                    message: "Success",
                    data: {
                        _id: user._id,
                        name: user.name,
                        email: user.email,
                        role: user.role,
                        createdAt: user.createdAt,
                        updatedAt: user.updatedAt,
                        access_token: accessToken,
                        refresh_token: refreshToken,
                        tokenExpiresAt: new Date(Date.now() + ACCESS_TOKEN_EXPIRY * 1000),
                    },
                    toastMessage: "Login successful",
                });
            } catch (tokenError) {
                console.error("Token generation error:", tokenError);
                return res.status(500).json({
                    status: 500,
                    message: "Internal server error",
                    data: "Internal server error",
                    toastMessage: "An error occurred during login. Please try again later.",
                });
            }
        }
    )(req, res, next);
};

// Refresh Token Controller
export const refreshTokenController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { refresh_token } = req.body;
        const accessToken = req.headers.authorization?.split(" ")[1];

        if (!refresh_token || !accessToken) {
            return res.status(400).json({
                status: 400,
                message: "Refresh token and access token are required",
                data: "Refresh token and access token are required",
                toastMessage: "Session expired. Please log in again.",
            });
        }

        const storedToken = await RefreshToken.findOne({ token: refresh_token });
        if (!storedToken) {
            return res.status(403).json({
                status: 403,
                message: "Invalid or expired refresh token",
                data: "Invalid or expired refresh token",
                toastMessage: "Please log in again.",
            });
        }

        let decoded: any;
        try {
            decoded = jwt.verify(refresh_token, JWT_SECRET);
        } catch (error) {
            await RefreshToken.deleteOne({ token: refresh_token });
            return res.status(403).json({
                status: 403,
                message: "Invalid or expired refresh token",
                data: "Invalid or expired refresh token",
                toastMessage: "Please log in again.",
            });
        }

        const user = await UserModel.findById(decoded.id);
        if (!user) {
            await RefreshToken.deleteOne({ token: refresh_token });
            return res.status(404).json({
                status: 404,
                message: "User not found",
                data: "User not found",
                toastMessage: "User no longer exists.",
            });
        }

        await AccessToken.deleteOne({ token: accessToken });

        const newAccessToken = jwt.sign(
            { id: user._id, role: user.role },
            JWT_SECRET,
            { expiresIn: ACCESS_TOKEN_EXPIRY }
        );

        await AccessToken.create({ userId: user._id, token: newAccessToken });

        return res.status(200).json({
            status: 200,
            message: "Tokens refreshed successfully",
            data: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
                access_token: newAccessToken,
                refresh_token: refresh_token,
                tokenExpiresAt: new Date(Date.now() + ACCESS_TOKEN_EXPIRY * 1000),
            }
        });
    } catch (error) {
        console.error("Refresh token error:", error);
        return res.status(500).json({
            status: 500,
            message: "Internal server error",
            data: "Internal server error",
            toastMessage: "An error occurred while refreshing the token. Please try again later.",
        });
    }
};

// Logout Controller
export const logoutController = async (req: Request, res: Response) => {
    try {
        const accessToken = req.headers.authorization?.split(" ")[1]; // Extract access token from headers
        const { refresh_token } = req.body; // Get refresh_token from request body

        if (!accessToken) {
            return res.status(400).json({
                status: 400,
                message: "Access token is required",
                data: "Access token is required",
                toastMessage: "Invalid request. Please provide an access token.",
            });
        }

        let decoded: any;
        try {
            decoded = jwt.verify(accessToken, JWT_SECRET);
        } catch (error) {
            return res.status(403).json({
                status: 403,
                message: "Invalid or expired access token",
                data: "Invalid or expired access token",
                toastMessage: "Session expired. Please log in again.",
            });
        }

        // Ensure refresh_token exists
        if (!refresh_token) {
            return res.status(400).json({
                status: 400,
                message: "Refresh token is required",
                data: "Refresh token is required",
                toastMessage: "Invalid request. Please provide a refresh token.",
            });
        }

        //console.log(accessToken);
        

        // Find the access token linked to this refresh token
        const deletedToken = await AccessToken.findOneAndDelete({
            token: accessToken, 
        });

        if (!deletedToken) {
            return res.status(404).json({
                status: 404,
                message: "Access token not found or already removed",
                data: "Access token not found or already removed",
                toastMessage: "Session already expired or invalid.",
            });
        }

        // Find the access token linked to this refresh token
        const deletedRefreshToken = await RefreshToken.findOneAndDelete({
            token: refresh_token, 
        });

        if (!deletedRefreshToken) {
            return res.status(404).json({
                status: 404,
                message: "Refresh token not found or already removed",
                data:  "Refresh token not found or already removed",
                toastMessage: "Session already expired or invalid.",
            });
        }

        return res.status(200).json({
            status: 200,
            message: "Success",
            data: "Logout successful",
            toastMessage: "Logout successful",
            });

    } catch (error) {
        console.error("Logout error:", error);
        return res.status(500).json({
            status: 500,
            message: "Internal server error",
            data: "Internal server error",
            toastMessage: "An error occurred while logging out. Please try again later.",
        });
    }
};

// Admin Profile Controller

export const getAdminProfile = async (req: Request, res: Response) => {
    try {
        const accessToken = req.headers.authorization?.split(" ")[1];

        if (!accessToken) {
            return res.status(401).json({
                status: 401,
                message: "Unauthorized",
                data: "Unauthorized",
                toastMessage: "Please log in again.",
            });
        }

        // Decode the access token to get user ID
        let decoded: any;
        try {
            decoded = jwt.verify(accessToken, config.JWT_SECRET);
        } catch (error) {
            return res.status(403).json({
                status: 403,
                message: "Invalid token",
                data: "Invalid token",
                toastMessage: "Session expired. Please log in again.",
            });
        }

        // Extract projection from request body, ensure _id is always included
        let projection = req.body.project || {};
        projection._id = 1; // Always include _id

        // Fetch admin profile using MongoDB aggregation
        const adminProfile = await UserModel.aggregate([
            { $match: { _id: new mongoose.Types.ObjectId(decoded.id) } },
            { $project: projection } // Apply dynamic projection
        ]);

        if (!adminProfile.length) {
            return res.status(404).json({
                status: 404,
                message: "Admin profile not found",
                data: "Admin profile not found",
                toastMessage: "Admin profile does not exist.",
            });
        }

        // Fetch refresh token from RefreshToken model
        const refreshTokenData = await RefreshToken.findOne({ userId: decoded.id }).select("token").lean();
        const refreshToken = refreshTokenData ? refreshTokenData.token : null;

        return res.status(200).json({
            status: 200,
            message: "Success",
            data: {
                ...adminProfile[0], // Spread the first result since aggregation returns an array
                access_token: accessToken,
                refresh_token: refreshToken,
                tokenExpiresAt: new Date(Date.now() + config.ACCESS_TOKEN_EXPIRY * 1000),
            }
        });
    } catch (error) {
        console.error("Error fetching admin profile:", error);
        return res.status(500).json({
            status: 500,
            message: "Internal server error",
            data: "Internal server error",
            toastMessage: "An error occurred while fetching the profile.",
        });
    }
};


export const updateAdminProfile = async (req: Request, res: Response) => {
    try {
        const accessToken = req.headers.authorization?.split(" ")[1];

        if (!accessToken) {
            return res.status(401).json({
                status: 401,
                message: "Unauthorized",
                data: "Unauthorized",
                toastMessage: "Please log in again.",
            });
        }

        // Decode JWT to get user ID
        let decoded: any;
        try {
            decoded = jwt.verify(accessToken, config.JWT_SECRET);
        } catch (error) {
            return res.status(403).json({
                status: 403,
                message: "Invalid token",
                data: "Invalid token",
                toastMessage: "Session expired. Please log in again.",
            });
        }

        const adminId = decoded.id;

        // Find admin user
        const adminProfile = await UserModel.findById(adminId);
        if (!adminProfile) {
            return res.status(404).json({
                status: 404,
                message: "Admin profile not found",
                data: "Admin profile not found",
                toastMessage: "Admin profile does not exist.",
            });
        }

        // Allowed fields for update
        const allowedFields = ["name", "email", "role", "isDeleted"];
        const updates: any = {};
        Object.keys(req.body).forEach((key) => {
            if (allowedFields.includes(key)) {
                updates[key] = req.body[key];
            }
        });

        if (Object.keys(updates).length === 0) {
            return res.status(400).json({
                status: 400,
                message: "No valid fields to update",
                data: "No valid fields to update",
                toastMessage: "Please provide valid fields to update.",
            });
        }

        // Update profile
        await UserModel.findByIdAndUpdate(adminId, updates, { new: true });

        return res.status(200).json({
            status: 200,
            message: "Success",
            data: "Updated successfully",
            toastMessage: "Updated successfully",
        });
    } catch (error) {
        console.error("Error updating admin profile:", error);
        return res.status(500).json({
            status: 500,
            message: "Internal server error",
            data: "Internal server error",
            toastMessage: "An error occurred while updating the profile.",
        });
    }
};