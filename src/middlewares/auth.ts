import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { config } from "../config/config"; // Correct import for config
import { UserRole } from "../models/users";
import { AccessToken } from "../models/accessTokens"; // Import UserRole if it's an enum or type


// Middleware to verify Admin user
export async function verifyAdmin(req: Request, res: Response, next: NextFunction) {
    console.log("Req User in verifyAdmin:", req.user); // Debugging

    if (!req.user) {
        res.status(401).json({
            status: 401,
            message: "Unauthorized",
            data: "User authentication failed.",
            toastMessage: "Please log in to continue.",
        });
        return;
    }

    const user = req.user as { id: string; role: string; email: string }; // Explicitly defining expected properties

    if (user.role !== UserRole.ADMIN) {
        res.status(403).json({
            status: 403,
            message: "Forbidden",
            data: "Admin access required.",
            toastMessage: "You do not have permission to access this resource.",
        });
        return;
    }

    next();

}

//Specifically ensures that the token exists in the database and is valid for an admin user
export const authenticateAdmin = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Extract the token from headers
        const accessToken = req.headers.authorization?.split(" ")[1];

        if (!accessToken) {
            return res.status(401).json({
                status: 401,
                message: "Unauthorized",
                data: "Unauthorized",
                toastMessage: "Please log in again.",
            });
        }

        // Check if the token exists in the database (ensures accessToken is valid)
        const storedAccessToken = await AccessToken.findOne({ token: accessToken });
        if (!storedAccessToken) {
            return res.status(403).json({
                status: 403,
                message: "Invalid or expired access token",
                data: "Invalid or expired access token",
                toastMessage: "Please log in again.",
            });
        }

        // Decode and verify the JWT token
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

        // Attach the decoded user ID to the request for further use
        req.user = { id: decoded.id };

        next(); // Proceed to the next middleware or controller
    } catch (error) {
        console.error("Error in authentication middleware:", error);
        return res.status(500).json({
            status: 500,
            message: "Internal server error",
            data: "Internal server error",
            toastMessage: "An error occurred while verifying authentication.",
        });
    }
};

