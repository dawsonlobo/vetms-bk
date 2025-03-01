import passport from "passport";
import { Strategy as BearerStrategy } from "passport-http-bearer";
import jwt from "jsonwebtoken";
import { config } from "../config/config";
import UserModel from "../models/users";
import { Response,Request, NextFunction, } from "express";
import {ErrorCodes,ResponseObj} from "../models/models"




const ACCESS_SECRET = config.JWT_SECRET || "access_secret";


passport.use(
  new BearerStrategy(async (token, done) => {
    try {
      console.log("Received Token:", token); // Debugging step

      // 🔹 Decode and verify the JWT
      const decoded = jwt.verify(token, ACCESS_SECRET) as { id: string };

      console.log("Decoded Token:", decoded); // Debugging step

      // 🔹 Fetch user from database
      const user = await UserModel.findById(decoded.id).lean();

      // console.log("decoded,;",decoded);
      // console.log("rftvgbhjnkml,;",user);
      
      if (!user ) {
        return done(null, false, { message: "User not found", scope: "error" });
        // const responseObj = new ResponseObj(401, "Unauthorized", {});
        // return done(null, false, responseObj.toJsonString());
      }

      if (user.isDeleted===true ) {
        
        return done(null, false, { message: "User id deleted", scope: "error" });

        // const responseObj = new ResponseObj(400, "User is deleted", {});
        // return done(null, false, responseObj.toJsonString());
      }
      if (user.isEnabled===false ) {
        return done(null, false, { message: "User is not enabled", scope: "error" });
      }

      console.log("Authenticated User:", user); // Debugging step

      // req.user = { id: decoded.id };

      // 🔹 Pass user to req.user
      return done(null, { id: user._id.toString(), role: user.role, email: user.email,});
    } catch (error) {
      console.error("Authentication error:", error);
      return done(null, false, { message: "Invalid or expired token", scope: "error" });
    }
  })
);








export default passport;
