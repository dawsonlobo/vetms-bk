import passport from "passport";
import { Strategy as BearerStrategy } from "passport-http-bearer";
import jwt from "jsonwebtoken";
import { config } from "../config/config";
import UserModel from "../models/users";

const ACCESS_SECRET = config.JWT_SECRET || "access_secret";

passport.use(
  new BearerStrategy(async (token, done) => {
    try {
      console.log(token); 
      const decoded = jwt.verify(token, ACCESS_SECRET) as { id: string };

      const user = await UserModel.findById(decoded.id).lean();
      if (!user || user.isDeleted) {
        return done(null, false, { message: "User not found or deleted", scope: "error" });
      }
      
      return done(null, { id: user._id.toString(), role: user.role, email: user.email });
    } catch (error) {
      console.error("Authentication error:", error);
      return done(null, false, { message: "Invalid or expired token", scope: "error" });
    }
  })
);

export default passport;
