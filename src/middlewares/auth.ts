import { Request, Response, NextFunction } from "express";
import jwt, { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";
import { config } from "../config/config"; // Correct import for config
import UserModel, { UserRole } from "../models/users";
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

};

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


// Middleware to verify Nurse user
export const verifyNurse = async (req: Request, res: Response, next: NextFunction) => {
    const authHeader: string | undefined = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
        return res.status(401).json({
            status: 401,
            message: "Unauthorized",
            data: "Unauthorized",
            toastMessage: "Authentication required.",
        });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded: any = jwt.verify(token, config.JWT_SECRET);
        const user = await UserModel.findById(decoded.id);

        if (!user || user.role !== UserRole.NURSE) {
            return res.status(403).json({
                status: 403,
                message: "Forbidden",
                data: "Forbidden",
                toastMessage: "Nurse access required.",
            });
        }

        req.user = user;
        next();
    } catch (error) {
        if (error instanceof TokenExpiredError) {
            return res.status(401).json({
                status: 401,
                message: "Token expired",
                data: "Token expired",
                toastMessage: "Session expired. Please log in again.",
            });
        }
        if (error instanceof JsonWebTokenError) {
            return res.status(403).json({
                status: 403,
                message: "Invalid token",
                data: "Invalid token",
                toastMessage: "Session expired. Please log in again.",
            });
        }
        return res.status(500).json({
            status: 500,
            message: "Internal server error",
            data: "Internal server error",
        });
    }
};

// Middleware to ensure the token exists in the database and is valid for a nurse
export const authenticateNurse = async (req: Request, res: Response, next: NextFunction) => {
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



export async function authenticateDoctor (req: Request, res: Response, next: NextFunction):Promise<void> {
    try {
        // Extract the token from headers
        const accessToken = req.headers.authorization?.split(" ")[1];

        if (!accessToken) {
            res.status(401).json({
                status: 401,
                message: "Unauthorized",
                data: "Unauthorized",
                toastMessage: "Please log in again.",
            });
            return 
        }
            
        // Check if the token exists in the database (ensures accessToken is valid)
        const storedAccessToken = await AccessToken.findOne({ token: accessToken });

        if (!storedAccessToken) {
            res.status(403).json({
                status: 403,
                message: "Invalid or expired access token",
                data: "Invalid or expired access token",
                toastMessage: "Please log in again.",
            });
            return
        }

        // Decode and verify the JWT token
        let decoded: any;
        try {
            decoded = jwt.verify(accessToken, config.JWT_SECRET);
            
        } catch (error) {
            res.status(403).json({
                status: 403,
                message: "Invalid token",
                data: "Invalid token",
                toastMessage: "Session expired. Please log in again.",
            });
            return 
        }

        // Attach the decoded user ID to the request for further use
        req.user = { id: decoded.id };

        next(); // Proceed to the next middleware or controller
    } catch (error) {
        console.error("Error in authentication middleware:", error);
        res.status(500).json({
            status: 500,
            message: "Internal server error",
            data: "Internal server error",
            toastMessage: "An error occurred while verifying authentication.",
        });
        return;
    }
};




export async function verifyDoctor(req: Request, res: Response, next: NextFunction): Promise<void> {
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

    // Find the existing user by their ID (using req.user.id)
    const existingUser = await UserModel.findById(user.id);

    if (!existingUser) {
        res.status(404).json({
            status: 404,
            message: "User not found",
            data: "The user does not exist in the database.",
            toastMessage: "User not found in the system.",
        });
        return;
    }
    

    // Check if the user's role is DOCTOR
    if (existingUser.role !== UserRole.DOCTOR) {
        res.status(403).json({
            status: 403,
            message: "Forbidden",
            data: "DOCTOR access required.",
            toastMessage: "You do not have permission to access this resource.",
        });
        return;
    }

    next(); // Proceed to the next middleware or route handler
}