/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - password
 *         - role
 *       properties:
 *         _id:
 *           type: string
 *           format: ObjectId
 *           description: The unique ID of the user
 *           example: "6512c5f3e4b09a12d8f42b68"
 *         name:
 *           type: string
 *           description: Full name of the user
 *           example: "Dr. John Smith"
 *         email:
 *           type: string
 *           format: email
 *           description: Email address of the user
 *           example: "john.smith@example.com"
 *         password:
 *           type: string
 *           description: Encrypted password of the user
 *           example: "$2b$10$7sPbQKq5b6pP0v9hB1X1euLXjzXq99yI8kTvqzQyQxUIUOJDgN/Nm"  # Hashed password
 *         role:
 *           type: string
 *           enum: [ADMIN, DOCTOR, RECEPTIONIST, NURSE]
 *           description: Role of the user in the system
 *           example: "DOCTOR"
 *         isDeleted:
 *           type: boolean
 *           description: Flag indicating whether the user has been deleted
 *           example: false
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the user was created
 *           example: "2024-02-05T12:00:00Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Timestamp when the user was last updated
 *           example: "2024-02-06T15:30:00Z"
 */

import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcryptjs";

export enum UserRole {
  ADMIN = "ADMIN",
  DOCTOR = "DOCTOR",
  RECEPTIONIST = "RECEPTIONIST",
  NURSE = "NURSE",
}

export interface IUser {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  createdAt?: Date;
  updatedAt?: Date;
  isDeleted: boolean;
}

export interface IUserDocument extends IUser, Document {}

const UserSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: Object.values(UserRole), required: true },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Hash password before saving
// UserSchema.pre<IUserDocument>("save", async function (next) {
//   if (!this.isModified("password")) return next();

//   const salt = await bcrypt.genSalt(10);
//   this.password = await bcrypt.hash(String(this.password), salt); // 🔹 Ensure password is a string

//   next();
// });

const UserModel = mongoose.model<IUserDocument>("users", UserSchema);

export default UserModel;
