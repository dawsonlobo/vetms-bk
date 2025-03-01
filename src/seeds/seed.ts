import mongoose from "mongoose";
import bcrypt from "bcrypt";
import UserModel from "../models/users"; // Import the correct User model
import { config, seedUsers } from "../config/config"; // Import configuration

async function seedDatabase() {
  try {
    await mongoose.connect(config.MONGODB_URI);
    console.log("Connected to MongoDB");

    for (const user of seedUsers) {
      const existingUser = await UserModel.findOne({ email: user.email });

      if (existingUser) {
        console.log(
          `User with email ${user.email} already exists. Skipping...`,
        );
        continue;
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(user.password, config.ROUNDS);

      // Create new user
      await UserModel.create({
        name: user.name,
        email: user.email,
        password: hashedPassword,
        role: user.role,
        isDeleted: false, // Since your schema has this field
      });

      console.log(`User ${user.email} added successfully`);
    }

    console.log("Seeding completed!");
    mongoose.connection.close();
    process.exit();
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
}

seedDatabase();
