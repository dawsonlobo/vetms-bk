import passport from "passport";
import { Strategy as BearerStrategy } from "passport-http-bearer";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import UserModel, { IUserDocument } from "../models/users"; // Corrected import

dotenv.config();

const ACCESS_SECRET = process.env.ACCESS_SECRET || "access_secret";

passport.use(
  new BearerStrategy(async (token, done) => {
    try {
      const decoded = jwt.verify(token, ACCESS_SECRET) as { id: string };

      const user: IUserDocument | null = await UserModel.findById(decoded.id).lean();
      if (!user || user.isDeleted) return done(null, false);

      console.log("Authenticated user:", user);
      return done(null, user);
    } catch (error) {
      console.error("Authentication error:", error);
      return done(null, false);
    }
  })
);

export default passport;
