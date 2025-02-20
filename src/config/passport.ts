// src/config/passportConfig.ts
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcryptjs";
import UserModel from "../models/users";

// Define Passport Local Strategy
passport.use(
  new LocalStrategy(
    { usernameField: "email", passwordField: "password" },
    async (email, password, done) => {
      try {
        const user = await UserModel.findOne({ email, isDeleted: false });
        if (!user) return done(null, false, { message: "User not found" });

        const isMatch = await bcrypt.compare(password, String(user.password));
        if (!isMatch) return done(null, false, { message: "Invalid credentials" });

        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);
