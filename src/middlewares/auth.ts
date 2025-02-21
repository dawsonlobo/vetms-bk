import { Request, Response, NextFunction } from "express";
import jwt, { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";
import { config } from "../config/config"; // Correct import for config
import UserModel from "../models/users";
import { UserRole } from "../models/users"; // Import UserRole if it's an enum or type

// Middleware to verify any authenticated user
export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
    const authHeader: string | undefined = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {  
        return res.status(401).json({ status: 401, message: "Unauthorized", data: null });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, config.JWT_SECRET);
        (req as any).user = decoded; // Attach decoded user details
        next();
    } catch (error) {
        if (error instanceof TokenExpiredError) {
            return res.status(401).json({ status: 401, message: "Token expired", data: null });
        }
        if (error instanceof JsonWebTokenError) {
            return res.status(403).json({ status: 403, message: "Invalid token", data: null });
        }
        return res.status(500).json({ status: 500, message: "Internal server error", data: null });
    }
};

// Middleware to verify Admin user
export const verifyAdmin = async (req: Request, res: Response, next: NextFunction) => {
    const authHeader: string | undefined = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
        return res.status(401).json({
            status: 401,
            message: "Unauthorized",
            data: null,
            toastMessage: "Authentication required.",
        });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded: any = jwt.verify(token, config.JWT_SECRET);
        const user = await UserModel.findById(decoded.id);

        if (!user || user.role !== UserRole.ADMIN) {
            return res.status(403).json({
                status: 403,
                message: "Forbidden",
                data: null,
                toastMessage: "Admin access required.",
            });
        }

        req.user = user;
        next();
    } catch (error) {
        if (error instanceof TokenExpiredError) {
            return res.status(401).json({
                status: 401,
                message: "Token expired",
                data: null,
                toastMessage: "Session expired. Please log in again.",
            });
        }
        if (error instanceof JsonWebTokenError) {
            return res.status(403).json({
                status: 403,
                message: "Invalid token",
                data: null,
                toastMessage: "Session expired. Please log in again.",
            });
        }
        return res.status(500).json({
            status: 500,
            message: "Internal server error",
            data: null,
        });
    }
};
