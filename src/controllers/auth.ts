import { Request, Response, NextFunction } from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { IUserDocument, UserModel } from "../models/users";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET as string;
const ACCESS_TOKEN_EXPIRY = parseInt(process.env.ACCESS_TOKEN_EXPIRY ?? "86400", 10); // 1 day
const REFRESH_TOKEN_EXPIRY = parseInt(process.env.REFRESH_TOKEN_EXPIRY ?? "604800", 10); // 7 days

if (!JWT_SECRET) {
    throw new Error("Missing JWT_SECRET or REFRESH_SECRET in .env file");
}

// Login Controller
export const loginController = (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate(
        "local",
        { session: false },
        (err: Error | null, user: IUserDocument | false, info?: { message?: string }) => {
            if (err) return next(err);
            if (!user) {
                return res.status(401).json({
                    status: 401,
                    message: "Authentication failed",
                    data: null,
                    toastMessage: info?.message ?? "Invalid credentials, please try again"
                });
            }

            const accessToken = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRY });
            const refreshToken = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRY });

            res.status(200).json({
                status: 200,
                message: "Success",
                data: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    access_token: accessToken,
                    refresh_token: refreshToken,
                    tokenExpiresAt: new Date(Date.now() + ACCESS_TOKEN_EXPIRY * 1000),
                },
                toastMessage: "Login successful"
            });
        }
    )(req, res, next);
};

// Refresh Token Controller
export const refreshTokenController = async (req: Request, res: Response) => {
    try {
        const { refresh_token } = req.body;

        if (!refresh_token) {
            return res.status(400).json({
                status: 400,
                message: "Refresh token is required",
                data: null,
                toastMessage: "Session expired. Please log in again."
            });
        }

        // Verify refresh token
        let decoded: any;
        try {
            decoded = jwt.verify(refresh_token, JWT_SECRET);
        } catch (error) {
            return res.status(401).json({
                status: 401,
                message: "Invalid or expired refresh token",
                data: null,
                toastMessage: "Please log in again."
            });
        }

        // Check if refresh token has expired
        if (decoded.exp && decoded.exp * 1000 < Date.now()) {
            return res.status(401).json({
                status: 401,
                message: "Refresh token has expired",
                data: null,
                toastMessage: "Session expired. Please log in again."
            });
        }

        // Find user by ID
        const user: IUserDocument | null = await User.findById(decoded.id);

        if (!user) {
            return res.status(404).json({
                status: 404,
                message: "User not found",
                data: null,
                toastMessage: "User no longer exists."
            });
        }

        // Generate new tokens
        const newAccessToken = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRY });
        const newRefreshToken = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRY });

        return res.status(200).json({
            status: 200,
            message: "Success",
            data: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                isVerified: user.isVerified,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
                access_token: newAccessToken,
                refresh_token: newRefreshToken,
                tokenExpiresAt: new Date(Date.now() + ACCESS_TOKEN_EXPIRY * 1000)
            },
            toastMessage: "Token refreshed successfully."
        });

    } catch (error) {
        console.error("Refresh token error:", error);
        return res.status(500).json({
            status: 500,
            message: "Internal Server Error",
            data: null,
            toastMessage: "Something went wrong. Please try again."
        });
    }
};
